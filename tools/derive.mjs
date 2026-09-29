#!/usr/bin/env node
/**
 * derive.mjs — 从 dsh-smooth-stream 派生 dsh-stream-think 的两个半边。
 *
 * 为什么是「派生脚本」而不是手工改 bundle：
 *   · dsh-stream-think 的流式渲染引擎（TypewriterAssistantNodeView / FollowHost /
 *     useSmoothStreamContent …）是上游 dsh-smooth-stream 的成果，重写不现实；
 *     我们集中维护 Think 行的展开归属与过程计时等宿主适配。
 *   · bundle 是构建产物，手改无法审计、上游升级后无法重放。本脚本把每一处
 *     改动写成具名补丁（锚点 + 期望命中次数），任何一处对不上就整份失败并列出
 *     诊断，绝不静默产出半成品。
 *
 * 用法：
 *   node tools/derive.mjs                       # 源：本包 vendor/dsh-smooth-stream
 *   node tools/derive.mjs --source <包目录>      # 指定其它 smooth-stream 安装
 *   node tools/derive.mjs --check               # 只校验补丁能否命中，不写盘
 *
 * 产出：lib/index.js（Host 半边）、lib/client.js（Client 半边）
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PLUGIN_ROOT = resolve(HERE, '..')
const OUT_LIB = join(PLUGIN_ROOT, 'lib')

const argv = process.argv.slice(2)
const checkOnly = argv.includes('--check')
const sourceArg = argv[argv.indexOf('--source') + 1]
const DEFAULT_SOURCES = [
  join(PLUGIN_ROOT, 'vendor', 'dsh-smooth-stream'),
]
const SOURCE = sourceArg !== undefined && !sourceArg.startsWith('--')
  ? resolve(sourceArg)
  : DEFAULT_SOURCES.find(candidate => existsSync(join(candidate, 'lib', 'client.js')))

if (SOURCE === undefined) {
  console.error('[derive] 找不到 dsh-smooth-stream 源包；用 --source <包目录> 指定')
  process.exit(1)
}

const NEW_ID = 'dsh-stream-think'
const failures = []
const applied = []

/** 精确替换：命中次数不符即记为失败（绝不静默跳过）。 */
function swap(source, name, from, to, expect = 1) {
  const count = source.split(from).length - 1
  const wanted = expect === 'all' ? count : expect
  if (count === 0 || count !== wanted) {
    failures.push(`${name}: 期望 ${expect} 处，实际命中 ${count} 处 | 锚点: ${JSON.stringify(from.slice(0, 90))}`)
    return source
  }
  applied.push(`${name} ×${count}`)
  return source.split(from).join(to)
}

/* ────────────────────────────────────────────────────────────────────────────
 * 一、注入的代码块
 * ──────────────────────────────────────────────────────────────────────────── */

/** 修复「正在分析 → 不展开」：上游把 running 判定写成 index === last。 */
const IS_REASONING_LIVE = [
  '\t\t/**',
  '\t\t* dsh-stream-think: 该 reasoning 块是否仍在「思考中」。',
  '\t\t*',
  '\t\t* 上游判定是 `index === last`（assistant 节点的最后一个 block），于是',
  '\t\t* [reasoning, tool-call] 这种「正在分析请求、准备调工具」的形态里，reasoning',
  '\t\t* 不是最后一块，被当成已结算 —— 既不自动展开、data-state 也不是 running',
  '\t\t* （思考盒插件正是靠 data-state 判定，于是两处一起失效）。',
  '\t\t* 正确语义：正文（text）尚未开始、且后面没有更新的 reasoning 块时，仍在思考。',
  '\t\t*/',
  '\t\tfunction findLiveReasoningIndex(blocks) {',
  '\t\t\tfor (let i = blocks.length - 1; i >= 0; i--) {',
  '\t\t\t\tconst kind = blocks[i]?.kind;',
  '\t\t\t\tif (kind === "text") return -1;',
  '\t\t\t\tif (kind === "reasoning") return i;',
  '\t\t\t}',
  '\t\t\treturn -1;',
  '\t\t}',
  '\t\tfunction isReasoningLive(blocks, index) {',
  '\t\t\treturn index === findLiveReasoningIndex(blocks);',
  '\t\t}',
  '\t\tfunction shouldHideReasoning(nativeHidden, streaming, autoExpand, blocks, index) {',
  '\t\t\treturn nativeHidden && !(streaming && autoExpand && isReasoningLive(blocks, index));',
  '\t\t}',
  '\t\tfunction shouldKeepReasoningDuringHandoff(autoCollapse, turnStatus) {',
  '\t\t\treturn !autoCollapse || turnStatus !== "closed";',
  '\t\t}',
  '',
].join('\n')

/** Think 摘要只摘最近的实质性句子；切到新句时翻页，流式添字不反复重播。 */
const ROLLING_THINK_SUMMARY = String.raw`
		function selectThoughtSummary(text) {
			const limit = Math.max(0, text.length - 8192);
			const meaningfulEnd = text.trimEnd().length;
			let end = text.length;
			for (let checked = 0; end > limit && checked < 40; checked++) {
				const breakAt = text.lastIndexOf("\n", end - 1);
				const start = Math.max(limit, breakAt + 1);
				const line = text.slice(start, end);
				end = breakAt < limit ? limit : breakAt;
				if (/^\s*(?:\x60{3}|~{3}|(?:const|let|var|function|import|export)\b)/u.test(line)) continue;
				const sentences = [...line.matchAll(/[^。！？!?；;]+[。！？!?；;]?/gu)];
				for (let i = sentences.length - 1; i >= 0; i--) {
					const part = sentences[i];
					const sentence = part[0].replace(/\s+/gu, " ").trim();
					if (sentence === "") continue;
					const offset = start + part.index;
					const trimmed = [...sentence];
					const result = { text: trimmed.length > 120 ? trimmed.slice(0, 119).join("") + "…" : sentence, line: offset, followEnd: offset + part[0].length >= meaningfulEnd };
					const plain = sentence.replace(/[^\p{L}\p{N}]/gu, "");
					if (/^(?:先|再|然后|现在|接着)?(?:开始|继续|调用|执行|检查|读取|搜索|运行|编辑|完成)(?:一下|工具|命令|文件|代码)?[。.!！?？]*$/u.test(sentence)) continue;
					if ([...plain].length >= 8 || ([...plain].length >= 5 && /[\d/\\：:修复发现确认失败成功错误问题结论]/u.test(sentence))) return result;
				}
			}
			return { text: "", line: -1, followEnd: false };
		}
		function RollingThinkSummary({ text, line, followEnd, reduced }) {
			const rootRef = (0, react.useRef)(null);
			const previousRef = (0, react.useRef)({ text, line });
			const lastFlipAtRef = (0, react.useRef)(-Infinity);
			const scrollFrameRef = (0, react.useRef)(0);
			const followEndRef = (0, react.useRef)(followEnd);
			followEndRef.current = followEnd;
			const [outgoing, setOutgoing] = (0, react.useState)(null);
			(0, react.useLayoutEffect)(() => {
				const previous = previousRef.current;
				previousRef.current = { text, line };
				const now = performance.now();
				if (previous.line !== line && previous.text !== "" && text !== "" && !reduced && outgoing === null && now - lastFlipAtRef.current >= 560) {
					lastFlipAtRef.current = now;
					setOutgoing({ text: previous.text, line });
				} else if (previous.line !== line || reduced) setOutgoing(null);
			}, [text, line, reduced, outgoing]);
			(0, react.useEffect)(() => {
				if (outgoing === null) return;
				const timer = setTimeout(() => setOutgoing(null), 260);
				return () => clearTimeout(timer);
			}, [outgoing]);
			(0, react.useEffect)(() => {
				if (scrollFrameRef.current !== 0) return;
				scrollFrameRef.current = requestAnimationFrame(() => {
					scrollFrameRef.current = 0;
					const element = rootRef.current;
					if (element !== null) element.scrollLeft = followEndRef.current ? 1e9 : 0;
				});
			}, [text, followEnd, outgoing]);
			(0, react.useEffect)(() => {
				return () => {
					if (scrollFrameRef.current !== 0) cancelAnimationFrame(scrollFrameRef.current);
					scrollFrameRef.current = 0;
				};
			}, []);
			return (0, react.createElement)("span", {
				ref: rootRef,
				className: cx(TypewriterAssistantNodeView_module_css_default.thinkSummary, "dsh-stream-think-summary"),
				"data-follow-end": followEnd || void 0
			},
				(0, react.createElement)("span", {
					key: line,
					className: cx("dsh-stream-think-summary-current", outgoing?.line === line ? "dsh-stream-think-summary-enter" : "")
				}, text),
				outgoing !== null && (0, react.createElement)("span", {
					key: "old-" + line,
					className: "dsh-stream-think-summary-old",
					"aria-hidden": true
				}, outgoing.text));
		}
`

/** Keep the old follower's layout reservation until a successor takes the port or the turn ends. */
const FOLLOW_HANDOFF = String.raw`
		function waitForFollowHandoff(host, isLeader, enabled, finish) {
			let stopped = false;
			let frame = 0;
			let endTimer = null;
			let watchdog = null;
			let observer = null;
			const stop = () => {
				if (stopped) return;
				stopped = true;
				observer?.disconnect();
				if (frame !== 0) cancelAnimationFrame(frame);
				if (endTimer !== null) clearTimeout(endTimer);
				if (watchdog !== null) clearInterval(watchdog);
			};
			const check = () => {
				frame = 0;
				if (stopped) return;
				const shouldFinish = !host.isConnected || !enabled();
				if (shouldFinish || !isLeader()) {
					stop();
					if (shouldFinish) finish();
					return;
				}
				if (turnStatusOf(host) === null) {
					if (endTimer === null) endTimer = setTimeout(() => { stop(); finish(); }, 180);
				} else if (endTimer !== null) {
				clearTimeout(endTimer);
				endTimer = null;
				}
			};
			if (typeof MutationObserver !== "undefined") {
				observer = new MutationObserver(() => {
					if (frame === 0) frame = requestAnimationFrame(check);
				});
				observer.observe(host, { childList: true, subtree: true });
			}
			watchdog = setInterval(check, 1000);
			check();
			return stop;
		}
`

/** DSH 0.2 reuses one scroll element when the active Session changes. */
const FOLLOW_SESSION_ISOLATION = String.raw`
		const followSessionOwners = new WeakMap();
		const followSessionActivations = new WeakMap();
		function followSessionOf(element) {
			return element?.closest("[data-conversation-session]")?.getAttribute("data-conversation-session") ?? null;
		}
		function isolateFollowSession(port, root) {
			const session = followSessionOf(root);
			const previous = followSessionOwners.get(port);
			if (previous === session) return;
			if (previous !== void 0) {
				clearVisual(port);
				setFlowPad(port, 0);
				restoreFlowFill(port);
				followLeaders.delete(port);
				followCompletionSettle.delete(port);
				followCompletionSettleRows.delete(port);
				followActivePorts.delete(port);
				followReaderHolds.delete(port);
				followHostScrollPorts.delete(port);
				followScrollLedgers.delete(port);
				followGuardAnchors.delete(port);
				followRunwayOffsetHistory.delete(port);
				followFloorHistory.delete(port);
				followSlackTransition.delete(port);
				followActivityAt.delete(port);
				debugRuntime.reportFollow(port, null);
				const activation = {};
				followSessionActivations.set(port, activation);
				queueMicrotask(() => {
					if (followSessionActivations.get(port) === activation) followSessionActivations.delete(port);
				});
			}
			followSessionOwners.set(port, session);
		}
`

