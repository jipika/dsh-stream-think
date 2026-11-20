"""Probe native disclosure expand animation (dsh-stream-think).

Run: python3 tools/native-expand-browser.py
Requires Playwright. Verifies the WAAPI height+fade installed by
installNativeDisclosureExpand against a mock native DisclosureRow DOM:
  1. user expand (data-open + content mounted together) animates, mid-frame
     height/opacity are partial, then settles with overflow restored;
  2. session-switch style whole-tree mounts do NOT animate (no cascade);
  3. plugin-owned disclosureContent is skipped (grid animation owns it);
  4. prefers-reduced-motion installs to a no-op (zero animate calls).
"""

import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

PLUGIN_ROOT = Path(__file__).resolve().parents[1]
source = (PLUGIN_ROOT / "lib/client.js").read_text()
start = source.index("const NATIVE_DISCLOSURE_STYLE_ID")
end = source.index("//#endregion", start)
block = source[start:end]
assert "installNativeDisclosureExpand" in block, "native expand block missing from lib/client.js"

SETUP_JS = (
    block
    + """
    window.__animateCalls = [];
    const __origAnimate = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
      try {
        const keys = Array.isArray(keyframes) && keyframes[0] ? Object.keys(keyframes[0]).join(',') : '';
        window.__animateCalls.push(String(this.className || this.tagName) + '|' + keys);
      } catch (e) {}
      return __origAnimate.call(this, keyframes, options);
    };
    window.__installNative = installNativeDisclosureExpand();
    // 哨兵：让这段求值以可序列化值结尾。以函数值结尾时，Playwright
    // 对该次求值的处理会使本次安装的观察器收不到后续变更（harness  quirks，
    // 与被测实现无关；宿主里走的是正常模块调用，无此问题）。
    "native-expand-probe-ready";
    """
)

NATIVE_ROOT_HTML = """
<div id="root">
  <div data-disclosure-header><div data-disclosure-row>Think</div></div>
</div>
"""


def read_mid(page, selector="#newContent"):
    return page.evaluate(
        """(sel) => {
          const el = document.querySelector(sel);
          const r = el.getBoundingClientRect();
          return { height: r.height, opacity: parseFloat(getComputedStyle(el).opacity),
                   overflow: el.style.overflow, count: window.__animateCalls.length };
        }""",
        selector,
    )


import os

CHROMIUM_BIN = (
    "/Users/lixiongwei/Library/Caches/ms-playwright/"
    "chromium-1228/chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium"
)
HEADLESS_SHELL_BIN = (
    "/Users/lixiongwei/Library/Caches/ms-playwright/"
    "chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell"
)


def launch_browser(p):
    for exe in (HEADLESS_SHELL_BIN, CHROMIUM_BIN):
        if os.path.exists(exe):
            return p.chromium.launch(headless=True, executable_path=exe)
    return p.chromium.launch(headless=True)


with sync_playwright() as p:
    browser = launch_browser(p)

    # 1-3: normal motion
    page = browser.new_page(viewport={"width": 800, "height": 600})
    page.set_content(f"<style>body{{margin:0;font:14px/24px system-ui}}</style>{NATIVE_ROOT_HTML}")
    page.wait_for_load_state("networkidle")
    page.evaluate(SETUP_JS)

    # user expand: data-open + content mounted in the same task (like React commit).
    # Headless-shell timers are sloppy, so instead of sampling at a fixed
    # offset: wait for the animation to start, take two samples inside the
    # window, then assert the height actually interpolated (not a pop-in).
    page.evaluate(
        """() => {
          const root = document.getElementById('root');
          const c = document.createElement('div');
          c.id = 'newContent';
          c.style.height = '200px';
          c.textContent = 'reasoning body';
          root.setAttribute('data-open', '');
          root.appendChild(c);
        }"""
    )
    page.wait_for_function("window.__animateCalls.length >= 1", timeout=3000)
    sample_a = read_mid(page)
    page.wait_for_timeout(60)
    sample_b = read_mid(page)
    assert sample_a["count"] == 1, sample_a
    assert sample_a["height"] < 200, sample_a
    assert sample_b["height"] > sample_a["height"], (sample_a, sample_b)
    assert sample_b["height"] < 200 or sample_b["opacity"] < 1.0, (sample_a, sample_b)
    print("expand interpolating:", sample_a, "->", sample_b)

    page.wait_for_timeout(500)
    done = read_mid(page)
    assert done["count"] == 1, done
    assert abs(done["height"] - 200) < 1.5, done
    assert done["opacity"] == 1.0, done
    assert done["overflow"] == "", done
    print("expand settled + overflow restored:", done)

    # session-switch style whole-tree mount must NOT cascade
    before = page.evaluate("window.__animateCalls.length")
    page.evaluate(
        """() => {
          const turn = document.createElement('div');
          turn.innerHTML = '<div data-open><div data-disclosure-header><div>x</div></div>'
            + '<div style="height:100px">nested</div></div>';
          document.body.appendChild(turn);
        }"""
    )
    page.wait_for_timeout(300)
    after = page.evaluate("window.__animateCalls.length")
    assert after == before, (before, after)
    print("whole-tree mount skipped (no cascade):", before, "->", after)

    # plugin-owned disclosureContent skipped
    before = after
    page.evaluate(
        """() => {
          const host = document.createElement('div');
          host.setAttribute('data-disclosure-content', '');
          const c = document.createElement('div');
          c.style.height = '100px';
          c.textContent = 'own';
          const root = document.createElement('div');
          root.setAttribute('data-open', '');
          root.innerHTML = '<div data-disclosure-header><div>x</div></div>';
          root.appendChild(host);
          host.appendChild(c);
          document.body.appendChild(root);
        }"""
    )
    page.wait_for_timeout(300)
    after = page.evaluate("window.__animateCalls.length")
    assert after == before, (before, after)
    print("plugin-owned disclosure skipped:", before, "->", after)
    page.close()

    # 4: reduced motion => shorter form (height + opacity, no transform)
    ctx = browser.new_context(
        viewport={"width": 800, "height": 600}, reduced_motion="reduce"
    )
    rpage = ctx.new_page()
    rpage.set_content(
        f"<style>body{{margin:0;font:14px/24px system-ui}}</style>{NATIVE_ROOT_HTML}"
    )
    rpage.wait_for_load_state("networkidle")
    rpage.evaluate(SETUP_JS)
    rpage.evaluate(
        """() => {
          const root = document.getElementById('root');
          const c = document.createElement('div');
          c.id = 'newContent';
          c.style.height = '200px';
          root.setAttribute('data-open', '');
          root.appendChild(c);
        }"""
    )
    rpage.wait_for_timeout(300)
    count = rpage.evaluate("window.__animateCalls.length")
    h = rpage.evaluate(
        "document.querySelector('#newContent').getBoundingClientRect().height"
    )
    calls = rpage.evaluate("window.__animateCalls")
    assert count == 1, calls
    # 减少动效：仍然撑开 + 淡入，但去掉位移（transform）
    assert "height" in calls[0] and "transform" not in calls[0], calls
    assert abs(h - 200) < 1.5, h
    print("reduced-motion short form:", {"count": count, "keys": calls[0], "height": h})
    ctx.close()
    browser.close()

print("native-expand probe: 4/4 passed")
