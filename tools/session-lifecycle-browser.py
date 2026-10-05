"""Real follower callbacks must stop when React reuses the conversation scrollport.

Run: python3 tools/session-lifecycle-browser.py
STREAM_CLIENT can point at a before-fix generated client for comparison.
No model requests are sent; Chromium runs the actual generated follower helpers.
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
    <div class="history" data-chat-flow-key="user-A" data-chat-flow-kind="user" data-chat-anchor-key="user-A">history</div>
    <div class="tail" data-chat-flow-kind="assistant" data-chat-anchor-key="tail-A" data-chat-flow-key="tail-A"><div id="root">Existing streamed content</div></div>
    <div data-chat-running>Running A</div>
  </div></div><div data-composer-seat>composer</div>
</div></div>
"""

scenario = """async ({order, inactive, roundTrip, boundary}) => {
  const port = document.querySelector('[data-conversation-scroll]');
  let session = document.querySelector('[data-conversation-session]');
  const flow = document.querySelector('[data-chat-flow]');
  const view = document.querySelector('.view');
  const wait = async count => {for(let i = 0; i < count; i++) await new Promise(requestAnimationFrame);};
  const snap = () => {
    const tail = document.querySelector('.tail');
    const transform = getComputedStyle(tail).transform;
    const shift = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
    return {session: session.dataset.conversationSession, top: port.scrollTop,
      floor: Math.max(0, port.scrollHeight - port.clientHeight), shift,
      tailTop: tail.getBoundingClientRect().top, owned: port.getAttribute('data-follow-owned')};
  };
  const restore = (name, top) => {
    session.dataset.conversationSession = name;
    // Keep the viewport and flow DOM, as the native host does, but replace all
    // rows. The old follower cannot treat the new history as its completion.
    flow.innerHTML = `<div class="history" style="height:1300px" data-chat-flow-key="user-${name}"
      data-chat-flow-kind="user" data-chat-anchor-key="user-${name}">History ${name}</div>
      <div class="tail" data-chat-flow-kind="assistant" data-chat-flow-key="tail-${name}"
      data-chat-anchor-key="tail-${name}"><div id="root">Restored ${name}</div></div>`;
    view.removeAttribute('data-chat-following-tail');
    port.scrollTop = top;
  };
  port.scrollTop = Math.max(0, port.scrollHeight - port.clientHeight);
  mount();
  await wait(20);
  // Leave an actual growth animation and reserve pending at the unmount.
  document.querySelector('.tail').style.height = '250px';
  await wait(1);
  const active = snap();
  if (inactive) setFirstActive(false);
  let restored;
  if (order === 'cleanup-first') {
    if (boundary === 'partial-history') {
      // React can switch the session attribute before the restored rows finish
      // committing. Old cleanup must not initialize an empty B entry snapshot.
      session.dataset.conversationSession = 'B';
      flow.innerHTML = '';
    }
    cleanup();
    if (boundary === 'container-identity') {
      const replaced = document.createElement('div');
      replaced.dataset.conversationSession = 'A';
      session.after(replaced);
      replaced.append(port);
      session.remove();
      session = replaced;
      restore('A', 200);
    } else if (boundary === 'disconnect-reconnect') {
      // A cached view can leave and re-enter in one task. Neither the id nor
      // the current isConnected flag records that boundary; pending removal
      // records must invalidate the old lifecycle before mount inherits it.
      session.remove();
      document.body.append(session);
      restore('A', 200);
      restored = snap();
      mount();
    } else {
      restore('B', 200);
      if (boundary === 'partial-history') {
        view.setAttribute('data-chat-following-tail', '');
        port.scrollTop = Math.max(0, port.scrollHeight - port.clientHeight);
        restored = snap();
        mount(true, false);
      }
    }
  } else {
    restore('B', 200);
    cleanup();
  }
  restored ??= snap();
  if (roundTrip) {
    // Neither delayed RAF nor the 180ms handoff timer may become valid again
    // merely because the string session id is A once more.
    restore('A', 250);
    restored = snap();
    mount();
  }
  const afterMount = snap();
  const samples = [];
  for (let i = 0; i < 75; i++) {await wait(1); samples.push(snap());}
  return {active, restored, afterMount, final: samples.at(-1),
    restoredAtBottom: boundary === 'partial-history',
    maxScrollDrift: Math.max(...[afterMount, ...samples].map(s => Math.abs(s.top - restored.top))),
    maxVisualShift: Math.max(...[afterMount, ...samples].map(s => Math.abs(s.shift))),
    lastMotionOwner: samples.at(-1).owned};
}"""

