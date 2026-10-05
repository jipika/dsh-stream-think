"""Verify restored row entry with the generated follower and Chromium layout.

Run: python3 tools/session-entry-browser.py
STREAM_CLIENT can select an older bundle to verify the regression fails.
React's layout-effect dispatcher is a small shim; all entry classification,
following, text pacing, CSS, and browser observers come from the real bundle.
The test never connects to DSH or sends model requests.
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
queue_start = source.index('const QUEUE_ACCEL_EXPONENT = ')
queue_end = source.index('/** Counts user-perceived characters', queue_start)
queue_helpers = source[queue_start:queue_end]
opaque_start = source.index('const ledgerByRoot = ')
opaque_end = source.index('//#region \\0dsh-css:', opaque_start)
opaque_helpers = source[opaque_start:opaque_end]
entry_css_start = source.index('const css$2 = ', opaque_end) + len('const css$2 = ')
entry_css = json.JSONDecoder().raw_decode(source[entry_css_start:])[0]

html = """
<style>
* { box-sizing: border-box; } body { margin: 0; }
[data-conversation-scroll] { height: 700px; overflow: auto; overflow-anchor: none; }
.view { display: flex; flex-direction: column; min-height: 620px; }
[data-chat-flow] { display: flex; flex-direction: column; gap: 8px; padding: 12px 24px; }
.history { height: 900px; flex: none; }
.tail { min-height: 120px; flex: none; line-height: 24px; }
.entry-root { height: 96px; }
[data-chat-running] { height: 28px; margin-top: 80px; flex: none; }
[data-composer-seat] { height: 80px; position: sticky; bottom: 0; background: white; }
</style>
<div data-conversation-session="A"><div data-conversation-scroll>
 <div class="view" data-chat-following-tail><div data-chat-flow>
  <div class="history" data-chat-anchor-key="history">Earlier transcript</div>
  <div class="tail" data-chat-anchor-key="tool-known" data-chat-flow-key="tool-known" data-chat-node-key="tool-known">
   <div id="restored" class="entry-root _7P9_Ta_surface" data-entrance="active">Existing restored tool result. Keep this text visible.</div>
  </div>
  <div data-chat-running>Running</div>
 </div></div><div data-composer-seat>composer</div>
