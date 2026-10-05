"""Exercise generated Think components in real React and Chromium.

Run with existing React 18 UMD dependencies; no installation or network is used:
  DSH_TEST_NODE_MODULES=/path/to/node_modules python3 tools/history-layout-performance-browser.py
STREAM_CLIENT selects an older generated client for the failing comparison.

Only the icon primitives, optional fade channel and outer follow notification
are fixture adapters. Disclosure, Reasoning, Summary and smooth-content hooks
are extracted unchanged from the generated production client.
"""
import json
import os
import re
from pathlib import Path

from playwright.sync_api import sync_playwright


plugin = Path(__file__).resolve().parents[1]
source = Path(os.environ.get("STREAM_CLIENT", plugin / "lib/client.js")).read_text()
node_candidates = [
    Path(os.environ["DSH_TEST_NODE_MODULES"]) if "DSH_TEST_NODE_MODULES" in os.environ else plugin / "node_modules",
    Path.cwd() / "node_modules",
    Path.cwd() / "work/dsh-codex-subscription/node_modules",
    Path.home() / "Documents/deepseek/dsh-qoder-connect/node_modules",
]
modules = next((path for path in node_candidates if (path / "react/umd/react.production.min.js").is_file()
                and (path / "react-dom/umd/react-dom.production.min.js").is_file()), None)
if modules is None:
    raise SystemExit("Set DSH_TEST_NODE_MODULES to existing React 18 / ReactDOM 18 UMD dependencies")

think_css = json.loads(re.search(r'const css\$4 = ("(?:\\.|[^"\\])*");', source).group(1))
clock_lines = source.split('const TURN_PROCESS_CLOCK_CSS = [', 1)[1].split('].join("\\n")', 1)[0]
clock_css = "\n".join(json.loads(line.strip().rstrip(",")) for line in clock_lines.splitlines() if line.strip().startswith('"'))
disclosure_begin = source.index("var TypewriterAssistantNodeView_module_css_default = {")
disclosure_end = source.index("//#region src/settings.ts", disclosure_begin)
smooth_begin = source.index("//#region src/client/useSmoothStreamContent.ts")
smooth_end = source.index("//#region src/client/useFpsGuard.ts", smooth_begin)
reasoning_begin = source.index("function selectThoughtSummary(text)")
reasoning_end = source.index("const TypewriterAssistantNodeView = ", reasoning_begin)
tuning_begin = source.index("const DEFAULT_STREAM_DEBUG_TUNING = {")
tuning_end = source.index("\n\t\t};", tuning_begin) + len("\n\t\t};")
components = (source[disclosure_begin:disclosure_end] + source[smooth_begin:smooth_end]
              + source[tuning_begin:tuning_end] + source[reasoning_begin:reasoning_end])

instrument = """() => {
  window.measuringHistory = false;
  window.historyReads = {computedStyles:0, bounds:0, bodyGeometry:0, bodyScrollReads:0,
    bodyScrollWrites:0, bodyResizeObservations:0, bodyScrollListeners:0, summaryScrollWrites:0};
  const body = element => element?.classList?.contains('I17U7q_thinkBody');
  const summary = element => element?.classList?.contains('dsh-stream-think-summary');
  const nativeComputed = window.getComputedStyle;
  window.getComputedStyle = function(element, ...args) {
    if (measuringHistory && body(element)) historyReads.computedStyles++;
    return nativeComputed.call(this, element, ...args);
  };
  const bounds = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function(...args) {
    if (measuringHistory && body(this)) historyReads.bounds++;
    return bounds.apply(this, args);
  };
  for (const property of ['scrollTop','scrollHeight','clientHeight','scrollLeft']) {
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, property);
    if (!descriptor?.get) throw new Error('Missing native layout descriptor: ' + property);
    Object.defineProperty(Element.prototype, property, {...descriptor,
      get() {
        if (measuringHistory && body(this)) {
          if (property === 'scrollTop') historyReads.bodyScrollReads++;
          else if (property === 'scrollHeight' || property === 'clientHeight') historyReads.bodyGeometry++;
        }
        return descriptor.get.call(this);
      },
      ...descriptor.set ? {set(value) {
        if (measuringHistory) {
          if (body(this) && property === 'scrollTop') historyReads.bodyScrollWrites++;
          if (summary(this) && property === 'scrollLeft') historyReads.summaryScrollWrites++;
        }
        descriptor.set.call(this, value);
      }} : {}
    });
  }
  const listen = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, ...args) {
    if (measuringHistory && body(this) && ['scroll','wheel'].includes(type)) historyReads.bodyScrollListeners++;
    return listen.call(this, type, ...args);
  };
  const NativeResize = window.ResizeObserver;
  window.ResizeObserver = class extends NativeResize {
    observe(element, ...args) {
      if (measuringHistory && body(element)) historyReads.bodyResizeObservations++;
      return super.observe(element, ...args);
    }
  };
}"""

