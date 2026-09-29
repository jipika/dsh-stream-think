"""Regression for the first turn: composer growth must not scroll a short chat.

Run: python3 tools/short-conversation-browser.py
"""

from pathlib import Path

from playwright.sync_api import sync_playwright


SOURCE = Path(__file__).resolve().parents[1] / "lib/client.js"
source = SOURCE.read_text()
begin = source.index('const FOLLOW_FLOW_FILL_SYMBOL = Symbol.for("dsh-smooth-stream.follow-flow-fill");')
end = source.index("/** Height committed by one newly mounted Chat row", begin)
flow_fill = source[begin:end]

css = """
  * { box-sizing: border-box; }
  body { margin: 0; }
  .port { height: 800px; display: flex; flex-direction: column; overflow-y: auto; }
  .view { flex: 1 0 auto; min-height: auto; display: flex; flex-direction: column; }
  .scroll { padding: 16px 32px; flex: none; min-height: auto; }
  .flow { display: flex; flex-direction: column; width: 100%; max-width: 800px; margin: auto; }
  .seat { flex: none; height: 80px; position: sticky; bottom: 0; }
  .row { height: 48px; }
"""
html = f"""
  <style>{css}</style>
  <div class="port" data-conversation-scroll>
    <div class="view"><div class="scroll"><div class="flow" data-chat-flow>
      <div class="row">user</div><div class="row">assistant</div>
    </div></div></div>
    <div class="seat" data-composer-seat></div>
  </div>
"""

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1000, "height": 900})
    page.set_content(html)
    page.evaluate(f"() => {{ {flow_fill} window.ensureFlowFillsPort = ensureFlowFillsPort; }}")
    result = page.evaluate(
        """() => {
          const port = document.querySelector('.port');
          const seat = document.querySelector('.seat');
          const flow = document.querySelector('.flow');
          const floor = () => Math.max(0, port.scrollHeight - port.clientHeight);
          window.ensureFlowFillsPort(port);
          const initial = floor();
          seat.style.height = '240px';
          window.ensureFlowFillsPort(port);
          const afterComposerGrow = floor();
          port.scrollTop = floor();
          const shortScrollTop = port.scrollTop;
          for (let i = 0; i < 30; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            flow.appendChild(row);
          }
          window.ensureFlowFillsPort(port);
          const longFloor = floor();
          port.scrollTop = longFloor;
          const longScrollTop = port.scrollTop;
          seat.style.height = '80px';
          window.ensureFlowFillsPort(port);
          return {initial, afterComposerGrow, shortScrollTop, longFloor, longScrollTop,
            afterComposerShrink: floor()};
        }"""
    )
    browser.close()

assert result["initial"] == 0, result
assert result["afterComposerGrow"] == 0, result
assert result["shortScrollTop"] == 0, result
assert result["longFloor"] > 0, result
assert result["longScrollTop"] == result["longFloor"], result
assert result["afterComposerShrink"] < result["longFloor"], result
print("short conversation stays still; long conversation follows real overflow:", result)
