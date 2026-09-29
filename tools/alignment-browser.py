"""Compare the plugin's two text overlays against DSH 0.2's native rows.

Run after ``node tools/derive.mjs``: ``python3 tools/alignment-browser.py``.
Requires Playwright and Pillow. The first 80 CSS pixels of a truncated title
are compared, since the plugin intentionally adds an ellipsis at narrow widths.
"""

import json
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright


source = (Path(__file__).resolve().parents[1] / "lib/client.js").read_text()
css_lines = source.split("const TURN_PROCESS_CLOCK_CSS = [", 1)[1].split('].join("\\n")', 1)[0]
plugin_css = "\n".join(
    json.loads(line.strip().rstrip(","))
    for line in css_lines.splitlines()
    if line.strip().startswith('"')
)

# The relevant layout rules are copied from DSH 0.2's TextShimmer,
# ChatGroupSeat, and ChatView styles. Other native styles do not affect the rows.
native_css = """
*{box-sizing:border-box}
body{margin:0;background:#f8f8f8;color:#777;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}
.shimmer-root{position:relative;display:inline-grid;width:max-content;max-width:100%;min-width:0;vertical-align:top;color:inherit}
.shimmer-content{display:flex;align-items:center;min-width:0}
.rwaBla_title{max-width:100%;color:#777;font:inherit;font-size:var(--dsh-content-font-size,14px);text-align:left;cursor:pointer;background:none;border:0;align-items:center;gap:6px;padding:0;display:flex}
.rwaBla_title[aria-expanded=true]{padding-bottom:8px}
.rwaBla_leading{width:16px;height:16px;flex:none;justify-content:center;align-items:center;display:inline-flex}
.rwaBla_label{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}
.QEbr4q_running{color:#315fc4;font-size:calc(var(--dsh-content-font-size,14px) - 2px);line-height:calc(22px + var(--dsh-content-font-delta,0px));flex-direction:column;align-items:flex-start;display:flex}
.QEbr4q_runningContent{align-items:center;gap:6px;min-width:0;display:inline-flex}
.QEbr4q_runningText{font-variant-numeric:tabular-nums;min-width:0}
.QEbr4q_runningIcon{width:calc(14px + var(--dsh-content-font-delta,0px));height:calc(14px + var(--dsh-content-font-delta,0px));flex:none;display:inline-flex}
.demo{width:500px;padding:12px 20px}
.pair{display:flex;flex-direction:column;gap:8px;padding-bottom:12px}
"""

icon = '<svg width="100%" height="100%" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor"/></svg>'


def shimmer(label, extra=""):
    return f'<span class="shimmer-root {extra}"><span class="shimmer-content"><span>{label}</span></span></span>'


def process(plugin):
    label = "正在分析请求 · 检查文件与动画效果"
    inner = shimmer(label, "rwaBla_label")
    native = f'<span class="shimmer-root {"dsh-stream-think-process-native" if plugin else ""}"><span class="shimmer-content">{inner}</span></span>'
    overlay = f'<span class="dsh-stream-think-process-viewport" aria-hidden="true"><span class="dsh-stream-think-process-label">{label}</span></span>' if plugin else ""
    title_class = "dsh-stream-think-process-title" if plugin else ""
    return f'<div data-step-process><button class="rwaBla_title {title_class}" data-process-activity="thinking"><span class="rwaBla_leading">{icon}</span>{native}{overlay}</button></div>'


def running(plugin):
    label = "深度求索中，用时 4秒 ..."
    native = shimmer(label, "QEbr4q_runningText " + ("dsh-stream-think-live-native" if plugin else ""))
    overlay = f'<span class="dsh-stream-think-live-overlay" aria-hidden="true">{label}</span>' if plugin else ""
    content_class = "dsh-stream-think-live-content" if plugin else ""
    return f'<div class="QEbr4q_running" data-chat-running><span class="QEbr4q_runningContent {content_class}"><span class="QEbr4q_runningIcon">{icon}</span>{native}{overlay}</span></div>'


html = f'<style>{native_css}\n{plugin_css}</style><div class="demo"><div class="pair">{process(False)}{process(True)}</div><div class="pair">{running(False)}{running(True)}</div></div>'


