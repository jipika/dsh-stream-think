"""Check Think geometry with both generated style layers and DSH flow groups.

Run: python3 tools/think-layout-browser.py
Requires Playwright. This includes the real padding cascade; testing only
css$4 missed the later process-clock stylesheet overriding collapsed padding.
"""

import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

source = (Path(__file__).resolve().parents[1] / 'lib/client.js').read_text()
think_css = json.loads(re.search(r'const css\$4 = ("(?:\\.|[^"\\])*");', source).group(1))
clock_lines = source.split('const TURN_PROCESS_CLOCK_CSS = [', 1)[1].split('].join("\\n")', 1)[0]
clock_css = '\n'.join(json.loads(s.strip().rstrip(',')) for s in clock_lines.splitlines() if s.strip().startswith('"'))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for capped in (True, False):
        page = browser.new_page(viewport={'width': 800, 'height': 600})
        lines = '\n'.join(f'检查第 {i} 项内容，保留完整底部。' for i in range(80))
        page.set_content(f'''<style>
        body{{margin:0;font:14px/24px system-ui}}.flow{{padding:30px}}
        .flow>:not([hidden])~:not([hidden]){{margin-top:var(--dsh-chat-flow-gap,6px)}}
        {think_css}{clock_css}
        </style><div class="flow">
        <div data-chat-flow-kind="turn-process"><div class="dsh-stream-think-highlights">读取与查看 1 项</div></div>
        <div data-step-process hidden="until-found"><span data-variant="think">折叠的原生过程组</span></div>
        <div data-chat-group-part="response" data-chat-flow-kind="assistant-step">
          <div class="I17U7q_body"><div data-variant="think" class="I17U7q_think">
          <div class="I17U7q_disclosureRow">Think · 查看内容</div>
          <div class="I17U7q_disclosureContent" data-disclosure-content data-collapsed>
          <div class="I17U7q_thinkBody" {'data-think-cap style="max-height:120px"' if capped else ''}>{lines}</div>
          </div></div><div id="answer">继续展示正文。</div></div>
        </div></div>''')
        page.wait_for_load_state('networkidle')
        collapsed = page.evaluate('''() => {
          const content=document.querySelector('[data-disclosure-content]');
          const think=document.querySelector('.I17U7q_think');
          const hidden=document.querySelector('[data-step-process]');
          return {content:content.getBoundingClientRect().height,think:think.getBoundingClientRect().height,hidden:hidden.getBoundingClientRect().height,hiddenMargin:getComputedStyle(hidden).marginTop};
        }''')
        assert collapsed == {'content': 0, 'think': 24, 'hidden': 0, 'hiddenMargin': '0px'}, collapsed
        page.locator('[data-disclosure-content]').evaluate('e=>e.removeAttribute("data-collapsed")')
        page.wait_for_timeout(260)
        expanded = page.locator('.I17U7q_thinkBody').evaluate('''e=>({top:getComputedStyle(e).paddingTop,bottom:getComputedStyle(e).paddingBottom,height:e.clientHeight,scroll:e.scrollHeight})''')
        assert expanded['top'] == expanded['bottom'] == '8px', expanded
        if capped:
            assert expanded['height'] == 120 and expanded['scroll'] > expanded['height'], expanded
            page.locator('.I17U7q_thinkBody').evaluate('e=>e.scrollTop=e.scrollHeight')
            end = page.locator('.I17U7q_thinkBody').evaluate('e=>e.scrollHeight-e.clientHeight-e.scrollTop')
            assert end == 0, end
        page.locator('[data-disclosure-content]').evaluate('e=>e.setAttribute("data-collapsed", "")')
        page.wait_for_timeout(260)
        assert page.locator('[data-disclosure-content]').evaluate('e=>e.getBoundingClientRect().height') == 0
        print('full CSS cascade stable:', 'capped' if capped else 'unlimited', collapsed, expanded)
        page.close()
    browser.close()
