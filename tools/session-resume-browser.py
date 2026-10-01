"""Exercise the real follower on a running conversation remount, without model calls.

Run: python3 tools/session-resume-browser.py
STREAM_CLIENT can point at a before-fix bundle for comparison.
"""
import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


source = Path(os.environ.get("STREAM_CLIENT", Path(__file__).resolve().parents[1] / "lib/client.js")).read_text()
begin = source.index('const FOLLOW_OWNED_ATTR = "data-follow-owned";')
end = source.index('//#region src/client/useSmoothStreamContent.ts', begin)
tuning_start = source.index('const DEFAULT_STREAM_DEBUG_TUNING = {')
tuning_end = source.index('\n\t\t};', tuning_start) + len('\n\t\t};')
helpers = source[tuning_start:tuning_end] + source[begin:end]
opaque_start = source.index('const ledgerByRoot = ')
opaque_end = source.index('//#region \\0dsh-css:', opaque_start)
opaque_helpers = source[opaque_start:opaque_end]

html = """
<style>
* { box-sizing: border-box; } body { margin: 0; }
[data-conversation-scroll] { height: 700px; overflow: auto; overflow-anchor: none; }
.view { display: flex; flex-direction: column; min-height: 620px; }
[data-chat-flow] { display: flex; flex-direction: column; gap: 8px; padding: 12px 24px; }
.history { height: 900px; flex: none; }
.tail { min-height: 120px; flex: none; line-height: 24px; }
[data-chat-running] { height: 28px; flex: none; }
[data-composer-seat] { height: 80px; position: sticky; bottom: 0; background: white; }
</style>
<div data-conversation-session="A"><div data-conversation-scroll>
  <div class="view" data-chat-following-tail><div data-chat-flow>
    <div class="history" data-chat-anchor-key="history">history</div>
    <div class="tail" data-chat-anchor-key="tail" data-chat-flow-key="tail"><div id="root">Existing streamed content</div></div>
    <div data-chat-running>Running</div>
  </div></div><div data-composer-seat>composer</div>
</div></div>
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1000, "height": 800})
    page.set_content(html)
    page.evaluate("""() => {
      window.effects = []; window.cleanups = [];
      window.react = { useRef: current => ({current}), useLayoutEffect: cb => effects.push(cb) };
      window.debugRuntime = { activeTuning: () => tuning, isEnabled: () => false, reportFollow() {}, reportStream() {} };
    }""")
    page.evaluate(f"""() => {{
      {helpers}
      {opaque_helpers}
      window.tuning = DEFAULT_STREAM_DEBUG_TUNING;
      const nativeFrame = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = callback => nativeFrame(now => {{
        const beforeFrame = window.beforeFollowFrame;
        window.beforeFollowFrame = undefined;
        beforeFrame?.();
        callback(now);
      }});
      window.mount = (entrance = false, predictive = true) => {{
        useConversationFollow({{current: document.querySelector('#root')}}, true, {{current: 300}}, undefined, predictive, entrance);
        for (const effect of effects.splice(0)) cleanups.push(effect());
      }};
      window.primeOpaqueText = () => {{
        useProgressiveDomText({{current: document.querySelector('#root')}}, true, true, {{current:300}});
        for (const effect of effects.splice(0)) cleanups.push(effect());
      }};
      window.switchAway = () => {{
        document.querySelector('[data-conversation-session]').dataset.conversationSession = 'B';
        for (const cleanup of cleanups.splice(0)) cleanup?.();
      }};
    }}""")
    result = page.evaluate("""async () => {
      const port = document.querySelector('[data-conversation-scroll]');
      const tail = document.querySelector('.tail');
      const floor = () => Math.max(0, port.scrollHeight - port.clientHeight);
      const snapshot = () => {
        const status = document.querySelector('[data-chat-running]').getBoundingClientRect();
        const composer = document.querySelector('[data-composer-seat]').getBoundingClientRect();
        return {top: port.scrollTop, floor: floor(), tailTop: tail.getBoundingClientRect().top, transform: tail.style.transform,
          statusTop: status.top, statusBottom: status.bottom, composerTop: composer.top};
      };
      port.scrollTop = floor();
      const before = snapshot();
      mount();
      primeOpaqueText();
      const initialText = document.querySelector('#root').textContent;
      const samples = [];
      for (let i = 0; i < 40; i++) { await new Promise(requestAnimationFrame); samples.push(snapshot()); }
      const idle = snapshot();
      // Typing/clicking a control is not an upward reading gesture. If a disclosure
      // shrinks the document meanwhile, the browser clamps scrollTop to the new floor.
      document.querySelector('[data-composer-seat]').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}));
      window.beforeFollowFrame = () => {tail.style.minHeight = '80px';};
      for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame);
      const clickAndShrink = snapshot();
      port.scrollTop = floor();
      tail.style.minHeight = '120px';
      for (let i = 0; i < 50; i++) await new Promise(requestAnimationFrame);
      // A wrap after re-entry should still be followed and retain physical bottom.
      tail.style.height = '168px';
      for (let i = 0; i < 60; i++) await new Promise(requestAnimationFrame);
      const grown = snapshot();
      // Genuine upward wheel intent must still release the follower. Content
      // growth while reading must not force the reader back to the running row.
      port.dispatchEvent(new WheelEvent('wheel', {deltaY:-100, bubbles:true}));
      port.scrollTop -= 100;
      for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame);
      const wheelReading = snapshot();
      tail.style.height = '208px';
      for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame);
      const wheelGrowth = snapshot();
      // Native ChatReading follows an own submitted message even from history.
      // Reproduce its committed user row and physical bottom landing; our old
      // reader hold must not suppress that landing or the subsequent stream.
      document.querySelector('[data-composer-seat]').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}));
      const ownMessage = document.createElement('div');
      ownMessage.dataset.chatFlowKind = 'user'; ownMessage.dataset.chatFlowKey = 'sent-user';
      ownMessage.style.height = '48px'; ownMessage.textContent = 'New user message';
      tail.before(ownMessage);
      document.querySelector('.view').setAttribute('data-chat-following-tail', '');
      port.scrollTop = floor();
      for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame);
      tail.style.height = '248px';
      for (let i = 0; i < 50; i++) await new Promise(requestAnimationFrame);
      const sentAndGrown = snapshot();
      // The old owner must not touch the new running conversation.
      switchAway();
      ownMessage.remove();
      tail.style.height = '120px';
      document.querySelector('[data-conversation-session]').dataset.conversationSession = 'A';
      port.scrollTop = floor();
      const restored = snapshot();
      mount();
      for (let i = 0; i < 40; i++) await new Promise(requestAnimationFrame);
      const resumed = snapshot();
      // The running label can mount after the host restored scrollTop. Its full
      // height is part of physical bottom; it must not be hidden by the composer.
      document.querySelector('[data-chat-running]').style.height = '80px';
      for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame);
      const tallerStatus = snapshot();
      document.querySelector('[data-chat-running]').style.height = '28px';
      for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame);
      switchAway();
      // A restored reader position must remain a reader position, even while running.
      document.querySelector('[data-conversation-session]').dataset.conversationSession = 'A';
      document.querySelector('.view').removeAttribute('data-chat-following-tail');
      port.scrollTop = 200;
      mount();
      for (let i = 0; i < 20; i++) await new Promise(requestAnimationFrame);
      const reading = snapshot();
      switchAway();
      document.querySelector('[data-conversation-session]').dataset.conversationSession = 'A';
      document.querySelector('.view').setAttribute('data-chat-following-tail', '');
      port.scrollTop = floor();
      const genericBefore = snapshot();
      // Native tool rows incorrectly arm entrance=true when an open Turn remounts.
      mount(true, false);
      for (let i = 0; i < 40; i++) await new Promise(requestAnimationFrame);
      const generic = snapshot();
      // A genuinely new row in this same running conversation still glides in.
      // Leave real paint room and perform the native host's bottom landing first.
      document.querySelector('[data-chat-running]').style.marginTop = '80px';
      for (let i = 0; i < 40; i++) await new Promise(requestAnimationFrame);
      document.querySelector('#root').id = 'old-root';
      const added = document.createElement('div');
      added.dataset.chatFlowKey = 'new'; added.dataset.chatAnchorKey = 'new';
      added.innerHTML = '<div id="root" style="height:48px">New tool result</div>';
      document.querySelector('[data-chat-flow]').insertBefore(added, document.querySelector('[data-chat-running]'));
      port.scrollTop = floor();
      mount(true, false);
      let newRowShift = 0;
      for (let i = 0; i < 10; i++) {
        await new Promise(requestAnimationFrame);
        newRowShift = Math.max(newRowShift, Number(/translate3d\\(0(?:px)?,\\s*([\\d.]+)px/.exec(added.style.transform)?.[1] ?? 0));
      }
      return {before, idle, grown, restored, resumed, tallerStatus, reading, wheelReading, wheelGrowth, sentAndGrown,
        genericBefore, generic, initialText, newRowShift, clickAndShrink,
        maxIdleDrift: Math.max(...samples.map(s => Math.abs(s.tailTop - before.tailTop)))};
    }""")
    browser.close()

print(json.dumps(result, ensure_ascii=False))
assert result["maxIdleDrift"] <= 1, "Existing content moved when the running follower remounted"
assert abs(result["clickAndShrink"]["top"] - result["clickAndShrink"]["floor"]) <= 1, "A layout clamp after clicking a control was mistaken for reading upward"
assert result["grown"]["floor"] > result["idle"]["floor"], "Growth was not exercised"
assert abs(result["grown"]["floor"] - result["grown"]["top"]) <= 1, "Real growth lost bottom"
assert result["wheelReading"]["floor"] - result["wheelReading"]["top"] > 48, "Upward reading gesture was ignored"
assert abs(result["wheelGrowth"]["top"] - result["wheelReading"]["top"]) <= 1, "Growth forced a history reader to bottom"
assert abs(result["sentAndGrown"]["top"] - result["sentAndGrown"]["floor"]) <= 1, "Native own-message bottom landing did not resume follow"
assert abs(result["resumed"]["tailTop"] - result["restored"]["tailTop"]) <= 1, "Switching back replayed scrolling"
assert abs(result["tallerStatus"]["top"] - result["tallerStatus"]["floor"]) <= 1, "Late running-status growth lost bottom"
for name in ("idle", "clickAndShrink", "grown", "resumed", "tallerStatus", "sentAndGrown"):
    assert result[name]["statusTop"] >= 0, f"{name}: running status moved above the viewport"
    assert result[name]["statusBottom"] <= result[name]["composerTop"] + 1, f"{name}: composer obscures running status"
assert abs(result["reading"]["top"] - 200) <= 1, "Reader position was overridden"
assert abs(result["generic"]["tailTop"] - result["genericBefore"]["tailTop"]) <= 1, "An existing tool row replayed its entrance"
assert result["initialText"] == "Existing streamed content", "Existing text was erased and replayed on remount"
assert result["newRowShift"] > 1, "A genuinely new row lost its entrance animation"
print("Chromium: running remount/layout clamp stay at bottom, status remains visible, upward reading releases, native own-message landing resumes follow")