def crop(image, rect, width):
    x, y, height = round(rect["x"] * 2), round(rect["y"] * 2), round(rect["height"] * 2)
    return image.crop((x, y, x + round(width * 2), y + height))


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for font_size, line_height, width in ((14, 24, 500), (14, 24, 180), (16, 26, 500), (16, 26, 180), (18, 30, 500), (18, 30, 180)):
        page = browser.new_page(viewport={"width": 600, "height": 350}, device_scale_factor=2)
        page.set_content(html)
        page.evaluate("""({fontSize,lineHeight,width}) => {
          document.documentElement.style.setProperty('--dsh-content-font-size',fontSize+'px');
          document.documentElement.style.setProperty('--dsh-content-font-delta',(lineHeight-24)+'px');
          document.body.style.fontSize=fontSize+'px';
          document.body.style.lineHeight=lineHeight+'px';
          document.querySelector('.demo').style.width=width+'px';
          if(width===180) document.querySelectorAll('.rwaBla_title').forEach(button=>button.setAttribute('aria-expanded','true'));
        }""", {"fontSize": font_size, "lineHeight": line_height, "width": width})
        rects = page.evaluate("""() => ['.rwaBla_label','.dsh-stream-think-process-label','.QEbr4q_runningText:not(.dsh-stream-think-live-native)','.dsh-stream-think-live-overlay'].map(selector => {
          const element=document.querySelector(selector),r=element.getBoundingClientRect();
          const row=element.closest('.rwaBla_title,.QEbr4q_runningContent').getBoundingClientRect();
          return {x:r.x,y:r.y,width:r.width,height:r.height,offsetY:r.y-row.y};
        })""")
        assert rects[0]["height"] == rects[1]["height"], rects
        assert rects[2]["height"] == rects[3]["height"], rects
        assert page.locator(".rwaBla_title").first.aria_snapshot() == page.locator(".dsh-stream-think-process-title").aria_snapshot()
        assert page.locator(".QEbr4q_runningContent").first.aria_snapshot() == page.locator(".dsh-stream-think-live-content").aria_snapshot()
        image = Image.open(BytesIO(page.screenshot())).convert("RGB")
        for native, overlay, crop_width in ((rects[0], rects[1], min(80, rects[0]["width"])), (rects[2], rects[3], rects[2]["width"])):
            assert native["x"] == overlay["x"] and native["offsetY"] == overlay["offsetY"], (font_size, width, native, overlay)
            assert ImageChops.difference(crop(image, native, crop_width), crop(image, overlay, crop_width)).getbbox() is None, (font_size, width)

        before = page.evaluate("""() => [...document.querySelectorAll('.rwaBla_title,.QEbr4q_runningContent')].map(e=>{
          const r=e.getBoundingClientRect();return [r.y,r.height]
        })""")
        page.evaluate("""() => {
          const viewport=document.querySelector('.dsh-stream-think-process-viewport');
          const current=viewport.firstElementChild;
          const old=document.createElement('span');old.className='dsh-stream-think-process-label';old.dataset.old='';old.textContent=current.textContent;
          viewport.append(old);current.textContent='正在分析请求 · 下一句标题';
          old.animate([{transform:'translateY(0)'},{transform:'translateY(100%)'}],{duration:240});
          current.animate([{transform:'translateY(-100%)'},{transform:'translateY(0)'}],{duration:240});
          document.querySelector('.dsh-stream-think-live-overlay').innerHTML='深度求索中，用时 <span class="dsh-stream-think-clock-number"><span class="dsh-stream-think-clock-old">4</span><span class="dsh-stream-think-clock-next">5</span></span>秒 ...';
        }""")
        page.wait_for_timeout(120)
        during = page.evaluate("""() => [...document.querySelectorAll('.rwaBla_title,.QEbr4q_runningContent')].map(e=>{
          const r=e.getBoundingClientRect();return [r.y,r.height]
        })""")
        assert before == during, (font_size, width, before, during)
        print(f"alignment and animation stable: {font_size}px/{line_height}px, width {width}px")
        page.close()
    browser.close()