/** 宿主的 turn-process 每秒重写计时文字；让数字独立过渡，避免通用逐字器反复擦写。 */
const TURN_PROCESS_CLOCK = String.raw`
		//#region dsh-stream-think: turn-process elapsed clock
		const TURN_PROCESS_CLOCK_STYLE_ID = "dsh-stream-think-turn-process-clock";
		const TURN_PROCESS_CLOCK_CSS = [
			".dsh-stream-think-clock{position:relative;min-width:0}",
			"[data-chat-flow-kind=turn-process]:has(.dsh-stream-think-clock[data-live-empty]){height:0!important;margin:0!important;overflow:hidden}",
			".dsh-stream-think-clock[data-clock-ready] button[data-turn-process]>span:first-child{color:transparent!important;font-variant-numeric:tabular-nums}",
			".dsh-stream-think-clock-overlay{box-sizing:border-box;position:absolute;top:0;left:0;width:100%;height:calc(33px + var(--dsh-content-font-delta,0px));padding:0 0 8px;pointer-events:none;overflow:hidden;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(24px + var(--dsh-content-font-delta,0px));font-variant-numeric:tabular-nums}",
			".dsh-stream-think-clock:has(.dsh-stream-think-highlights) button[data-turn-process]{height:calc(28px + var(--dsh-content-font-delta,0px));padding:0;border-bottom:0}",
			".dsh-stream-think-clock:has(.dsh-stream-think-highlights) .dsh-stream-think-clock-overlay{top:2px;height:calc(24px + var(--dsh-content-font-delta,0px));padding:0}",
			".dsh-stream-think-clock:has(button[data-turn-process]:not(:disabled):hover) .dsh-stream-think-clock-overlay{color:var(--dsw-alias-label-primary)}",
			"[data-chat-running] .dsh-stream-think-live-content{position:relative}",
			"[data-chat-running] .dsh-stream-think-live-native{position:absolute;opacity:0;pointer-events:none}",
			"[data-chat-running] .dsh-stream-think-live-overlay{display:inline-block;min-width:0;white-space:nowrap;pointer-events:none;color:inherit;font:inherit;line-height:inherit;font-variant-numeric:tabular-nums}",
			".dsh-stream-think-clock-number{display:inline-block;position:relative;vertical-align:bottom;height:1lh;line-height:1lh;overflow:hidden}",
			".dsh-stream-think-clock-next{display:inline-block;animation:dsh-stream-think-clock-in .22s cubic-bezier(.2,.8,.2,1) both}",
			".dsh-stream-think-clock-old{position:absolute;top:0;left:0;animation:dsh-stream-think-clock-out .22s cubic-bezier(.2,.8,.2,1) both}",
			".dsh-stream-think-highlights{display:flex;flex-direction:column;gap:2px;padding:8px 0 0;min-width:0;color:var(--dsw-alias-label-secondary);font-size:var(--dsh-content-font-size-secondary,13px);line-height:20px}",
			".dsh-stream-think-clock:has(button[data-turn-process]) > .dsh-stream-think-highlights{padding-top:4px}",
			"[data-chat-flow-kind=turn-process]:has(.dsh-stream-think-highlights) + [data-step-process]{margin-top:4px!important}",
			"[data-chat-flow-kind=turn-process]:has(.dsh-stream-think-highlights) + [data-step-process] + [data-chat-running]{--dsh-chat-flow-gap:4px}",
			"[data-chat-flow-kind=turn-process]:has(.dsh-stream-think-highlights) + [data-step-process] + [data-chat-running] > .QEbr4q_runningDivider{margin:4px 0}",
			".dsh-stream-think-highlight-group{min-width:0}",
			".dsh-stream-think-highlight-header{box-sizing:border-box;display:flex;align-items:center;gap:8px;width:100%;min-width:0;min-height:28px;padding:3px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}",
			".dsh-stream-think-highlight-title{flex:none;font-weight:500;color:var(--dsw-alias-label-secondary)}",
			".dsh-stream-think-highlight-preview{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}",
			".dsh-stream-think-highlight-chevron{flex:none;font-size:14px;line-height:18px;transform:rotate(0deg);transition:transform .22s cubic-bezier(.2,.8,.2,1)}",
			".dsh-stream-think-highlight-header[aria-expanded=true] .dsh-stream-think-highlight-chevron{transform:rotate(180deg)}",
			".dsh-stream-think-highlight-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .22s cubic-bezier(.2,.8,.2,1)}",
			".dsh-stream-think-highlight-body[data-open=true]{grid-template-rows:1fr}",
			".dsh-stream-think-highlight-list{box-sizing:border-box;min-height:0;max-height:min(42vh,360px);overflow:hidden;visibility:hidden;padding:0 0 0 20px;transition:visibility 0s .22s,padding .22s cubic-bezier(.2,.8,.2,1)}",
			".dsh-stream-think-highlight-body[data-open=true] .dsh-stream-think-highlight-list{visibility:visible;transition-delay:0s;overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable;scroll-padding-bottom:12px;padding-top:2px;padding-bottom:12px}",
			".dsh-stream-think-highlight-item{box-sizing:border-box;display:block;width:100%;min-height:26px;padding:3px 0;border:0;background:none;color:inherit;font:inherit;line-height:20px;text-align:left;overflow-wrap:anywhere;cursor:pointer}",
			".dsh-stream-think-highlight-entry{min-width:0}",
			".dsh-stream-think-highlight-text{box-sizing:border-box;min-height:26px;padding:3px 0;overflow-wrap:anywhere}",
			".dsh-stream-think-task-update{margin:4px 0;border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-markdown-code-block);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xs-13);overflow:hidden}",
			".dsh-stream-think-task-update-title{padding:10px 14px 6px;color:var(--dsw-alias-label-caption);font-size:12px;line-height:18px;overflow-wrap:anywhere}",
			".dsh-stream-think-task-items{margin:0;padding:0;list-style:none}",
			".dsh-stream-think-task-item{display:flex;align-items:flex-start;gap:8px;padding:10px 14px;min-width:0;line-height:20px}",
			".dsh-stream-think-task-item+.dsh-stream-think-task-item{border-top:.5px solid var(--dsw-alias-border-l2)}",
			".dsh-stream-think-task-status{flex:none;display:inline-flex;align-items:center;justify-content:center;width:14px;height:20px;font-size:16px;color:var(--dsw-alias-label-secondary)}",
			".dsh-stream-think-task-item[data-status=in_progress] .dsh-stream-think-task-status{color:var(--dsw-alias-state-business-primary)}",
			".dsh-stream-think-task-item[data-status=completed] .dsh-stream-think-task-status{color:var(--dsw-alias-state-success-primary)}",
			".dsh-stream-think-task-item[data-status=pending] .dsh-stream-think-task-status::before{content:'';box-sizing:border-box;width:10px;height:10px;border:1px solid var(--dsw-alias-label-tertiary);border-radius:2px}",
			".dsh-stream-think-task-content{flex:1;min-width:0;white-space:pre-wrap;overflow-wrap:anywhere}",
			".dsh-stream-think-task-label{flex:none;color:var(--dsw-alias-label-caption);font-size:12px;white-space:nowrap}",
			".dsh-stream-think-task-empty{margin:0;padding:9px 14px;color:var(--dsw-alias-label-caption)}",
			".dsh-stream-think-highlight-thought{margin:2px 0 8px;padding:8px 10px;border-left:2px solid var(--dsw-alias-border-secondary,currentColor);border-radius:0 6px 6px 0;background:var(--dsw-alias-background-secondary,transparent);white-space:pre-wrap;overflow-wrap:anywhere}",
			".dsh-stream-think-highlight-item[data-type=file]{text-decoration:underline dotted;text-underline-offset:3px}",
			".dsh-stream-think-highlights button:hover{color:var(--dsw-alias-label-primary)}",
			".dsh-stream-think-highlights button:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-brand-primary));outline-offset:2px;border-radius:2px}",
			"@media (prefers-reduced-motion:reduce){.dsh-stream-think-highlight-body,.dsh-stream-think-highlight-list,.dsh-stream-think-highlight-chevron{transition:none}}",
			// DSH 0.2 把 Think、正文和下一段工具过程拆成不同 flow 行；统一相邻视觉间距。
			".I17U7q_body:has([data-variant=think]){gap:8px}",
			"[data-step-process-content] > [data-chat-flow-kind]{--dsh-chat-flow-gap:8px!important}",
			"[data-step-process]:has([data-variant=think]) + [data-chat-group-part=response]{--dsh-chat-flow-gap:8px!important}",
			"[data-step-process]:has([data-variant=think]) + [data-chat-group-part=response] + :is([data-step-process],[data-chat-flow-kind=tool-call],[data-chat-flow-kind=assistant-step],[data-chat-running]){--dsh-chat-flow-gap:8px!important}",
			"[data-variant=think] .I17U7q_thinkBody[data-think-cap]{padding-top:8px;padding-bottom:8px;scroll-padding-bottom:8px}",
			"[data-step-process-body]:has([data-variant=think] [data-disclosure-content]:not([data-collapsed])){max-height:none;overflow:visible;mask-image:none;scrollbar-gutter:auto}",
			".dsh-stream-think-summary{position:relative;display:block;flex:auto;min-width:0;height:24px;overflow:hidden;white-space:nowrap}",
			".dsh-stream-think-summary-current{display:block;width:max-content;min-width:100%;height:24px;line-height:24px;white-space:nowrap}",
			".dsh-stream-think-summary:not([data-follow-end]) .dsh-stream-think-summary-current{max-width:100%;overflow:hidden;text-overflow:ellipsis}",
			".dsh-stream-think-summary-enter{animation:dsh-stream-think-summary-in .24s cubic-bezier(.2,.8,.2,1) both}",
			".dsh-stream-think-summary-old{position:absolute;inset:0;height:24px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;pointer-events:none;animation:dsh-stream-think-summary-out .24s cubic-bezier(.2,.8,.2,1) both}",
			"[data-step-process] button[data-process-activity].dsh-stream-think-process-title{position:relative;min-width:0;max-width:100%;overflow:visible}",
			".dsh-stream-think-process-title .dsh-stream-think-process-native{position:absolute;opacity:0;pointer-events:none}",
			".dsh-stream-think-process-viewport{display:block;position:relative;flex:0 1 auto;min-width:0;height:1lh;overflow:hidden;pointer-events:none}",
			".dsh-stream-think-process-label{display:block;position:relative;height:1lh;font:inherit;line-height:1lh;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit}",
			".dsh-stream-think-process-label[data-old]{position:absolute;inset:0 0 auto;z-index:1}",
			"@keyframes dsh-stream-think-clock-in{from{opacity:0;transform:translateY(.45em)}to{opacity:1;transform:translateY(0)}}",
			"@keyframes dsh-stream-think-clock-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-.45em)}}",
			"@keyframes dsh-stream-think-summary-in{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}",
			"@keyframes dsh-stream-think-summary-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(100%)}}",
			"@media (prefers-reduced-motion:reduce){.dsh-stream-think-clock-next,.dsh-stream-think-clock-old{animation:none}.dsh-stream-think-clock-old{display:none}}"
		].join("\n");
		function ensureTurnProcessClockStyle() {
			if (typeof document === "undefined" || !document.head) return;
			let style = document.getElementById(TURN_PROCESS_CLOCK_STYLE_ID);
			if (style === null) {
				style = document.createElement("style");
				style.id = TURN_PROCESS_CLOCK_STYLE_ID;
				document.head.appendChild(style);
			}
			if (style.textContent !== TURN_PROCESS_CLOCK_CSS) style.textContent = TURN_PROCESS_CLOCK_CSS;
		}
		function clockLabelParts(label) { return label.split(/(\d+)/u); }
		function canAnimateClockChange(previous, current) {
			if (previous === "" || previous === current) return false;
			const oldParts = clockLabelParts(previous);
			const nextParts = clockLabelParts(current);
			if (oldParts.length !== nextParts.length) return false;
			let changed = false;
			for (let i = 0; i < nextParts.length; i++) {
				if (i % 2 === 0) {
					if (oldParts[i] !== nextParts[i]) return false;
				} else if (oldParts[i] !== nextParts[i]) {
					if (oldParts[i].length !== nextParts[i].length) return false;
					if (Number(nextParts[i]) - Number(oldParts[i]) !== 1) return false;
					changed = true;
				}
			}
			return changed;
		}
		/** DSH 0.2 renders the live clock in RunningStatus, outside turn-process. */
		function installLiveRunningClock() {
			if (typeof document === "undefined" || !document.body || typeof MutationObserver === "undefined") return () => {};
			const attached = new Map();
			const attach = (row) => {
				if (attached.has(row)) return;
				const content = row.lastElementChild;
				const native = content?.lastElementChild;
				if (!content || !native || native.nodeType !== 1) return;
				// TextShimmer keeps a second decorative copy; read only its real text layer.
				const source = native.firstElementChild ?? native;
				const overlay = document.createElement("span");
				overlay.className = "dsh-stream-think-live-overlay";
				overlay.setAttribute("aria-hidden", "true");
				let previous = "";
				const render = () => {
					const current = source.textContent ?? "";
					if (current === previous) return;
					const oldParts = clockLabelParts(previous);
					const parts = clockLabelParts(current);
					const animate = canAnimateClockChange(previous, current);
					const fragment = document.createDocumentFragment();
					for (let i = 0; i < parts.length; i++) {
						const part = parts[i];
						if (!animate || i % 2 === 0 || part === oldParts[i]) {
							fragment.appendChild(document.createTextNode(part));
							continue;
						}
						const digit = document.createElement("span");
						digit.className = "dsh-stream-think-clock-number";
						const old = document.createElement("span");
						old.className = "dsh-stream-think-clock-old";
						old.textContent = oldParts[i];
						const next = document.createElement("span");
						next.className = "dsh-stream-think-clock-next";
						next.textContent = part;
						digit.append(old, next);
						fragment.appendChild(digit);
					}
					overlay.replaceChildren(fragment);
					previous = current;
				};
				render();
				content.classList.add("dsh-stream-think-live-content");
				content.appendChild(overlay);
				native.classList.add("dsh-stream-think-live-native");
				const watcher = new MutationObserver(render);
				watcher.observe(source, { characterData: true, childList: true, subtree: true });
			attached.set(row, () => {
				watcher.disconnect();
				overlay.remove();
				native.classList.remove("dsh-stream-think-live-native");
				content.classList.remove("dsh-stream-think-live-content");
			});
			};
			const scan = (node) => {
				if (node.nodeType !== 1) return;
				if (node.matches?.("[data-chat-running]")) attach(node);
				for (const row of node.querySelectorAll?.("[data-chat-running]") ?? []) attach(row);
			};
			scan(document.body);
			const watcher = new MutationObserver((changes) => {
				let removed = false;
				for (const change of changes) {
					for (const node of change.addedNodes) scan(node);
					if (change.removedNodes.length > 0) removed = true;
				}
				if (removed) for (const [row, detach] of attached) {
					if (!row.isConnected) { detach(); attached.delete(row); }
				}
			});
			watcher.observe(document.body, { childList: true, subtree: true });
			return () => {
				watcher.disconnect();
				for (const detach of attached.values()) detach();
				attached.clear();
			};
		}
		function presentProcessTitle(title) {
			const normalized = title.replace(/\s+/g, " ").trim();
			const fence = normalized.search(/\x60{3}|~{3}/u);
			if (fence >= 0) {
				const separator = normalized.indexOf(" · ");
				const label = (separator >= 0 && separator < fence ? normalized.slice(0, separator) : normalized.slice(0, fence)).replace(/[\s·:：]+$/u, "").trim();
				return (label === "" ? "正在分析请求" : label) + " · 代码片段";
			}
			const chars = [...normalized];
			return chars.length > 100 ? chars.slice(0, 99).join("").trimEnd() + "…" : normalized;
		}
		/** DSH 0.2 的「正在分析请求 · 细节」是原生过程组标题，不是 Think 行。 */
		function installProcessTitleFlip(readMotionPreference) {
			if (typeof document === "undefined" || !document.body || typeof MutationObserver === "undefined") return () => {};
			const attached = new Map();
			const selector = "[data-step-process] button[data-process-activity]";
			const readTitle = (native) => {
				const label = native.querySelector?.(".rwaBla_label") ?? native.querySelector?.('[class*="_label"]') ?? native;
				const source = label.firstElementChild ?? label;
				const text = (source.textContent ?? "").trim();
				return presentProcessTitle(text !== "" ? text : (label.textContent ?? "").trim());
			};
			const reduced = () => {
				const preference = readMotionPreference();
				return preference === "force-reduced" || preference !== "force-smooth" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
			};
			const attach = (button) => {
				const native = button.children[1];
				if (!native || native.nodeType !== 1 || native.classList.contains("dsh-stream-think-process-viewport")) {
					attached.get(button)?.detach();
					attached.delete(button);
					return;
				}
				const prior = attached.get(button);
				if (prior?.native === native) return;
				prior?.detach();
				attached.delete(button);
				let presented = readTitle(native);
				let desired = presented;
				let lastChangeAt = -Infinity;
				let flipActive = false;
				const viewport = document.createElement("span");
				viewport.className = "dsh-stream-think-process-viewport";
				viewport.setAttribute("aria-hidden", "true");
				const current = document.createElement("span");
				current.className = "dsh-stream-think-process-label";
				current.textContent = presented;
				viewport.appendChild(current);
				button.appendChild(viewport);
				button.classList.add("dsh-stream-think-process-title");
				native.classList.add("dsh-stream-think-process-native");
				let oldLayer = null;
				let incoming = null;
				let outgoing = null;
				const clearOld = () => { oldLayer?.remove(); oldLayer = null; };
				const settleFlip = () => {
					if (!flipActive) return;
					flipActive = false;
					clearOld();
					if (desired !== presented) {
						presented = desired;
						current.textContent = desired;
					}
				};
				const render = () => {
					const next = readTitle(native);
					if (next === "" || next === desired) return;
					const now = performance.now();
					const quiet = now - lastChangeAt >= 480;
					lastChangeAt = now;
					desired = next;
					if (flipActive) return; // 这段动画跑完后直接显示期间收到的最新标题。
					const old = presented;
					presented = next;
					current.textContent = next;
					if (old === "" || reduced() || !quiet || typeof current.animate !== "function") return;
					flipActive = true;
					oldLayer = document.createElement("span");
					oldLayer.className = "dsh-stream-think-process-label";
					oldLayer.dataset.old = "";
					oldLayer.textContent = old;
					viewport.appendChild(oldLayer);
					const layer = oldLayer;
					outgoing = layer.animate([{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(100%)" }], { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" });
					incoming = current.animate([{ opacity: 0, transform: "translateY(-100%)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" });
					incoming.onfinish = settleFlip;
					incoming.oncancel = settleFlip;
					outgoing.onfinish = () => { if (oldLayer === layer) clearOld(); };
					outgoing.oncancel = () => { if (oldLayer === layer) clearOld(); };
				};
				const watcher = new MutationObserver(render);
				watcher.observe(native, { childList: true, characterData: true, subtree: true });
				attached.set(button, { native, detach: () => {
					watcher.disconnect();
					if (incoming) { incoming.onfinish = null; incoming.oncancel = null; }
					incoming?.cancel();
					outgoing?.cancel();
					clearOld();
					viewport.remove();
					native.classList.remove("dsh-stream-think-process-native");
					button.classList.remove("dsh-stream-think-process-title");
				} });
			};
			const scan = (node) => {
				if (node.nodeType !== 1) return;
				if (node.matches?.(selector)) attach(node);
				for (const button of [...(node.querySelectorAll?.(selector) ?? [])].slice(-12)) attach(button);
			};
			scan(document.body);
			const watcher = new MutationObserver((changes) => {
				let removed = false;
				for (const change of changes) {
					for (const node of change.addedNodes) scan(node);
					if (change.removedNodes.length > 0) removed = true;
					const button = change.target?.closest?.(selector);
					if (button && attached.get(button)?.native !== button.children[1]) attach(button);
				}
				if (removed) for (const [button, entry] of attached) if (!button.isConnected) { entry.detach(); attached.delete(button); }
			});
			watcher.observe(document.body, { childList: true, subtree: true });
			return () => {
				watcher.disconnect();
				for (const entry of attached.values()) entry.detach();
				attached.clear();
			};
		}
		function editPathsFromToolNode(node) {
			if (node?.kind !== "tool-call") return [];
			const paths = new Set();
			const add = (path) => {
				if (typeof path === "string" && path.trim() !== "" && path.length <= 1024 && !/[\r\n\0]/u.test(path)) paths.add(path.trim());
			};
			const visit = (block, depth) => {
				if (block === null || typeof block !== "object" || depth > 16) return;
				if (block.kind === "tool-result" && block.isError !== true) {
					const name = block.call?.name;
					if (["edit", "write", "apply_patch", "str_replace_editor"].includes(name)) {
						const raw = block.call?.argsRaw ?? "";
						let args;
						try { args = JSON.parse(raw); } catch { args = raw; }
						if (args !== null && typeof args === "object") {
							add(args.path);
							add(args.file_path);
						}
						const patch = typeof args === "string" ? args : args?.patch ?? args?.input ?? "";
						if (typeof patch === "string") for (const match of patch.matchAll(/^\*\*\* (?:Update|Add|Delete|Move to) File: (.+)$/gm)) add(match[1]);
					}
				}
				if (Array.isArray(block.subCalls)) for (const child of block.subCalls) visit(child, depth + 1);
			};
			visit(node.data?.root, 0);
			return [...paths];
		}
		function actionSummariesFromToolNode(node) {
			if (node?.kind !== "tool-call") return [];
			const actions = [];
			const visit = (block, depth) => {
				if (block === null || typeof block !== "object" || depth > 16) return;
				if (block.kind === "tool-result") {
					const name = block.call?.name;
					const kind = ["todo_write", "create_goal", "update_goal", "get_goal"].includes(name) ? "task" : ["bash", "pwsh", "run_code", "exec_command", "write_stdin"].includes(name) || name?.startsWith("terminal_") ? "command" : ["read", "read_file", "read_text_file", "read_image", "view_image", "list_dir", "list_directory", "web_fetch"].includes(name) ? "read" : ["web_search", "file_search", "search_files", "grep", "glob"].includes(name) || name?.endsWith("_inspect") ? "search" : ["edit", "write", "apply_patch", "str_replace_editor"].includes(name) ? "edit" : "other";
					{
						let args = {};
						try { args = JSON.parse(block.call?.argsRaw ?? "{}"); } catch { /* Partial arguments: use tool name. */ }
						if (args === null || typeof args !== "object") args = {};
						const title = kind === "task" ? "任务清单" : kind === "command" ? "命令" : kind === "search" ? "搜索" : kind === "read" ? "读取" : kind === "edit" ? "编辑" : String(name ?? "工具");
						let text;
						let todos = null;
						if (name === "todo_write" && Array.isArray(args.todos)) {
							const seen = new Set();
							const valid = args.todos.every((item) => {
								if (item === null || typeof item !== "object" || typeof item.content !== "string" || item.content.trim() === "" || !["completed", "in_progress", "pending"].includes(item.status)) return false;
								const title = item.content.trim();
								if (seen.has(title)) return false;
								seen.add(title);
								return true;
							});
							if (valid) todos = args.todos.map((item) => ({ content: item.content.trim(), status: item.status }));
						}
						if (kind === "task" && Array.isArray(args.todos)) {
							const todos = args.todos.filter((item) => item !== null && typeof item === "object" && typeof item.content === "string");
							const done = todos.filter((item) => item.status === "completed").length;
							const active = todos.find((item) => item.status === "in_progress") ?? todos.find((item) => item.status === "pending");
							text = done + "/" + todos.length + " 已完成" + (active ? " · " + active.content.replace(/\s+/g, " ").trim() : "");
						} else {
							const candidates = kind === "command" ? [args.description, args.command, name === "run_code" ? "运行代码" : name] : [args.description, args.path, args.file_path, args.query, args.pattern, args.url, args.queries?.[0], name];
							const raw = candidates.find((value) => typeof value === "string" && value.trim() !== "") ?? String(name);
							const normalized = raw.replace(/\s+/g, " ").trim();
							text = [...normalized].length > 120 ? [...normalized].slice(0, 119).join("") + "…" : normalized;
						}
						actions.push({ id: String(block.callId ?? ""), kind, title, text: (block.isError ? "失败 · " : "") + text, ...!block.isError && todos !== null ? { todos } : {} });
					}
				}
				if (Array.isArray(block.subCalls)) for (const child of block.subCalls) visit(child, depth + 1);
			};
			visit(node.data?.root, 0);
			return actions;
		}
		function processHighlights(scope, turn) {
			const files = new Set();
			const thoughts = [];
			const actions = [];
			const seenActionIds = new Set();
			const rows = scope.querySelectorAll("[data-chat-flow-kind][data-chat-turn]");
			for (const row of rows) {
				if (row.dataset.chatTurn !== turn) continue;
				if (row.dataset.chatFlowKind === "tool-call") {
					const holder = row.querySelector("[data-stream-think-edit-files]");
					if (holder !== null) {
						try { for (const path of JSON.parse(holder.dataset.streamThinkEditFiles)) if (typeof path === "string" && path !== "") files.add(path); } catch { /* Malformed DOM attribute: ignore. */ }
					}
					const actionHolder = row.querySelector("[data-stream-think-actions]");
					if (actionHolder !== null) {
						try {
							const rowActions = JSON.parse(actionHolder.dataset.streamThinkActions);
							for (const action of rowActions) {
								if (action === null || typeof action !== "object" || typeof action.kind !== "string" || typeof action.text !== "string") continue;
								if (typeof action.id === "string" && action.id !== "") {
									if (seenActionIds.has(action.id)) continue;
									seenActionIds.add(action.id);
								}
								if (action.kind !== "task") { actions.push(action); continue; }
								const tool = row.querySelector('[data-tool="todo_write"]');
								const summary = tool?.querySelector('[class*="_summary"]:not([class*="_summarySuffix"])')?.textContent?.trim() ?? "";
								const suffix = tool?.querySelector('[class*="_summarySuffix"]')?.textContent?.trim() ?? "";
								actions.push(summary === "" ? action : { ...action, text: summary + (suffix === "" ? "" : " · " + suffix) });
							}
						} catch { /* Malformed DOM attribute: ignore. */ }
					}
				}
				if (row.dataset.chatFlowKind === "assistant-step") {
					for (const box of row.querySelectorAll("[data-variant=think]")) {
						if (box.dataset.state === "running") continue;
						const raw = box.querySelector("[data-disclosure-content]")?.textContent ?? "";
							if (raw.trim() !== "") thoughts.push({ summary: selectThoughtSummary(raw).text, content: raw });
					}
				}
			}
			return { files: [...files], thoughts, actions };
		}
		function visibleProcessHighlights(highlights, settings) {
			return {
				files: settings.showEditedFiles ? highlights.files : [],
				thoughts: settings.showThoughtSummary ? highlights.thoughts : [],
				tasks: settings.showTaskUpdates ? highlights.actions.filter((action) => action.kind === "task") : [],
				actions: highlights.actions.filter((action) => action.kind === "edit" ? settings.showEditedFiles : action.kind === "command" ? settings.showCommands : action.kind === "read" ? settings.showReads : action.kind === "search" ? settings.showSearches : action.kind === "other" && settings.showOtherTools)
			};
		}
		function briefProcessText(text) {
			const chars = [...String(text).replace(/\s+/g, " ").trim()];
			return chars.length > 84 ? chars.slice(0, 83).join("") + "…" : chars.join("");
		}
		function buildProcessHighlightGroups(visible, fileLabel) {
			const groups = [];
			const actionsOf = (kind) => visible.actions.filter((action) => action.kind === kind);
			const actionItems = (actions) => actions.map((action) => ({ type: action.kind === "task" && Array.isArray(action.todos) ? "task" : "action", text: action.kind === "other" ? action.title + " · " + action.text : action.text, action }));
			const add = (key, title, items, preview) => {
				if (items.length > 0) groups.push({ key, title, preview: briefProcessText(preview), items });
			};
			const editActions = actionsOf("edit");
			const files = visible.files.map((path) => ({ type: "file", text: fileLabel(path), path }));
			const failedEdits = editActions.filter((action) => action.text.startsWith("失败 · "));
			const editTitle = files.length > 0 ? "编辑了 " + files.length + " 个文件" + (failedEdits.length > 0 ? " · " + failedEdits.length + " 次失败" : "") : "文件编辑 " + editActions.length + " 次";
			add("edit", editTitle, files.length > 0 ? [...files, ...actionItems(failedEdits)] : actionItems(editActions), files.length > 0 ? files.slice(-2).map((item) => item.text).join("、") : editActions.at(-1)?.text ?? "");
			const reads = actionsOf("read");
			add("read", "读取了 " + reads.length + " 项", actionItems(reads), reads.at(-1)?.text ?? "");
			const commands = actionsOf("command");
			add("command", "运行了 " + commands.length + " 条命令", actionItems(commands), commands.at(-1)?.text ?? "");
			const searches = actionsOf("search");
			add("search", "搜索了 " + searches.length + " 次", actionItems(searches), searches.at(-1)?.text ?? "");
			const currentTask = visible.tasks.findLast((action) => Array.isArray(action.todos)) ?? visible.tasks.at(-1);
			add("task", "任务清单更新 " + visible.tasks.length + " 次", currentTask === void 0 ? [] : actionItems([currentTask]), currentTask?.text ?? "");
			const thoughts = visible.thoughts.map((thought, index) => ({ type: "thought", text: thought.summary || "第 " + (index + 1) + " 段思考", content: thought.content }));
			add("thought", "思考摘要 " + thoughts.length + " 段", thoughts, visible.thoughts.findLast((thought) => thought.summary !== "")?.summary ?? "");
			const others = actionsOf("other");
			add("other", "其他工具 " + others.length + " 项", actionItems(others), others.at(-1)?.text ?? "");
			return groups;
		}
		function shouldShowProcessHighlights(visible) {
			return visible.tasks.length > 0 || visible.files.length > 0 || visible.thoughts.length > 0 || visible.actions.length > 0;
		}
		function sameTaskSnapshot(first, second) {
			if (first === void 0 || second === void 0) return first === second;
			return first.length === second.length && first.every((todo, index) => todo.content === second[index].content && todo.status === second[index].status);
		}
		function wrapTurnProcessClockNodeView(Inner) {
			return function TurnProcessClockNodeView(props) {
				const rootRef = (0, react.useRef)(null);
				const [clock, setClock] = (0, react.useState)({ previous: "", current: "", sequence: 0 });
				const [highlights, setHighlights] = (0, react.useState)({ files: [], thoughts: [], actions: [] });
				const [openGroups, setOpenGroups] = (0, react.useState)({});
				const [visitedGroups, setVisitedGroups] = (0, react.useState)({});
				const [openThought, setOpenThought] = (0, react.useState)(null);
				const detailSettings = (0, react.useSyncExternalStore)(subscribeThinkSettings, getThinkSettings, getThinkSettings);
				const detailsEnabled = detailSettings.showTaskUpdates || detailSettings.showEditedFiles || detailSettings.showThoughtSummary || detailSettings.showCommands || detailSettings.showReads || detailSettings.showSearches || detailSettings.showOtherTools;
				(0, react.useLayoutEffect)(() => {
					const root = rootRef.current;
					if (root === null) return;
					let lastLabel = "";
					const read = () => {
						const label = root.querySelector("button[data-turn-process]>span:first-child");
						const next = label?.textContent ?? "";
						if (next === lastLabel) return;
						lastLabel = next;
						setClock((old) => old.current === next ? old : { previous: old.current, current: next, sequence: old.sequence + 1 });
					};
					read();
					const observer = typeof MutationObserver === "undefined" ? null : new MutationObserver(read);
					observer?.observe(root, { childList: true, characterData: true, subtree: true });
					return () => observer?.disconnect();
				}, []);
				const closed = props.node?.location?.turn?.status === "closed";
				const turnId = String(props.node?.data?.turn ?? "");
				(0, react.useLayoutEffect)(() => {
					if (turnId === "" || !detailsEnabled) return;
					const root = rootRef.current;
					const scope = root?.closest("[data-conversation-scroll]") ?? root?.closest("[data-chat-flow]");
					if (scope === null || scope === void 0) return;
					let frame = 0;
					const read = () => {
						frame = 0;
						const next = processHighlights(scope, turnId);
						setHighlights((old) => old.thoughts.length === next.thoughts.length && old.thoughts.every((thought, i) => thought.summary === next.thoughts[i].summary && thought.content === next.thoughts[i].content) && old.files.length === next.files.length && old.files.every((file, i) => file === next.files[i]) && old.actions.length === next.actions.length && old.actions.every((action, i) => action.id === next.actions[i].id && action.kind === next.actions[i].kind && action.title === next.actions[i].title && action.text === next.actions[i].text && sameTaskSnapshot(action.todos, next.actions[i].todos)) ? old : next);
					};
					const schedule = () => { if (frame === 0) frame = requestAnimationFrame(read); };
					read();
					const belongsToTurn = (node) => (node?.nodeType === 1 ? node : node?.parentElement)?.closest?.("[data-chat-turn]")?.dataset.chatTurn === turnId;
					const observer = typeof MutationObserver === "undefined" ? null : new MutationObserver((changes) => {
						for (const change of changes) {
							if (change.type === "attributes" && belongsToTurn(change.target)) { schedule(); return; }
							if (change.type === "characterData" && belongsToTurn(change.target) && change.target.parentElement?.closest?.('[data-tool="todo_write"]')) { schedule(); return; }
							for (const added of change.addedNodes) {
								if (added.nodeType !== 1) continue;
								if (belongsToTurn(added) && (added.matches?.("[data-chat-flow-kind],[data-variant=think],[data-tool],[data-step-process]") || added.querySelector?.("[data-chat-flow-kind],[data-variant=think],[data-tool],[data-step-process]"))) { schedule(); return; }
							}
						}
					});
					observer?.observe(scope, { childList: true, characterData: true, attributes: true, subtree: true, attributeFilter: ["data-stream-think-edit-files", "data-stream-think-actions", "data-turn-process-member", "data-state"] });
					const stop = closed ? setTimeout(() => observer?.disconnect(), 1500) : null;
					return () => { observer?.disconnect(); if (stop !== null) clearTimeout(stop); if (frame !== 0) cancelAnimationFrame(frame); };
				}, [closed, turnId, detailsEnabled]);
				const oldParts = clockLabelParts(clock.previous);
				const parts = clockLabelParts(clock.current);
				const animate = canAnimateClockChange(clock.previous, clock.current);
				const content = parts.map((part, i) => {
					if (!animate || i % 2 === 0 || part === oldParts[i]) return part;
					return (0, react.createElement)("span", { className: "dsh-stream-think-clock-number", key: clock.sequence + ":" + i },
						(0, react.createElement)("span", { className: "dsh-stream-think-clock-old" }, oldParts[i]),
						(0, react.createElement)("span", { className: "dsh-stream-think-clock-next" }, part));
				});
				const visible = visibleProcessHighlights(highlights, detailSettings);
				const showHighlights = shouldShowProcessHighlights(visible);
				const cwd = props.cwd ?? "";
				const fileLabel = (path) => cwd !== "" && path.startsWith(cwd + "/") ? path.slice(cwd.length + 1) : path;
				const groups = buildProcessHighlightGroups(visible, fileLabel);
				const toggleGroup = (key) => { setOpenGroups((old) => ({ ...old, [key]: !old[key] })); setVisitedGroups((old) => old[key] ? old : { ...old, [key]: true }); };
				/* DSH 0.2 hides the native turn-process while running; keep this seat for live highlights. */
				return (0, react.createElement)("div", { ref: rootRef, className: "dsh-stream-think-clock", "data-clock-ready": clock.current !== "" || void 0, "data-live-empty": !closed && !showHighlights || void 0 },
					(0, react.createElement)(Inner, props),
					clock.current !== "" && (0, react.createElement)("span", { className: "dsh-stream-think-clock-overlay", "aria-hidden": true }, ...content),
					showHighlights && (0, react.createElement)("div", { className: "dsh-stream-think-highlights", "aria-label": "对话执行摘要" },
						...groups.map((group) => {
							const open = openGroups[group.key] === true;
							const mounted = open || visitedGroups[group.key] === true;
							const bodyId = "dsh-stream-think-" + turnId + "-" + group.key;
							return (0, react.createElement)("div", { key: group.key, className: "dsh-stream-think-highlight-group", "data-kind": group.key },
								(0, react.createElement)("button", { type: "button", className: "dsh-stream-think-highlight-header", "aria-expanded": open, "aria-controls": bodyId, onClick: () => toggleGroup(group.key) },
									(0, react.createElement)("span", { className: "dsh-stream-think-highlight-title" }, group.title),
									(0, react.createElement)("span", { className: "dsh-stream-think-highlight-preview", title: group.preview }, group.preview),
									(0, react.createElement)("span", { className: "dsh-stream-think-highlight-chevron", "aria-hidden": true }, "⌄")),
								(0, react.createElement)("div", { id: bodyId, className: "dsh-stream-think-highlight-body", "data-open": open },
									(0, react.createElement)("div", { className: "dsh-stream-think-highlight-list", "aria-hidden": !open },
										...(mounted ? group.items : []).map((item, index) => {
											const key = item.type + ":" + index;
											if (item.type === "thought") {
												const expanded = openThought === index;
												const detailId = bodyId + "-thought-" + index;
												return (0, react.createElement)("div", { key, className: "dsh-stream-think-highlight-entry" },
													(0, react.createElement)("button", { type: "button", className: "dsh-stream-think-highlight-item", "data-type": "thought", tabIndex: open ? 0 : -1, "aria-expanded": expanded, "aria-controls": expanded ? detailId : void 0, onClick: () => setOpenThought((old) => old === index ? null : index) }, item.text),
													expanded && (0, react.createElement)("div", { id: detailId, className: "dsh-stream-think-highlight-thought" }, item.content));
											}
											if (item.type === "task") return (0, react.createElement)("section", { key, className: "dsh-stream-think-task-update", "aria-label": "任务清单" },
												(0, react.createElement)("div", { className: "dsh-stream-think-task-update-title" }, item.text),
												item.action.todos.length === 0 ? (0, react.createElement)("p", { className: "dsh-stream-think-task-empty" }, "暂无任务") :
												(0, react.createElement)("ul", { className: "dsh-stream-think-task-items" }, ...item.action.todos.map((todo, todoIndex) => (0, react.createElement)("li", { key: todoIndex, className: "dsh-stream-think-task-item", "data-status": todo.status },
													(0, react.createElement)("span", { className: "dsh-stream-think-task-status", role: "img", "aria-label": todo.status === "completed" ? "已完成" : todo.status === "in_progress" ? "进行中" : "待处理" }, todo.status === "completed" ? "✓" : todo.status === "in_progress" ? "▶" : null),
													(0, react.createElement)("span", { className: "dsh-stream-think-task-content" }, todo.content),
													(0, react.createElement)("span", { className: "dsh-stream-think-task-label" }, todo.status === "completed" ? "已完成" : todo.status === "in_progress" ? "进行中" : "待处理")))));
											if (item.type === "file" && typeof props.openFile === "function") return (0, react.createElement)("button", { type: "button", key, className: "dsh-stream-think-highlight-item", "data-type": "file", tabIndex: open ? 0 : -1, title: item.path, onClick: () => props.openFile(item.path) }, item.text);
											return (0, react.createElement)("div", { key, className: "dsh-stream-think-highlight-text", "data-type": item.type, title: item.text }, item.text);
										}))));
						})));
			};
		}
		//#endregion
`

