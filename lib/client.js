window.__ModuleLoader__.load({
	id: "dsh-stream-think",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let _deepseek_ai_dsh_client_ui_attachment = require("@deepseek-ai/dsh-client-ui-attachment");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		//#region \0dsh-css:/Users/dzlin/work/project/dsh-smooth-stream/src/client/TypewriterAssistantNodeView.module.css.mjs
		const css$4 = ".I17U7q_root{min-width:0;color:var(--dsw-alias-label-primary);flex-direction:column;font-size:var(--dsh-content-font-size,14px);line-height:calc(24px + var(--dsh-content-font-delta,0px));display:flex}.I17U7q_body{flex-direction:column;gap:16px;min-width:0;display:flex}.I17U7q_think{flex-direction:column;display:flex}.I17U7q_thinkRow{position:relative;overflow:hidden}.I17U7q_thinkLeading{flex-shrink:0}.I17U7q_thinkChevron{color:var(--dsw-alias-label-secondary)}.I17U7q_thinkTitle{font-weight:400}.I17U7q_thinkBody{color:var(--dsw-alias-label-tertiary);white-space:pre-wrap;word-break:break-word;padding:4px 0 4px calc(22px + var(--dsh-content-font-delta,0px));min-width:0}.I17U7q_disclosureRoot{flex-direction:column;width:100%;min-width:0;display:flex}.I17U7q_disclosureRow{cursor:pointer;align-items:center;min-width:0;height:calc(24px + var(--dsh-content-font-delta,0px));color:var(--dsw-alias-label-tertiary);transition:color .1s ease;display:flex;position:relative;overflow:hidden}.I17U7q_disclosureRow:hover{color:var(--dsw-alias-label-secondary)}.I17U7q_disclosureLeading{width:calc(16px + var(--dsh-content-font-delta,0px));height:calc(16px + var(--dsh-content-font-delta,0px));color:inherit;flex:none;justify-content:center;align-items:center;margin-right:6px;display:inline-flex;position:relative}.I17U7q_disclosureLeading svg:not([data-state]){width:calc(14px + var(--dsh-content-font-delta,0px));height:calc(14px + var(--dsh-content-font-delta,0px))}.I17U7q_disclosureIconIdle{opacity:1;transition:opacity .1s;display:inline-flex}.I17U7q_disclosureChevronHover{opacity:0;margin:auto;transition:opacity .1s;position:absolute;inset:0}.I17U7q_disclosureRow:hover .I17U7q_disclosureIconIdle{opacity:0}.I17U7q_disclosureRow:hover .I17U7q_disclosureChevronHover{opacity:1}.I17U7q_disclosureTitle{color:inherit;flex:none;font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(24px + var(--dsh-content-font-delta,0px))}.I17U7q_disclosureContent{visibility:visible;transition:grid-template-rows var(--ds-transition-duration,.2s) var(--ds-ease-in-out,cubic-bezier(.4, 0, .2, 1)), visibility 0s;grid-template-rows:1fr;display:grid}.I17U7q_disclosureContent[data-collapsed]{visibility:hidden;transition:grid-template-rows var(--ds-transition-duration,.2s) var(--ds-ease-in-out,cubic-bezier(.4, 0, .2, 1)), visibility 0s var(--ds-transition-duration,.2s);grid-template-rows:0fr}.I17U7q_disclosureContent[data-no-transition]{transition:none}.I17U7q_disclosureContent>*{min-height:0;overflow:hidden}@media (prefers-reduced-motion:reduce){.I17U7q_think[data-state=running] .I17U7q_thinkRow:after{animation:none}.I17U7q_disclosureContent,.I17U7q_disclosureContent[data-collapsed]{transition:none}}.I17U7q_stopped{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-tertiary);border-radius:var(--dsw-radius-sm);align-self:flex-start;padding:0 6px;font-size:11px;line-height:18px}.I17U7q_visuallyHidden{clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.I17U7q_follow{contain:layout style;min-width:0}.I17U7q_root :not(pre)>code{line-height:inherit;white-space:normal;overflow-wrap:anywhere;vertical-align:baseline;display:inline}@supports (text-box-trim:trim-both){.I17U7q_root :is(p,h1,h2,h3,h4,h5,h6,blockquote){text-box-trim:trim-both;text-box-edge:text}}";
		const tagId$4 = "dsh-stream-think/TypewriterAssistantNodeView.module.css";
		if (typeof document !== "undefined") {
			let tag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]");
			if (tag === null) {
				tag = document.createElement("style");
				tag.dataset.plugin = "dsh-stream-think";
				tag.dataset.pluginCss = tagId$4;
				document.head.appendChild(tag);
			}
			tag.textContent = css$4;
		}
		var TypewriterAssistantNodeView_module_css_default = {
			"thinkTitle": "I17U7q_thinkTitle",
			"disclosureContent": "I17U7q_disclosureContent",
			"disclosureLeading": "I17U7q_disclosureLeading",
			"thinkRow": "I17U7q_thinkRow",
			"visuallyHidden": "I17U7q_visuallyHidden",
			"disclosureRoot": "I17U7q_disclosureRoot",
			"body": "I17U7q_body",
			"disclosureIconIdle": "I17U7q_disclosureIconIdle",
			"root": "I17U7q_root",
			"disclosureChevronHover": "I17U7q_disclosureChevronHover",
			"stopped": "I17U7q_stopped",
			"think": "I17U7q_think",
			"thinkChevron": "I17U7q_thinkChevron",
			"thinkBody": "I17U7q_thinkBody",
			"follow": "I17U7q_follow",
			"thinkLeading": "I17U7q_thinkLeading",
			"disclosureRow": "I17U7q_disclosureRow",
			"disclosureTitle": "I17U7q_disclosureTitle"
		};
		//#endregion
		//#region src/settings.ts
		/**
		* User-owned settings for the smooth-stream plugin, exposed to the Host
		* settings service and edited from the Web Settings "plugin configuration"
		* page. This is the runtime-editable complement to {@link StreamConfig}: that
		* contract is composed at load and bridged once through the boot global, while
		* these preferences live in the durable user-settings document and take effect
		* live.
		*/
		/** Settings namespace registered by the Host and served through the plugin RPC. */
		const STREAM_SETTINGS_NS = "smooth-stream";
		/** Defaults preserve the production engine exactly. */
		const DEFAULT_STREAM_DEBUG_TUNING = {
			revealScale: 1,
			queuePressure: .85,
			maxRevealCps: 1800,
			springStiffness: 130,
			springDamping: 24,
			springMass: 1,
			runwayPx: 72,
			reserveResponseMs: 180,
			backpressureMinScale: .55
		};
		/** Defaults shared by the Host schema and the client-side fallback. */
		const DEFAULT_STREAM_SETTINGS = {
			enabled: true,
			controlScroll: true,
			motionPreference: "auto",
			thinkAutoExpand: true,
			logarithmicFade: true,
			debugEnabled: false,
			debugTuning: DEFAULT_STREAM_DEBUG_TUNING
		};
		//#endregion
		//#region src/config.ts
		/** Defaults shared by the Host schema and the client-side fallback. */
		const DEFAULT_STREAM_CONFIG = {
			mode: "typewriter",
			preset: "balanced",
			revealCharsPerSec: 80,
			scrollSpeedPxPerSec: 48,
			maxScrollSpeedPxPerSec: 1e3
		};
		/**
		* Window global the Host writes into the served index HTML. The browser boot
		* graph carries no per-entry config, so this inline script is the only
		* Host-to-client configuration channel for a composed web plugin.
		*/
		const STREAM_BOOT_GLOBAL = "__DSH_STREAM_THINK_CONFIG__";
		//#endregion
		//#region src/client/index.ts
		/**
		* Cordis services required by the browser half. Only `slots` is load-bearing
		* for the stream itself; locale and Connection power the configuration card
		* and are wired through `ctx.inject` below so a deployment without them still
		* streams with defaults.
		*/
		const inject = ["slots"];
		const STREAM_MODES = ["typewriter", "teleprompter"];
		const STREAM_PRESETS = [
			"realtime",
			"balanced",
			"silky"
		];
		/**
		* The assistant renderer owns its own character queue and conversation
		* follower, so wrapping it again would create two scroll owners. Human input
		* stays immediate; every Agent-owned output renderer goes through the same
		* generic follow boundary. This is deliberately keyed by the owner that
		* provides the renderer, not by individual tool names, so new Context,
		* Command, and Tool rows are covered automatically.
		*/
		const SKIP_WRAP = /* @__PURE__ */ new Set([
			"assistant-step",
			"user",
			"steering",
			"command-input"
		]);
		/** React function/class or an exotic component such as memo/forwardRef/lazy. */
		function isWrappableComponent(value) {
			return typeof value === "function" || value !== null && typeof value === "object" && "$$typeof" in value;
		}
		/* boot 配置桥已随打字机渲染器移除：客户端不再读 __DSH_STREAM_THINK_CONFIG__。 */
		/**
		* Wrap every Agent-owned keyed Chat row except the assistant renderer in
		* place. A second
		* register with the same `children` table throws because the child slot is
		* already declared, and only the winning entry receives `renderSlot`;
		* swapping `entry.component` keeps the original children, locale, and inject
		* seats. `assistant-step` is replaced below so text and Think use the
		* typewriter reveal. The wrapper owns only the shared layout-growth/follow
		* lifecycle; the Harness keeps each renderer's controls, disclosures, and
		* cards intact.
		* @param ctx - Browser context carrying the slot registry.
		* @returns Restorer that puts the original components back.
		*/

		//#region dsh-stream-think: turn-process elapsed clock
		const TURN_PROCESS_CLOCK_STYLE_ID = "dsh-stream-think-turn-process-clock";
		const TURN_PROCESS_CLOCK_CSS = [
			".dsh-stream-think-clock{position:relative;min-width:0}",
			"[data-chat-flow-kind=turn-process]:has(.dsh-stream-think-clock[data-live-empty]){height:0!important;margin:0!important;overflow:hidden}",
			/* clock 接管已撤销：文字透明化 / clock-overlay / 两条 hover 规则删除；保留下面一条只服务摘要的布局规则 */
			/* 原生计时行接管已撤销：live-content / live-native / live-overlay 三条 CSS 一并删除 */
			/* clock 数字逐位过渡已撤销 */
			".dsh-stream-think-highlights{display:flex;flex-direction:column;gap:2px;padding:8px 0 0;min-width:0;color:var(--dsw-alias-label-secondary);font-size:var(--dsh-content-font-size-secondary,13px);line-height:20px}",
			".dsh-stream-think-clock:has(button[data-turn-process]) > .dsh-stream-think-highlights{padding-top:4px}",
			"[data-chat-flow-kind=turn-process]:has(.dsh-stream-think-highlights) + [data-step-process]:not([hidden]){margin-top:4px!important}",
			"[data-chat-flow-kind=turn-process]:has(.dsh-stream-think-highlights) + [data-step-process] + [data-chat-running]{--dsh-chat-flow-gap:4px}",
			".dsh-stream-think-highlight-group{min-width:0}",
			".dsh-stream-think-btw{min-width:0;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px}",
			".dsh-stream-think-btw-question{color:var(--dsw-alias-label-secondary);font-size:var(--dsh-content-font-size-secondary,13px);line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}",
			".dsh-stream-think-btw-answer{margin-top:6px;color:var(--dsw-alias-label-primary);font-size:var(--dsh-content-font-size-primary,14px);line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}",
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
			".dsh-stream-think-highlight-item[data-type=file],.dsh-stream-think-highlight-item[data-type=read]{text-decoration:underline dotted;text-underline-offset:3px}",
			".dsh-stream-think-highlights button:hover{color:var(--dsw-alias-label-primary)}",
			".dsh-stream-think-highlights button:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-brand-primary));outline-offset:2px;border-radius:2px}",
			"@media (prefers-reduced-motion:reduce){.dsh-stream-think-highlight-body,.dsh-stream-think-highlight-list,.dsh-stream-think-highlight-chevron{transition:none}}",
			// 用户要求「不改变任何官方外观」：这条把正文块间距从官方 16px 压到 8px，删除。
			/* 原生过程标题接管已撤销：process-title / process-native / process-viewport 三条 CSS 删除 */
			".dsh-stream-think-process-label{display:block;position:relative;height:1lh;font:inherit;line-height:1lh;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit}",
			".dsh-stream-think-process-label[data-old]{position:absolute;inset:0 0 auto;z-index:1}",
			/* clock 数字与过程标题翻页的 keyframes 已撤销 */
			/* clock 数字动画的 reduced-motion 兜底已随动画一并撤销 */
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
		/* clockLabelParts / canAnimateClockChange 已随计时行接管撤销删除。 */
		/* presentProcessTitle 已随过程标题接管撤销删除。 */
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
		function readTargetFields(args) {
			/* 与官方 ToolRow 同口径：只认 path/file_path 字符串（官方 FILE_PATH_KEYS），首行截断；offset 正整数即打开行号（官方 readCallLine）。 */
			const raw = typeof args.path === "string" && args.path.trim() !== "" ? args.path : typeof args.file_path === "string" && args.file_path.trim() !== "" ? args.file_path : void 0;
			if (raw === void 0) return null;
			const path = raw.split("\n")[0].trim();
			if (path === "") return null;
			const offset = args.offset;
			return { path, ...typeof offset === "number" && Number.isInteger(offset) && offset >= 1 ? { line: offset } : {} };
		}
		function actionSummariesFromToolNode(node) {
			if (node?.kind !== "tool-call") return [];
			const actions = [];
			const visit = (block, depth) => {
				if (block === null || typeof block !== "object" || depth > 16) return;
				if (block.kind === "tool-result") {
					const name = block.call?.name;
					const kind = name === "advisor" ? "advisor" : name === "todo_write" ? "task" : ["create_goal", "update_goal", "get_goal"].includes(name) ? "goal" : ["bash", "pwsh", "run_code", "exec_command", "write_stdin"].includes(name) || name?.startsWith("terminal_") ? "command" : ["read", "read_file", "read_text_file", "read_image", "view_image", "list_dir", "list_directory", "web_fetch"].includes(name) ? "read" : ["web_search", "file_search", "search_files", "grep", "glob"].includes(name) || name?.endsWith("_inspect") ? "search" : ["edit", "write", "apply_patch", "str_replace_editor"].includes(name) ? "edit" : "other";
					{
						let args = {};
						try { args = JSON.parse(block.call?.argsRaw ?? "{}"); } catch { /* Partial arguments: use tool name. */ }
						if (args === null || typeof args !== "object") args = {};
						const title = kind === "advisor" ? "第二模型复核" : kind === "task" ? "任务清单" : kind === "goal" ? name === "create_goal" ? "创建目标" : name === "update_goal" ? "更新目标" : "查看目标" : kind === "command" ? "命令" : kind === "search" ? "搜索" : kind === "read" ? "读取" : kind === "edit" ? "编辑" : String(name ?? "工具");
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
							const candidates = kind === "command" ? [args.description, args.command, name === "run_code" ? "运行代码" : name] : kind === "goal" ? [args.objective, args.description, args.title, args.name, args.goal_id, args.goalId, args.id, title] : [args.description, args.path, args.file_path, args.query, args.pattern, args.url, args.queries?.[0], name];
							const raw = candidates.find((value) => typeof value === "string" && value.trim() !== "") ?? String(name);
							const normalized = raw.replace(/\s+/g, " ").trim();
							text = [...normalized].length > 120 ? [...normalized].slice(0, 119).join("") + "…" : normalized;
						}
						/* read 家族里目录与网页不给可点路径（官方 list_dir 走 others、web_fetch 的 url 不是文件）：只留真实文件读取。 */
						const target = kind === "read" && !["list_dir", "list_directory", "web_fetch"].includes(name) ? readTargetFields(args) : null;
						actions.push({ id: String(block.callId ?? ""), kind, title, failed: block.isError === true, text: (block.isError ? "失败 · " : "") + text, ...target !== null ? target : {}, ...!block.isError && todos !== null ? { todos } : {} });
					}
				}
				if (Array.isArray(block.subCalls)) for (const child of block.subCalls) visit(child, depth + 1);
			};
			visit(node.data?.root, 0);
			return actions;
		}
		const EMPTY_PROCESS_DATA = [];
		const EMPTY_PROCESS_SOURCE = { subscribe: () => () => {}, getSnapshot: () => EMPTY_PROCESS_DATA };
		const processToolCache = new WeakMap();
		const processThoughtCache = new WeakMap();
		function toolDataHighlights(records) {
			const files = new Set();
			const actions = [];
			const seen = new Set();
			for (const data of records) {
				if (data === null || typeof data !== "object") continue;
				let entry = processToolCache.get(data);
				if (entry === void 0) {
					const node = { kind: "tool-call", data };
					entry = { files: editPathsFromToolNode(node), actions: actionSummariesFromToolNode(node) };
					processToolCache.set(data, entry);
				}
				for (const path of entry.files) files.add(path);
				for (const action of entry.actions) {
					if (action.id !== "" && seen.has(action.id)) continue;
					if (action.id !== "") seen.add(action.id);
					actions.push(action);
				}
			}
			return { files: [...files], actions };
		}
		function thoughtDataHighlights(records) {
			const thoughts = [];
			for (const data of records) {
				if (data === null || typeof data !== "object") continue;
				let entry = processThoughtCache.get(data);
				if (entry === void 0) {
					entry = [];
					const blocks = data.blocks ?? [];
					for (let index = 0; index < blocks.length; index++) {
						const block = blocks[index];
						if (block?.kind !== "reasoning" || data.status === "running" && isReasoningLive(blocks, index)) continue;
						if (typeof block.text === "string" && block.text.trim() !== "") entry.push({ summary: selectThoughtSummary(block.text).text, content: block.text });
					}
					processThoughtCache.set(data, entry);
				}
				thoughts.push(...entry);
			}
			return thoughts;
		}
		/**
		* dsh-stream-think: 该 reasoning 块是否仍在「思考中」。
		*
		* 上游判定是 `index === last`（assistant 节点的最后一个 block），于是
		* [reasoning, tool-call] 这种「正在分析请求、准备调工具」的形态里，reasoning
		* 不是最后一块，被当成已结算 —— 既不自动展开、data-state 也不是 running
		* （思考盒插件正是靠 data-state 判定，于是两处一起失效）。
		* 正确语义：正文（text）尚未开始、且后面没有更新的 reasoning 块时，仍在思考。
		*/
		function findLiveReasoningIndex(blocks) {
			for (let i = blocks.length - 1; i >= 0; i--) {
				const kind = blocks[i]?.kind;
				if (kind === "text") return -1;
				if (kind === "reasoning") return i;
			}
			return -1;
		}
		function isReasoningLive(blocks, index) {
			return index === findLiveReasoningIndex(blocks);
		}
		function shouldHideReasoning(nativeHidden, streaming, autoExpand, blocks, index) {
			return nativeHidden && !(streaming && autoExpand && isReasoningLive(blocks, index));
		}
		function shouldKeepReasoningDuringHandoff(autoCollapse, turnStatus) {
			return !autoCollapse || turnStatus !== "closed";
		}

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
							const taskCount = rowActions.filter((action) => action?.kind === "task").length;
							const taskTools = taskCount === 1 ? row.querySelectorAll('[data-tool="todo_write"]') : [];
							for (const action of rowActions) {
								if (action === null || typeof action !== "object" || typeof action.kind !== "string" || typeof action.text !== "string") continue;
								if (typeof action.id === "string" && action.id !== "") {
									if (seenActionIds.has(action.id)) continue;
									seenActionIds.add(action.id);
								}
								if (action.kind !== "task" || action.failed) { actions.push(action); continue; }
								const tool = taskTools.length === 1 ? taskTools[0] : null;
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
				actions: highlights.actions.filter((action) => action.kind === "advisor" ? settings.showAdvisor : action.kind === "edit" ? settings.showEditedFiles : action.kind === "goal" ? settings.showGoals : action.kind === "command" ? settings.showCommands : action.kind === "read" ? settings.showReads : action.kind === "search" ? settings.showSearches : action.kind === "other" && settings.showOtherTools)
			};
		}
		function briefProcessText(text) {
			const chars = [...String(text).replace(/\s+/g, " ").trim()];
			return chars.length > 84 ? chars.slice(0, 83).join("") + "…" : chars.join("");
		}
		function buildProcessHighlightGroups(visible, fileLabel) {
			const groups = [];
			const actionsOf = (kind) => visible.actions.filter((action) => action.kind === kind);
			const actionItems = (actions) => actions.map((action) => {
				const failed = action.failed && action.text.startsWith("失败 · ");
				const detail = failed ? action.text.slice(5) : action.text;
				const labeled = ["other", "goal", "advisor"].includes(action.kind) ? (failed ? "失败 · " : "") + action.title + (detail === action.title ? "" : " · " + detail) : action.text;
				return { type: action.kind === "task" && Array.isArray(action.todos) ? "task" : "action", text: labeled, action };
			});
			const add = (key, title, items, preview) => {
				if (items.length > 0) groups.push({ key, title, preview: briefProcessText(preview), items });
			};
			const editActions = actionsOf("edit");
			const files = visible.files.map((path) => ({ type: "file", text: fileLabel(path), path }));
			const failedEdits = editActions.filter((action) => action.text.startsWith("失败 · "));
			const editTitle = files.length > 0 ? "编辑了 " + files.length + " 个文件" + (failedEdits.length > 0 ? " · " + failedEdits.length + " 次失败" : "") : "文件编辑 " + editActions.length + " 次";
			add("edit", editTitle, files.length > 0 ? [...files, ...actionItems(failedEdits)] : actionItems(editActions), files.length > 0 ? files.slice(-2).map((item) => item.text).join("、") : editActions.at(-1)?.text ?? "");
			const reads = actionsOf("read");
			add("read", "读取与查看 " + reads.length + " 项", actionItems(reads), reads.at(-1)?.text ?? "");
			const commands = actionsOf("command");
			add("command", "命令与代码执行 " + commands.length + " 次", actionItems(commands), commands.at(-1)?.text ?? "");
			const searches = actionsOf("search");
			add("search", "搜索了 " + searches.length + " 次", actionItems(searches), searches.at(-1)?.text ?? "");
			const snapshots = visible.tasks.filter((action) => Array.isArray(action.todos));
			const withoutSnapshot = visible.tasks.filter((action) => !Array.isArray(action.todos));
			const failedTasks = withoutSnapshot.filter((action) => action.failed).length;
			const currentTask = snapshots.at(-1);
			const taskTitle = (snapshots.length > 0 ? "任务清单更新 " + snapshots.length + " 次" : "任务清单调用 " + visible.tasks.length + " 次") + (failedTasks > 0 ? " · " + failedTasks + " 次失败" : "") + (withoutSnapshot.length > failedTasks ? " · " + (withoutSnapshot.length - failedTasks) + " 次无有效清单" : "");
			add("task", taskTitle, actionItems(currentTask === void 0 ? withoutSnapshot : [currentTask, ...withoutSnapshot]), currentTask?.text ?? withoutSnapshot.at(-1)?.text ?? "");
			const goals = actionsOf("goal");
			add("goal", "目标操作 " + goals.length + " 次", actionItems(goals), goals.at(-1)?.text ?? "");
			const thoughts = visible.thoughts.map((thought, index) => ({ type: "thought", text: thought.summary || "第 " + (index + 1) + " 段思考", content: thought.content }));
			add("thought", "思考摘录 " + thoughts.length + " 段", thoughts, visible.thoughts.findLast((thought) => thought.summary !== "")?.summary ?? "");
			const advisors = actionsOf("advisor");
			add("advisor", "第二模型复核 " + advisors.length + " 次", actionItems(advisors), advisors.at(-1)?.text ?? "");
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
		function isBtwCommandNode(node) {
			return node?.kind === "command" && node.data?.name === "btw";
		}
		/* Side questions belong to the Session, outside both Turn and Step disclosures. */
		function installBtwCommandVisibility(registry) {
			if (typeof registry?.entries !== "function" || typeof registry.subscribe !== "function" || typeof registry.refresh !== "function") return () => {};
			const wrapped = new WeakSet();
			const undoBuilders = [];
			const wrap = () => {
				let changed = false;
				for (const definition of registry.entries()) {
					if (definition.kind !== "command" || typeof definition.buildViewNode !== "function" || wrapped.has(definition.buildViewNode)) continue;
					const original = definition.buildViewNode;
					const next = (context) => {
						const node = original.call(definition, context);
						return isBtwCommandNode(node) && node.location?.kind !== "session" ? { ...node, location: { kind: "session" } } : node;
					};
					wrapped.add(next);
					definition.buildViewNode = next;
					undoBuilders.push(() => { if (definition.buildViewNode === next) definition.buildViewNode = original; });
					changed = true;
				}
				if (changed) registry.refresh();
			};
			const off = registry.subscribe(wrap);
			wrap();
			return () => { off(); for (const restore of undoBuilders) restore(); registry.refresh(); };
		}
		function wrapBtwCommandNodeView(Inner) {
			return function BtwCommandNodeView(props) {
				if (!isBtwCommandNode(props.node)) return (0, react.createElement)(Inner, props);
				const command = props.node.data;
				const outcome = command.outcome;
				return (0, react.createElement)("section", { className: "dsh-stream-think-btw", "data-btw-command": command.commandId, "aria-label": "旁问", "aria-busy": outcome === null },
					(0, react.createElement)("div", { className: "dsh-stream-think-btw-question" }, "/btw" + (command.args ? " · " + command.args : "")),
					(0, react.createElement)("div", { className: "dsh-stream-think-btw-answer", role: outcome?.kind === "error" ? "alert" : void 0 }, outcome === null ? "旁问中…" : outcome.text ?? (outcome.kind === "error" ? "旁问失败" : "旁问完成")));
			};
		}
		function wrapTurnProcessClockNodeView(Inner) {
			/* Read DSH 0.2 data before the first DOM commit, so scroll restoration sees final group heights. */
			function NativeProcessHighlights(props) {
				const store = props.useChat((snapshot) => snapshot.nodes);
				const turn = props.node?.data?.turn;
				const sources = (0, react.useMemo)(() => ({
					tools: store?.turnDataSource?.(turn, "tool-call") ?? EMPTY_PROCESS_SOURCE,
					thoughts: store?.turnDataSource?.(turn, "assistant-step") ?? EMPTY_PROCESS_SOURCE
				}), [store, turn]);
				const tools = (0, react.useSyncExternalStore)(sources.tools.subscribe, sources.tools.getSnapshot, sources.tools.getSnapshot);
				const steps = (0, react.useSyncExternalStore)(sources.thoughts.subscribe, sources.thoughts.getSnapshot, sources.thoughts.getSnapshot);
				const toolHighlights = (0, react.useMemo)(() => toolDataHighlights(tools), [tools]);
				const thoughts = (0, react.useMemo)(() => thoughtDataHighlights(steps), [steps]);
				const nativeHighlights = store?.turnDataSource === void 0 ? void 0 : { ...toolHighlights, thoughts };
				return (0, react.createElement)(TurnProcessClockNodeView, { ...props, nativeHighlights });
			}
			function TurnProcessClockNodeView(props) {
				const rootRef = (0, react.useRef)(null);
				const highlightId = (0, react.useId)();
				const [highlights, setHighlights] = (0, react.useState)({ files: [], thoughts: [], actions: [] });
				const [openGroups, setOpenGroups] = (0, react.useState)({});
				const [visitedGroups, setVisitedGroups] = (0, react.useState)({});
				const [openThought, setOpenThought] = (0, react.useState)(null);
				const detailSettings = (0, react.useSyncExternalStore)(subscribeThinkSettings, getThinkSettings, getThinkSettings);
				const detailsEnabled = detailSettings.showTaskUpdates || detailSettings.showGoals || detailSettings.showEditedFiles || detailSettings.showThoughtSummary || detailSettings.showCommands || detailSettings.showReads || detailSettings.showSearches || detailSettings.showOtherTools;
				/* 原生计时行接管已撤销：不再读按钮标签、不做数字过渡。 */
				const closed = props.node?.location?.turn?.status === "closed";
				const turnId = String(props.node?.data?.turn ?? "");
				(0, react.useLayoutEffect)(() => {
					if (props.nativeHighlights !== void 0 || turnId === "" || !detailsEnabled) return;
					const root = rootRef.current;
					const scope = root?.closest("[data-conversation-scroll]") ?? root?.closest("[data-chat-flow]");
					if (scope === null || scope === void 0) return;
					let frame = 0;
					const read = () => {
						frame = 0;
						const next = processHighlights(scope, turnId);
						setHighlights((old) => old.thoughts.length === next.thoughts.length && old.thoughts.every((thought, i) => thought.summary === next.thoughts[i].summary && thought.content === next.thoughts[i].content) && old.files.length === next.files.length && old.files.every((file, i) => file === next.files[i]) && old.actions.length === next.actions.length && old.actions.every((action, i) => action.id === next.actions[i].id && action.kind === next.actions[i].kind && action.title === next.actions[i].title && action.failed === next.actions[i].failed && action.text === next.actions[i].text && sameTaskSnapshot(action.todos, next.actions[i].todos)) ? old : next);
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
				}, [closed, turnId, detailsEnabled, props.nativeHighlights !== void 0]);
				/* 原生计时行接管已撤销：不再计算数字过渡内容。 */
				const visible = visibleProcessHighlights(props.nativeHighlights ?? highlights, detailSettings);
				const showHighlights = shouldShowProcessHighlights(visible);
				const cwd = props.cwd ?? "";
				const fileLabel = (path) => cwd !== "" && path.startsWith(cwd + "/") ? path.slice(cwd.length + 1) : path;
				const groups = buildProcessHighlightGroups(visible, fileLabel);
				const toggleGroup = (key) => { setOpenGroups((old) => ({ ...old, [key]: !old[key] })); setVisitedGroups((old) => old[key] ? old : { ...old, [key]: true }); };
				/* DSH 0.2 hides the native turn-process while running; keep this seat for live highlights. */
				return (0, react.createElement)("div", { ref: rootRef, className: "dsh-stream-think-clock", "data-live-empty": !closed && !showHighlights || void 0 },
					(0, react.createElement)(Inner, props),
					showHighlights && (0, react.createElement)("div", { className: "dsh-stream-think-highlights", "aria-label": "对话执行摘要" },
						...groups.map((group) => {
							const open = openGroups[group.key] === true;
							const mounted = open || visitedGroups[group.key] === true;
							const bodyId = "dsh-stream-think-" + highlightId + "-" + group.key;
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
											/* 读取/查看类条目保持官方工具行的点击能力：带路径就渲染成按钮，openFile(path[, {line}]) 打开侧边栏预览。 */
											if (item.type === "action" && typeof item.action?.path === "string" && item.action.path !== "" && typeof props.openFile === "function") return (0, react.createElement)("button", { type: "button", key, className: "dsh-stream-think-highlight-item", "data-type": "read", tabIndex: open ? 0 : -1, title: item.action.path, onClick: () => typeof item.action.line === "number" ? props.openFile(item.action.path, { line: item.action.line }) : props.openFile(item.action.path) }, item.text);
											return (0, react.createElement)("div", { key, className: "dsh-stream-think-highlight-text", "data-type": item.type, title: item.text }, item.text);
										}))));
						})));
			}
			return function ProcessHighlightsView(props) {
				return (0, react.createElement)(typeof props.useChat === "function" ? NativeProcessHighlights : TurnProcessClockNodeView, props);
			};
		}
		//#endregion
		function wrapAgentChatRows(ctx, useControlScroll) {
			const restores = [];
			const wrapped = /* @__PURE__ */ new WeakSet();
			const wrapAll = () => {
				for (const entry of ctx.slots.entries("conversation.chat.node")) {
					const key = entry.options.key;
					if (key === void 0 || SKIP_WRAP.has(key)) continue;
					const current = entry.component;
					if (!isWrappableComponent(current) || wrapped.has(current)) continue;
					const inner = current;
					const next = key === "turn-process" ? wrapTurnProcessClockNodeView(inner) : key === "command" ? wrapBtwCommandNodeView(inner) : inner;
					wrapped.add(next);
					entry.component = next;
					restores.push(() => {
						if (entry.component === next) entry.component = inner;
					});
				}
			};
			wrapAll();
			const off = ctx.on("slots/changed", (key) => {
				if (key === "conversation.chat.node") wrapAll();
			});
			return () => {
				off();
				for (const restore of restores) restore();
			};
		}
		/**
		* A live settings cell shared by the renderer lifecycle and React views. It
		* starts on the shared defaults and follows the plugin-owned controller once
		* the optional settings services arrive.
		*/
		var SettingsCell = class {
			listeners = /* @__PURE__ */ new Set();
			card;
			value = DEFAULT_STREAM_SETTINGS;
			pending = false;
			/** Re-point the cell at the plugin-owned settings controller. */
			attach(card) {
				this.card = card;
				this.refresh();
				const unsubscribe = card.subscribe(() => {
					this.refresh();
				});
				return () => {
					unsubscribe();
					if (this.card !== card) return;
					this.card = void 0;
					this.refresh();
				};
			}
			read() {
				const snapshot = this.card?.getSnapshot();
				if (snapshot === void 0 || snapshot.status !== "ready") return this.value;
				return this.card?.values() ?? this.value;
			}
			refresh() {
				const next = this.read();
				const pending = this.card?.getSnapshot().status === "loading";
				if (pending === this.pending && next.enabled === this.value.enabled && next.controlScroll === this.value.controlScroll && next.motionPreference === this.value.motionPreference && next.thinkAutoExpand === this.value.thinkAutoExpand && next.logarithmicFade === this.value.logarithmicFade && next.debugEnabled === this.value.debugEnabled && next.debugTuning === this.value.debugTuning) return;
				this.pending = pending;
				this.value = next;
				for (const listener of this.listeners) listener();
			}
			/**
			* dsh-stream-think: 接管不再等设置服务就绪。上游是 `!this.pending && value.enabled`
			* —— 设置 RPC 一旦慢或失败（Host 半边没挂上、连接未就绪），pending 长期为真，
			* `assistant-step` 就永远不会被接管：界面静默退回官方渲染器，思考行不自动展开，
			* 而插件表面一切正常（模块已加载、设置页能开）。改为只看 enabled（默认 true），
			* 设置未就绪时先用默认值接管。
			*/
			takeoverEnabled() {
				return this.value.enabled;
			}
			getSnapshot = () => this.value;
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
		};
		/**
		* Register the typewriter renderer after the conversation package declares the
		* keyed Chat node seat. A lower priority shadows the built-in assistant row;
		* every other keyed renderer is wrapped in place so Context, commands, Tool
		* cards, retries, and workflow runs share one extensible follow boundary. The
		* Host-bridged configuration
		* selects the render direction, smoothing preset, and glide speed; the
		* plugin-owned settings RPC supplies the live auto-expand preference when the
		* settings surface is composed.
		* @param ctx - Browser context carrying the shared slot registry.
		*/
		//#region dsh-stream-think: 思考行展开设置（localStorage，不依赖 Host）
		/** 展开/收起/预览行数全部由本插件决定，改完立刻生效，不需要重启。 */
		const THINK_SETTINGS_KEY = "dsh-stream-think:settings.v1";
		const THINK_SETTINGS_DEFAULTS = { autoExpand: true, autoCollapse: true, controlScroll: true, imageSettle: true, showTaskUpdates: true, showGoals: true, showEditedFiles: true, showThoughtSummary: true, showCommands: true, showReads: false, showSearches: false, showOtherTools: false, showAdvisor: true };
		const thinkSettingsListeners = new Set();

		function readThinkSettings() {
			const out = Object.assign({}, THINK_SETTINGS_DEFAULTS);
			try {
				const raw = window.localStorage.getItem(THINK_SETTINGS_KEY) ?? window.localStorage.getItem("dsh-think-ux:settings.v1");
				if (raw !== null) {
					const parsed = JSON.parse(raw);
					if (parsed !== null && typeof parsed === "object") {
						if (typeof parsed.autoExpand === "boolean") out.autoExpand = parsed.autoExpand;
						if (typeof parsed.autoCollapse === "boolean") out.autoCollapse = parsed.autoCollapse;
						if (typeof parsed.showTaskUpdates === "boolean") out.showTaskUpdates = parsed.showTaskUpdates;
						if (typeof parsed.showGoals === "boolean") out.showGoals = parsed.showGoals;
						if (typeof parsed.showEditedFiles === "boolean") out.showEditedFiles = parsed.showEditedFiles;
						if (typeof parsed.showThoughtSummary === "boolean") out.showThoughtSummary = parsed.showThoughtSummary;
						if (typeof parsed.showCommands === "boolean") out.showCommands = parsed.showCommands;
						if (typeof parsed.showReads === "boolean") out.showReads = parsed.showReads;
						else if (typeof parsed.showLookups === "boolean") out.showReads = parsed.showLookups;
						if (typeof parsed.showSearches === "boolean") out.showSearches = parsed.showSearches;
						else if (typeof parsed.showLookups === "boolean") out.showSearches = parsed.showLookups;
						if (typeof parsed.showOtherTools === "boolean") out.showOtherTools = parsed.showOtherTools;
						if (typeof parsed.showAdvisor === "boolean") out.showAdvisor = parsed.showAdvisor;
						// groupAutoExpand / toolSummary 已废弃：过程行注入会把思考盒带坏，不再读取
						if (typeof parsed.controlScroll === "boolean") out.controlScroll = parsed.controlScroll;
						if (typeof parsed.imageSettle === "boolean") out.imageSettle = parsed.imageSettle;
					}
				}
			} catch (error) { /* 隐私模式 / 脏数据 → 默认值 */ }
			return out;
		}

		let thinkSettings = readThinkSettings();

		function getThinkSettings() { return thinkSettings; }
		function subscribeThinkSettings(cb) {
			thinkSettingsListeners.add(cb);
			return () => { thinkSettingsListeners.delete(cb); };
		}
		function applyThinkSettings() {
			try {
			} catch (error) { /* 无 document：忽略 */ }
			for (const cb of Array.from(thinkSettingsListeners)) {
				try { cb(); } catch (error) { /* 单个订阅者出错不影响其它 */ }
			}
		}
		function updateThinkSettings(patch) {
			thinkSettings = Object.assign({}, thinkSettings, patch);
			try { window.localStorage.setItem(THINK_SETTINGS_KEY, JSON.stringify(thinkSettings)); } catch (error) { /* 写不进去也当场生效 */ }
			applyThinkSettings();
		}

		const THINK_PANEL_STYLE_ID = "dsh-stream-think-settings-style";
		const THINK_PANEL_CSS = [
			".dsh-stream-think-set{display:flex;flex-direction:column;gap:14px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}",
			".dsh-stream-think-set-desc{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",
			".dsh-stream-think-set-heading{margin:6px 0 -6px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}",
			".dsh-stream-think-set-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border:0.5px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-base)}",
			".dsh-stream-think-set-main{flex:1;min-width:0}",
			".dsh-stream-think-set-name{font-weight:500}",
			".dsh-stream-think-set-meta{margin-top:2px;color:var(--dsw-alias-label-caption);font-size:11px;line-height:16px}",
			".dsh-stream-think-set-switch{flex:none;position:relative;box-sizing:border-box;width:38px;height:22px;padding:0;border:none;border-radius:999px;background:var(--dsw-alias-bg-layer-3);cursor:pointer;transition:background .16s ease}",
			".dsh-stream-think-set-switch[data-on=true]{background:var(--dsw-alias-brand-primary,var(--dsw-specific-sidebar-nav-item-active-accent,#D97757))}",
			".dsh-stream-think-set-knob{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .16s ease}",
			".dsh-stream-think-set-switch[data-on=true] .dsh-stream-think-set-knob{transform:translateX(16px)}",
			".dsh-stream-think-set-seg{display:flex;flex-wrap:wrap;gap:6px}",
			".dsh-stream-think-set-seg button{height:26px;padding:0 10px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:999px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:11px;cursor:pointer}",
			".dsh-stream-think-set-seg button[data-on=true]{border-color:var(--dsw-alias-brand-primary,var(--dsw-specific-sidebar-nav-item-active-accent,#D97757));color:var(--dsw-alias-label-primary);font-weight:600}"
		].join("\n");

		function ensureThinkPanelStyle() {
			if (typeof document === "undefined" || !document.head) return;
			let el = document.getElementById(THINK_PANEL_STYLE_ID);
			if (el === null) {
				el = document.createElement("style");
				el.id = THINK_PANEL_STYLE_ID;
				document.head.appendChild(el);
			}
			if (el.textContent !== THINK_PANEL_CSS) el.textContent = THINK_PANEL_CSS;
		}

		/** 设置 → 插件 → 思考盒：展开行为和对话分类摘要的唯一入口。 */
		function ThinkSettingsPanel() {
			const h = react.createElement;
			const s = (0, react.useSyncExternalStore)(subscribeThinkSettings, getThinkSettings, getThinkSettings);
			const switchBtn = (on, label, testId, onToggle) => h("button", {
				type: "button", role: "switch",
				"aria-checked": on ? "true" : "false",
				"aria-label": label,
				"data-on": on ? "true" : "false",
				"data-testid": testId,
				className: "dsh-stream-think-set-switch",
				onClick: onToggle
			}, h("span", { className: "dsh-stream-think-set-knob", "aria-hidden": true }));
			const row = (key, name, meta, control) => h("div", { className: "dsh-stream-think-set-row", key },
				h("div", { className: "dsh-stream-think-set-main" },
					h("div", { className: "dsh-stream-think-set-name" }, name),
					h("div", { className: "dsh-stream-think-set-meta" }, meta)),
				control);
			return h("div", { className: "dsh-stream-think-set" },
				h("div", { className: "dsh-stream-think-set-desc" },
					"勾选的类别会直接出现在对话中，各类独立合并，点击标题展开；原生过程组的折叠不影响这些分类。修改立即生效并保存在本机。"),
				/* 展开/收起已交回官方（官方 Think 行默认收起、点开才展开），两个开关一并移除。 */
				row("controlScroll", "跟随动画（已停用）",
					"跟随已整条交回官方：本插件不再操作会话滚动。开关保留但当前没有任何效果。",
				switchBtn(s.controlScroll, "平滑跟随动画（已停用）", "stream-think-control-scroll",
					() => updateThinkSettings({ controlScroll: !s.controlScroll }))),
				row("imageSettle", "图片加载后补回底部",
					s.imageSettle
						? "切回会话时若图片撑高了内容而落到偏上，自动补回底部（默认）"
						: "已关闭：偏上时不自动补位，由官方自身行为决定",
					switchBtn(s.imageSettle, "图片加载后补回底部", "stream-think-image-settle",
						() => updateThinkSettings({ imageSettle: !s.imageSettle }))),
				h("div", { className: "dsh-stream-think-set-heading" }, "直接显示在对话中"),
				row("showTaskUpdates", "任务清单", "显示最近一次有效清单及更新次数（默认）",
					switchBtn(s.showTaskUpdates, "在对话中显示任务清单", "stream-think-show-task-updates", () => updateThinkSettings({ showTaskUpdates: !s.showTaskUpdates }))),
				row("showGoals", "目标操作", "目标的创建、更新与查看，独立于任务清单（默认）",
					switchBtn(s.showGoals, "在对话中显示目标操作", "stream-think-show-goals", () => updateThinkSettings({ showGoals: !s.showGoals }))),
				row("showEditedFiles", "文件编辑", "显示本轮成功写入或编辑的所有文件（默认）",
					switchBtn(s.showEditedFiles, "在对话中显示已修改文件", "stream-think-show-edited-files", () => updateThinkSettings({ showEditedFiles: !s.showEditedFiles }))),
				row("showThoughtSummary", "思考摘录", "每段已完成思考提取一句实质内容；点击查看原文（默认）",
					switchBtn(s.showThoughtSummary, "在对话中显示思考摘录", "stream-think-show-thought-summary", () => updateThinkSettings({ showThoughtSummary: !s.showThoughtSummary }))),
				row("showCommands", "命令与代码执行", "从已完成的命令提取简短描述；失败会标记（默认）",
					switchBtn(s.showCommands, "在对话中显示命令与代码执行", "stream-think-show-commands", () => updateThinkSettings({ showCommands: !s.showCommands }))),
				row("showReads", "读取与查看", "文件、图片、目录与网页内容；默认关闭以减少噪音",
					switchBtn(s.showReads, "在对话中显示读取记录", "stream-think-show-reads", () => updateThinkSettings({ showReads: !s.showReads }))),
				row("showSearches", "搜索", "显示文件搜索和网页搜索；默认关闭",
					switchBtn(s.showSearches, "在对话中显示搜索记录", "stream-think-show-searches", () => updateThinkSettings({ showSearches: !s.showSearches }))),
				row("showAdvisor", "第二模型复核", "advisor 工具（第二模型复核）独立成组；默认显示",
					switchBtn(s.showAdvisor, "在对话中显示第二模型复核", "stream-think-show-advisor", () => updateThinkSettings({ showAdvisor: !s.showAdvisor }))),
				row("showOtherTools", "其他工具", "显示未归入以上类别的工具调用；默认关闭",
					switchBtn(s.showOtherTools, "在对话中显示其他工具", "stream-think-show-other-tools", () => updateThinkSettings({ showOtherTools: !s.showOtherTools }))));
		}
		//#endregion

		//#region dsh-stream-think: 图片宽高比占位（消除"先上去再下来"）
		const IMAGE_PLACEHOLDER_ATTR = "data-stream-think-ratio";
		const IMAGE_PLACEHOLDER_MAX_PX = 320; // 官方 CSS 的 max-height
		const IMAGE_PLACEHOLDER_SELECTOR = ".codexMessageImages img";
		/** 占位真正要写在**容器**上：图片是异步插入 button 的（首帧只有「…」），
		 *  而 button 高度 auto 会随内容塌陷再撑开 —— 写 img 拦不住那次撑高。 */
		const IMAGE_PLACEHOLDER_BOX_SELECTOR = ".codexMessageImages[data-single=true] .codexImageThumb";
		let imagePlaceholderApplied = 0;
		/**
		* 从 React fiber 同步读图片的声明尺寸。
		*
		* 为什么不用 naturalWidth：那个值要等解码完成才有，而本模块的全部意义就是
		* 在解码**之前**写下比例。fiber 上的 props 是同步可读的。
		* 向上限 16 层，只认 image.attachment 与 width/height 两种形状；
		* 越界或形状不符就放弃，不猜。
		*/
		function readDeclaredImageSize(element) {
			if (element === null || element === void 0) return null;
			let keys;
			try { keys = Object.keys(element); } catch (error) { return null; }
			for (const key of keys) {
				if (key.startsWith("__reactFiber") === false && key.startsWith("__reactProps") === false) continue;
				let node = element[key];
				for (let depth = 0; depth < 16 && node !== null && node !== void 0; depth++) {
					const props = node.memoizedProps ?? node.pendingProps;
					if (props !== null && props !== void 0) {
						const attachment = props.image?.attachment;
						if (attachment !== void 0 && typeof attachment.width === "number" && typeof attachment.height === "number" && attachment.width > 0 && attachment.height > 0) {
							return { width: attachment.width, height: attachment.height };
						}
						if (typeof props.width === "number" && typeof props.height === "number" && props.width > 0 && props.height > 0) {
							return { width: props.width, height: props.height };
						}
					}
					node = node.return;
				}
			}
			return null;
		}
		/**
		* 给**图片容器**（button.codexImageThumb）写占位高度。
		*
		* 为什么必须写容器而不是 img（实测对比）：
		*   MessageImagePreview 首次渲染时 src 还没就绪，button 里只有「…」文本，
		*   高度约 18px；img 要等异步 loadImage 完成后才被插入。实测：
		*     占位写在 img 上 → 插入前 button 34px、插入后 322px（+288px 撑高，无效）
		*     占位写在 button 上 → 插入前 323px、插入后 323px（0 增长，有效）
		*   因为 button 在单图模式下是 height:auto，高度由内容撑开；图片迟到就会
		*   先塌后撑。只有把高度钉在 button 自己身上，才能让"行高"从第一帧就正确。
		*
		* 高度按容器宽度 × 图片比例算：单图模式容器宽 240px（官方 CSS 固定），
		* 用 getBoundingClientRect().width 读实测宽度更稳（窄屏会 max-width:100%）。
		* 超过官方 max-height:320px 时按 320px 截断。
		*/
		function applyImageBoxPlaceholder(box) {
			if (!(box instanceof HTMLElement)) return false;
			if (box.hasAttribute(IMAGE_PLACEHOLDER_ATTR)) return false;
			if (box.style.height !== "") return false; // 已有高度来源，让位
			const size = readDeclaredImageSize(box) ?? readDeclaredImageSize(box.parentElement) ?? readDeclaredImageSize(box.querySelector("img"));
			if (size === null) return false;
			const width = box.getBoundingClientRect().width;
			if (!(width > 0)) return false; // 还没布局出宽度：等下一轮，别猜
			const scaled = width * size.height / size.width;
			const height = Math.min(IMAGE_PLACEHOLDER_MAX_PX, scaled);
			if (!(height > 0)) return false;
			box.style.height = height + "px";
			box.setAttribute(IMAGE_PLACEHOLDER_ATTR, size.width + "x" + size.height);
			imagePlaceholderApplied += 1;
			if (typeof window !== "undefined") window.__DSH_IMAGE_PLACEHOLDER_APPLIED__ = imagePlaceholderApplied;
			return true;
		}
		function scanImageBoxes(root) {
			if (root === null || root === void 0 || root.nodeType !== 1) return;
			if (root.matches?.(IMAGE_PLACEHOLDER_BOX_SELECTOR)) applyImageBoxPlaceholder(root);
			for (const box of root.querySelectorAll?.(IMAGE_PLACEHOLDER_BOX_SELECTOR) ?? []) applyImageBoxPlaceholder(box);
		}
		/** 已解码图片的等价尺寸；未解码返回 null。 */
		function readLoadedImageSize(img) {
			const w = img.naturalWidth, h = img.naturalHeight;
			return w > 0 && h > 0 ? { width: w, height: h } : null;
		}
		/**
		* 给一张图写宽高比占位。
		*
		* 准入条件（缺一不可）：
		*   ① 本模块没写过（data 标记）；
		*   ② 该图自己也没有任何比例来源（style.aspectRatio 为空）—— 不复写别人写的；
		*   ③ 图片还没解码完成 —— **已解码的图本来就有正确高度，写占位是无意义的样式写入**；
		*   ④ 能同步拿到尺寸。
		*/
		function applyImagePlaceholder(img) {
			if (!(img instanceof HTMLImageElement)) return false;
			if (img.hasAttribute(IMAGE_PLACEHOLDER_ATTR)) return false;
			if (img.style.aspectRatio !== "") return false;
			if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
				img.setAttribute(IMAGE_PLACEHOLDER_ATTR, "loaded");
				return false;
			}
			const size = readDeclaredImageSize(img) ?? readDeclaredImageSize(img.parentElement) ?? readDeclaredImageSize(img.parentElement?.parentElement) ?? readLoadedImageSize(img);
			if (size === null) return false;
			img.style.aspectRatio = size.width + " / " + size.height;
			img.setAttribute(IMAGE_PLACEHOLDER_ATTR, size.width + "x" + size.height);
			imagePlaceholderApplied += 1;
			if (typeof window !== "undefined") window.__DSH_IMAGE_PLACEHOLDER_APPLIED__ = imagePlaceholderApplied;
			return true;
		}
		function scanImagePlaceholders(root) {
			if (root === null || root === void 0) return;
			if (root.nodeType !== 1) return;
			if (root.tagName === "IMG" && root.matches(IMAGE_PLACEHOLDER_SELECTOR)) applyImagePlaceholder(root);
			for (const img of root.querySelectorAll?.(IMAGE_PLACEHOLDER_SELECTOR) ?? []) applyImagePlaceholder(img);
		}
		/**
		* 及早写占位：观察到 img 插入时立即处理，并**同步尝试**。
		*
		* 实测时序（冷启动加载含图会话）：
		*   MutationObserver 的 childList 回调到达时，内容的 scrollHeight 已经涨到
		*   最终值、滚动位置也已经落到偏上处 —— 也就是说**撑高已经发生**，此时再
		*   写占位只能防止后续抖动，救不了这一帧。
		*
		* 真正早于布局的时机是 src 被赋值的那一刻。所以这里对**新出现的 img 实例**
		* 做实例级 src 接管（不碰 HTMLImageElement.prototype，只影响消息区里的图片）：
		* 在 src 写入前先把 fiber 上的比例写进 style，图片从第一次布局起就有正确高度。
		*/
		const imPlaceholderPatched = /* @__PURE__ */ new WeakSet();
		function patchImageSrc(img) {
			if (imPlaceholderPatched.has(img)) return;
			let descriptor;
			try { descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src"); } catch (error) { return; }
			if (descriptor === void 0 || typeof descriptor.set !== "function") return;
			try {
				Object.defineProperty(img, "src", {
					configurable: true,
					get() { return descriptor.get.call(this); },
					set(value) {
						/* src 赋值先于加载：此刻写比例，图片第一次参与布局就是最终高度。 */
						applyImagePlaceholder(this);
						descriptor.set.call(this, value);
						/* 某些实现会在赋值后立即同步解码（缓存命中）；再补一次以防万一。 */
						if (this.complete && this.naturalWidth > 0) applyImagePlaceholder(this);
					}
				});
				imPlaceholderPatched.add(img);
			} catch (error) { /* 冻结对象等：放弃接管，childList 路径仍会兜底 */ }
		}
		function prepareImageNode(node) {
			if (node === null || node === void 0 || node.nodeType !== 1) return;
			if (node.tagName === "IMG" && node.matches(IMAGE_PLACEHOLDER_SELECTOR)) { patchImageSrc(node); applyImagePlaceholder(node); }
			for (const img of node.querySelectorAll?.(IMAGE_PLACEHOLDER_SELECTOR) ?? []) { patchImageSrc(img); applyImagePlaceholder(img); }
		}
		/**
		* 常驻安装。两条路径并用：
		*   ① childList 观察 —— 发现新 img → 实例级 src 接管 + 尝试写占位；
		*   ② 解码完成事件 —— 兜底"插入时 fiber 还读不到、之后才补上"的情形。
		*/
		function installImagePlaceholder() {
			prepareImageNode(document.body);
			scanImageBoxes(document.body);
			const observer = typeof MutationObserver === "undefined" ? null : new MutationObserver((mutations) => {
				for (const mutation of mutations) for (const node of mutation.addedNodes) { prepareImageNode(node); scanImageBoxes(node); }
			});
			observer?.observe(document.body, { childList: true, subtree: true });
			const onDecoded = (event) => {
				const target = event.target;
				if (target instanceof HTMLImageElement && target.matches(IMAGE_PLACEHOLDER_SELECTOR)) applyImagePlaceholder(target);
			};
			document.addEventListener("load", onDecoded, true);
			return () => {
				observer?.disconnect();
				document.removeEventListener("load", onDecoded, true);
			};
		}
		//#endregion


		//#region dsh-stream-think: 图片加载后补回底部
		const IMAGE_SETTLE_ARMED_MS = 8000; // 会话被观察的窗口；之后彻底撒手
		const IMAGE_SETTLE_QUIET_MS = 400; // 读者停止滚动多久后才允许补位
		const IMAGE_SETTLE_SLACK_PX = 2; // 「贴底」判定
		/**
		* 「够接近底部、可以认为读者本意就在底部」的容差。
		* 官方内容变化时的位置保持补偿会把 scrollTop 留在离底十几像素处（实测 16px）；
		* 若按 slack=2 判，就会被误判成"读者在中间"而放走真正的偏上。
		* 取 32px：足够覆盖官方补偿量，又远小于"读者主动停在中间"的距离
		* （实测读者上翻一次就 ≥100px）。
		*/
		const IMAGE_SETTLE_CANDIDATE_PX = 32;
		/**
		* 补位前让官方先走一步的等待时间。
		* 官方每次内容变化后都会自己尝试贴底；若我们同拍写入，两者会互相覆盖。
		* 等这一拍之后，若官方已贴底就完全不介入（零写入），只有它没做到才补。
		* 取 160ms：大于一帧、小于人能察觉的延迟。
		*/
		const IMAGE_SETTLE_ENTER_DELAY_MS = 160;
		/**
		* 切会话恢复纠偏的「偏上」上限：只把"贴着底部的一小段"算作图片撑高造成的
		* 偏上并补回底部；超过这个距离就认为读者本来就是停在中间，一律不动。
		* 取 512px：覆盖图片撑高可能造成的偏移（实测 304px），又远小于一屏
		* （视口 740px）——读者主动上翻一屏是不可能被误判的。
		*/
		const IMAGE_SETTLE_RECOVER_MAX_PX = 512;
		const imageSettleRecoveryTimers = [];
		const IMAGE_SETTLE_READER_UP_PX = 24; // scrollTop 一次回退超过这么多 = 读者上翻
		const imageSettleState = /* @__PURE__ */ new WeakMap();
		let imageSettleArmedAt = 0;
		let imageSettlePort = null;
		let imageSettleHeightObserver = null;
		let imageSettleLastReaderAt = 0;
		let imageSettleApplied = 0;
		let imageSettleBound = false;
		function imageSettleEnabled() {
			try { return getThinkSettings().imageSettle === true; } catch (error) { return false; }
		}
		function imageSettleSlack(port) {
			return port.scrollHeight - port.scrollTop - port.clientHeight;
		}
		function imageSettleAtBottom(port) {
			return imageSettleSlack(port) <= IMAGE_SETTLE_SLACK_PX;
		}
		/**
		* 读者动了：既刷新静默计时，也把 atBottom 置假 —— 这是 atBottom 唯一
		* 由"非贴底"转 false 的入口（见 imageSettleSnapshot 的说明）。
		*/
		function noteImageSettleReaderIntent() {
			imageSettleLastReaderAt = Date.now();
			const port = imageSettlePort;
			if (port === null) return;
			const state = imageSettleState.get(port);
			if (state !== void 0) state.atBottom = false;
		}
		/**
		* 记下基线。语义（这是本模块的核心，改动前务必读懂）：
		*   · height  —— 上一次见到的内容高度（判定"是否被撑高"）
		*   · atBottom —— 读者当前是否处于「贴底」状态
		*
		* atBottom 的更新规则刻意只有两条，其余一律不改：
		*   ① 观察到贴底（slack <= 2px）        → true
		*   ② 观察到读者主动滚动/上翻            → false（由 noteImageSettleReaderIntent）
		* **不因为"当前不在底部"就置 false** —— 官方在内容变化时做的位置保持补偿
		* （实测把 scrollTop 留在离底 16px 处）会让 atBottom 被误判为 false，
		* 之后图片撑高就再也不补位了。这个坑实测踩到过，别再改回去。
		*/
		function imageSettleSnapshot(port) {
			const state = imageSettleState.get(port) ?? { height: 0, atBottom: false, done: /* @__PURE__ */ new Set() };
			state.height = port.scrollHeight;
			if (imageSettleAtBottom(port)) state.atBottom = true;
			imageSettleState.set(port, state);
			return state;
		}
		/**
		* 图片解码完成 → 内容可能被撑高。只有「撑高前贴底 + 读者静默 + 窗口内 + 未补过」
		* 才把位置补回底部；否则一行不动。
		*
		* 关键设计：**不跟官方抢**。官方在每次内容变化后都会自己尝试贴底，
		* 若我们在同一拍也写 scrollTop，两者会互相覆盖，甚至把位置算到中间态上。
		* 所以补位前要等 ENTER_DELAY_MS：若官方在这段时间内已经把它补到底了，
		* 我们的目标值就会与当前值一致，直接跳过（不产生任何写入）。
		*/
		function settleAfterImage(port, img) {
			if (port === null || port.isConnected === false) return;
			if (!imageSettleEnabled()) return;
			if (performance.now() - imageSettleArmedAt > IMAGE_SETTLE_ARMED_MS) return;
			const state = imageSettleState.get(port);
			if (state === void 0) return;
			const nextHeight = port.scrollHeight;
			const slack = imageSettleSlack(port);
			// 未撑高：这条路径只维护基线（观察到贴底就记 atBottom=true），不做任何写入。
			if (nextHeight <= state.height) {
				if (slack <= IMAGE_SETTLE_SLACK_PX) state.atBottom = true;
				state.height = nextHeight;
				return;
			}
			const wasAtBottom = state.atBottom;
			const key = String(nextHeight) + ":" + String(img?.currentSrc ?? "");
			state.height = nextHeight;
			if (state.done.has(key)) return; // 同一次撑高只补一次
			state.done.add(key);
			// 「撑高前贴底」是补位的唯一理由。官方自己补偿时会把位置留在离底
			// 一点点的偏上处（实测 16px），所以用比 slack 更宽的容差来判定
			// "当时是否本就该在底部"，避免因为这十几像素放走真正的偏上。
			if (!wasAtBottom && slack > IMAGE_SETTLE_CANDIDATE_PX) return; // 读者确实在中间 → 绝不补位
			if (Date.now() - imageSettleLastReaderAt < IMAGE_SETTLE_QUIET_MS) return; // 读者近期有滚动意图
			const target = Math.max(0, nextHeight - port.clientHeight);
			// 让官方先走一步：等一拍再看它是否已经贴底；若已贴底则完全不介入。
			const expectedHeight = nextHeight;
			setTimeout(() => {
				if (imageSettlePort !== port || port.isConnected === false) return;
				if (!imageSettleEnabled()) return;
				if (port.scrollHeight !== expectedHeight) return; // 高度又变了 → 交给下一轮，不在这里抢
				const nowSlack = imageSettleSlack(port);
				if (nowSlack <= IMAGE_SETTLE_SLACK_PX) { state.atBottom = true; return; } // 官方已处理
				if (Date.now() - imageSettleLastReaderAt < IMAGE_SETTLE_QUIET_MS) return; // 期间读者动了
				const nowTarget = Math.max(0, expectedHeight - port.clientHeight);
				if (Math.abs(port.scrollTop - nowTarget) <= IMAGE_SETTLE_SLACK_PX) return;
				port.scrollTop = nowTarget;
				/* 可观测标记：写到自己的计数器上，便于实测断言与排障（不碰宿主 DOM）。 */
				imageSettleApplied += 1;
				if (typeof window !== "undefined") window.__DSH_IMAGE_SETTLE_APPLIED__ = imageSettleApplied;
				state.atBottom = true;
				state.height = port.scrollHeight;
			}, IMAGE_SETTLE_ENTER_DELAY_MS);
		}
		/** 会话切换：重新武装窗口并对新 port 取基线。 */
		function armImageSettle(port) {
			if (port === null || port.isConnected === false) return;
			imageSettlePort = port;
			imageSettleArmedAt = performance.now();
			// 只重置「上次读者滚动时刻」这一项：切会话的瞬间官方自己会写 scrollTop
			// （位置恢复），那不是读者意图，不该压制后续补位。之后读者的任何
			// wheel/keydown/touchmove/scroll 都会把它刷新，届时补位自动让路。
			imageSettleLastReaderAt = -1e9;
			imageSettleState.delete(port);
			const armed = imageSettleSnapshot(port);
			// 切进来时是否"一开始就贴底"——纠偏路径的准入条件。
			// 若进入时本来就贴底，那之后任何偏上都是内容变化造成的，值得纠偏；
			// 若进入时就偏上，则更可能是"官方忠实恢复了读者上次停的位置"，
			// 也可能是被记住的偏上值 —— 两者无法当场区分，交给复查窗口内的
			// 稳定性判定（内容定型 + 位置始终不动）来定夺。
			armed.enteredAtBottom = imageSettleAtBottom(port);
			watchImageSettleHeight(port);
			scheduleImageSettleRecovery(port);
		}
		/**
		* 会话切换后的「位置恢复纠偏」。
		*
		* 为什么需要它（这是用户报的稳定复现路径，实测取证）：
		*   官方会记住每个会话的 scrollTop 并忠实恢复。若某一次因图片撑高而落在
		*   偏上处（实测 1745 / gap=304px），**这个偏上值会被当成阅读位置永久记住**，
		*   之后每次切回来都恢复成偏上 —— 表现为"有些会话稳定偏上"。
		*
		* 由于这一刻内容高度并无变化，撑高那条路径（settleAfterImage）不会介入，
		* 所以单靠它修不了这个症状。这里在会话切换后的一小段窗口内做几次复查：
		* 只有当「内容已定型不再长高」且「位置贴着内容底部一小段但没到底」
		* 且「读者没动过」时，才把位置补到真正的底部。
		*
		* 只在窗口期内复查（REARM_MS），之后彻底撒手。
		*/
		const IMAGE_SETTLE_REARM_DELAYS_MS = [700, 1400, 2400];
		function scheduleImageSettleRecovery(port) {
			imageSettleRecoveryTimers.forEach(clearTimeout);
			imageSettleRecoveryTimers.length = 0;
			// 记录每次复查看到的位置：只有"接连两次看到同一个偏上值"
			// 才认为它是稳定状态（官方恢复后的静止值 / 被记住的值），
			// 从而排除"读者正在拖动"或"渲染过程中"这两种会漂移的情况。
			let lastSeenTop = null;
			for (const delay of IMAGE_SETTLE_REARM_DELAYS_MS) {
				imageSettleRecoveryTimers.push(setTimeout(() => {
					if (imageSettlePort !== port || port.isConnected === false) return;
					if (!imageSettleEnabled()) return;
					if (performance.now() - imageSettleArmedAt > IMAGE_SETTLE_ARMED_MS) return;
					if (Date.now() - imageSettleLastReaderAt < IMAGE_SETTLE_QUIET_MS) return;
					const topNow = Math.round(port.scrollTop);
					const slack = imageSettleSlack(port);
					const state = imageSettleState.get(port);
					if (state === void 0) return;
					// 位置在两次复查之间还在变 → 不是稳定态（读者在动 / 官方在调）→ 不插手
					const stable = lastSeenTop !== null && Math.abs(topNow - lastSeenTop) <= IMAGE_SETTLE_SLACK_PX;
					lastSeenTop = topNow;
					// 已经到底：无事可做
					if (slack <= IMAGE_SETTLE_SLACK_PX) return;
					// 离底太远 → 读者就是停在这里的，绝不是"图片撑高造成的偏上"
					if (slack > IMAGE_SETTLE_RECOVER_MAX_PX) return;
					// 内容还在长高（渲染未定型）→ 交给下一轮复查，别在过程里插手
					if (port.scrollHeight !== state.height) {
						state.height = port.scrollHeight;
						return;
					}
					// 内容定型了、位置也稳定，才纠偏
					if (!stable) return;
					const target = Math.max(0, port.scrollHeight - port.clientHeight);
					if (Math.abs(port.scrollTop - target) <= IMAGE_SETTLE_SLACK_PX) return;
					port.scrollTop = target;
					imageSettleApplied += 1;
					if (typeof window !== "undefined") window.__DSH_IMAGE_SETTLE_APPLIED__ = imageSettleApplied;
					state.atBottom = true;
					lastSeenTop = Math.round(port.scrollTop);
				}, delay));
			}
		}
		/**
		* 窗口期内盯住**内容容器**的高度变化。
		*
		* 两个必须注意的点（都是实测踩出来的）：
		*   ① 不能观察滚动容器 —— 它的高度被 CSS 钉死在视口高（实测 740px），
		*      内容撑高时它一个像素都不变，ResizeObserver 永远不回调。
		*      真正随内容变高的是 [data-chat-flow]（内容列）。
		*   ② 同时挂 img 的 load/error 作为第二触发源：图片解码与布局提交之间
		*      存在时间差，两个信号互补。
		*
		* 离开观察窗口就 disconnect，不做长期跟随。
		*/
		function watchImageSettleHeight(port) {
			if (typeof ResizeObserver === "undefined") return;
			imageSettleHeightObserver?.disconnect();
			const target = port.querySelector("[data-chat-flow]") ?? port.firstElementChild ?? port;
			const observer = new ResizeObserver(() => {
				if (performance.now() - imageSettleArmedAt > IMAGE_SETTLE_ARMED_MS) {
					observer.disconnect();
					imageSettleHeightObserver = null;
					return;
				}
				const current = imageSettlePort;
				if (current === null || current.isConnected === false) return;
				// 下一帧再量：ResizeObserver 回调时布局可能仍在提交中。
				requestAnimationFrame(() => {
					if (imageSettlePort !== current) return;
					settleAfterImage(current, null);
				});
			});
			observer.observe(target);
			imageSettleHeightObserver = observer;
		}
		function installImageSettle() {
			if (imageSettleBound) return () => {};
			imageSettleBound = true;
			const onImageDone = (event) => {
				const img = event.target;
				if (!(img instanceof HTMLImageElement)) return;
				const port = img.closest?.("[data-conversation-scroll]");
				if (port === null || port === void 0 || port !== imageSettlePort) return;
				// 图片事件发生在解码后，但布局可能还没提交；下一帧再测量更准。
				requestAnimationFrame(() => settleAfterImage(port, img));
			};
			const onWheelOrKey = () => noteImageSettleReaderIntent();
			// 拖动滚动条 / 触控板惯性不派发 wheel。用「读者上滚」这一条补判据：
			// 只有位置**比我们上次见到的更靠上**（scrollTop 变小）才算读者主动看更早的内容；
			// 官方位置恢复、图片撑高后的补位都会让 scrollTop 变大或持平，不会误判。
			let lastSeenTop = -1;
			const onScroll = (event) => {
				const port = event.target;
				if (port === document || port === window) return;
				if (port?.matches?.("[data-conversation-scroll]") !== true) return;
				if (port !== imageSettlePort) return;
				const top = port.scrollTop;
				if (lastSeenTop >= 0 && top < lastSeenTop - IMAGE_SETTLE_READER_UP_PX) noteImageSettleReaderIntent();
				lastSeenTop = top;
			};
			document.addEventListener("load", onImageDone, true);
			document.addEventListener("error", onImageDone, true);
			window.addEventListener("scroll", onScroll, { capture: true, passive: true });
			window.addEventListener("wheel", onWheelOrKey, { passive: true });
			window.addEventListener("touchmove", onWheelOrKey, { passive: true });
			window.addEventListener("keydown", onWheelOrKey);
			return () => {
				imageSettleBound = false;
				imageSettleHeightObserver?.disconnect();
				imageSettleHeightObserver = null;
				imageSettleRecoveryTimers.forEach(clearTimeout);
				imageSettleRecoveryTimers.length = 0;
				document.removeEventListener("load", onImageDone, true);
				document.removeEventListener("error", onImageDone, true);
				window.removeEventListener("scroll", onScroll, { capture: true });
				window.removeEventListener("wheel", onWheelOrKey);
				window.removeEventListener("touchmove", onWheelOrKey);
				window.removeEventListener("keydown", onWheelOrKey);
				imageSettlePort = null;
			};
		}
		/**
		* 会话切换的检测。
		*
		* 实测（桌面 19387）：切换会话时 data-conversation-session 属性**不会变**
		* （DSH 0.2 复用一个滚动元素，属性值保持不变），所以不能只盯它。
		* 真正可靠的信号是**内容本身**：首行的 data-chat-flow-key 在换会话时必然变。
		* 两者一起看，取「任一变化即重新武装」。
		*/
		function imageSettleFingerprint() {
			const port = document.querySelector("[data-conversation-scroll]");
			if (port === null) return null;
			const session = port.closest("[data-conversation-session]")?.getAttribute("data-conversation-session") ?? "";
			const firstRow = port.querySelector("[data-chat-flow-key]");
			const firstKey = firstRow?.getAttribute("data-chat-flow-key") ?? "";
			// 刻意**不**把行数放进指纹：流式输出时行数会一直变，
			// 那样每次新增行都会重新武装，纠偏窗口永不结束。
			return { port, key: session + "|" + firstKey };
		}
		function watchImageSettleSessions() {
			let fingerprint = null;
			const initial = imageSettleFingerprint();
			if (initial !== null) {
				fingerprint = initial.key;
				armImageSettle(initial.port);
			}
			let pending = false;
			const evaluate = () => {
				if (pending) return;
				pending = true;
				requestAnimationFrame(() => {
					pending = false;
					const next = imageSettleFingerprint();
					if (next === null) return;
					if (next.key === fingerprint) return;
					fingerprint = next.key;
					armImageSettle(next.port);
				});
			};
			const observer = typeof MutationObserver === "undefined" ? null : new MutationObserver(evaluate);
			if (observer !== null) {
				observer.observe(document.body, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ["data-conversation-session", "data-chat-flow-key"]
				});
			}
			// 有些会话切换不产生可观察的 childList（复用节点、仅改文本），
			// 用低频复查兜底。**刻意不用 setInterval**：常驻定时器会让宿主/测试
			// 进程的事件循环一直有活（smoke-test 因此卡死过一次），且卸载后必须
			// 显式清理才停。改成「只在观察窗口内自我续期」的链式 setTimeout，
			// 窗口一过自然停止，无残留。
			let pollTimer = null;
			const schedulePoll = (delay) => {
				pollTimer = setTimeout(() => {
					pollTimer = null;
					if (performance.now() - imageSettleArmedAt > IMAGE_SETTLE_ARMED_MS) return;
					evaluate();
					schedulePoll(500);
				}, delay);
			};
			schedulePoll(500);
			return () => {
				observer?.disconnect();
				if (pollTimer !== null) clearTimeout(pollTimer);
				pollTimer = null;
			};
		}
		//#endregion

		function apply(ctx) {
			applyThinkSettings();
			ensureThinkPanelStyle();
			ensureTurnProcessClockStyle();
			/* 治本：图片解码前写好宽高比占位，让内容高度不再分两帧定型。 */
			const uninstallImagePlaceholder = installImagePlaceholder();
			/* 兜底：挤掉 1 帧窗口仍然发生时，把位置补回底部（不是每次都需要）。 */
			const uninstallImageSettle = installImageSettle();
			const unwatchImageSettleSessions = watchImageSettleSessions();
			ctx.effect(() => () => { uninstallImagePlaceholder(); uninstallImageSettle(); unwatchImageSettleSessions(); }, "dsh-stream-think: image placeholder + settle");
			ctx.inject(["uiConversation"], (conversationCtx) => installBtwCommandVisibility(conversationCtx.uiConversation.events));
			if (ctx !== null && ctx !== void 0 && ctx.slots && typeof ctx.slots.inject === "function") {
				ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
					name: "settings.plugins.tab",
					id: "dsh-stream-think",
					order: 20,
					label: () => "思考盒"
				}, ThinkSettingsPanel));
			}
			/* 上游设置数据源（SettingsCell + 卡片控制器）已摘除：只用自己的本地设置。 */
			/* 上游设置数据源已摘除：settings RPC / locale 词典 / 调试绑定都不再需要。 */
			/* 打字机渲染器已交回官方：StreamConfiguredView 死代码移除。 */
			/* Think 行的展开与摘录已交回官方；这里只保留 turn-process 的摘要座位包装。 */
			ctx.slots.inject("conversation.chat.node", () => {
				const unwrap = wrapAgentChatRows(ctx);
				return () => {
					unwrap();
				};
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map