fixture = """
const react = React;
const react_jsx_runtime = {
  Fragment: React.Fragment,
  jsx: (type, props, key) => React.createElement(type, key === undefined ? props : {...props,key}),
  jsxs: (type, props, key) => React.createElement(type, key === undefined ? props : {...props,key})
};
const Icon = props => React.createElement('span', {...props, 'aria-hidden':true}, '◇');
const _deepseek_ai_dsh_client_ui_primitives = {IconThinkOutlineRegular:Icon, IconChevronDownOutlineRegular:Icon};
const debugRuntime = {activeTuning:()=>DEFAULT_STREAM_DEBUG_TUNING, reportStream(){}};
const notifyFollowCommit = () => {};
const useLogarithmicFade = () => {};
""" + components + """
window.testRoot = ReactDOM.createRoot(document.querySelector('#app'));
window.actualSummary = RollingThinkSummary;
const props = {preset:'balanced', thinkAutoExpand:true, thinkAutoCollapse:true,
  thinkCapLines:12, motionReduced:true, logarithmicFade:false, t:key=>key};
window.reasoningProps = {...props, running:true, text:Array.from({length:80},(_,i)=>'检查第 '+i+' 项内容，保留完整底部。').join('\\n')};
window.mountHistory = () => {
  ReactDOM.flushSync(()=>testRoot.render(React.createElement('section', {key:'history'},
    ...Array.from({length:300},(_,i)=>React.createElement(AnimatedReasoning,
      {...props,key:i,running:false,text:'完成分析，确认当前数据与输出一致。\\n第 '+i+' 轮需要保留完整的思考记录。'})))));
};
window.renderReasoning = patch => {
  Object.assign(reasoningProps, patch);
  ReactDOM.flushSync(()=>testRoot.render(React.createElement('section', {key:'reasoning'},
    React.createElement(AnimatedReasoning, reasoningProps))));
};
window.renderSummary = followEnd => {
  ReactDOM.flushSync(()=>testRoot.render(React.createElement('section', {key:'summary',className:'summary-case'},
    React.createElement(RollingThinkSummary, {text:'正在检查完整的源文件，并确认编辑、读取与运行结果。'.repeat(8),line:0,followEnd,reduced:true}))));
};
window.waitFrames = async count => {for(let i=0;i<count;i++)await new Promise(requestAnimationFrame);};
window.reasoningGeometry = () => {
  const body = document.querySelector('.I17U7q_thinkBody');
  const style = getComputedStyle(body);
  return {lineHeight:Number.parseFloat(style.lineHeight), height:body.clientHeight,
    scrollHeight:body.scrollHeight, scrollTop:body.scrollTop, maxHeight:style.maxHeight,
    expanded:document.querySelector('[data-disclosure-row]').getAttribute('aria-expanded')};
};
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    try:
        page = browser.new_page(viewport={"width": 1000, "height": 800})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.set_content(f"""<style>
          body{{margin:0;font:14px/24px system-ui}} #app{{padding:24px;width:700px}}
          {think_css}{clock_css}
          .summary-case .dsh-stream-think-summary{{display:block;width:180px;max-width:180px}}
          </style><main id="app"></main>""")
        page.add_script_tag(path=str(modules / "react/umd/react.production.min.js"))
        page.add_script_tag(path=str(modules / "react-dom/umd/react-dom.production.min.js"))
        page.evaluate(instrument)
        page.add_script_tag(content=fixture)
        cdp = page.context.new_cdp_session(page)
        cdp.send("Performance.enable")
        before = {item["name"]: item["value"] for item in cdp.send("Performance.getMetrics")["metrics"]}
        history = page.evaluate("""async () => {
          measuringHistory = true;
          const start = performance.now();
          mountHistory();
          const mountSyncMs = performance.now()-start;
          await waitFrames(12);
          measuringHistory = false;
          return {reads:{...historyReads}, mountSyncMs, elapsedMs:performance.now()-start,
            rows:document.querySelectorAll('[data-variant=think]').length};
        }""")
        after = {item["name"]: item["value"] for item in cdp.send("Performance.getMetrics")["metrics"]}
        history["layoutCount"] = after["LayoutCount"] - before["LayoutCount"]
        history["styleCount"] = after["RecalcStyleCount"] - before["RecalcStyleCount"]
        history["layoutDurationMs"] = (after["LayoutDuration"] - before["LayoutDuration"]) * 1000
        history["styleDurationMs"] = (after["RecalcStyleDuration"] - before["RecalcStyleDuration"]) * 1000

        page.evaluate("async () => {renderReasoning({thinkCapLines:4}); await waitFrames(8);}")
        running = page.evaluate("reasoningGeometry()")
        page.evaluate("""async () => {
          const body = document.querySelector('.I17U7q_thinkBody');
          body.style.fontSize='20px'; body.style.lineHeight='31.5px';
          await waitFrames(6);
        }""")
        resized = page.evaluate("reasoningGeometry()")
        page.evaluate("""async () => {
          renderReasoning({text:reasoningProps.text+'\\n'+reasoningProps.text});
          await waitFrames(8);
        }""")
        grown = page.evaluate("reasoningGeometry()")
        page.locator("[data-disclosure-row]").click()
        page.evaluate("async () => {await waitFrames(8);}")
        collapsed = page.evaluate("reasoningGeometry()")
        page.locator("[data-disclosure-row]").click()
        page.evaluate("async () => {await waitFrames(8);}")
        reopened = page.evaluate("reasoningGeometry()")
        page.evaluate("async () => {renderReasoning({thinkCapLines:12}); await waitFrames(8);}")
        twelve = page.evaluate("reasoningGeometry()")
        page.evaluate("async () => {renderReasoning({thinkCapLines:0}); await waitFrames(8);}")
        unlimited = page.evaluate("reasoningGeometry()")
        page.evaluate("async () => {renderReasoning({thinkCapLines:4,thinkAutoCollapse:false}); await waitFrames(8);}")
        page.evaluate("""async () => {
          renderReasoning({running:false,text:reasoningProps.text+'\\n最后一块文本已完整提交。\\n终点。'});
          await waitFrames(8);
        }""")
        finished = page.evaluate("reasoningGeometry()")

        page.evaluate("async () => {renderSummary(true); await waitFrames(8);}")
        summary_end = page.locator(".dsh-stream-think-summary").evaluate("element=>({left:element.scrollLeft,width:element.clientWidth,scroll:element.scrollWidth})")
        page.evaluate("async () => {renderSummary(false); await waitFrames(8);}")
        summary_reset = page.locator(".dsh-stream-think-summary").evaluate("element=>element.scrollLeft")
        page.evaluate("""async () => {
          renderSummary(true);
          document.querySelector('.dsh-stream-think-summary').scrollLeft=400;
          renderSummary(false);
          await waitFrames(8);
        }""")
        summary_coalesced_reset = page.locator(".dsh-stream-think-summary").evaluate("element=>element.scrollLeft")
        result = {"history": history, "running": running, "resized": resized, "grown": grown,
                  "collapsed": collapsed, "reopened": reopened, "twelve": twelve,
                  "unlimited": unlimited, "finished": finished, "summaryEnd": summary_end,
                  "summaryReset": summary_reset, "summaryCoalescedReset": summary_coalesced_reset,
                  "errors": errors}
    finally:
        browser.close()

print(json.dumps(result, ensure_ascii=False))
assert not errors, errors
assert history["rows"] == 300, "Large completed history was not mounted"
assert all(value == 0 for value in history["reads"].values()), "Completed collapsed Think rows performed synchronous geometry/scroll work or installed unnecessary observers"
assert history["layoutCount"] <= 8, "Completed history caused per-row layout flushes"
assert history["styleCount"] <= 8, "Completed history caused per-row style flushes"
for name, geometry, cap in [("running", running, 4), ("resized", resized, 4),
                            ("grown", grown, 4), ("reopened", reopened, 4), ("twelve", twelve, 12),
                            ("finished", finished, 4)]:
    expected = geometry["lineHeight"] * cap + 16
    assert abs(geometry["height"] - expected) <= 1, f"{name}: expected full {cap} lines and padding, got {geometry}"
    assert geometry["scrollHeight"] > geometry["height"], f"{name}: internal overflow was not exercised"
assert abs(resized["lineHeight"] - running["lineHeight"]) > 1, "Font/line-height change was not exercised"
for name, geometry in [("running", running), ("grown", grown), ("reopened", reopened), ("finished", finished)]:
    assert abs(geometry["scrollHeight"] - geometry["height"] - geometry["scrollTop"]) <= 1, f"{name}: running Think did not follow its internal bottom"
assert collapsed["expanded"] == "false" and reopened["expanded"] == "true", "User disclosure toggles did not work"
assert unlimited["maxHeight"] == "none" and unlimited["height"] > twelve["height"], "Unlimited mode retained the cap"
assert summary_end["left"] > 0, "Running summary did not show its end"
assert summary_reset == 0, "Finished summary retained the horizontal end offset"
assert summary_coalesced_reset == 0, "Summary completion before the pending RAF retained its live offset"
print("Chromium + real React: 300 closed Think rows avoid synchronous layout; caps track line-height, running internal scroll and summary reset remain correct")