/** 思考行行为与折叠过程摘要设置。 */
const THINK_SETTINGS_BLOCK = [
  '\t\t//#region dsh-stream-think: 思考行展开设置（localStorage，不依赖 Host）',
  '\t\t/** 展开/收起/预览行数全部由本插件决定，改完立刻生效，不需要重启。 */',
  '\t\tconst THINK_SETTINGS_KEY = "dsh-stream-think:settings.v1";',
  '\t\tconst THINK_SETTINGS_DEFAULTS = { autoExpand: true, autoCollapse: true, controlScroll: true, capLines: 24, showTaskUpdates: true, showEditedFiles: true, showThoughtSummary: true, showCommands: true, showReads: false, showSearches: false, showOtherTools: false };',
  '\t\tconst THINK_CAP_VAR = "--dsh-stream-think-cap-lines";',
  '\t\tconst thinkSettingsListeners = new Set();',
  '',
  '\t\tfunction readThinkSettings() {',
  '\t\t\tconst out = Object.assign({}, THINK_SETTINGS_DEFAULTS);',
  '\t\t\ttry {',
  '\t\t\t\tconst raw = window.localStorage.getItem(THINK_SETTINGS_KEY) ?? window.localStorage.getItem("dsh-think-ux:settings.v1");',
  '\t\t\t\tif (raw !== null) {',
  '\t\t\t\t\tconst parsed = JSON.parse(raw);',
  '\t\t\t\t\tif (parsed !== null && typeof parsed === "object") {',
  '\t\t\t\t\t\tif (typeof parsed.autoExpand === "boolean") out.autoExpand = parsed.autoExpand;',
  '\t\t\t\t\t\tif (typeof parsed.autoCollapse === "boolean") out.autoCollapse = parsed.autoCollapse;',
  '\t\t\t\t\t\tif (typeof parsed.showTaskUpdates === "boolean") out.showTaskUpdates = parsed.showTaskUpdates;',
  '\t\t\t\t\t\tif (typeof parsed.showEditedFiles === "boolean") out.showEditedFiles = parsed.showEditedFiles;',
  '\t\t\t\t\t\tif (typeof parsed.showThoughtSummary === "boolean") out.showThoughtSummary = parsed.showThoughtSummary;',
  '\t\t\t\t\t\tif (typeof parsed.showCommands === "boolean") out.showCommands = parsed.showCommands;',
  '\t\t\t\t\t\tif (typeof parsed.showReads === "boolean") out.showReads = parsed.showReads;',
  '\t\t\t\t\t\telse if (typeof parsed.showLookups === "boolean") out.showReads = parsed.showLookups;',
  '\t\t\t\t\t\tif (typeof parsed.showSearches === "boolean") out.showSearches = parsed.showSearches;',
  '\t\t\t\t\t\telse if (typeof parsed.showLookups === "boolean") out.showSearches = parsed.showLookups;',
  '\t\t\t\t\t\tif (typeof parsed.showOtherTools === "boolean") out.showOtherTools = parsed.showOtherTools;',
  '\t\t\t\t\t\t// groupAutoExpand / toolSummary 已废弃：过程行注入会把思考盒带坏，不再读取',
  '\t\t\t\t\t\tif (typeof parsed.controlScroll === "boolean") out.controlScroll = parsed.controlScroll;',
  '\t\t\t\t\t\tif (typeof parsed.capLines === "number" && isFinite(parsed.capLines) && parsed.capLines >= 0) {',
  '\t\t\t\t\t\t\tout.capLines = Math.min(400, Math.floor(parsed.capLines));',
  '\t\t\t\t\t\t}',
  '\t\t\t\t\t}',
  '\t\t\t\t}',
  '\t\t\t} catch (error) { /* 隐私模式 / 脏数据 → 默认值 */ }',
  '\t\t\treturn out;',
  '\t\t}',
  '',
  '\t\tlet thinkSettings = readThinkSettings();',
  '',
  '\t\tfunction getThinkSettings() { return thinkSettings; }',
  '\t\tfunction subscribeThinkSettings(cb) {',
  '\t\t\tthinkSettingsListeners.add(cb);',
  '\t\t\treturn () => { thinkSettingsListeners.delete(cb); };',
  '\t\t}',
  '\t\tfunction applyThinkSettings() {',
  '\t\t\tconst lines = thinkSettings.capLines === 0 ? 100000 : thinkSettings.capLines;',
  '\t\t\ttry {',
  '\t\t\t\tdocument.documentElement.style.setProperty(THINK_CAP_VAR, String(lines));',
  '\t\t\t} catch (error) { /* 无 document：忽略 */ }',
  '\t\t\tfor (const cb of Array.from(thinkSettingsListeners)) {',
  '\t\t\t\ttry { cb(); } catch (error) { /* 单个订阅者出错不影响其它 */ }',
  '\t\t\t}',
  '\t\t}',
  '\t\tfunction updateThinkSettings(patch) {',
  '\t\t\tthinkSettings = Object.assign({}, thinkSettings, patch);',
  '\t\t\ttry { window.localStorage.setItem(THINK_SETTINGS_KEY, JSON.stringify(thinkSettings)); } catch (error) { /* 写不进去也当场生效 */ }',
  '\t\t\tapplyThinkSettings();',
  '\t\t}',
  '',
  '\t\tconst THINK_PANEL_STYLE_ID = "dsh-stream-think-settings-style";',
  '\t\tconst THINK_PANEL_CSS = [',
  '\t\t\t".dsh-stream-think-set{display:flex;flex-direction:column;gap:14px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}",',
  '\t\t\t".dsh-stream-think-set-desc{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",',
  '\t\t\t".dsh-stream-think-set-heading{margin:6px 0 -6px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}",',
  '\t\t\t".dsh-stream-think-set-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border:0.5px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-base)}",',
  '\t\t\t".dsh-stream-think-set-main{flex:1;min-width:0}",',
  '\t\t\t".dsh-stream-think-set-name{font-weight:500}",',
  '\t\t\t".dsh-stream-think-set-meta{margin-top:2px;color:var(--dsw-alias-label-caption);font-size:11px;line-height:16px}",',
  '\t\t\t".dsh-stream-think-set-switch{flex:none;position:relative;box-sizing:border-box;width:38px;height:22px;padding:0;border:none;border-radius:999px;background:var(--dsw-alias-bg-layer-3);cursor:pointer;transition:background .16s ease}",',
  '\t\t\t".dsh-stream-think-set-switch[data-on=true]{background:var(--dsw-alias-brand-primary,var(--dsw-specific-sidebar-nav-item-active-accent,#D97757))}",',
  '\t\t\t".dsh-stream-think-set-knob{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .16s ease}",',
  '\t\t\t".dsh-stream-think-set-switch[data-on=true] .dsh-stream-think-set-knob{transform:translateX(16px)}",',
  '\t\t\t".dsh-stream-think-set-seg{display:flex;flex-wrap:wrap;gap:6px}",',
  '\t\t\t".dsh-stream-think-set-seg button{height:26px;padding:0 10px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:999px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:11px;cursor:pointer}",',
  '\t\t\t".dsh-stream-think-set-seg button[data-on=true]{border-color:var(--dsw-alias-brand-primary,var(--dsw-specific-sidebar-nav-item-active-accent,#D97757));color:var(--dsw-alias-label-primary);font-weight:600}"',
  '\t\t].join("\\n");',
  '',
  '\t\tfunction ensureThinkPanelStyle() {',
  '\t\t\tif (typeof document === "undefined" || !document.head) return;',
  '\t\t\tlet el = document.getElementById(THINK_PANEL_STYLE_ID);',
  '\t\t\tif (el === null) {',
  '\t\t\t\tel = document.createElement("style");',
  '\t\t\t\tel.id = THINK_PANEL_STYLE_ID;',
  '\t\t\t\tdocument.head.appendChild(el);',
  '\t\t\t}',
  '\t\t\tif (el.textContent !== THINK_PANEL_CSS) el.textContent = THINK_PANEL_CSS;',
  '\t\t}',
  '',
  '\t\t/** 设置 → 插件 → 思考盒：展开行为和对话分类摘要的唯一入口。 */',
  '\t\tfunction ThinkSettingsPanel() {',
  '\t\t\tconst h = react.createElement;',
  '\t\t\tconst s = (0, react.useSyncExternalStore)(subscribeThinkSettings, getThinkSettings, getThinkSettings);',
  '\t\t\tconst switchBtn = (on, label, testId, onToggle) => h("button", {',
  '\t\t\t\ttype: "button", role: "switch",',
  '\t\t\t\t"aria-checked": on ? "true" : "false",',
  '\t\t\t\t"aria-label": label,',
  '\t\t\t\t"data-on": on ? "true" : "false",',
  '\t\t\t\t"data-testid": testId,',
  '\t\t\t\tclassName: "dsh-stream-think-set-switch",',
  '\t\t\t\tonClick: onToggle',
  '\t\t\t}, h("span", { className: "dsh-stream-think-set-knob", "aria-hidden": true }));',
  '\t\t\tconst row = (key, name, meta, control) => h("div", { className: "dsh-stream-think-set-row", key },',
  '\t\t\t\th("div", { className: "dsh-stream-think-set-main" },',
  '\t\t\t\t\th("div", { className: "dsh-stream-think-set-name" }, name),',
  '\t\t\t\t\th("div", { className: "dsh-stream-think-set-meta" }, meta)),',
  '\t\t\t\tcontrol);',
  '\t\t\tconst capOptions = [4, 12, 24, 48, 0];',
  '\t\t\treturn h("div", { className: "dsh-stream-think-set" },',
  '\t\t\t\th("div", { className: "dsh-stream-think-set-desc" },',
  '\t\t\t\t\t"勾选的类别会直接出现在对话中，各类独立合并，点击标题展开；原生过程组的折叠不影响这些分类。修改立即生效并保存在本机。"),',
  '\t\t\t\trow("autoExpand", "生成时自动展开 Think",',
  '\t\t\t\t\ts.autoExpand',
  '\t\t\t\t\t\t? "模型推理时展开该条 Think；关闭后未手动操作的当前 Think 会收起（默认）"',
  '\t\t\t\t\t\t: "已关闭：当前 Think 收起，需要时手动点开",',
  '\t\t\t\t\tswitchBtn(s.autoExpand, "生成时自动展开 Think", "stream-think-auto-expand",',
  '\t\t\t\t\t\t() => updateThinkSettings({ autoExpand: !s.autoExpand }))),',
  '\t\t\t\trow("autoCollapse", "单段推理结束后收起 Think",',
  '\t\t\t\t\t!s.autoExpand',
  '\t\t\t\t\t\t? "自动展开已关闭；手动展开的 Think 不会被自动收起"',
  '\t\t\t\t\t\t: s.autoCollapse',
  '\t\t\t\t\t\t\t? "该条 Think 结束后收起，不控制外层过程组（默认）"',
  '\t\t\t\t\t\t\t: "已关闭：Think 内层保持展开；整轮结束后可从过程组查看",',
  '\t\t\t\t\tswitchBtn(s.autoCollapse, "单段推理结束后收起 Think", "stream-think-auto-collapse",',
  '\t\t\t\t\t\t() => updateThinkSettings({ autoCollapse: !s.autoCollapse }))),',
  '\t\t\t\trow("controlScroll", "流式跟随（滚动动画）",',
  '\t\t\t\t\ts.controlScroll',
  '\t\t\t\t\t\t? "外层会话随输出平滑跟随；手动上翻即暂停（默认）"',
  '\t\t\t\t\t\t: "已关闭：外层会话滚动交还 DSH；Think 框和过程组仍可独立滚动",',
  '\t\t\t\t\tswitchBtn(s.controlScroll, "流式跟随", "stream-think-control-scroll",',
  '\t\t\t\t\t\t() => updateThinkSettings({ controlScroll: !s.controlScroll }))),',
  '\t\t\t\trow("capLines", "展开时的预览行数",',
  '\t\t\t\t\ts.capLines === 0',
  '\t\t\t\t\t\t? "不限制：整段推理全部铺开，长推理会把会话顶下去"',
  '\t\t\t\t\t\t: "最多显示 " + s.capLines + " 行，超出部分在框内滚动",',
  '\t\t\t\t\th("div", { className: "dsh-stream-think-set-seg" },',
  '\t\t\t\t\t\tcapOptions.map((v) => h("button", {',
  '\t\t\t\t\t\t\ttype: "button",',
  '\t\t\t\t\t\t\tkey: v,',
  '\t\t\t\t\t\t\t"data-on": String(s.capLines === v),',
  '\t\t\t\t\t\t\t"data-testid": "stream-think-cap-" + v,',
  '\t\t\t\t\t\t\tonClick: () => updateThinkSettings({ capLines: v })',
  '\t\t\t\t\t\t}, v === 0 ? "不限" : v + " 行")))),',
  '\t\t\t\th("div", { className: "dsh-stream-think-set-heading" }, "直接显示在对话中"),',
  '\t\t\t\trow("showTaskUpdates", "任务清单", "显示每次已完成的任务清单更新（默认）",',
  '\t\t\t\t\tswitchBtn(s.showTaskUpdates, "在对话中显示任务清单", "stream-think-show-task-updates", () => updateThinkSettings({ showTaskUpdates: !s.showTaskUpdates }))),',
  '\t\t\t\trow("showEditedFiles", "文件编辑", "显示本轮成功写入或编辑的所有文件（默认）",',
  '\t\t\t\t\tswitchBtn(s.showEditedFiles, "在对话中显示已修改文件", "stream-think-show-edited-files", () => updateThinkSettings({ showEditedFiles: !s.showEditedFiles }))),',
  '\t\t\t\trow("showThoughtSummary", "思考摘要", "每段已完成思考各留一条记录；短句不冒充摘要（默认）",',
  '\t\t\t\t\tswitchBtn(s.showThoughtSummary, "在对话中显示思考摘要", "stream-think-show-thought-summary", () => updateThinkSettings({ showThoughtSummary: !s.showThoughtSummary }))),',
  '\t\t\t\trow("showCommands", "命令与代码执行", "从已完成的命令提取简短描述；失败会标记（默认）",',
  '\t\t\t\t\tswitchBtn(s.showCommands, "在对话中显示命令与代码执行", "stream-think-show-commands", () => updateThinkSettings({ showCommands: !s.showCommands }))),',
  '\t\t\t\trow("showReads", "读取文件与图片", "显示读取记录；默认关闭以减少噪音",',
  '\t\t\t\t\tswitchBtn(s.showReads, "在对话中显示读取记录", "stream-think-show-reads", () => updateThinkSettings({ showReads: !s.showReads }))),',
  '\t\t\t\trow("showSearches", "搜索", "显示文件搜索和网页搜索；默认关闭",',
  '\t\t\t\t\tswitchBtn(s.showSearches, "在对话中显示搜索记录", "stream-think-show-searches", () => updateThinkSettings({ showSearches: !s.showSearches }))),',
  '\t\t\t\trow("showOtherTools", "其他工具", "显示未归入以上类别的工具调用；默认关闭",',
  '\t\t\t\t\tswitchBtn(s.showOtherTools, "在对话中显示其他工具", "stream-think-show-other-tools", () => updateThinkSettings({ showOtherTools: !s.showOtherTools }))));',
  '\t\t}',
  '\t\t//#endregion',
  '',
].join('\n')

