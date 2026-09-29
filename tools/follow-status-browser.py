"""Verify the follower recognizes DSH 0.2's actual running row.

Run: python3 tools/follow-status-browser.py
"""
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


SOURCE = Path(os.environ.get("STREAM_CLIENT", Path(__file__).resolve().parents[1] / "lib" / "client.js"))


def main():
    source = SOURCE.read_text()
    begin = source.index("function turnStatusOf(port) {")
    end = source.index("\n\t\t}", begin) + len("\n\t\t}")
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content("""
          <div data-conversation-scroll>
            <div data-chat-flow>
              <div data-chat-flow-kind="assistant">新增中的消息</div>
              <div id="running" data-chat-running><span role="status">深度求索中</span></div>
            </div>
          </div>
        """)
        page.evaluate(f"() => {{ window.turnStatusOf = {source[begin:end]}; }}")
        assert page.evaluate("turnStatusOf(document.querySelector('[data-conversation-scroll]'))?.id") == "running", "DSH 0.2 running row was missed"
        page.evaluate("document.getElementById('running').remove()")
        assert page.evaluate("turnStatusOf(document.querySelector('[data-conversation-scroll]'))") is None
        page.evaluate("document.querySelector('[data-chat-flow]').insertAdjacentHTML('beforeend', '<div id=legacy role=status>旧版状态</div>')")
        assert page.evaluate("turnStatusOf(document.querySelector('[data-conversation-scroll]'))?.id") == "legacy", "legacy status selector regressed"
        print("Chromium: DSH 0.2 running row and legacy status are both recognized")
        browser.close()


if __name__ == "__main__":
    main()