</div></div>
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    try:
        page = browser.new_page(viewport={"width": 1000, "height": 800}, reduced_motion="no-preference")
        page_errors = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.set_content(html)
        page.add_style_tag(content=entry_css)
        page.evaluate("""() => {
          window.effects = [];
          window.react = { useRef: current => ({current}), useLayoutEffect: cb => effects.push(cb) };
          window.debugRuntime = { activeTuning: () => tuning, isEnabled: () => false, reportFollow() {}, reportStream() {} };
        }""")
        page.evaluate(f"""() => {{
          {helpers}
          {queue_helpers}
          {opaque_helpers}
          window.tuning = DEFAULT_STREAM_DEBUG_TUNING;
          window.frameNumber = 0;
          const markFrame = () => {{ frameNumber++; requestAnimationFrame(markFrame); }};
          requestAnimationFrame(markFrame);
          window.mount = root => {{
            const callbacks = [];
            const cleanups = [];
            const rootRef = {{current: root}};
            const speedRef = {{current:300}};
            useConversationFollow(rootRef, true, speedRef, undefined, false, true, () => {{
              callbacks.push({{frame: frameNumber, text: root.textContent}});
              // Mirrors the wrapper's layout-effect state update before paint.
              root.dataset.entrance = 'idle';
            }});
            for (const effect of effects.splice(0)) cleanups.push(effect());
            // FollowHost is a child, so its layout effects run before the
            // generic wrapper's progressive-text layout effect.
            useProgressiveDomText(rootRef, true, true, speedRef);
            for (const effect of effects.splice(0)) cleanups.push(effect());
            return {{callbacks, cleanup() {{ for (const cleanup of cleanups.splice(0)) cleanup?.(); rootRef.current = null; }} }};
          }};
        }}""")
        result = page.evaluate("""async () => {
          const port = document.querySelector('[data-conversation-scroll]');
          const flow = document.querySelector('[data-chat-flow]');
          const status = document.querySelector('[data-chat-running]');
          const floor = () => Math.max(0, port.scrollHeight - port.clientHeight);
          const frames = async count => { for (let i=0; i<count; i++) await new Promise(requestAnimationFrame); };
          const snapshot = (root, callbacks, startFrame) => ({
            startFrame, frame: frameNumber, callbacks: callbacks.map(item => ({...item})),
            entrance: root.dataset.entrance, text: root.textContent,
            opacity: Number(getComputedStyle(root).opacity), transform: getComputedStyle(root).transform,
            animations: root.getAnimations().length, top: port.scrollTop, floor: floor(),
            rowTop: root.parentElement.getBoundingClientRect().top,
            shift: root.parentElement.style.transform
          });
          port.scrollTop = floor();
          const firstRoot = document.querySelector('#restored');
          const expectedText = firstRoot.textContent;
          const firstFrame = frameNumber;
          const first = mount(firstRoot);
          const firstSync = snapshot(firstRoot, first.callbacks, firstFrame);
          await frames(12);
          const firstSettled = snapshot(firstRoot, first.callbacks, firstFrame);

          // A grouping change creates a new DOM row and display flow key, while
          // preserving the underlying native node key and conversation lifetime.
          first.cleanup();
          const replacement = document.createElement('div');
          replacement.className = 'tail';
          replacement.dataset.chatFlowKey = JSON.stringify(['tool-known','process']);
          replacement.dataset.chatAnchorKey = replacement.dataset.chatFlowKey;
          replacement.dataset.chatNodeKey = 'tool-known';
          replacement.innerHTML = '<div id="regrouped" class="entry-root _7P9_Ta_surface" data-entrance="active"></div>';
          const regroupedRoot = replacement.firstElementChild;
          regroupedRoot.textContent = expectedText;
          firstRoot.parentElement.replaceWith(replacement);
          port.scrollTop = floor();
          const regroupedFrame = frameNumber;
          const regrouped = mount(regroupedRoot);
          const regroupedSync = snapshot(regroupedRoot, regrouped.callbacks, regroupedFrame);
          const regroupedSamples = [];
          for(let i=0;i<12;i++) { await frames(1); regroupedSamples.push(snapshot(regroupedRoot, regrouped.callbacks, regroupedFrame)); }

          // A genuinely new data node in the same conversation must still
          // receive its entry glide and progressive text, with bounded geometry.
          const added = document.createElement('div');
          added.dataset.chatFlowKey = 'tool-new'; added.dataset.chatAnchorKey = 'tool-new';
          added.dataset.chatNodeKey = 'tool-new';
          added.innerHTML = '<div id="new" class="entry-root _7P9_Ta_surface" data-entrance="active">A genuinely new tool result enters once.</div>';
          flow.insertBefore(added,status);
          port.scrollTop = floor();
          const newRoot = added.firstElementChild;
          const newFrame = frameNumber;
          const fresh = mount(newRoot);
          const freshSync = snapshot(newRoot, fresh.callbacks, newFrame);
          let maxNewShift = 0;
          for(let i=0;i<10;i++) {
            await frames(1);
            maxNewShift = Math.max(maxNewShift, Number(/translate3d\\(0(?:px)?,\\s*([\\d.]+)px/.exec(added.style.transform)?.[1] ?? 0));
          }
          for(let i=0;i<180;i++) {
            if(fresh.callbacks.length === 1 && newRoot.textContent === 'A genuinely new tool result enters once.') break;
            await frames(1);
          }
          const freshSettled = snapshot(newRoot, fresh.callbacks, newFrame);
          // Invalidate both arms before their cleanup so no settle owner remains.
          document.querySelector('[data-conversation-session]').dataset.conversationSession = 'B';
          fresh.cleanup(); regrouped.cleanup();
          return {expectedText, firstSync, firstSettled, regroupedSync, regroupedSamples,
            freshSync, freshSettled, maxNewShift};
        }""")
    finally:
        browser.close()

regrouped_drift = max(abs(sample["rowTop"] - result["regroupedSync"]["rowTop"]) for sample in result["regroupedSamples"])
print(json.dumps({key: value for key, value in result.items() if key != "regroupedSamples"} | {
    "regroupedFrames": len(result["regroupedSamples"]), "regroupedDriftPx": regrouped_drift,
    "pageErrors": page_errors,
}, ensure_ascii=False, indent=2))
assert page_errors == [], "Generated entry/text helpers must run without browser errors"
first = result["firstSync"]
assert len(first["callbacks"]) == 1 and first["callbacks"][0]["frame"] == first["startFrame"], "History entrance must be canceled synchronously before the next animation frame"
assert first["entrance"] == "idle" and first["animations"] == 0 and first["opacity"] == 1, "Restored history must not paint a CSS entrance frame"
assert first["text"] == result["expectedText"], "Restored text must remain visible on its initial commit"
regrouped = result["regroupedSync"]
assert len(regrouped["callbacks"]) == 1 and regrouped["callbacks"][0]["frame"] == regrouped["startFrame"], "A remounted historical node key must cancel entrance before paint"
assert regrouped["entrance"] == "idle" and regrouped["animations"] == 0, "Regrouping a known node must not replay CSS entry"
assert regrouped["text"] == result["expectedText"], "Changing the DOM and flow key must not clear historical text"
assert all(sample["text"] == result["expectedText"] for sample in result["regroupedSamples"]), "Regrouped text must not blink during subsequent frames"
assert regrouped_drift <= 0.25, "Regrouping a restored row must not glide the conversation"
fresh = result["freshSync"]
assert fresh["callbacks"] == [] and fresh["entrance"] == "active", "A new data node must retain genuine entrance"
assert fresh["text"] == "", "A genuine new node must still receive progressive text reveal"
assert result["maxNewShift"] > 1, "A genuine new node must retain its bounded entry glide"
assert result["freshSettled"]["text"] == "A genuinely new tool result enters once.", "The new row must reveal its complete final text"
assert len(result["freshSettled"]["callbacks"]) == 1, "Genuine entrance must finish exactly once"
print("PASS: history cancels before RAF; regrouped node keeps text and position; new node enters once")