/** 预览限高的 CSS：挂在 grid 子元素上（挂 grid 容器会让 1fr 轨道塌陷）。 */
const THINK_CAP_CSS = [
  '.I17U7q_thinkBody[data-think-cap]{',
  'box-sizing:border-box;',
  'padding-bottom:16px;scroll-padding-bottom:16px;',
  'overflow-y:auto;overflow-x:hidden;overscroll-behavior:auto;',
  '}',
  '.I17U7q_disclosureContent>.I17U7q_thinkBody{transition:padding-top var(--ds-transition-duration,.2s) var(--ds-ease-in-out,cubic-bezier(.4,0,.2,1)),padding-bottom var(--ds-transition-duration,.2s) var(--ds-ease-in-out,cubic-bezier(.4,0,.2,1))}',
  '.I17U7q_disclosureContent[data-collapsed]>.I17U7q_thinkBody{padding-top:0;padding-bottom:0;overflow:hidden}',
  '.I17U7q_disclosureContent[data-no-transition]>.I17U7q_thinkBody{transition:none}',
  '@media(prefers-reduced-motion:reduce){.I17U7q_disclosureContent>.I17U7q_thinkBody{transition:none}}',
  '.I17U7q_thinkBody[data-think-cap]::-webkit-scrollbar{width:6px}',
].join('')