cases = [
    ("active_cleanup_before_switch", {"order": "cleanup-first", "inactive": False, "roundTrip": False}),
    ("active_switch_before_cleanup", {"order": "switch-first", "inactive": False, "roundTrip": False}),
    ("inactive_handoff_before_switch", {"order": "cleanup-first", "inactive": True, "roundTrip": False}),
    ("inactive_switch_before_cleanup", {"order": "switch-first", "inactive": True, "roundTrip": False}),
    ("active_quick_A_B_A", {"order": "cleanup-first", "inactive": False, "roundTrip": True}),
    ("inactive_quick_A_B_A", {"order": "cleanup-first", "inactive": True, "roundTrip": True}),
    ("active_container_replaced_same_session", {"order": "cleanup-first", "inactive": False, "roundTrip": False, "boundary": "container-identity"}),
    ("active_disconnect_reconnect_same_task", {"order": "cleanup-first", "inactive": False, "roundTrip": False, "boundary": "disconnect-reconnect"}),
    ("inactive_disconnect_reconnect_same_task", {"order": "cleanup-first", "inactive": True, "roundTrip": False, "boundary": "disconnect-reconnect"}),
    ("restored_history_commits_after_old_cleanup", {"order": "cleanup-first", "inactive": False, "roundTrip": False, "boundary": "partial-history"}),
]
results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    try:
        for name, options in cases:
            page = browser.new_page(viewport={"width": 1000, "height": 800})
            try:
                page.set_content(html)
                page.evaluate("""() => {
                  window.effects = []; window.cleanups = []; window.refs = [];
                  window.react = {
                    useRef: current => {const ref = {current}; refs.push(ref); return ref;},
                    useLayoutEffect: callback => effects.push(callback)
                  };
                  window.debugRuntime = {activeTuning: () => tuning, isEnabled: () => false,
                    reportFollow() {}, reportStream() {}};
                }""")
                page.evaluate(f"""() => {{
                  {helpers}
                  window.tuning = DEFAULT_STREAM_DEBUG_TUNING;
                  window.mount = (entrance = false, predictive = true) => {{
                    useConversationFollow({{current: document.querySelector('#root')}}, true,
                      {{current: 300}}, undefined, predictive, entrance);
                    for (const effect of effects.splice(0)) cleanups.push(effect());
                  }};
                  window.setFirstActive = value => {{refs[0].current = value;}};
                  window.cleanup = () => {{for (const cleanup of cleanups.splice(0)) cleanup?.();}};
                }}""")
                results[name] = page.evaluate(scenario, options)
            finally:
                page.close()
    finally:
        browser.close()

print(json.dumps(results, ensure_ascii=False))
failures = []
for name, result in results.items():
    if result["maxScrollDrift"] > 1:
        failures.append(f'{name}: old callbacks moved restored history by {result["maxScrollDrift"]:.2f}px')
    if result["maxVisualShift"] > 1:
        failures.append(f'{name}: old animation leaked {result["maxVisualShift"]:.2f}px into the restored session')
    if result["restoredAtBottom"] and abs(result["final"]["floor"] - result["final"]["top"]) > 1:
        failures.append(f'{name}: restored tail lost physical bottom')
    if not result["restoredAtBottom"] and result["final"]["floor"] - result["final"]["top"] <= 48:
        failures.append(f'{name}: a deliberately restored history reader was forced to bottom')
    if not result["restoredAtBottom"] and result["lastMotionOwner"] is not None:
        failures.append(f'{name}: stopped old follower left motion ownership on restored history')
assert not failures, '\n'.join(failures)
print('Chromium: cleanup orders, handoff, quick A→B→A, container boundaries and late restored-history commits preserve positions and skip old entrance motion')