/** Remove upstream controls whose values no longer drive runtime behavior. */
function removeUpstreamCardField(source, key) {
  const marker = `children: t("${key}")`
  const at = source.indexOf(marker)
  const startMarker = '\t'.repeat(7) + '/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {'
  const endMarker = '\n' + '\t'.repeat(7) + '}),\n'
  const start = source.lastIndexOf(startMarker, at)
  const end = source.indexOf(endMarker, at)
  if (at < 0 || start < 0 || end < 0) {
    failures.push(`client/card-${key}: cannot locate upstream field`)
    return source
  }
  return swap(source, `client/card-${key}`, source.slice(start, end + endMarker.length), '')
}

/* ────────────────────────────────────────────────────────────────────────────
 * 二、Client 半边补丁表
 * ──────────────────────────────────────────────────────────────────────────── */

function patchClient(source) {
  let out = source

  // 身份：模块 id、CSS 标签、日志前缀、RPC 通道、boot global
  out = swap(out, 'client/module-id', '\tid: "dsh-smooth-stream",', `\tid: "${NEW_ID}",`)
  out = swap(out, 'client/css-tag-plugin', 'tag.dataset.plugin = "dsh-smooth-stream";', `tag.dataset.plugin = "${NEW_ID}";`, 'all')
  out = swap(out, 'client/css-tag-id', '"dsh-smooth-stream/', `"${NEW_ID}/`, 'all')
  out = swap(out, 'client/log-prefix', '[dsh-smooth-stream]', `[${NEW_ID}]`, 'all')
  out = swap(out, 'client/error-prefix', 'dsh-smooth-stream: ', `${NEW_ID}: `, 'all')
  out = swap(out, 'client/boot-global', '"__DSH_SMOOTH_STREAM_CONFIG__"', '"__DSH_STREAM_THINK_CONFIG__"', 'all')
  out = swap(out, 'client/rpc-channel', 'const STREAM_SETTINGS_RPC_CHANNEL = "/smooth-stream";', 'const STREAM_SETTINGS_RPC_CHANNEL = "/stream-think";')
  // 300 token/s 的英文、代码常超过 600 字符/s；提高队列上限但仍每帧合批提交。
  out = swap(out, 'client/high-speed-default', 'maxRevealCps: 600,', 'maxRevealCps: 1800,')
  out = swap(out, 'client/high-speed-control', 'key: "maxRevealCps",\n\t\t\t\tlabel: "debugMaxReveal",\n\t\t\t\ttip: "debugTipMaxReveal",\n\t\t\t\tmin: 120,\n\t\t\t\tmax: 1e3,', 'key: "maxRevealCps",\n\t\t\t\tlabel: "debugMaxReveal",\n\t\t\t\ttip: "debugTipMaxReveal",\n\t\t\t\tmin: 120,\n\t\t\t\tmax: 2400,')

  // 原生过程计时不是流式正文：绕开逐字器，单独给每秒变化的数字做过渡。
  out = swap(out, 'client/turn-process-clock-insert', '\t\tfunction wrapAgentChatRows(ctx, useControlScroll) {', TURN_PROCESS_CLOCK + '\t\tfunction wrapAgentChatRows(ctx, useControlScroll) {')
  out = swap(out, 'client/live-clock-start', '\t\t\tconst restores = [];', '\t\t\tconst restores = [];\n\t\t\tconst detachLiveRunningClock = installLiveRunningClock();')
  out = swap(out, 'client/live-clock-stop', '\t\t\t\tfor (const restore of restores) restore();', '\t\t\t\tdetachLiveRunningClock();\n\t\t\t\tfor (const restore of restores) restore();')
  out = swap(out, 'client/process-title-motion-source', '\t\tfunction wrapAgentChatRows(ctx, useControlScroll) {', '\t\tfunction wrapAgentChatRows(ctx, useControlScroll, readMotionPreference) {')
  out = swap(out, 'client/process-title-start', '\t\t\tconst detachLiveRunningClock = installLiveRunningClock();', '\t\t\tconst detachLiveRunningClock = installLiveRunningClock();\n\t\t\tconst detachProcessTitleFlip = installProcessTitleFlip(readMotionPreference);')
  out = swap(out, 'client/process-title-stop', '\t\t\t\tdetachLiveRunningClock();', '\t\t\t\tdetachProcessTitleFlip();\n\t\t\t\tdetachLiveRunningClock();')
  out = swap(out, 'client/process-title-call', 'const unwrap = wrapAgentChatRows(ctx, useControlScroll);', 'const unwrap = wrapAgentChatRows(ctx, useControlScroll, () => settings.getSnapshot().motionPreference);')
  out = swap(out, 'client/turn-process-clock-wrapper', 'const next = wrapFollowNodeView(inner, useControlScroll);', 'const next = key === "turn-process" ? wrapTurnProcessClockNodeView(inner) : wrapFollowNodeView(inner, useControlScroll);')
  out = swap(
    out,
    'client/mark-edited-files',
    [
      '\t\t\t\tconst hostRef = (0, react.useRef)(null);',
      '\t\t\t\tconst growing = isGrowingChatNode(props.node);',
    ].join('\n'),
    [
      '\t\t\t\tconst hostRef = (0, react.useRef)(null);',
      '\t\t\t\t(0, react.useLayoutEffect)(() => {',
      '\t\t\t\t\tif (props.node?.kind !== "tool-call" || hostRef.current === null) return;',
      '\t\t\t\t\tconst files = editPathsFromToolNode(props.node);',
      '\t\t\t\t\tif (files.length > 0) hostRef.current.dataset.streamThinkEditFiles = JSON.stringify(files);',
      '\t\t\t\t\telse delete hostRef.current.dataset.streamThinkEditFiles;',
      '\t\t\t\t\tconst actions = actionSummariesFromToolNode(props.node);',
      '\t\t\t\t\tif (actions.length > 0) hostRef.current.dataset.streamThinkActions = JSON.stringify(actions);',
      '\t\t\t\t\telse delete hostRef.current.dataset.streamThinkActions;',
      '\t\t\t\t}, [props.node]);',
      '\t\t\t\tconst growing = isGrowingChatNode(props.node);',
    ].join('\n'),
  )

  // 修复 1：reasoning 的 running 判定
  out = swap(out, 'client/isReasoningLive-insert', '\t\tfunction AnimatedReasoning({', IS_REASONING_LIVE + '\t\tfunction AnimatedReasoning({')
  out = swap(out, 'client/reasoning-running', 'running: streaming && index === last,', 'running: streaming && isReasoningLive(data.blocks, index),')
  out = swap(
    out,
    'client/defer-native-fold',
    [
      '\t\tfunction FoldableReasoning({ hidden, reveal, children }) {',
      '\t\t\tconst ref = useSearchableHidden(hidden, reveal);',
      '\t\t\treturn /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {',
      '\t\t\t\tref,',
      '\t\t\t\t"data-turn-process-inline": hidden || void 0,',
      '\t\t\t\tchildren',
      '\t\t\t});',
      '\t\t}',
    ].join('\n'),
    [
      '\t\tfunction FoldableReasoning({ hidden, reveal, live, keepVisibleAfterLive, collapseDelayMs, children }) {',
      '\t\t\t/* Let the inner disclosure finish collapsing before restoring the Host fold. */',
      '\t\t\tconst [visibleForLive, setVisibleForLive] = (0, react.useState)(live);',
      '\t\t\t(0, react.useLayoutEffect)(() => {',
      '\t\t\t\tif (live) { setVisibleForLive(true); return; }',
      '\t\t\t\tif (!visibleForLive || keepVisibleAfterLive) return;',
      '\t\t\t\tif (collapseDelayMs <= 0) { setVisibleForLive(false); return; }',
      '\t\t\t\tconst timer = setTimeout(() => setVisibleForLive(false), collapseDelayMs);',
      '\t\t\t\treturn () => clearTimeout(timer);',
      '\t\t\t}, [live, visibleForLive, keepVisibleAfterLive, collapseDelayMs]);',
      '\t\t\tconst effectiveHidden = hidden && !visibleForLive;',
      '\t\t\tconst ref = useSearchableHidden(effectiveHidden, reveal);',
      '\t\t\treturn /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {',
      '\t\t\t\tref,',
      '\t\t\t\t"data-turn-process-inline": effectiveHidden || void 0,',
      '\t\t\t\tchildren',
      '\t\t\t});',
      '\t\t}',
    ].join('\n'),
  )
  out = swap(out, 'client/live-reasoning-visible', 'hidden: reasoningHidden,', 'hidden: shouldHideReasoning(reasoningHidden, streaming, thinkAutoExpand, data.blocks, index),')
  out = swap(
    out,
    'client/reasoning-fold-delay-props',
    'hidden: shouldHideReasoning(reasoningHidden, streaming, thinkAutoExpand, data.blocks, index),',
    [
      'hidden: shouldHideReasoning(reasoningHidden, streaming, thinkAutoExpand, data.blocks, index),',
      '\t\t\t\t\t\t\tlive: streaming && thinkAutoExpand && isReasoningLive(data.blocks, index),',
      '\t\t\t\t\t\t\tkeepVisibleAfterLive: shouldKeepReasoningDuringHandoff(thinkAutoCollapse, node.location?.turn?.status),',
      '\t\t\t\t\t\t\tcollapseDelayMs: reduced ? 0 : 240,',
    ].join('\n'),
  )
  out = swap(
    out,
    'client/reasoning-speed-tail',
    'const reasoningTailIndex = streaming && data.blocks[data.blocks.length - 1]?.kind === "reasoning" ? data.blocks.length - 1 : -1;',
    'const reasoningTailIndex = streaming ? findLiveReasoningIndex(data.blocks) : -1;',
  )
  out = swap(out, 'client/reasoning-speed-ref', 'reasoningOwnsSpeed && index === last ? rootSpeedRef', 'reasoningOwnsSpeed && index === reasoningTailIndex ? rootSpeedRef')
  out = swap(out, 'client/reasoning-reveal-ref', 'reasoningOwnsSpeed && index === last ? rootRevealScaleRef', 'reasoningOwnsSpeed && index === reasoningTailIndex ? rootRevealScaleRef')

  // 修复 2：展开/收起完全由本插件决定（含「用户手动切换后不再被自动逻辑覆盖」）
  out = swap(
    out,
    'client/reasoning-props',
    'function AnimatedReasoning({ text, running, preset, thinkAutoExpand, motionReduced,',
    'function AnimatedReasoning({ text, running, preset, thinkAutoExpand, thinkAutoCollapse, thinkCapLines, motionReduced,',
  )
  out = swap(
    out,
    'client/reasoning-state',
    [
      '\t\t\tconst [autoClosed, setAutoClosed] = (0, react.useState)(false);',
      '\t\t\tconst summaryRef = (0, react.useRef)(null);',
    ].join('\n'),
    [
      '\t\t\t/* 读者一旦亲手开合过这一行，自动逻辑就永久放手（think-ux 的语义）。 */',
      '\t\t\tconst userToggledRef = (0, react.useRef)(false);',
      '\t\t\tconst wasRunningRef = (0, react.useRef)(running);',
      '\t\t\tconst previousAutoCollapseRef = (0, react.useRef)(thinkAutoCollapse);',
      '\t\t\tconst expandedRef = (0, react.useRef)(expanded);',
      '\t\t\texpandedRef.current = expanded;',
      '\t\t\tconst followThinkBodyRef = (0, react.useRef)(true);',
      '\t\t\tconst lastRunningForScrollRef = (0, react.useRef)(running);',
      '\t\t\tconst summaryRef = (0, react.useRef)(null);',
    ].join('\n'),
  )
  out = swap(
    out,
    'client/reasoning-layout-effect',
    [
      '\t\t\t(0, react.useLayoutEffect)(() => {',
      '\t\t\t\tif (thinkAutoExpand) {',
      '\t\t\t\t\tsetExpanded(running);',
      '\t\t\t\t\tsetAutoClosed(!running);',
      '\t\t\t\t}',
      '\t\t\t\tnotifyFollowCommit(commitAnchorRef.current);',
      '\t\t\t}, [running, thinkAutoExpand]);',
    ].join('\n'),
    [
      '\t\t\t(0, react.useLayoutEffect)(() => {',
      '\t\t\t\tconst wasRunning = wasRunningRef.current;',
      '\t\t\t\twasRunningRef.current = running;',
      '\t\t\t\tconst autoCollapseJustEnabled = !previousAutoCollapseRef.current && thinkAutoCollapse;',
      '\t\t\t\tpreviousAutoCollapseRef.current = thinkAutoCollapse;',
      '\t\t\t\tif (!userToggledRef.current) {',
      '\t\t\t\t\tif (running) {',
      '\t\t\t\t\t\t/* 进入思考：按设置自动展开。 */',
      '\t\t\t\t\t\tsetExpanded(thinkAutoExpand);',
      '\t\t\t\t\t} else if ((wasRunning || autoCollapseJustEnabled) && thinkAutoCollapse && expandedRef.current) {',
      '\t\t\t\t\t\t/* reasoning → 结算：只有确实展开着才收回。 */',
      '\t\t\t\t\t\tsetExpanded(false);',
      '\t\t\t\t\t}',
      '\t\t\t\t}',
      '\t\t\t\tnotifyFollowCommit(commitAnchorRef.current);',
      '\t\t\t}, [running, thinkAutoExpand, thinkAutoCollapse]);',
    ].join('\n'),
  )
  out = swap(
    out,
    'client/reasoning-toggle',
    [
      '\t\t\t\t\t\tonToggle: () => {',
      '\t\t\t\t\t\t\tsetAutoClosed(false);',
      '\t\t\t\t\t\t\tsetExpanded((value) => !value);',
      '\t\t\t\t\t\t},',
    ].join('\n'),
    [
      '\t\t\t\t\t\tonToggle: () => {',
      '\t\t\t\t\t\t\tuserToggledRef.current = true;',
      '\t\t\t\t\t\t\tsetExpanded((value) => !value);',
      '\t\t\t\t\t\t},',
    ].join('\n'),
  )
  out = swap(out, 'client/animate-auto-collapse', 'bodyTransition: !autoClosed,', 'bodyTransition: !reduced,')

  // 修复 3：限高预览 + 流式时跟随到框底
  out = swap(
    out,
    'client/reasoning-cap-attr',
    [
      '\t\t\t\t\t\tchildren: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {',
      '\t\t\t\t\t\t\tref: fadeRootRef,',
      '\t\t\t\t\t\t\tclassName: TypewriterAssistantNodeView_module_css_default.thinkBody,',
      '\t\t\t\t\t\t\tchildren: shown',
      '\t\t\t\t\t\t})',
    ].join('\n'),
    [
      '\t\t\t\t\t\tchildren: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {',
      '\t\t\t\t\t\t\tref: fadeRootRef,',
      '\t\t\t\t\t\t\tclassName: TypewriterAssistantNodeView_module_css_default.thinkBody,',
      '\t\t\t\t\t\t\t"data-think-cap": thinkCapLines > 0 ? "" : void 0,',
      '\t\t\t\t\t\t\tchildren: shown',
      '\t\t\t\t\t\t})',
    ].join('\n'),
  )
  out = swap(
    out,
    'client/reasoning-cap-follow',
    [
      '\t\t\t(0, react.useEffect)(() => {',
      '\t\t\t\tconst element = summaryRef.current;',
      '\t\t\t\tif (element === null) return;',
      '\t\t\t\telement.scrollLeft = running ? element.scrollWidth - element.clientWidth : 0;',
      '\t\t\t}, [running, summary]);',
    ].join('\n'),
    [
      '\t\t\t(0, react.useEffect)(() => {',
      '\t\t\t\tconst element = summaryRef.current;',
      '\t\t\t\tif (element === null) return;',
      '\t\t\t\telement.scrollLeft = running ? element.scrollWidth - element.clientWidth : 0;',
      '\t\t\t}, [running, summary]);',
      '\t\t\t/* 按实际行高计算预览高度：字体缩放时 12 行仍然是完整的 12 行。 */',
      '\t\t\t(0, react.useLayoutEffect)(() => {',
      '\t\t\t\tconst element = fadeRootRef.current;',
      '\t\t\t\tif (element === null) return;',
      '\t\t\t\tconst resize = () => {',
      '\t\t\t\t\tconst lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight) || 24;',
      '\t\t\t\t\tconst height = thinkCapLines > 0 ? Math.ceil(lineHeight * thinkCapLines + 16) + "px" : "";',
      '\t\t\t\t\tif (element.style.maxHeight !== height) element.style.maxHeight = height;',
      '\t\t\t\t};',
      '\t\t\t\tresize();',
      '\t\t\t\tconst observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);',
      '\t\t\t\tobserver?.observe(element);',
      '\t\t\t\treturn () => observer?.disconnect();',
      '\t\t\t}, [thinkCapLines]);',
      '\t\t\t/* 限高预览：只在读者仍贴底时跟随；最终一块文本也要滚到真实底部。 */',
      '\t\t\t(0, react.useLayoutEffect)(() => {',
      '\t\t\t\tconst element = fadeRootRef.current;',
      '\t\t\t\tconst justFinished = lastRunningForScrollRef.current && !running;',
      '\t\t\t\tlastRunningForScrollRef.current = running;',
      '\t\t\t\tif (element !== null && thinkCapLines > 0 && followThinkBodyRef.current && (running || justFinished)) element.scrollTop = element.scrollHeight - element.clientHeight;',
      '\t\t\t}, [running, shown, thinkCapLines, expanded]);',
      '\t\t\t(0, react.useEffect)(() => {',
      '\t\t\t\tconst element = fadeRootRef.current;',
      '\t\t\t\tif (element === null) return;',
      '\t\t\t\tlet previousTop = element.scrollTop;',
      '\t\t\t\tconst track = () => {',
      '\t\t\t\t\tconst gap = element.scrollHeight - element.scrollTop - element.clientHeight;',
      '\t\t\t\t\tif (element.scrollTop < previousTop - 0.5) followThinkBodyRef.current = false;',
      '\t\t\t\t\telse if (element.scrollTop > previousTop + 0.5 && gap <= 2) followThinkBodyRef.current = true;',
      '\t\t\t\t\tpreviousTop = element.scrollTop;',
      '\t\t\t\t};',
      '\t\t\t\tconst stop = (event) => {',
      '\t\t\t\t\tif (element.scrollHeight <= element.clientHeight + 1) return;',
      '\t\t\t\t\tif (event.deltaY < 0) followThinkBodyRef.current = false;',
      '\t\t\t\t\tconst atTop = element.scrollTop <= 1 && event.deltaY < 0;',
      '\t\t\t\t\tconst atBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= 1 && event.deltaY > 0;',
      '\t\t\t\t\tif (!atTop && !atBottom) event.stopPropagation();',
      '\t\t\t\t};',
      '\t\t\t\tconst observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {',
      '\t\t\t\t\tif (running && followThinkBodyRef.current) element.scrollTop = element.scrollHeight - element.clientHeight;',
      '\t\t\t\t});',
      '\t\t\t\tobserver?.observe(element);',
      '\t\t\t\telement.addEventListener("scroll", track, { passive: true });',
      '\t\t\t\telement.addEventListener("wheel", stop, { passive: true });',
      '\t\t\t\treturn () => { observer?.disconnect(); element.removeEventListener("scroll", track); element.removeEventListener("wheel", stop); };',
      '\t\t\t}, [thinkCapLines, running]);',
    ].join('\n'),
  )

  // Think 摘要切到有信息量的新句时在固定高度内交叠翻页；结算沿用同一选择规则。
  out = swap(out, 'client/rolling-summary-insert', '\t\tfunction AnimatedReasoning({', ROLLING_THINK_SUMMARY + '\t\tfunction AnimatedReasoning({')
  out = swap(
    out,
    'client/rolling-summary-source',
    '\t\t\tconst summary = running ? latestLine(shown) : firstLine(text);',
    '\t\t\tconst thoughtSummary = selectThoughtSummary(shown);\n\t\t\tconst summary = thoughtSummary.text;\n\t\t\tconst summaryLine = thoughtSummary.line;',
  )
  out = swap(
    out,
    'client/rolling-summary-render',
    [
      '\t\t\t\t\t\t}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {',
      '\t\t\t\t\t\t\tref: summaryRef,',
      '\t\t\t\t\t\t\tclassName: TypewriterAssistantNodeView_module_css_default.thinkSummary,',
      '\t\t\t\t\t\t\t"data-follow-end": running || void 0,',
      '\t\t\t\t\t\t\tchildren: summary',
      '\t\t\t\t\t\t})] }),',
    ].join('\n'),
    [
      '\t\t\t\t\t\t}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RollingThinkSummary, {',
      '\t\t\t\t\t\t\ttext: summary,',
      '\t\t\t\t\t\t\tline: summaryLine,',
      '\t\t\t\t\t\t\tfollowEnd: running && thoughtSummary.followEnd,',
      '\t\t\t\t\t\t\treduced',
      '\t\t\t\t\t\t})] }),',
    ].join('\n'),
  )
  out = swap(
    out,
    'client/rolling-summary-hide-empty',
    '\t\t\t\t\t\tcollapsedContent: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [',
    '\t\t\t\t\t\tcollapsedContent: summary === "" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [',
  )
  out = swap(out, 'client/rolling-summary-ref', '\t\t\tconst summaryRef = (0, react.useRef)(null);\n', '')
  out = swap(
    out,
    'client/rolling-summary-scroll',
    [
      '\t\t\t(0, react.useEffect)(() => {',
      '\t\t\t\tconst element = summaryRef.current;',
      '\t\t\t\tif (element === null) return;',
      '\t\t\t\telement.scrollLeft = running ? element.scrollWidth - element.clientWidth : 0;',
      '\t\t\t}, [running, summary]);',
      '',
    ].join('\n'),
    '',
  )

  // 组件签名与调用点补上新 props
  out = swap(
    out,
    'client/nodeview-defaults',
    'thinkAutoExpand = DEFAULT_STREAM_SETTINGS.thinkAutoExpand, logarithmicFade = DEFAULT_STREAM_SETTINGS.logarithmicFade,',
    'thinkAutoExpand = DEFAULT_STREAM_SETTINGS.thinkAutoExpand, thinkAutoCollapse = true, thinkCapLines = 24, logarithmicFade = DEFAULT_STREAM_SETTINGS.logarithmicFade,',
  )
  out = swap(
    out,
    'client/reasoning-call-props',
    [
      '\t\t\t\t\t\t\t\trunning: streaming && isReasoningLive(data.blocks, index),',
      '\t\t\t\t\t\t\t\tpreset,',
      '\t\t\t\t\t\t\t\tthinkAutoExpand,',
    ].join('\n'),
    [
      '\t\t\t\t\t\t\t\trunning: streaming && isReasoningLive(data.blocks, index),',
      '\t\t\t\t\t\t\t\tpreset,',
      '\t\t\t\t\t\t\t\tthinkAutoExpand,',
      '\t\t\t\t\t\t\t\tthinkAutoCollapse,',
      '\t\t\t\t\t\t\t\tthinkCapLines,',
    ].join('\n'),
  )

  // 修复 4：接管不再等设置服务就绪
  out = swap(
    out,
    'client/takeover-not-pending',
    [
      '\t\t\t/** False while an available settings service is resolving its authority. */',
      '\t\t\ttakeoverEnabled() {',
      '\t\t\t\treturn !this.pending && this.value.enabled;',
      '\t\t\t}',
    ].join('\n'),
    [
      '\t\t\t/**',
      '\t\t\t* dsh-stream-think: 接管不再等设置服务就绪。上游是 `!this.pending && value.enabled`',
      '\t\t\t* —— 设置 RPC 一旦慢或失败（Host 半边没挂上、连接未就绪），pending 长期为真，',
      '\t\t\t* `assistant-step` 就永远不会被接管：界面静默退回官方渲染器，思考行不自动展开，',
      '\t\t\t* 而插件表面一切正常（模块已加载、设置页能开）。改为只看 enabled（默认 true），',
      '\t\t\t* 设置未就绪时先用默认值接管。',
      '\t\t\t*/',
      '\t\t\ttakeoverEnabled() {',
      '\t\t\t\treturn this.value.enabled;',
      '\t\t\t}',
    ].join('\n'),
  )

  // 借鉴 ZCode 的 epsilonPx：贴底判定 25px → 48px（内容一涨就"撒手"会让跟随反复启停）
  out = swap(
    out,
    'client/epsilon-48',
    'reportedLag <= (readerReleased ? 1 : 25)',
    'reportedLag <= (readerReleased ? 1 : 48)',
  )

  // DSH 0.2 的运行状态是 [data-chat-running]，并非旧版的 [role=status] 行。
  // 漏认会让 runway 挂到上一条消息上，交接时又直接撤掉底部预留，出现先下后上的反弹。
  out = swap(
    out,
    'client/dsh-02-running-status',
    'return port.querySelector("[data-chat-turn-status], [data-chat-flow] > [role=\\"status\\"]");',
    'return port.querySelector("[data-chat-turn-status], [data-chat-flow] > [role=\\"status\\"], [data-chat-flow] > [data-chat-running]");',
  )

  // 空对话里输入框会随附件、候选消息和草稿改变高度。旧的 flow-fill 只在首次接管时
  // 探测一次输入框占用空间，之后拿旧的 min-height 继续填充，制造假的 scroll floor。
  // 每当可视高度或输入框高度改变时重新探测；长对话则仍按真实溢出跟随。
  out = swap(
    out,
    'client/flow-fill-live-layout',
    [
      '\t\t\tconst client = Math.max(0, port.clientHeight);',
      '\t\t\tlet overshoot = owned?.overshootPx;',
      '\t\t\tif (overshoot === void 0) {',
    ].join('\n'),
    [
      '\t\t\tconst client = Math.max(0, port.clientHeight);',
      '\t\t\tconst composerHeight = port.querySelector("[data-composer-seat]")?.getBoundingClientRect().height ?? 0;',
      '\t\t\tlet overshoot = owned?.overshootPx;',
      '\t\t\tif (overshoot === void 0 || owned.clientPx !== client || Math.abs(owned.composerHeightPx - composerHeight) > .5 || owned.element !== element) {',
    ].join('\n'),
  )
  out = swap(
    out,
    'client/flow-fill-live-layout-state',
    [
      '\t\t\tfollowFlowFills.set(port, {',
      '\t\t\t\telement,',
      '\t\t\t\toriginal,',
      '\t\t\t\tovershootPx: overshoot',
    ].join('\n'),
    [
      '\t\t\tfollowFlowFills.set(port, {',
      '\t\t\t\telement,',
      '\t\t\t\toriginal,',
      '\t\t\t\tovershootPx: overshoot,',
      '\t\t\t\tclientPx: client,',
      '\t\t\t\tcomposerHeightPx: composerHeight',
    ].join('\n'),
  )

  // 旧会话的完成预留可能绑在已卸载的 flow 上；切会话时只恢复旧节点，不改新会话的底边距。
  out = swap(
    out,
    'client/session-pad-restore',
    [
      '\t\t\tconst flow = flowElementOf(port);',
      '\t\t\tif (flow === null) return;',
      '\t\t\tconst existing = followSettlePads.get(port);',
      '\t\t\tconst original = existing?.original ?? flow.style.paddingBottom;',
    ].join('\n'),
    [
      '\t\t\tconst flow = flowElementOf(port);',
      '\t\t\tconst existing = followSettlePads.get(port);',
      '\t\t\tif (existing !== void 0 && existing.element !== flow) {',
      '\t\t\t\texisting.element.style.paddingBottom = existing.original;',
      '\t\t\t\tfollowSettlePads.delete(port);',
      '\t\t\t}',
      '\t\t\tif (flow === null) return;',
      '\t\t\tconst original = followSettlePads.get(port)?.original ?? flow.style.paddingBottom;',
    ].join('\n'),
  )
  out = swap(out, 'client/session-pad-clear', '\t\t\t\t\tflow.style.paddingBottom = existing.original;', '\t\t\t\t\texisting.element.style.paddingBottom = existing.original;')

  out = swap(out, 'client/session-follow-helper', '\t\tfunction useConversationFollow(rootRef, active,', FOLLOW_SESSION_ISOLATION + '\t\tfunction useConversationFollow(rootRef, active,')
  out = swap(out, 'client/session-follow-owner', '\t\t\t\tlet port = null;\n\t\t\t\tlet resize = null;', '\t\t\t\tlet port = null;\n\t\t\t\tlet boundSession = null;\n\t\t\t\tconst isOriginalSession = (element) => boundSession === null || followSessionOf(element) === boundSession;\n\t\t\t\tlet resize = null;')
  out = swap(out, 'client/session-follow-observer', '\t\t\t\tconst restoreBeforePaint = () => {\n\t\t\t\t\tif (!following || port === null) return;', '\t\t\t\tconst restoreBeforePaint = () => {\n\t\t\t\t\tif (!following || port === null || !isOriginalSession(port)) return;')
  out = swap(
    out,
    'client/follow-observe-composer',
    '\t\t\t\t\t\tresize.observe(port);\n\t\t\t\t\t\tconst proxy = resizeProxyOf(port);',
    '\t\t\t\t\t\tresize.observe(port);\n\t\t\t\t\t\tconst composer = port.querySelector("[data-composer-seat]");\n\t\t\t\t\t\tif (composer !== null) resize.observe(composer);\n\t\t\t\t\t\tconst proxy = resizeProxyOf(port);',
  )
  out = swap(
    out,
    'client/session-follow-adopt',
    '\t\t\t\t\tconst nextPort = root.closest("[data-conversation-scroll]");\n\t\t\t\t\tif (nextPort === null) return;\n\t\t\t\t\tbindPort(nextPort);',
    '\t\t\t\t\tconst nextPort = root.closest("[data-conversation-scroll]");\n\t\t\t\t\tif (nextPort === null) return;\n\t\t\t\t\tconst currentSession = followSessionOf(root);\n\t\t\t\t\tif (currentSession === null) return;\n\t\t\t\t\tif (boundSession === null) boundSession = currentSession;\n\t\t\t\t\telse if (boundSession !== currentSession) return;\n\t\t\t\t\tisolateFollowSession(nextPort, root);\n\t\t\t\t\tif (followSessionActivations.has(nextPort)) return; // 等宿主恢复该会话的阅读位置后再接管。\n\t\t\t\t\tbindPort(nextPort);',
  )
  out = swap(out, 'client/session-follow-cleanup', '\t\t\t\t\tif (host === null) return;\n\t\t\t\t\tholding = null;\n\t\t\t\t\tif (!isLeader(host)) return;', '\t\t\t\t\tif (host === null) return;\n\t\t\t\t\tholding = null;\n\t\t\t\t\tif (!isOriginalSession(host)) {\n\t\t\t\t\t\tisolateFollowSession(host, host);\n\t\t\t\t\t\treleaseRevealScale();\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tif (!isLeader(host)) return;')
  out = swap(out, 'client/session-follow-disabled-cleanup', '\t\t\t\t\t\tif (disabledHost !== null) {\n\t\t\t\t\t\t\tclearVisual(disabledHost);', '\t\t\t\t\t\tif (disabledHost !== null && !isOriginalSession(disabledHost)) isolateFollowSession(disabledHost, disabledHost);\n\t\t\t\t\t\telse if (disabledHost !== null) {\n\t\t\t\t\t\t\tclearVisual(disabledHost);')

  // 旧行结束后等待实际接管或本轮结束；固定 260ms 在工具切换稍慢时仍会清空预留并跳底。
  out = swap(out, 'client/follow-handoff-helper', '\t\tfunction useConversationFollow(rootRef, active,', FOLLOW_HANDOFF + '\t\tfunction useConversationFollow(rootRef, active,')
  out = swap(
    out,
    'client/follow-handoff-grace',
    [
      '\t\t\t\t\tif (!activeRef.current) {',
      '\t\t\t\t\t\tfollowTraceUntilMs = Math.max(followTraceUntilMs, performance.now() + 1e4);',
      '\t\t\t\t\t\tfollowTrace("fast-gate", {',
      '\t\t\t\t\t\t\tsh: host.scrollHeight,',
      '\t\t\t\t\t\t\tst: Math.round(host.scrollTop),',
      '\t\t\t\t\t\t\tpad: Math.round(flowPadOf(host))',
      '\t\t\t\t\t\t});',
      '\t\t\t\t\t\trestoreRunway(host);',
      '\t\t\t\t\t\tsetFlowPad(host, 0);',
      '\t\t\t\t\t\tfinishAtNaturalFloor(host, !startedAsEntrance, true);',
      '\t\t\t\t\t\tfollowLeaders.delete(host);',
      '\t\t\t\t\t\tfollowCompletionSettle.delete(host);',
      '\t\t\t\t\t\treleaseRevealScale();',
      '\t\t\t\t\t\tdebugRuntime.reportFollow(host, null);',
      '\t\t\t\t\t\treturn;',
      '\t\t\t\t\t}',
    ].join('\n'),
    [
      '\t\t\t\t\tif (!activeRef.current) {',
      '\t\t\t\t\t\tconst finishInactive = () => {',
      '\t\t\t\t\t\t\tif (!isLeader(host)) return; // 下一行已接管，沿用同一份 motion state。',
      '\t\t\t\t\t\t\tif (!host.isConnected) { followLeaders.delete(host); releaseRevealScale(); return; }',
      '\t\t\t\t\t\t\tfollowTraceUntilMs = Math.max(followTraceUntilMs, performance.now() + 1e4);',
      '\t\t\t\t\t\t\tfollowTrace("fast-gate", {',
      '\t\t\t\t\t\t\t\tsh: host.scrollHeight,',
      '\t\t\t\t\t\t\t\tst: Math.round(host.scrollTop),',
      '\t\t\t\t\t\t\t\tpad: Math.round(flowPadOf(host))',
      '\t\t\t\t\t\t\t});',
      '\t\t\t\t\t\t\trestoreRunway(host);',
      '\t\t\t\t\t\t\tsetFlowPad(host, 0);',
      '\t\t\t\t\t\t\tfinishAtNaturalFloor(host, !startedAsEntrance, true);',
      '\t\t\t\t\t\t\tfollowLeaders.delete(host);',
      '\t\t\t\t\t\t\tfollowCompletionSettle.delete(host);',
      '\t\t\t\t\t\t\treleaseRevealScale();',
      '\t\t\t\t\t\t\tdebugRuntime.reportFollow(host, null);',
      '\t\t\t\t\t\t};',
      '\t\t\t\t\t\tif (turnStatusOf(host) !== null) waitForFollowHandoff(host, () => isLeader(host), () => controlScrollRef.current, finishInactive);',
      '\t\t\t\t\t\telse finishInactive();',
      '\t\t\t\t\t\treturn;',
      '\t\t\t\t\t}',
    ].join('\n'),
  )


  // 诊断：把过程组的开合也投影到 DOM（验证 A 生效与否用，零视觉影响）
  out = swap(
    out,
    'client/group-diagnostic-attr',
    '\t\t\t\t"data-streaming": streaming || void 0,',
    [
      '\t\t\t\t"data-streaming": streaming || void 0,',
      '\t\t\t\t"data-group-open": turnProcess !== void 0 && turnProcess.open ? "1" : "0",',
      '\t\t\t\t"data-group-foldable": turnProcess !== void 0 && turnProcess.foldable ? "1" : "0",',
    ].join('\n'),
  )

  // 诊断：把展开决策投影到 aria-label（可访问性树可读，便于无 DevTools 排障）
  out = swap(
    out,
    'client/diagnostic-aria-label',
    [
      '\t\t\t\t\tclassName: TypewriterAssistantNodeView_module_css_default.think,',
      '\t\t\t\t\t"data-variant": "think",',
      '\t\t\t\t\t"data-state": running ? "running" : "ok",',
    ].join('\n'),
    [
      '\t\t\t\t\tclassName: TypewriterAssistantNodeView_module_css_default.think,',
      '\t\t\t\t\t"data-variant": "think",',
      '\t\t\t\t\t"data-state": running ? "running" : "ok",',
      '\t\t\t\t\t"aria-label": "think live=" + (running ? "1" : "0") + " auto=" + (thinkAutoExpand ? "1" : "0") + " open=" + (expanded ? "1" : "0") + " cap=" + thinkCapLines,',
    ].join('\n'),
  )

  // 设置来源：本插件的本地设置说了算（上游开关不再参与与运算）
  out = swap(
    out,
    'client/configured-subscribe',
    [
      '\t\t\tconst configured = function StreamConfiguredView(props) {',
      '\t\t\t\tconst preferences = (0, react.useSyncExternalStore)(settings.subscribe, settings.getSnapshot, settings.getSnapshot);',
    ].join('\n'),
    [
      '\t\t\tconst configured = function StreamConfiguredView(props) {',
      '\t\t\t\tconst preferences = (0, react.useSyncExternalStore)(settings.subscribe, settings.getSnapshot, settings.getSnapshot);',
      '\t\t\t\tconst thinkPrefs = (0, react.useSyncExternalStore)(subscribeThinkSettings, getThinkSettings, getThinkSettings);',
    ].join('\n'),
  )
  // 流式跟随（滚动动画的所有权）也收进本插件的设置里
  out = swap(
    out,
    'client/control-scroll-source',
    '\t\t\t\t\tcontrolScroll: preferences.controlScroll,',
    '\t\t\t\t\tcontrolScroll: thinkPrefs.controlScroll,',
  )

  out = swap(
    out,
    'client/configured-props',
    '\t\t\t\t\tthinkAutoExpand: preferences.thinkAutoExpand,',
    [
      '\t\t\t\t\tthinkAutoExpand: thinkPrefs.autoExpand,',
      '\t\t\t\t\tthinkAutoCollapse: thinkPrefs.autoCollapse,',
      '\t\t\t\t\tthinkCapLines: thinkPrefs.capLines,',
    ].join('\n'),
  )

  // 设置面板注册 + 把行数投影到 CSS 变量
  out = swap(
    out,
    'client/apply-settings-panel',
    [
      '\t\tfunction apply(ctx) {',
      '\t\t\tconst config = readBootConfig();',
    ].join('\n'),
    [
      '\t\tfunction apply(ctx) {',
      '\t\t\tconst config = readBootConfig();',
      '\t\t\tapplyThinkSettings();',
      '\t\t\tensureThinkPanelStyle();',
      '\t\t\tensureTurnProcessClockStyle();',
      '\t\t\tif (ctx !== null && ctx !== void 0 && ctx.slots && typeof ctx.slots.inject === "function") {',
      '\t\t\t\tctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({',
      '\t\t\t\t\tname: "settings.plugins.tab",',
      `\t\t\t\t\tid: "${NEW_ID}",`,
      '\t\t\t\t\torder: 20,',
      '\t\t\t\t\tlabel: () => "思考盒"',
      '\t\t\t\t}, ThinkSettingsPanel));',
      '\t\t\t}',
    ].join('\n'),
  )

  // 设置块本身的注入点（在 apply 之前，保证 apply 里能引用到）
  out = swap(out, 'client/settings-block-insert', '\t\tfunction apply(ctx) {', THINK_SETTINGS_BLOCK + '\t\tfunction apply(ctx) {')
  out = swap(
    out,
    'client/all-rows-share-scroll-setting',
    'const useControlScroll = () => (0, react.useSyncExternalStore)(settings.subscribe, () => settings.getSnapshot().controlScroll, () => settings.getSnapshot().controlScroll);',
    'const useControlScroll = () => (0, react.useSyncExternalStore)(subscribeThinkSettings, () => getThinkSettings().controlScroll, () => getThinkSettings().controlScroll);',
  )
  out = removeUpstreamCardField(out, 'controlScroll')
  out = removeUpstreamCardField(out, 'thinkAutoExpand')

  // 限高 CSS：追加到 TypewriterAssistantNodeView 的模块样式表
  out = swap(
    out,
    'client/cap-css',
    '\t\tconst css$4 = "',
    '\t\tconst css$4 = "' + THINK_CAP_CSS,
  )

  return out
}

/* ────────────────────────────────────────────────────────────────────────────
 * 三、Host 半边补丁表
 * ──────────────────────────────────────────────────────────────────────────── */

/** 可在解析不到 schemastery 时兜底的链式 Proxy（每次调用返回自身）。 */
const SCHEMA_FALLBACK = [
  '/**',
  ' * schemastery 是宿主 profile 提供的 peer 依赖：link 安装时本包目录不在那条',
  ' * 解析链上（node 从本文件向上找 node_modules），静态 import 一旦失败会让整个',
  ' * Host 半边加载失败、拖累插件树。改成可选动态导入 + 链式 Proxy 兜底：解析不到',
  ' * 时 Config 退化为「无约束」，boot config 桥与设置 RPC 照常工作。',
  ' */',
  'const Schema = await (async () => {',
  '\ttry {',
  '\t\treturn (await import("@deepseek-ai/schemastery")).default;',
  '\t} catch (error) {',
  '\t\tconsole.warn("[dsh-stream-think] 解析不到 @deepseek-ai/schemastery，Config 校验降级；如设置卡片不可用，给本插件建 node_modules/@deepseek-ai/schemastery 链接");',
  '\t\tconst fallback = new Proxy(function () {}, {',
  '\t\t\tget: () => () => fallback,',
  '\t\t\tapply: () => fallback',
  '\t\t});',
  '\t\treturn fallback;',
  '\t}',
  '})();',
].join('\n')

function patchHost(source) {
  let out = source
  out = swap(
    out,
    'host/schema-optional',
    'import Schema from "@deepseek-ai/schemastery";',
    SCHEMA_FALLBACK,
  )
  out = swap(out, 'host/name', 'const name = "dsh-smooth-stream";', `const name = "${NEW_ID}";`)
  out = swap(out, 'host/rpc-channel', 'const STREAM_SETTINGS_RPC_CHANNEL = "/smooth-stream";', 'const STREAM_SETTINGS_RPC_CHANNEL = "/stream-think";')
  out = swap(out, 'host/boot-global', '"__DSH_SMOOTH_STREAM_CONFIG__"', '"__DSH_STREAM_THINK_CONFIG__"', 'all')
  out = swap(out, 'host/log-prefix', '[dsh-smooth-stream]', `[${NEW_ID}]`, 'all')
  out = swap(out, 'host/error-prefix', 'dsh-smooth-stream: ', `${NEW_ID}: `, 'all')
  out = swap(out, 'host/high-speed-default', 'maxRevealCps: 600,', 'maxRevealCps: 1800,')
  out = swap(out, 'host/high-speed-schema', 'maxRevealCps: Schema.number().min(120).max(1e3)', 'maxRevealCps: Schema.number().min(120).max(2400)')
  out = swap(out, 'host/high-speed-validation', 'tuning.maxRevealCps <= 1e3', 'tuning.maxRevealCps <= 2400')
  return out
}

/* ────────────────────────────────────────────────────────────────────────────
 * 四、执行
 * ──────────────────────────────────────────────────────────────────────────── */

const clientSource = readFileSync(join(SOURCE, 'lib', 'client.js'), 'utf8')
const hostSource = readFileSync(join(SOURCE, 'lib', 'index.js'), 'utf8')
const clientOut = patchClient(clientSource)
const hostOut = patchHost(hostSource)

if (failures.length > 0) {
  console.error(`[derive] ❌ ${failures.length} 处补丁未能命中（上游 bundle 可能已改版）：`)
  for (const line of failures) console.error('   · ' + line)
  console.error(`\n[derive] 源: ${SOURCE}`)
  process.exit(1)
}

console.log(`[derive] 源: ${SOURCE}`)
for (const line of applied) console.log('   ✓ ' + line)

if (checkOnly) {
  console.log('[derive] --check：补丁全部命中，未写盘')
  process.exit(0)
}

writeFileSync(join(OUT_LIB, 'client.js'), clientOut)
writeFileSync(join(OUT_LIB, 'index.js'), hostOut)
console.log(`[derive] ✅ 已写出 lib/client.js (${clientOut.length} B) 与 lib/index.js (${hostOut.length} B)`)
