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
		//#region src/client/AnimatedDisclosure.tsx
		/** Class-name join for optional overlay classes over the chrome defaults. */
		function cx(...parts) {
			return parts.filter((part) => part !== void 0 && part !== "").join(" ");
		}
		/**
		* Render one disclosure header whose expanded body is height-animated.
		* @param props - Visual content, controlled open state, and the toggle
		* callback fired by row click and Enter/Space.
		* @returns the animated disclosure row.
		*/
		function AnimatedDisclosure({ icon, title, open, onToggle, collapsedContent, children, rowClassName, leadingClassName, titleClassName, chevronClassName, bodyTransition = true }) {
			const toggleFromKeyboard = (event) => {
				if (event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				onToggle();
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: TypewriterAssistantNodeView_module_css_default.disclosureRoot,
				"data-open": open || void 0,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: cx(TypewriterAssistantNodeView_module_css_default.disclosureRow, rowClassName),
					"data-disclosure-row": true,
					"data-expandable": "",
					role: "button",
					tabIndex: 0,
					"aria-expanded": open,
					onClick: onToggle,
					onKeyDown: toggleFromKeyboard,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: cx(TypewriterAssistantNodeView_module_css_default.disclosureLeading, leadingClassName),
							children: open ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: chevronClassName }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: TypewriterAssistantNodeView_module_css_default.disclosureIconIdle,
								children: icon
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: cx(chevronClassName, TypewriterAssistantNodeView_module_css_default.disclosureChevronHover) })] })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: cx(TypewriterAssistantNodeView_module_css_default.disclosureTitle, titleClassName),
							children: title
						}),
						!open && collapsedContent
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: TypewriterAssistantNodeView_module_css_default.disclosureContent,
					"data-disclosure-content": true,
					"data-collapsed": open ? void 0 : "",
					"data-no-transition": bodyTransition ? void 0 : "",
					children
				})]
			});
		}
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
		//#region src/client/clientStore.ts
		function fallbackSnapshotStore(init) {
			let state = init;
			const listeners = /* @__PURE__ */ new Set();
			return {
				getSnapshot: () => state,
				subscribe: (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				update: (mutator) => {
					const draft = Object.create(Object.getPrototypeOf(state), Object.getOwnPropertyDescriptors(state));
					mutator(draft);
					state = draft;
					for (const listener of [...listeners]) listener(state);
				},
				set: (next) => {
					state = next;
					for (const listener of [...listeners]) listener(state);
				}
			};
		}
		/**
		* Runtime require: the module-loader factory scopes its own resolver over the
		* booting kernel's table; under Node (vitest) there is no global require, so
		* fall back to `createRequire`.
		*/
		function pickRequire() {
			if (typeof require === "function") try {
				return require;
			} catch {
				return null;
			}
			if (typeof process !== "undefined" && typeof process.getBuiltinModule === "function") try {
				const { createRequire } = process.getBuiltinModule("node:module");
				return createRequire(process.cwd() + "/package.json");
			} catch {
				return null;
			}
			return null;
		}
		let clientStore;
		try {
			const req = pickRequire();
			if (req !== null) try {
				clientStore = req("@deepseek-ai/dsh-client-store");
			} catch {
				try {
					clientStore = req("@deepseek-ai/dsh-client-runtime/client");
				} catch {}
			}
		} catch {}
		const createSnapshotStore = clientStore?.createSnapshotStore ?? fallbackSnapshotStore;
		//#endregion
		//#region src/client/debugRuntime.ts
		/**
		* Shared browser-side diagnostics state.
		*
		* The settings card owns persistence. This module is the live bridge used by
		* the renderer and the chat-side panel: renderer loops publish measurements,
		* while panel edits are staged through the settings-card controller.
		*/
		const EMPTY_METRICS = {
			fps: null,
			frameMs: null,
			fpsDegraded: false,
			streamActive: false,
			streamBacklog: 0,
			streamSpeedCps: 0,
			streamTargetChars: 0,
			streamDisplayedChars: 0,
			followActive: false,
			followLagPx: 0,
			followVelocityPxPerSec: 0,
			followReservePx: 0,
			followCapacityPx: 0,
			followRevealScale: 1,
			followFollowing: false,
			followConstrained: false,
			scrollTop: null,
			scrollHeight: null,
			clientHeight: null,
			lastUpdatedMs: null
		};
		const INITIAL_STATE = {
			available: false,
			enabled: false,
			writable: false,
			dirty: false,
			status: "loading",
			tuning: { ...DEFAULT_STREAM_DEBUG_TUNING },
			metrics: EMPTY_METRICS
		};
		const store = createSnapshotStore(INITIAL_STATE);
		const streamMetrics = /* @__PURE__ */ new Map();
		const followMetrics = /* @__PURE__ */ new Map();
		let actions;
		let lastMetricPublish = 0;
		function resetMetrics() {
			streamMetrics.clear();
			followMetrics.clear();
			lastMetricPublish = 0;
		}
		function resetRuntime() {
			actions = void 0;
			resetMetrics();
			store.set({
				...INITIAL_STATE,
				metrics: EMPTY_METRICS
			});
		}
		function now() {
			return typeof performance === "undefined" ? Date.now() : performance.now();
		}
		function sameTuning(left, right) {
			return left.revealScale === right.revealScale && left.queuePressure === right.queuePressure && left.maxRevealCps === right.maxRevealCps && left.springStiffness === right.springStiffness && left.springDamping === right.springDamping && left.springMass === right.springMass && left.runwayPx === right.runwayPx && left.reserveResponseMs === right.reserveResponseMs && left.backpressureMinScale === right.backpressureMinScale;
		}
		function currentMetrics(timestamp) {
			let stream;
			for (const candidate of streamMetrics.values()) if (stream === void 0 || candidate.updatedAt > stream.updatedAt) stream = candidate;
			let follow;
			for (const candidate of followMetrics.values()) if (follow === void 0 || candidate.updatedAt > follow.updatedAt) follow = candidate;
			return {
				fps: store.getSnapshot().metrics.fps,
				frameMs: store.getSnapshot().metrics.frameMs,
				fpsDegraded: store.getSnapshot().metrics.fpsDegraded,
				streamActive: stream?.active ?? false,
				streamBacklog: stream?.backlog ?? 0,
				streamSpeedCps: stream?.speedCps ?? 0,
				streamTargetChars: stream?.targetChars ?? 0,
				streamDisplayedChars: stream?.displayedChars ?? 0,
				followActive: follow?.active ?? false,
				followLagPx: follow?.lagPx ?? 0,
				followVelocityPxPerSec: follow?.velocityPxPerSec ?? 0,
				followReservePx: follow?.reservePx ?? 0,
				followCapacityPx: follow?.capacityPx ?? 0,
				followRevealScale: follow?.revealScale ?? 1,
				followFollowing: follow?.following ?? false,
				followConstrained: follow?.constrained ?? false,
				scrollTop: follow?.scrollTop ?? null,
				scrollHeight: follow?.scrollHeight ?? null,
				clientHeight: follow?.clientHeight ?? null,
				lastUpdatedMs: timestamp
			};
		}
		function publishMetrics(force = false) {
			const timestamp = now();
			if (!force && timestamp - lastMetricPublish < 80) return;
			lastMetricPublish = timestamp;
			store.set({
				...store.getSnapshot(),
				metrics: currentMetrics(timestamp)
			});
		}
		const debugRuntime = {
			store,
			getSnapshot() {
				return store.getSnapshot();
			},
			subscribe(listener) {
				return store.subscribe(listener);
			},
			/** Whether hot-path instrumentation should do any work. */
			isEnabled() {
				return store.getSnapshot().enabled;
			},
			tuning() {
				return store.getSnapshot().tuning;
			},
			/** Production values remain untouched until the user explicitly enables diagnostics. */
			activeTuning() {
				return store.getSnapshot().enabled ? store.getSnapshot().tuning : DEFAULT_STREAM_DEBUG_TUNING;
			},
			bindSettings(nextActions) {
				actions = nextActions;
				return () => {
					if (actions !== nextActions) return;
					resetRuntime();
				};
			},
			syncSettings(input) {
				const current = store.getSnapshot();
				const available = input.available ?? true;
				const enabled = available && input.enabled;
				const availabilityChanged = current.available !== available;
				const enabledChanged = current.enabled !== enabled;
				if (availabilityChanged || enabledChanged) resetMetrics();
				const tuning = input.tuning === void 0 ? current.tuning : {
					...DEFAULT_STREAM_DEBUG_TUNING,
					...input.tuning
				};
				if (current.available === available && current.enabled === enabled && current.writable === input.writable && current.dirty === input.dirty && current.status === input.status && sameTuning(current.tuning, tuning)) return;
				store.set({
					...current,
					available,
					enabled,
					writable: input.writable,
					dirty: input.dirty,
					status: input.status,
					tuning,
					metrics: availabilityChanged || enabledChanged || !enabled ? EMPTY_METRICS : current.metrics
				});
			},
			edit(patch) {
				const current = store.getSnapshot();
				const enabled = patch.debugEnabled ?? current.enabled;
				const enabledChanged = current.enabled !== enabled;
				if (enabledChanged) resetMetrics();
				const tuning = patch.debugTuning === void 0 ? current.tuning : {
					...current.tuning,
					...patch.debugTuning
				};
				store.set({
					...current,
					enabled,
					dirty: true,
					tuning,
					metrics: enabledChanged || !enabled ? EMPTY_METRICS : current.metrics
				});
				actions?.edit({
					...patch.debugEnabled === void 0 ? {} : { debugEnabled: patch.debugEnabled },
					...patch.debugTuning === void 0 ? {} : { debugTuning: tuning }
				});
			},
			save() {
				actions?.save();
			},
			discard() {
				actions?.discard();
			},
			reset() {
				this.edit({ debugTuning: { ...DEFAULT_STREAM_DEBUG_TUNING } });
			},
			reportStream(id, metric) {
				if (!this.isEnabled()) return;
				if (metric === null) streamMetrics.delete(id);
				else streamMetrics.set(id, {
					...metric,
					updatedAt: now()
				});
				publishMetrics(metric === null);
			},
			reportFollow(port, metric) {
				if (!this.isEnabled()) return;
				if (metric === null) followMetrics.delete(port);
				else followMetrics.set(port, {
					...metric,
					updatedAt: now()
				});
				publishMetrics(metric === null);
			},
			reportFps(fps, frameMs, degraded) {
				if (!this.isEnabled()) return;
				const current = store.getSnapshot();
				store.set({
					...current,
					metrics: {
						...current.metrics,
						fps,
						frameMs,
						fpsDegraded: degraded,
						lastUpdatedMs: now()
					}
				});
			},
			clearFps() {
				if (!this.isEnabled()) return;
				const current = store.getSnapshot();
				store.set({
					...current,
					metrics: {
						...current.metrics,
						fps: null,
						frameMs: null,
						fpsDegraded: false,
						lastUpdatedMs: now()
					}
				});
			},
			panelFace() {
				return {
					hooks: { debugRuntime: store },
					edit: (patch) => {
						this.edit(patch);
					},
					save: () => {
						this.save();
					},
					discard: () => {
						this.discard();
					},
					reset: () => {
						this.reset();
					}
				};
			},
			resetRuntime() {
				resetRuntime();
			}
		};
		//#endregion
		//#region src/client/teleprompterGlide.ts
		/**
		* Conversation-port follow while an assistant reply streams.
		*
		* A sub-stepped spring physics engine drives a float `animatedH`, rather
		* than restarting native smooth-scroll animations as every glyph lands.
		* Remaining lag rides a small compositor transform while the real scrollport
		* stays at its floor. The transform is bounded by the measured paint gap
		* before conversation chrome. This follower:
		*
		* - marks programmatic writes via `data-follow-owned` for compatible hosts;
		* - sets `overflow-anchor: none` so CSS scroll-anchoring does not snap;
		* - restores `animatedH` in a ResizeObserver (before paint) so a layout
		*   pass cannot flash a snapped frame;
		* - expresses safe lag as a compositor transform on message rows;
		* - opens a speed-adaptive layout runway before fast output wraps, preserving
		*   the reference spring constants at every reveal speed;
		* - catches up any lag that cannot fit before turn status / composer chrome,
		*   so fixed chrome never has to counter-shift and the host stays at-bottom;
		* - never clips or overlays streamed text.
		*
		* A real reader gesture receives the effective visual position before the
		* transform clears. Lifecycle completion instead settles at the floor.
		*
		* Directional wheel/touch intent unpins immediately; pointer/key input falls
		* back to an upward scroll delta from the engine's own written position. A
		* reader release re-acquires only after returning to the real floor.
		*/
		/**
		* Programmatic follow marker retained for hosts that recognize external
		* scroll ownership. Current Harness also sees the write land at the floor.
		*/
		const FOLLOW_OWNED_ATTR = "data-follow-owned";
		/**
		* Duration of completion runway retirement. The final pad is visible motion:
		* its shrinking floor brings the transcript down to its natural resting
		* position. 1.5s keeps the default 72px runway at 48px/s (0.8px per 60Hz
		* frame), matching the configured default reading-follow velocity instead of
		* the old 160ms / 450px/s staircase that looked like repeated completion
		* jumps.
		*/
		const FOLLOW_RUNWAY_RETIRE_MS = 1500;
		/** Runway size emitted by bundles before the 72px predictive runway. */
		const LEGACY_RUNWAY_PX = 48;
		/** Safe-lag occupancy band over which reveal pressure is progressively reduced. */
		const FOLLOW_BACKPRESSURE_START_RATIO = .1;
		/** Effective-scroll acceleration budget, in px/ms². */
		const FOLLOW_TRAJECTORY_ACCELERATION = 22e-5;
		const GESTURE_EVENTS = [
			"wheel",
			"touchstart",
			"touchmove",
			"touchend",
			"touchcancel",
			"pointerdown",
			"keydown"
		];
		/** Visible runway needed for the current reveal pressure. */
		function computeFollowReserve(speedCps, runwayPx = 72) {
			const available = Math.max(0, runwayPx);
			if (available <= 0) return 0;
			if (speedCps <= 20) return 0;
			const normalized = Math.min(1, Math.max(0, (speedCps - 20) / 580));
			const minimum = Math.min(available, 31);
			return minimum + normalized * (available - minimum);
		}
		/**
		* Character-domain feed-forward for the stepped layout floor. Callers only
		* provide committed reveal progress and the measured floor; wrap capacity and
		* line height stay local to this module and adapt when a real wrap lands.
		*/
		var FollowRevealPhaseTracker = class {
			charsPerLine;
			lineHeightPx;
			floorPx = null;
			wrapRevealCount = 0;
			lastRevealCount = 0;
			constructor({ seedCharsPerLine = 50, seedLineHeightPx = 26 } = {}) {
				this.charsPerLine = Math.max(1, seedCharsPerLine);
				this.lineHeightPx = Math.max(1, seedLineHeightPx);
			}
			advance(floorPx, revealedChars) {
				const nextFloor = Math.max(0, floorPx);
				const nextRevealCount = Math.max(0, revealedChars);
				if (this.floorPx === null || nextRevealCount < this.lastRevealCount) {
					this.floorPx = nextFloor;
					this.wrapRevealCount = nextRevealCount;
					this.lastRevealCount = nextRevealCount;
					return this.snapshot(nextFloor, 0);
				}
				const floorDelta = nextFloor - this.floorPx;
				const lineStepThreshold = Math.max(4, this.lineHeightPx * .5);
				if (floorDelta >= lineStepThreshold) {
					const wrappedLines = Math.max(1, Math.round(floorDelta / this.lineHeightPx));
					const sampledLineHeight = floorDelta / wrappedLines;
					const revealedSinceWrap = nextRevealCount - this.wrapRevealCount;
					if (revealedSinceWrap >= this.charsPerLine * .5) {
						const sampledCharsPerLine = revealedSinceWrap / wrappedLines;
						const alpha = .25;
						this.charsPerLine += (sampledCharsPerLine - this.charsPerLine) * alpha;
						this.lineHeightPx += (sampledLineHeight - this.lineHeightPx) * alpha;
						this.wrapRevealCount = nextRevealCount;
					} else this.wrapRevealCount = nextRevealCount;
				} else if (floorDelta <= -lineStepThreshold) this.wrapRevealCount = nextRevealCount;
				this.floorPx = nextFloor;
				this.lastRevealCount = nextRevealCount;
				const phase = Math.min(1, Math.max(0, (nextRevealCount - this.wrapRevealCount) / this.charsPerLine));
				return this.snapshot(nextFloor, phase);
			}
			snapshot(floorPx, phase) {
				return {
					targetPx: floorPx + this.lineHeightPx * phase,
					phase,
					charsPerLine: this.charsPerLine,
					lineHeightPx: this.lineHeightPx
				};
			}
		};
		/** Advance a continuous effective scroll position behind a stepped floor. */
		function computeFollowTrajectoryStep(dtMs, input) {
			if (dtMs <= 0) return {
				positionPx: input.positionPx,
				shiftPx: Math.max(0, (input.paintFloorPx ?? input.targetPx) - input.positionPx),
				velocityPxPerMs: input.velocityPxPerMs
			};
			const elapsedMs = Math.min(32, dtMs);
			const currentLagPx = input.targetPx - input.positionPx;
			const maxLagPx = Math.max(0, input.maxLagPx);
			const minLagPx = Math.min(Math.max(0, input.minLagPx), maxLagPx);
			const centerLagPx = (minLagPx + maxLagPx) / 2;
			const desiredVelocity = Math.max(0, input.targetVelocityPxPerMs + (currentLagPx - centerLagPx) / 120);
			const maxVelocityChange = FOLLOW_TRAJECTORY_ACCELERATION * elapsedMs;
			const velocityPxPerMs = desiredVelocity >= input.velocityPxPerMs ? Math.min(desiredVelocity, input.velocityPxPerMs + maxVelocityChange) : Math.max(desiredVelocity, input.velocityPxPerMs - maxVelocityChange);
			const minPosition = input.targetPx - maxLagPx;
			const maxPosition = input.targetPx - minLagPx;
			const frameAdvancePx = velocityPxPerMs * elapsedMs;
			const boundedPositionPx = Math.min(maxPosition, Math.max(minPosition, input.positionPx + frameAdvancePx));
			const positionPx = Math.max(input.positionPx, boundedPositionPx);
			return {
				positionPx,
				shiftPx: Math.max(0, (input.paintFloorPx ?? input.targetPx) - positionPx),
				velocityPxPerMs
			};
		}
		/**
		* Reveal-rate multiplier needed to retain one-wrap headroom for the spring.
		* Throttling starts only after a quarter of the safe transform is occupied;
		* a constrained paint lands at the minimum immediately so the next reveal
		* commit cannot keep feeding an already-full visual buffer.
		*/
		function computeFollowRevealScale(lagPx, capacityPx, constrained = false, tuning = DEFAULT_STREAM_DEBUG_TUNING) {
			if (constrained) return tuning.backpressureMinScale;
			if (!Number.isFinite(capacityPx)) return 1;
			if (capacityPx <= 0) return lagPx > 0 ? tuning.backpressureMinScale : 1;
			const ratio = Math.min(1, Math.max(0, lagPx / capacityPx));
			if (ratio >= .75) return tuning.backpressureMinScale;
			const progress = Math.min(1, Math.max(0, (ratio - FOLLOW_BACKPRESSURE_START_RATIO) / .65));
			const eased = progress * progress * (3 - 2 * progress);
			return 1 - (1 - tuning.backpressureMinScale) * eased;
		}
		/** Semi-implicit spring integration with four substeps per <=32ms slice. */
		function computeFollowStep(dtMs, input, tuning = DEFAULT_STREAM_DEBUG_TUNING) {
			if (input.lag <= .1 || dtMs <= 0) return {
				advancePx: 0,
				lerpStep: 0,
				velocityPxPerSec: 0
			};
			let lag = input.lag;
			let velocity = Math.max(0, input.velocityPxPerSec ?? 0);
			const elapsedMs = Math.min(32, dtMs);
			const slices = Math.max(1, Math.ceil(elapsedMs / 32));
			const subDt = elapsedMs / 1e3 / slices / 4;
			for (let slice = 0; slice < slices; slice += 1) for (let substep = 0; substep < 4; substep += 1) {
				const acceleration = (tuning.springStiffness * lag - tuning.springDamping * velocity) / tuning.springMass;
				velocity = Math.max(0, velocity + acceleration * subDt);
				const advance = velocity * subDt;
				if (advance >= lag) return {
					advancePx: input.lag,
					lerpStep: 1,
					velocityPxPerSec: 0
				};
				lag -= advance;
			}
			const advancePx = input.lag - lag;
			return {
				advancePx,
				lerpStep: advancePx / input.lag,
				velocityPxPerSec: velocity
			};
		}
		/** Element whose resize signals flow growth for the before-paint restore. */
		function resizeProxyOf(port) {
			return port.querySelector("[data-chat-transcript]") ?? port.querySelector("[data-chat-flow]");
		}
		/**
		* Outermost message surfaces; nested tool rows ride their parent.
		*
		* Another plugin may insert its own element as a flow sibling of the Chat rows
		* (meow-memory's fold bar is one).
		* Such a row carries no `data-chat-anchor-key`, so selecting only anchored
		* rows would shift the conversation while leaving the foreign row at its
		* natural offset, letting the shifted rows paint over it. Every direct flow
		* child therefore rides the same transform, keeping the visual order of the
		* column intact.
		*/
		function shiftSurfacesOf(port) {
			const transcript = port.querySelector("[data-chat-transcript]");
			if (transcript !== null) return [transcript];
			const anchored = [...port.querySelectorAll("[data-chat-anchor-key]")].filter((row) => row.parentElement?.closest("[data-chat-anchor-key]") === null);
			const flow = port.querySelector("[data-chat-flow]");
			if (flow === null) return anchored;
			const status = turnStatusOf(port);
			const anchoredSet = new Set(anchored);
			return [...flow.children].filter((child) => child instanceof HTMLElement && child !== status && (anchoredSet.has(child) || child.querySelector("[data-chat-anchor-key]") === null));
		}
		function currentShiftOf(element) {
			return Number(/translate3d\(0(?:px)?,\s*(-?[\d.]+)px,\s*0(?:px)?\)/.exec(element.style.transform)?.[1] ?? 0);
		}
		function setDirectShift(element, px) {
			if (Math.abs(px) > .01) {
				if (Math.abs(currentShiftOf(element) - px) <= .01 && element.style.willChange === "transform" && element.style.clipPath === "") return;
				element.style.transform = `translate3d(0, ${px}px, 0)`;
				element.style.willChange = "transform";
			} else {
				if (element.style.transform === "" && element.style.willChange === "" && element.style.clipPath === "") return;
				element.style.transform = "";
				element.style.willChange = "";
			}
			element.style.clipPath = "";
		}
		function setShift(element, px) {
			if (Math.abs(px) > .01 && element.querySelector("[role=\"tooltip\"]") !== null) {
				setDirectShift(element, 0);
				return;
			}
			setDirectShift(element, px);
		}
		function turnStatusOf(port) {
			return port.querySelector("[data-chat-turn-status], [data-chat-flow] > [role=\"status\"], [data-chat-flow] > [data-chat-running]");
		}
		const FOLLOW_FLOW_FILL_SYMBOL = Symbol.for("dsh-smooth-stream.follow-flow-fill");
		const followFlowFillHost = globalThis;
		const followFlowFills = followFlowFillHost[FOLLOW_FLOW_FILL_SYMBOL] ?? /* @__PURE__ */ new WeakMap();
		followFlowFillHost[FOLLOW_FLOW_FILL_SYMBOL] = followFlowFills;
		const FOLLOW_FLOW_FILL_USERS_SYMBOL = Symbol.for("dsh-smooth-stream.follow-flow-fill-users");
		const followFlowFillUsersHost = globalThis;
		const followFlowFillUsers = followFlowFillUsersHost[FOLLOW_FLOW_FILL_USERS_SYMBOL] ?? /* @__PURE__ */ new WeakMap();
		followFlowFillUsersHost[FOLLOW_FLOW_FILL_USERS_SYMBOL] = followFlowFillUsers;
		function flowElementOf(port) {
			return port.querySelector("[data-chat-transcript]") ?? port.querySelector("[data-chat-flow]");
		}
		function ensureFlowFillsPort(port) {
			const element = flowElementOf(port);
			const owned = followFlowFills.get(port);
			if (element === null) {
				if (owned !== void 0) restoreFlowFill(port);
				return;
			}
			const client = Math.max(0, port.clientHeight);
			const composerHeight = port.querySelector("[data-composer-seat]")?.getBoundingClientRect().height ?? 0;
			let overshoot = owned?.overshootPx;
			if (overshoot === void 0 || owned.clientPx !== client || Math.abs(owned.composerHeightPx - composerHeight) > .5 || owned.element !== element) {
				const pendingOriginal = element.style.minHeight;
				element.style.minHeight = `${client}px`;
				overshoot = Math.max(0, port.scrollHeight - client);
				element.style.minHeight = pendingOriginal;
				if (owned !== void 0) restoreFlowFill(port);
			}
			const target = `${Math.max(0, client - overshoot)}px`;
			if (owned !== void 0) {
				if (owned.element === element && owned.overshootPx === overshoot && element.style.minHeight === target) return;
				restoreFlowFill(port);
			}
			const original = element.style.minHeight;
			element.style.minHeight = target;
			followFlowFills.set(port, {
				element,
				original,
				overshootPx: overshoot,
				clientPx: client,
				composerHeightPx: composerHeight
			});
		}
		function restoreFlowFill(port) {
			const owned = followFlowFills.get(port);
			if (owned === void 0) return;
			owned.element.style.minHeight = owned.original;
			followFlowFills.delete(port);
		}
		/** Height committed by one newly mounted Chat row, including its flex gap. */
		function entranceExtentOf(root) {
			const row = root.closest("[data-chat-flow-key]") ?? root;
			const rect = row.getBoundingClientRect();
			const height = Math.max(0, rect.height, rect.bottom - rect.top, row.offsetHeight);
			let previous = row.previousElementSibling;
			while (previous instanceof HTMLElement) {
				const previousRect = previous.getBoundingClientRect();
				if (previousRect.height > 0 || previousRect.bottom > previousRect.top) return Math.max(height, rect.bottom - previousRect.bottom);
				previous = previous.previousElementSibling;
			}
			return height;
		}
		/**
		* The plugin can be reinjected without replacing the conversation DOM. Keep
		* runway ownership in the page realm so a fresh bundle adopts the existing
		* margin instead of treating it as host layout and adding another 48px.
		*/
		const FOLLOW_RUNWAYS_SYMBOL = Symbol.for("dsh-smooth-stream.follow-runways");
		const followRunwayRegistry = globalThis;
		const followRunways = followRunwayRegistry[FOLLOW_RUNWAYS_SYMBOL] ?? /* @__PURE__ */ new WeakMap();
		followRunwayRegistry[FOLLOW_RUNWAYS_SYMBOL] = followRunways;
		const followPaintLimits = /* @__PURE__ */ new WeakMap();
		const followHadChrome = /* @__PURE__ */ new WeakSet();
		/** Last painted shift per port, to spread a wrap's one-line step over frames. */
		const followLastShiftPx = /* @__PURE__ */ new WeakMap();
		/** Last settled floor per port, to size the shift decay bound against extent collapse. */
		const followLastFloorPx = /* @__PURE__ */ new WeakMap();
		const followGuardAnchors = /* @__PURE__ */ new WeakMap();
		/**
		* Ports whose completion settle loop owns the follow. The settle drains the
		* reveal, retires the pad and guards the cascade; the swap that ends the
		* turn REMOUNTS the follower arms in the same frame cluster, and a freshly
		* mounted arm primes with a higher generation and would otherwise steal the
		* port mid-drain — its observers miss the cascade mutations (armed after
		* the fact) and its state initialization re-materializes engine space.
		* Ownership is released only when the settle finishes, the reader gestures,
		* or a genuinely NEW turn arrives (a user row joined since the handoff).
		*/
		const followCompletionSettle = /* @__PURE__ */ new WeakSet();
		/** User-row count at handoff, for the new-turn check above. */
		const followCompletionSettleRows = /* @__PURE__ */ new WeakMap();
		/** User rows below the flow, or -1 when the host does not label rows with
		*  `data-chat-flow-kind` (the engine's own audit benches): the new-turn
		*  check is unsupported there and ownership guarding must stay OFF. */
		function countUserRows(port) {
			const flow = flowElementOf(port);
			if (flow === null) return -1;
			let count = 0;
			let sawKind = false;
			for (const child of flow.children) {
				if (!(child instanceof HTMLElement)) continue;
				const kind = child.getAttribute("data-chat-flow-kind");
				if (kind !== null) sawKind = true;
				if (kind === "user") count++;
			}
			return sawKind ? count : -1;
		}
		/** True while this port's completion settle owns the follow and no new turn
		*  has arrived since the handoff. */
		function completionSettleGuardsPort(port) {
			if (!followCompletionSettle.has(port)) return false;
			const baseline = followCompletionSettleRows.get(port) ?? -1;
			const current = countUserRows(port);
			return baseline >= 0 && current >= 0 && current <= baseline;
		}
		/**
		* Ports whose completion settle loop owns the follow. A settle loop drains,
		* retires the pad and guards the cascade; an arm that primes while this is
		* set with `active === false` (the settled-side static arm mounting in the
		* very swap frame) must NOT seize leadership — the swap re-renders the node
		* view, a fresh arm would otherwise steal the port mid-drain with
		* `reservePx = ownedBottomSpace` (the pad!), re-materialize an equal runway
		* through applyVisual, double-count the extent and fight the settle's own
		* guard for the rest of the window. A streaming arm (active === true, the
		* next turn) still takes over normally and the settle yields.
		*/
		function readingAnchorOf(port) {
			const flow = flowElementOf(port);
			if (flow === null) return null;
			let anchor = null;
			for (const child of flow.children) {
				if (!(child instanceof HTMLElement)) continue;
				if (child.getAttribute("data-chat-flow-kind") === "assistant" || child.querySelector("[data-variant=\"think\"]") !== null) anchor = child;
			}
			return anchor ?? shiftSurfacesOf(port).at(-1) ?? null;
		}
		/**
		* Measure the reading surface's screen delta since the last guard pass.
		* Returns null when there is nothing comparable yet (first observation), or
		* when the anchor changed identity in a way that is NOT the in-place
		* live→settled replacement (a new turn's row joined — nothing jumped,
		* re-seed). Compensation sites must store the POST-compensation held
		* position via `holdGuardAnchor`, or the guard would read its own
		* correction as a fresh jump and oscillate.
		*/
		function measureReadingAnchor(port) {
			const anchor = readingAnchorOf(port);
			if (anchor === null) {
				followGuardAnchors.delete(port);
				return null;
			}
			const rect = anchor.getBoundingClientRect();
			if (!(rect.width > 0 || rect.height > 0)) return null;
			const top = rect.top;
			const shift = currentShiftOf(anchor);
			const pad = flowPadOf(port);
			const scrollTop = port.scrollTop;
			const scrollHeight = port.scrollHeight;
			const flow = flowElementOf(port);
			const index = flow === null ? -1 : [...flow.children].indexOf(anchor);
			const stored = followGuardAnchors.get(port);
			if (stored === void 0) {
				followGuardAnchors.set(port, {
					element: anchor,
					top,
					index,
					shift,
					pad,
					scrollTop,
					scrollHeight
				});
				return null;
			}
			if (Math.abs(scrollHeight - stored.scrollHeight) <= .5 && Math.abs(scrollTop - stored.scrollTop) > .5) {
				followScrollLedgers.set(port, scrollTop);
				followGuardAnchors.set(port, {
					element: anchor,
					top,
					index,
					shift,
					pad,
					scrollTop,
					scrollHeight
				});
				return null;
			}
			const scrollDelta = scrollTop - stored.scrollTop;
			const delta = top - stored.top + scrollDelta - (shift - stored.shift) + (pad - stored.pad);
			if (stored.element === anchor) {
				followGuardAnchors.set(port, {
					element: anchor,
					top,
					index,
					shift,
					pad,
					scrollTop,
					scrollHeight
				});
				return {
					anchor,
					index,
					top,
					delta
				};
			}
			if (!stored.element.isConnected && stored.index === index) return {
				anchor,
				index,
				top,
				delta
			};
			followGuardAnchors.set(port, {
				element: anchor,
				top,
				index,
				shift,
				pad,
				scrollTop,
				scrollHeight
			});
			return null;
		}
		/** Record the position the reader should keep seeing after a correction. */
		function holdGuardAnchor(port, measured, heldTop) {
			followGuardAnchors.set(port, {
				element: measured.anchor,
				index: measured.index,
				top: heldTop,
				shift: currentShiftOf(measured.anchor),
				pad: flowPadOf(port),
				scrollTop: port.scrollTop,
				scrollHeight: port.scrollHeight
			});
		}
		/** Last runway offset seen per port, to rebase the extent when the margin size changes. */
		const followRunwayOffsetHistory = /* @__PURE__ */ new WeakMap();
		/** Last observed scroll floor per port, for the slack→overflow runway re-measure. */
		const followFloorHistory = /* @__PURE__ */ new WeakMap();
		/** One-shot flag: the transition frame must paint the full runway as baseline. */
		const followSlackTransition = /* @__PURE__ */ new WeakSet();
		const followSettlePads = /* @__PURE__ */ new WeakMap();
		/**
		* Retired follower space lives as `padding-bottom` on the FLOW element — the
		* one node the engine already owns styles on (flow-fill min-height) and the
		* host never rewrites. Host completion commits routinely REPLACE row elements
		* (live→settled swap re-keys the assistant row, the status row unmounts), and
		* any engine space written on those rows dies with them, sinking the floor
		* and slamming the pinned transcript for a frame. The flow survives.
		*/
		function flowPadOf(port) {
			return followSettlePads.get(port)?.px ?? 0;
		}
		/**
		* After a loss is re-opened as pad, a registry entry whose element is no
		* longer connected claims extent that no longer exists; drop it so the next
		* `ensureRunway` re-measures fresh instead of double-counting.
		*/
		function pruneDeadRunway(port) {
			const runway = followRunways.get(port);
			if (runway !== void 0 && !runway.element.isConnected) {
				restoreRunway(port);
				return true;
			}
			return false;
		}
		function setFlowPad(port, px) {
			const flow = flowElementOf(port);
			const existing = followSettlePads.get(port);
			if (existing !== void 0 && existing.element !== flow) {
				existing.element.style.paddingBottom = existing.original;
				followSettlePads.delete(port);
			}
			if (flow === null) return;
			const original = followSettlePads.get(port)?.original ?? flow.style.paddingBottom;
			if (px <= .25) {
				if (existing !== void 0) {
					existing.element.style.paddingBottom = existing.original;
					followSettlePads.delete(port);
				}
				return;
			}
			flow.style.paddingBottom = original === "" ? `${px}px` : `calc(${original} + ${px}px)`;
			followSettlePads.set(port, {
				element: flow,
				original,
				px
			});
		}
		/** Extent the follower owns below the content: the live runway margin plus
		*  the retired completion pad. At adopt the pad is reclaimed into the fresh
		*  reservation (same frame, pre-paint), so the floor never steps. */
		function ownedBottomSpaceOf(port) {
			return runwayOffsetOf(port) + flowPadOf(port);
		}
		/**
		* Completion-window diagnostics. Armed when a follower hands off to its
		* settle loop; every engine decision and every externally-written scroll
		* position inside the window prints one compact console line, so a live
		* host session can be diffed against the lab without a debugger.
		*/
		let followTraceUntilMs = 0;
		function traceActive() {
			return debugRuntime.isEnabled() && performance.now() < followTraceUntilMs;
		}
		function followTrace(event, detail) {
			if (!traceActive()) return;
			console.log(`[dsh-follow] ${event}`, JSON.stringify(detail));
		}
		function hostShOf(port) {
			return port.scrollHeight;
		}
		function invalidatePaintLimit(port) {
			followPaintLimits.delete(port);
		}
		/** Logical position and velocity survive a React owner handoff and finish. */
		const followMotionStates = /* @__PURE__ */ new WeakMap();
		const followReaderHolds = /* @__PURE__ */ new WeakMap();
		/**
		* Commit-time correction channel. A reveal commit that lands after this
		* frame's ResizeObserver delivery would otherwise paint one intermediate
		* frame — content grown, scrollTop/transform not yet compensated — before
		* the next tick fixes it. Reveal arms call {@link notifyFollowCommit} right
		* after their commit; the leading follower re-runs its geometry in the same
		* task, so the intermediate state never reaches a paint.
		*/
		const followCommitListeners = /* @__PURE__ */ new WeakMap();
		function notifyFollowCommit(fromInsidePort) {
			if (fromInsidePort === null) return;
			const port = fromInsidePort.closest("[data-conversation-scroll]");
			const listeners = port === null ? void 0 : followCommitListeners.get(port);
			if (listeners === void 0) return;
			for (const listener of [...listeners]) listener();
		}
		function subscribeFollowCommit(port, fn) {
			let listeners = followCommitListeners.get(port);
			if (listeners === void 0) {
				listeners = /* @__PURE__ */ new Set();
				followCommitListeners.set(port, listeners);
			}
			listeners.add(fn);
			return () => {
				listeners.delete(fn);
			};
		}
		function restoreRunway(port) {
			const runway = followRunways.get(port);
			if (runway === void 0) return;
			runway.element.style[runway.property] = runway.original;
			followRunways.delete(port);
			invalidatePaintLimit(port);
		}
		function isLegacyRunway(value) {
			if (value === "") return false;
			const terms = [...value.matchAll(/([\d.]+)px/g)];
			if (terms.length === 0 || value.replaceAll(/calc|px|[\d.+()\s]/g, "") !== "") return false;
			const values = terms.map(([, raw]) => Number(raw));
			if (values.some((px) => !Number.isFinite(px))) return false;
			return [LEGACY_RUNWAY_PX, 72].some((unit) => values.every((px) => px >= unit && Math.abs(px % unit) <= Number.EPSILON));
		}
		/** Remove unowned runway residue written by v0.3.3 and earlier bundles. */
		function migrateLegacyRunway(port, surfaces, status, composer) {
			if (followRunways.has(port)) return false;
			let migrated = false;
			if (status !== null && isLegacyRunway(status.style.marginTop)) {
				status.style.marginTop = "";
				migrated = true;
			}
			const last = surfaces.at(-1);
			if (status === null && composer !== null && last !== void 0 && isLegacyRunway(last.style.marginBottom)) {
				last.style.marginBottom = "";
				migrated = true;
			}
			if (migrated) invalidatePaintLimit(port);
			return migrated;
		}
		function ensureRunway(port, surfaces, runwayPx = 72) {
			const status = turnStatusOf(port);
			const composer = port.querySelector("[data-composer-seat]");
			if (status !== null && followRunways.get(port) === void 0) {
				const inlinePx = Number.parseFloat(status.style.marginTop ?? "") || 0;
				if (Math.abs(inlinePx - 72) <= .5) {
					followRunways.set(port, {
						element: status,
						offset: inlinePx,
						property: "marginTop",
						original: "",
						requestedPx: inlinePx
					});
					invalidatePaintLimit(port);
				}
			}
			const migratedLegacy = migrateLegacyRunway(port, surfaces, status, composer);
			const naturalHeight = Math.max(0, port.scrollHeight - runwayOffsetOf(port));
			const existing = followRunways.get(port);
			const requestedRunwayPx = migratedLegacy || existing?.normalizedLegacy === true ? 72 : runwayPx;
			if (requestedRunwayPx <= 0 || port.clientHeight <= 0 || naturalHeight <= port.clientHeight) {
				restoreRunway(port);
				return;
			}
			const target = status === null ? {
				element: composer === null ? void 0 : surfaces.at(-1),
				property: "marginBottom"
			} : {
				element: status,
				property: "marginTop"
			};
			if (target.element === void 0) {
				restoreRunway(port);
				return;
			}
			const element = target.element;
			const current = followRunways.get(port);
			if (current?.element === element && current.property === target.property && current.requestedPx === requestedRunwayPx) return;
			restoreRunway(port);
			const beforeHeight = port.scrollHeight;
			const original = element.style[target.property];
			element.style[target.property] = original === "" ? `${requestedRunwayPx}px` : `calc(${original} + ${requestedRunwayPx}px)`;
			const offset = Math.max(0, port.scrollHeight - beforeHeight);
			followRunways.set(port, {
				element,
				offset,
				property: target.property,
				original,
				requestedPx: requestedRunwayPx,
				normalizedLegacy: migratedLegacy || existing?.normalizedLegacy === true
			});
			invalidatePaintLimit(port);
		}
		function runwayOffsetOf(port) {
			return followRunways.get(port)?.offset ?? 0;
		}
		/**
		* Move owned runway margin into the persistent flow pad without changing the
		* scroll extent. Returns the actual layout pixels removed from the margin.
		*/
		function transferRunwayToFlowPad(port, requestedPx) {
			const runway = followRunways.get(port);
			if (runway === void 0 || requestedPx <= 0 || !runway.element.isConnected) return 0;
			const nextRequestedPx = Math.max(0, runway.requestedPx - requestedPx);
			const beforeOffset = runway.offset;
			const beforeHeight = port.scrollHeight;
			runway.element.style[runway.property] = nextRequestedPx <= .25 ? runway.original : runway.original === "" ? `${nextRequestedPx}px` : `calc(${runway.original} + ${nextRequestedPx}px)`;
			const nextOffset = Math.max(0, beforeOffset + port.scrollHeight - beforeHeight);
			const transferredPx = Math.max(0, beforeOffset - nextOffset);
			if (nextRequestedPx <= .25 || nextOffset <= .25) followRunways.delete(port);
			else followRunways.set(port, {
				...runway,
				offset: nextOffset,
				requestedPx: nextRequestedPx
			});
			if (transferredPx > 0) {
				setFlowPad(port, flowPadOf(port) + transferredPx);
				invalidatePaintLimit(port);
			}
			return transferredPx;
		}
		/** Available paint room below the last message before fixed conversation chrome. */
		function safeShiftLimit(port, surfaces) {
			const last = surfaces.at(-1);
			if (last === void 0) return 0;
			const status = turnStatusOf(port);
			const composer = port.querySelector("[data-composer-seat]");
			if (status !== null || composer !== null) followHadChrome.add(port);
			const cached = followPaintLimits.get(port);
			if (cached !== void 0 && performance.now() - cached.measuredAtMs <= 250 && cached.clientHeight === port.clientHeight && cached.surface === last && cached.status === status && cached.composer === composer) return cached.limit;
			const ceiling = [status, composer].filter((element) => element !== null).map((element) => ({
				element,
				rect: element.getBoundingClientRect()
			})).filter(({ rect }) => Number.isFinite(rect.top) && Number.isFinite(rect.bottom) && rect.bottom > rect.top).sort((first, second) => first.rect.top - second.rect.top)[0];
			if (ceiling === void 0) return status === null && composer === null ? followHadChrome.has(port) ? 0 : Number.POSITIVE_INFINITY : runwayOffsetOf(port);
			const ceilingTop = ceiling.rect.top - currentShiftOf(ceiling.element);
			const naturalBottom = last.getBoundingClientRect().bottom - currentShiftOf(last);
			const limit = Math.max(0, ceilingTop - naturalBottom - 1);
			followPaintLimits.set(port, {
				clientHeight: port.clientHeight,
				limit,
				measuredAtMs: performance.now(),
				composer,
				status,
				surface: last
			});
			return limit;
		}
		function setFollowScrollTop(port, nextTop) {
			const ledger = followScrollLedgers.get(port);
			if (port.getAttribute(FOLLOW_OWNED_ATTR) === null) port.setAttribute(FOLLOW_OWNED_ATTR, "active");
			if (ledger !== void 0 && traceActive() && Math.abs(port.scrollTop - ledger) > 1) followTrace("external-scroll", {
				from: Math.round(port.scrollTop),
				to: Math.round(nextTop),
				ledger: Math.round(ledger)
			});
			if (Math.abs(port.scrollTop - nextTop) > .01) port.scrollTop = nextTop;
			followScrollLedgers.set(port, port.scrollTop);
			const ownedTop = String(port.scrollTop);
			if (port.getAttribute(FOLLOW_OWNED_ATTR) !== ownedTop) port.setAttribute(FOLLOW_OWNED_ATTR, ownedTop);
		}
		/**
		* Last scrollTop this engine wrote or accepted, per port. Reader intent is a
		* real upward delta from this ledger; a key press or touch while pinned
		* (typing in the composer) must not release the pin, because a released pin
		* can never re-acquire while content streams away from the reader position.
		*/
		const followScrollLedgers = /* @__PURE__ */ new WeakMap();
		const followActivityAt = /* @__PURE__ */ new WeakMap();
		/**
		* Scroll ownership must survive follower-arm remounts. Per-closure state let a
		* new text/tool arm reset the strike counter, so the same host write kept
		* triggering another engine write and repainting the visible up/down fight.
		*/
		const followHostScrollPorts = /* @__PURE__ */ new WeakMap();
		/** Clear host ownership only when a new user turn actually starts. */
		function resetHostScrollOwnershipForNewTurn(port) {
			const ownership = followHostScrollPorts.get(port);
			if (ownership === void 0) return;
			const userRows = countUserRows(port);
			if (userRows >= 0 && userRows > ownership.userRows) followHostScrollPorts.delete(port);
		}
		/** Whether this port was owned recently enough to identify a closing tail row. */
		function hasRecentConversationFollow(port, windowMs = 250) {
			const last = followActivityAt.get(port);
			return last !== void 0 && performance.now() - last <= windowMs;
		}
		function readerScrolledUp(port) {
			const floor = Math.max(0, port.scrollHeight - port.clientHeight);
			const previousTop = Math.min(followScrollLedgers.get(port) ?? 0, floor);
			return port.scrollTop < previousTop - 8;
		}
		/**
		* Paint a bounded visual lag and return the effective logical extent.
		*
		* This is the final geometry invariant, not merely an animation preference:
		* any lag beyond the real gap to status/composer chrome is caught up in the
		* same frame. Carrying that excess in `scrollTop` would move the transcript
		* toward fixed chrome and also make the host expose jump-to-bottom.
		*/
		function applyVisual(port, animatedH, reservePx, velocityPxPerSec = 0, runwayPx = 72, shiftCeilingPx = Number.POSITIVE_INFINITY, promoteAtRest = false, trajectoryShiftPx, dtMs = 16.7, writeScrollTop = true) {
			const surfaces = shiftSurfacesOf(port);
			ensureFlowFillsPort(port);
			{
				const preFloor = Math.max(0, port.scrollHeight - port.clientHeight);
				const lastFloorSeen = followFloorHistory.get(port);
				if (lastFloorSeen !== void 0 && lastFloorSeen === 0 && preFloor > 0 && followRunways.has(port)) {
					const owned = followRunways.get(port);
					restoreRunway(port);
					ensureRunway(port, surfaces, owned?.requestedPx ?? runwayPx);
					followSlackTransition.add(port);
				}
				if (preFloor !== lastFloorSeen) followFloorHistory.set(port, preFloor);
			}
			ensureRunway(port, surfaces, reservePx);
			const contentHeight2 = Math.max(0, port.scrollHeight);
			const runwayOffset2 = runwayOffsetOf(port);
			const prevOffset2 = followRunwayOffsetHistory.get(port);
			if (prevOffset2 !== void 0 && runwayOffset2 !== prevOffset2) animatedH = Math.max(0, animatedH - (runwayOffset2 - prevOffset2));
			followRunwayOffsetHistory.set(port, runwayOffset2);
			const contentHeight = contentHeight2;
			const runwayOffset = runwayOffset2;
			const targetHeight = Math.max(0, contentHeight - runwayOffset);
			const floor = Math.max(0, contentHeight - port.clientHeight);
			const extent = Math.min(targetHeight, Math.max(0, animatedH));
			if (port.style.overflowAnchor !== "none") port.style.overflowAnchor = "none";
			if (port.style.scrollBehavior !== "auto") port.style.scrollBehavior = "auto";
			if (floor <= 0) {
				followRunwayOffsetHistory.set(port, 0);
				if (writeScrollTop) setFollowScrollTop(port, 0);
				followMotionStates.set(port, {
					capacityPx: Number.POSITIVE_INFINITY,
					constrained: false,
					extent: targetHeight,
					lagPx: 0,
					reservePx: 0,
					velocityPxPerSec: 0
				});
				for (const surface of surfaces) setShift(surface, 0);
				followLastShiftPx.set(port, 0);
				const status = turnStatusOf(port);
				if (status !== null) setShift(status, 0);
				return targetHeight;
			}
			const limit = safeShiftLimit(port, surfaces);
			followSlackTransition.delete(port);
			const visibleReserve = Math.min(runwayOffset, Math.max(0, reservePx));
			const baselineShift = runwayOffset - visibleReserve;
			const requestedLag = Math.max(0, targetHeight - extent);
			const availableShift = Math.min(Math.max(0, limit), Math.max(0, shiftCeilingPx));
			const motionShift = Math.min(trajectoryShiftPx ?? baselineShift + requestedLag, availableShift);
			let shift = Math.max(motionShift, promoteAtRest && motionShift <= .01 && availableShift > 0 ? .1 : 0);
			const previousShift = followLastShiftPx.get(port);
			const previousFloor = followLastFloorPx.get(port);
			const floorDropPx = Math.max(0, (previousFloor ?? floor) - floor);
			const maxDecayPx = Math.max(dtMs <= 0 ? 8 : Math.max(1, 8 / 16.67 * dtMs), floorDropPx);
			followLastFloorPx.set(port, floor);
			if (previousShift !== void 0 && shift < previousShift - maxDecayPx) shift = previousShift - maxDecayPx;
			if (followCompletionSettle.has(port) && previousShift !== void 0 && previousFloor !== void 0) {
				const confirmedGrowthPx = Math.max(0, floor - previousFloor);
				if (shift > previousShift + confirmedGrowthPx) shift = previousShift + confirmedGrowthPx;
			}
			followLastShiftPx.set(port, shift);
			const requestedShift = trajectoryShiftPx ?? baselineShift + requestedLag;
			const effectiveLag = Math.max(0, shift - baselineShift);
			const capacityPx = Math.max(0, limit - baselineShift);
			const effectiveExtent = targetHeight - effectiveLag;
			const isConstrained = requestedShift > availableShift + .25 || limit <= 0 && requestedShift > baselineShift;
			if (writeScrollTop) setFollowScrollTop(port, floor);
			followMotionStates.set(port, {
				capacityPx,
				constrained: isConstrained,
				extent: effectiveExtent,
				lagPx: effectiveLag,
				reservePx: visibleReserve,
				velocityPxPerSec
			});
			for (const surface of surfaces) setShift(surface, shift);
			const status = turnStatusOf(port);
			if (status !== null) setShift(status, 0);
			return effectiveExtent;
		}
		function clearMotion(port) {
			port.removeAttribute(FOLLOW_OWNED_ATTR);
			port.style.overflowAnchor = "";
			port.style.scrollBehavior = "";
			for (const surface of shiftSurfacesOf(port)) setShift(surface, 0);
			const status = turnStatusOf(port);
			if (status !== null) setShift(status, 0);
		}
		function clearVisual(port) {
			clearMotion(port);
			restoreRunway(port);
			followMotionStates.delete(port);
			followLastShiftPx.delete(port);
			followLastFloorPx.delete(port);
			invalidatePaintLimit(port);
		}
		/** Keep an already-promoted surface at zero until one stable final paint lands. */
		function holdCompositorAtRest(element) {
			element.style.transform = "translate3d(0, 0px, 0)";
			element.style.willChange = "transform";
			element.style.clipPath = "";
		}
		/** Remove equal offsets, land on the floor, then retire the compositor quietly. */
		function finishAtNaturalFloor(port, retainCompositor = true, writeScrollTop = true) {
			followCompletionSettle.delete(port);
			followTraceUntilMs = Math.max(followTraceUntilMs, performance.now() + 1e4);
			followTrace("finish-enter", {
				sh: hostShOf(port),
				st: Math.round(port.scrollTop),
				pad: Math.round(flowPadOf(port)),
				retain: retainCompositor
			});
			const surfaces = shiftSurfacesOf(port);
			const status = turnStatusOf(port);
			if (!retainCompositor) {
				restoreRunway(port);
				if (writeScrollTop) settleAtFloor(port);
				clearMotion(port);
				followMotionStates.delete(port);
				return;
			}
			const promoted = [...surfaces, ...status === null ? [] : [status]].filter((element) => element.style.transform !== "" || element.style.willChange === "transform");
			const promotedSet = new Set(promoted);
			if (writeScrollTop) settleAtFloor(port);
			port.removeAttribute(FOLLOW_OWNED_ATTR);
			port.style.overflowAnchor = "";
			port.style.scrollBehavior = "";
			for (const surface of surfaces) if (promotedSet.has(surface)) holdCompositorAtRest(surface);
			else setShift(surface, 0);
			if (status !== null) {
				if (promotedSet.has(status)) holdCompositorAtRest(status);
				else setShift(status, 0);
			}
			followMotionStates.delete(port);
			if (promoted.length === 0) return;
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					for (const element of promoted) if (Math.abs(currentShiftOf(element)) <= .01) setShift(element, 0);
				});
			});
		}
		function settleAtFloor(port) {
			setFollowScrollTop(port, Math.max(0, port.scrollHeight - port.clientHeight));
			followReaderHolds.delete(port);
		}
		/** Only the newest active follower may write one port's shared visual state. */
		const followLeaders = /* @__PURE__ */ new WeakMap();
		let followGeneration = 0;
		/** Ports with a live streaming arm; completion guards must not fight them. */
		const followActivePorts = /* @__PURE__ */ new WeakSet();
		/**
		* Own the conversation scrollport's bottom-follow while `active` is true.
		*
		* @param rootRef - An element inside the conversation scrollport.
		* @param active - True while the reply is still revealing.
		* @param speedCpsRef - Live reveal-rate EMA from the smoother.
		* @param revealScaleRef - Optional backpressure control for text reveal.
		* @param predictive - Whether to reserve paint room ahead of growth.
		* @param entrance - Whether the first committed row height should glide in.
		* @param onEntranceSettled - Releases a one-shot entrance owner after catch-up.
		* @param predictiveRef - Optional live visibility gate for predictive runway.
		* @param entranceExtentRef - Optional measured growth delta for a generic row.
		* @param revealedCharsRef - Committed code-point count for feed-forward phase.
		* @param controlScroll - When false, leave the scrollport entirely to the Host.
		*/

		const followSessionOwners = new WeakMap();
		const followSessionActivations = new WeakMap();
		const followSessionLifetimes = new WeakMap();
		const followSessionEntryRows = new WeakSet();
		function followSessionOf(element) {
			return element?.closest("[data-conversation-session]")?.getAttribute("data-conversation-session") ?? null;
		}
		function releaseFollowSession(port, lifetime) {
			if (lifetime?.released) return;
			if (lifetime !== void 0) {
				lifetime.released = true;
				lifetime.observer?.disconnect();
			}
			if (lifetime !== void 0 && followSessionLifetimes.get(port) !== lifetime) return;
			if (followSessionOwners.has(port)) {
				followLeaders.get(port)?.cancel?.();
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
			}
			followSessionOwners.delete(port);
			followSessionLifetimes.delete(port);
			followSessionActivations.delete(port);
		}
		function followSessionLifetimeChanged(port, lifetime, changes = lifetime.observer?.takeRecords() ?? []) {
			if (lifetime.released || port.isConnected === false || port.closest("[data-conversation-session]") !== lifetime.element || followSessionOf(port) !== lifetime.session) return true;
			// Queued records also catch A→B→A and detach→reattach within one task.
			return changes.some((change) => change.type === "attributes"
				? change.oldValue !== lifetime.session
				: [...change.removedNodes].some((node) => node === lifetime.element || node.contains?.(lifetime.element)));
		}
		function currentFollowSessionLifetime(port) {
			const lifetime = followSessionLifetimes.get(port);
			if (lifetime !== void 0 && followSessionLifetimeChanged(port, lifetime)) {
				releaseFollowSession(port, lifetime);
				return void 0;
			}
			return lifetime;
		}
		function isFollowSessionEntryRow(root) {
			const row = root?.closest("[data-chat-flow-key]");
			if (!row) return false;
			if (followSessionEntryRows.has(row)) return true;
			const port = root.closest("[data-conversation-scroll]");
			const key = row.getAttribute("data-chat-node-key") ?? row.getAttribute("data-chat-flow-key");
			return port !== null && key !== null && currentFollowSessionLifetime(port)?.entryKeys.has(key) === true;
		}
		function isolateFollowSession(port, root) {
			const session = followSessionOf(root);
			currentFollowSessionLifetime(port);
			const previous = followSessionOwners.get(port);
			if (previous === session) return;
			if (previous !== void 0) releaseFollowSession(port, followSessionLifetimes.get(port));
			const element = root.closest("[data-conversation-session]");
			const lifetime = { session, element, entryKeys: new Set(), released: false, observer: null };
			// Initial committed rows are restored history, even if their Turn remains open.
			for (const row of port.querySelectorAll?.("[data-chat-flow-key]") ?? []) {
				followSessionEntryRows.add(row);
				const key = row.getAttribute("data-chat-node-key") ?? row.getAttribute("data-chat-flow-key");
				if (key !== null) lifetime.entryKeys.add(key);
			}
			followSessionLifetimes.set(port, lifetime);
			if (typeof MutationObserver !== "undefined" && element !== null) {
				lifetime.observer = new MutationObserver((changes) => {
					if (followSessionLifetimeChanged(port, lifetime, changes)) releaseFollowSession(port, lifetime);
				});
				lifetime.observer.observe(element, { attributes: true, attributeFilter: ["data-conversation-session"], attributeOldValue: true });
				// A route can detach and reconnect the same container without changing its
				// id. Child-list delivery preserves that invalidation even in one task.
				if (typeof document !== "undefined" && document.documentElement) lifetime.observer.observe(document.documentElement, { childList: true, subtree: true });
			}
			const activation = {};
			followSessionActivations.set(port, activation);
			queueMicrotask(() => {
				if (followSessionActivations.get(port) === activation) followSessionActivations.delete(port);
			});
			followSessionOwners.set(port, session);
		}

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
					if (endTimer === null) endTimer = setTimeout(() => { stop(); if (isLeader()) finish(); }, 180);
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
		function useConversationFollow(rootRef, active, speedCpsRef, revealScaleRef, predictive = true, entrance = false, onEntranceSettled, predictiveRef, entranceExtentRef, revealedCharsRef, controlScroll = true) {
			const activeRef = (0, react.useRef)(active);
			const entranceRef = (0, react.useRef)(entrance);
			const onEntranceSettledRef = (0, react.useRef)(onEntranceSettled);
			entranceRef.current = entrance;
			onEntranceSettledRef.current = onEntranceSettled;
			activeRef.current = active;
			const controlScrollRef = (0, react.useRef)(controlScroll);
			controlScrollRef.current = controlScroll;
			(0, react.useLayoutEffect)(() => {
				/* dsh-stream-think：controlScroll 只表示「跟随动画」。跟随始终由本插件执行，
				 * 关闭时帧循环走瞬时落底分支（client/instant-follow-mode），不再把滚动交回宿主。 */
				if (!active) return;
				const startedAsEntrance = entrance;
				const owner = {};
				const generation = ++followGeneration;
				let rafId = 0;
				let last = performance.now();
				let following = true;
				let primed = false;
				let waitingForContentGrowth = false;
				let resumedContentHeight = 0;
				let animatedH = 0;
				let reservePx = 0;
				let velocityPxPerSec = 0;
				let interacting = false;
				let readerGestureIntent = false;
				let readerReleased = false;
				let touchStartY = null;
				let interactTimer = null;
				let port = null;
				let boundSession = null;
				let boundLifetime = null;
				let stopHandoff = null;
				let settleRafId = 0;
				const isOriginalSession = (element) => (boundLifetime === null || currentFollowSessionLifetime(element) === boundLifetime) && element.isConnected !== false && (boundSession === null || followSessionOf(element) === boundSession);
				let resize = null;
				let mutations = null;
				let observedTail = null;
				let statusWasPresent = null;
				let lastStatusHeightPx = 0;
				let trajectoryPositionPx = null;
				let trajectoryVelocityPxPerMs = 0;
				let trajectoryTargetVelocityPxPerMs = 0;
				let trajectoryFloorPx = null;
				let trajectoryGrowthAtMs = null;
				let trajectoryAccumulatedGrowthPx = 0;
				let trajectoryAccumulatedGrowthMs = 0;
				let trajectoryGrowthSamples = 0;
				let trajectoryWasActive = false;
				const revealPhase = new FollowRevealPhaseTracker();
				let holding = null;
				let entrancePending = entranceRef.current;
				const finishEntrance = () => {
					if (!entrancePending) return;
					entrancePending = false;
					onEntranceSettledRef.current?.();
				};
				const updateRevealScale = (next, elapsedMs, urgent = false) => {
					if (revealScaleRef === void 0) return;
					const tuning = debugRuntime.activeTuning();
					const state = followMotionStates.get(next);
					const target = state === void 0 ? 1 : computeFollowRevealScale(state.lagPx, state.capacityPx, state.constrained, tuning);
					const current = Math.min(1, Math.max(tuning.backpressureMinScale, revealScaleRef.current));
					if (target < current || urgent) {
						revealScaleRef.current = Math.min(current, target);
						return;
					}
					const releaseStep = 1 - Math.exp(-Math.max(0, elapsedMs) / 240);
					revealScaleRef.current = current + (target - current) * releaseStep;
				};
				const releaseRevealScale = () => {
					if (revealScaleRef !== void 0) revealScaleRef.current = 1;
				};
				const reportFollow = (next, isActive) => {
					const state = followMotionStates.get(next);
					debugRuntime.reportFollow(next, {
						lagPx: state ? state.lagPx : -1,
						velocityPxPerSec: state?.velocityPxPerSec ?? 0,
						reservePx: state?.reservePx ?? 0,
						capacityPx: state ? state.capacityPx : -1,
						revealScale: revealScaleRef?.current ?? 1,
						following,
						constrained: state?.constrained ?? false,
						scrollTop: next.scrollTop,
						scrollHeight: next.scrollHeight,
						clientHeight: next.clientHeight,
						active: isActive
					});
				};
				const isLeader = (next) => isOriginalSession(next) && followLeaders.get(next)?.owner === owner;
				const hold = (next) => {
					followActivityAt.set(next, performance.now());
					if (holding === next && isLeader(next)) return;
					holding = next;
					const leader = followLeaders.get(next);
					if ((leader === void 0 || generation > leader.generation) && !completionSettleGuardsPort(next)) {
						followCompletionSettle.delete(next);
						followLeaders.set(next, {
							generation,
							owner,
							cancel: () => stopSessionWork()
						});
					}
				};
				const yieldScrollOwnership = (next, floor) => {
					if (hostOwnsScroll) return;
					hostOwnsScroll = true;
					followHostScrollPorts.set(next, { userRows: countUserRows(next) });
					followTrace("yield-scroll", {
						from: Math.round(next.scrollTop),
						to: Math.round(floor)
					});
					clearVisual(next);
					setFollowScrollTop(next, Math.max(0, next.scrollHeight - next.clientHeight));
					next.removeAttribute(FOLLOW_OWNED_ATTR);
					followLeaders.delete(next);
					releaseRevealScale();
					debugRuntime.reportFollow(next, null);
				};
				const detectHostScroll = (next, floor) => {
					if (followHostScrollPorts.has(next)) {
						hostOwnsScroll = true;
						return;
					}
					const ledger = followScrollLedgers.get(next);
					if (ledger === void 0 || Math.abs(next.scrollTop - ledger) <= 1) return;
					if (Math.abs(next.scrollTop - floor) <= 1) {
						followScrollLedgers.set(next, next.scrollTop);
						externalScrollStrikes = 0;
						return;
					}
					externalScrollStrikes += 1;
					if (externalScrollStrikes >= 2) yieldScrollOwnership(next, floor);
				};
				const drop = (next) => {
					if (holding === next) holding = null;
					if (isLeader(next)) {
						clearMotion(next);
						followMotionStates.delete(next);
						releaseRevealScale();
						debugRuntime.reportFollow(next, null);
					}
				};
				const handBackVisual = (next) => {
					const shift = currentShiftOf(shiftSurfacesOf(next).at(-1) ?? next);
					const transferableShift = shift > .25 ? shift : 0;
					const visualTop = Math.max(0, next.scrollTop - transferableShift);
					clearMotion(next);
					restoreRunway(next);
					const floor = Math.max(0, next.scrollHeight - next.clientHeight);
					next.scrollTop = Math.min(visualTop, Math.max(0, floor - 26));
					followScrollLedgers.set(next, next.scrollTop);
				};
				const markGesture = (event) => {
					interacting = true;
					if (event.type === "wheel") {
						const deltaY = event.deltaY;
						if (Number.isFinite(deltaY) && deltaY < 0) readerGestureIntent = true;
					} else if (event.type === "touchstart") touchStartY = event.touches[0]?.clientY ?? null;
					else if (event.type === "touchmove") {
						const touch = event.touches[0];
						if (touch !== void 0) {
							if (touchStartY === null) touchStartY = touch.clientY;
							if (touch.clientY - touchStartY > 1) readerGestureIntent = true;
						}
					} else if (event.type === "touchend" || event.type === "touchcancel") touchStartY = null;
					if (interactTimer !== null) clearTimeout(interactTimer);
					interactTimer = setTimeout(() => {
						interacting = false;
						readerGestureIntent = false;
						interactTimer = null;
					}, 800);
				};
				/**
				* Last observed scroll extent, shared by the pre-paint correction and the
				* settle loop so a host layout shrink is re-opened exactly once no matter
				* which observer sees it first. `-1` until the first owned observation.
				*/
				let settleRetiring = false;
				let hostOwnsScroll = false;
				let externalScrollStrikes = 0;
				Number.NEGATIVE_INFINITY;
				let handedOff = false;
				/**
				* Bring the reading surface back down toward its held position after an
				* upward host push (clamp jump, live→settled swap): spend persistent pad
				* first — lowering the floor lets the pin carry the text back down —
				* then raise the compositor shift for whatever pad cannot cover, and
				* rebase the spring extent so the raise survives the next applyVisual
				* (which otherwise recomputes the shift from lag and undoes it).
				*/
				const pullReadingAnchorBack = (host, measured, trace = false) => {
					holdGuardAnchor(host, measured, measured.top);
				};
				/**
				* THE screen-space anchor hold, shared by every entry point: the
				* structural-observer path (pre-paint cascade correction), the settle
				* loop's per-frame poll, and the ACTIVE loop's per-frame poll. The
				* shift-excluded delta filters the engine's own motion (reveal glide,
				* wrap lockstep) to ~0, so a live poll may compensate safely — which is
				* what saves the completion swap: the settled-side arm primes in its
				* layout effect and steals leadership IN the cascade frame, its own
				* observers miss the mutations (armed after the fact), and only this
				* poll sees the jump while it can still be corrected before paint.
				* Returns the measured delta (null when nothing was comparable).
				*/
				const enforceReadingAnchor = (host, trace = false) => {
					const measured = measureReadingAnchor(host);
					if (measured === null) return null;
					if (measured.delta > .5) {
						if (trace) followTrace("anchor-hold", {
							screenDelta: Math.round(measured.delta),
							st: Math.round(host.scrollTop)
						});
						if (pruneDeadRunway(host)) reservePx = 0;
						holdGuardAnchor(host, measured, measured.top);
					} else if (measured.delta < -.5) {
						if (pruneDeadRunway(host)) reservePx = 0;
						pullReadingAnchorBack(host, measured, trace);
					} else holdGuardAnchor(host, measured, measured.top);
					return measured.delta;
				};
				/** Pre-paint correction (observers, commit subscription). */
				const restoreBeforePaint = () => {
					if (!following || port === null || !isOriginalSession(port)) return;
					if (interacting && (readerGestureIntent || readerScrolledUp(port))) return; // 原生先处理读者滚动，下一帧交还跟随。
					if (hostOwnsScroll || followHostScrollPorts.has(port)) {
						hostOwnsScroll = true;
						followScrollLedgers.set(port, port.scrollTop);
						return;
					}
					if (!activeRef.current) detectHostScroll(port, Math.max(0, port.scrollHeight - port.clientHeight));
					const leaderless = !isLeader(port);
					if (!activeRef.current && followActivePorts.has(port)) return;
					if (leaderless && (followLeaders.has(port) || !handedOff)) return;
					if (leaderless) {
						const sharedMotion = followMotionStates.get(port);
						if (sharedMotion !== void 0) {
							animatedH = Math.min(port.scrollHeight, Math.max(0, sharedMotion.extent));
							reservePx = sharedMotion.reservePx;
							velocityPxPerSec = sharedMotion.velocityPxPerSec;
						}
					}
					pruneDeadRunway(port);
					if (!settleRetiring) {
						const measured = measureReadingAnchor(port);
						if (measured !== null && measured.delta > .5) {
							if (pruneDeadRunway(port)) reservePx = 0;
							holdGuardAnchor(port, measured, measured.top);
						} else if (measured !== null && measured.delta < -.5) {
							if (pruneDeadRunway(port)) reservePx = 0;
							if (!activeRef.current) pullReadingAnchorBack(port, measured);
							else {
								const released = Math.min(flowPadOf(port), -measured.delta);
								if (released > .25) {
									setFlowPad(port, flowPadOf(port) - released);
									animatedH = Math.max(0, animatedH - released);
								}
								holdGuardAnchor(port, measured, measured.top + released);
							}
						} else if (measured !== null) holdGuardAnchor(port, measured, measured.top);
					}
					const tuning = debugRuntime.activeTuning();
					const predictGrowth = predictiveRef?.current ?? predictive;
					const floor = Math.max(0, port.scrollHeight - port.clientHeight);
					if (followFloorHistory.get(port) !== floor) invalidatePaintLimit(port);
					const isReasoningSurface = rootRef.current?.querySelector("[data-variant=\"think\"]") !== null;
					const trajectoryShift = predictive && !isReasoningSurface && runwayOffsetOf(port) > 0 && trajectoryPositionPx !== null ? floor - trajectoryPositionPx : void 0;
					animatedH = applyVisual(port, animatedH, reservePx, velocityPxPerSec, tuning.runwayPx, activeRef.current ? Number.POSITIVE_INFINITY : followLastShiftPx.get(port) ?? Number.POSITIVE_INFINITY, !predictGrowth, trajectoryShift, 0, activeRef.current && !hostOwnsScroll);
					if (trajectoryShift !== void 0) trajectoryPositionPx = floor - (followLastShiftPx.get(port) ?? floor - (trajectoryPositionPx ?? floor));
					updateRevealScale(port, 0, true);
					reportFollow(port, activeRef.current);
				};
				let unsubscribeCommit = null;
				const bindPort = (next) => {
					if (port === next) return;
					if (port !== null) {
						for (const name of GESTURE_EVENTS) port.removeEventListener(name, markGesture);
						resize?.disconnect();
						mutations?.disconnect();
					}
					unsubscribeCommit?.();
					port = next;
					invalidatePaintLimit(port);
					unsubscribeCommit = subscribeFollowCommit(port, () => {
						restoreBeforePaint();
					});
					for (const name of GESTURE_EVENTS) port.addEventListener(name, markGesture, { passive: true });
					if (typeof ResizeObserver !== "undefined") {
						resize = new ResizeObserver(() => restoreBeforePaint());
						resize.observe(port);
						const composer = port.querySelector("[data-composer-seat]");
						if (composer !== null) resize.observe(composer);
						const proxy = resizeProxyOf(port);
						if (proxy !== null) resize.observe(proxy);
					}
					if (typeof MutationObserver !== "undefined") {
						const flow = flowElementOf(port);
						if (flow !== null) {
							mutations = new MutationObserver(() => {
								restoreBeforePaint();
							});
							mutations.observe(flow, {
								childList: true,
								subtree: true
							});
						}
					}
				};
				/**
				* Keep the observer on the flow's TAIL surface. A flow locked to the
				* viewport by min-height does not resize when content grows inside it —
				* only the last message row does, and missing that resize means missing
				* the pre-paint correction for that frame's wrap.
				*/
				const observeTailSurface = () => {
					if (resize === null || port === null) return;
					const tail = shiftSurfacesOf(port).at(-1) ?? null;
					if (tail === observedTail) return;
					if (observedTail !== null) resize.unobserve(observedTail);
					observedTail = tail;
					if (tail !== null) resize.observe(tail);
				};
				const stopSessionWork = () => {
					cancelAnimationFrame(rafId);
					cancelAnimationFrame(settleRafId);
					stopHandoff?.();
					stopHandoff = null;
					unsubscribeCommit?.();
					resize?.disconnect();
					mutations?.disconnect();
					if (port !== null) for (const name of GESTURE_EVENTS) port.removeEventListener(name, markGesture);
					if (interactTimer !== null) clearTimeout(interactTimer);
					interactTimer = null;
					releaseRevealScale();
				};
				const frame = (now) => {
					rafId = requestAnimationFrame(frame);
					const elapsedMs = Math.max(.001, now - last);
					const dt = Math.min(32, elapsedMs);
					const tuning = debugRuntime.activeTuning();
					last = now;
					const root = rootRef.current;
					if (root === null) return;
					const nextPort = root.closest("[data-conversation-scroll]");
					if (nextPort === null) return;
					const currentSession = followSessionOf(root);
					if (currentSession === null) return;
					if (!isOriginalSession(nextPort)) { stopSessionWork(); return; }
					if (boundSession === null) boundSession = currentSession;
					isolateFollowSession(nextPort, root);
					boundLifetime ??= currentFollowSessionLifetime(nextPort);
					if (entrancePending && isFollowSessionEntryRow(root)) finishEntrance();
					if (followSessionActivations.has(nextPort)) return; // 等宿主恢复该会话的阅读位置后再接管。
					bindPort(nextPort);
					observeTailSurface();
					resetHostScrollOwnershipForNewTurn(nextPort);
					hostOwnsScroll = followHostScrollPorts.has(nextPort);
					if (activeRef.current) followActivePorts.add(nextPort);
					else followActivePorts.delete(nextPort);
					if (nextPort.clientHeight <= 0) return;
					const floor = Math.max(0, nextPort.scrollHeight - nextPort.clientHeight);
					const reportedLag = floor - nextPort.scrollTop;
					const extent = Math.min(nextPort.scrollHeight, Math.max(0, nextPort.scrollHeight - reportedLag));
					if (!primed) {
						if (completionSettleGuardsPort(nextPort)) {
							primed = true;
							following = false;
							return;
						}
						const inherited = nextPort.hasAttribute(FOLLOW_OWNED_ATTR) ? followMotionStates.get(nextPort) : void 0;
						if (inherited === void 0) {
							const entranceExtent = entrancePending ? entranceExtentRef?.current ?? entranceExtentOf(root) : 0;
							const predictGrowth = predictiveRef?.current ?? predictive;
							animatedH = entrancePending ? Math.max(0, nextPort.scrollHeight - entranceExtent) : nextPort.scrollHeight;
							const hasStatus = turnStatusOf(nextPort) !== null;
							waitingForContentGrowth = !entrancePending;
							reservePx = controlScrollRef.current ? Math.max(ownedBottomSpaceOf(nextPort), !waitingForContentGrowth && predictGrowth && (hasStatus || speedCpsRef.current > 90) ? computeFollowReserve(speedCpsRef.current, tuning.runwayPx) : 0) : 0;
							if (!completionSettleGuardsPort(nextPort)) setFlowPad(nextPort, 0);
							statusWasPresent = hasStatus;
							velocityPxPerSec = 0;
							following = (root.closest("[data-chat-following-tail]") !== null || reportedLag <= 1) && !readerScrolledUp(nextPort) && !followReaderHolds.has(nextPort);
							readerReleased = !following;
						} else {
							animatedH = Math.min(nextPort.scrollHeight, inherited.extent);
							reservePx = inherited.reservePx;
							velocityPxPerSec = inherited.velocityPxPerSec;
							following = true;
						}
						if (following) {
							hold(nextPort);
							if (isLeader(nextPort)) {
								animatedH = applyVisual(nextPort, animatedH, reservePx, velocityPxPerSec, tuning.runwayPx, Number.POSITIVE_INFINITY, !(predictiveRef?.current ?? predictive), void 0, 0, !hostOwnsScroll);
								if (predictive && root.querySelector("[data-variant=\"think\"]") === null && runwayOffsetOf(nextPort) > 0) {
									const floor = Math.max(0, nextPort.scrollHeight - nextPort.clientHeight);
									const requestedMinLagPx = Math.max(20, runwayOffsetOf(nextPort) - 32);
									const paintMaxLagPx = Math.max(0, safeShiftLimit(nextPort, shiftSurfacesOf(nextPort)) - 1);
									const minLagPx = Math.min(requestedMinLagPx, paintMaxLagPx);
									const currentShift = currentShiftOf(shiftSurfacesOf(nextPort).at(-1) ?? nextPort);
									trajectoryPositionPx = floor - Math.min(paintMaxLagPx, Math.max(minLagPx, currentShift));
									trajectoryTargetVelocityPxPerMs = Math.max(0, speedCpsRef.current) * .4 / 1e3;
									trajectoryVelocityPxPerMs = trajectoryTargetVelocityPxPerMs;
									trajectoryFloorPx = floor;
									trajectoryGrowthAtMs = now;
									trajectoryAccumulatedGrowthPx = 0;
									trajectoryAccumulatedGrowthMs = 0;
									trajectoryGrowthSamples = 0;
									trajectoryWasActive = true;
								}
								updateRevealScale(nextPort, elapsedMs);
								reportFollow(nextPort, activeRef.current);
								const runwayOffset = runwayOffsetOf(nextPort);
								if (Math.max(0, nextPort.scrollHeight - animatedH - runwayOffset) <= .25) finishEntrance();
							} else finishEntrance();
						} else finishEntrance();
						resumedContentHeight = Math.max(0, nextPort.scrollHeight - runwayOffsetOf(nextPort));
						primed = true;
						return;
					}
					if (!following && (!interacting || readerReleased && !readerGestureIntent && reportedLag <= 1) && reportedLag <= (readerReleased ? 1 : 48)) {
						following = true;
						readerReleased = false;
						followReaderHolds.delete(nextPort);
						animatedH = extent;
						reservePx = 0;
						velocityPxPerSec = 0;
						followScrollLedgers.set(nextPort, nextPort.scrollTop);
						hold(nextPort);
					} else if (following && interacting && (readerGestureIntent || readerScrolledUp(nextPort))) {
						following = false;
						readerGestureIntent = false;
						readerReleased = true;
						followReaderHolds.set(nextPort, { atMs: performance.now() });
						handBackVisual(nextPort);
						animatedH = nextPort.scrollHeight;
						reservePx = 0;
						velocityPxPerSec = 0;
						drop(nextPort);
						finishEntrance();
					}
					if (!activeRef.current || !following) {
						followScrollLedgers.set(nextPort, nextPort.scrollTop);
						reportFollow(nextPort, activeRef.current);
						return;
					}
					detectHostScroll(nextPort, floor);
					if (hostOwnsScroll) {
						followScrollLedgers.set(nextPort, nextPort.scrollTop);
						reportFollow(nextPort, false);
						return;
					}
					hold(nextPort);
					if (!isLeader(nextPort)) {
						finishEntrance();
						return;
					}
					if (waitingForContentGrowth) {
						const naturalHeight = Math.max(0, nextPort.scrollHeight - runwayOffsetOf(nextPort));
						if (naturalHeight <= resumedContentHeight + .5) {
							resumedContentHeight = naturalHeight;
							animatedH = naturalHeight;
							setFollowScrollTop(nextPort, floor);
							reportFollow(nextPort, true);
							return;
						}
						waitingForContentGrowth = false;
					}
					const predictGrowth = predictiveRef?.current ?? predictive;
					const statusElement = turnStatusOf(nextPort);
					const hasStatus = statusElement !== null;
					if (statusElement !== null) lastStatusHeightPx = statusElement.offsetHeight;
					const statusJustRemoved = predictGrowth && statusWasPresent === true && !hasStatus;
					if (statusJustRemoved) reservePx = Math.max(reservePx, tuning.runwayPx) + lastStatusHeightPx;
					statusWasPresent = hasStatus;
					const reserveEnabled = hasStatus || statusJustRemoved || reservePx > .25 || speedCpsRef.current > 90;
					const pressureReserveTarget = predictGrowth && reserveEnabled ? computeFollowReserve(speedCpsRef.current, tuning.runwayPx) : 0;
					const effectiveReserveTarget = Math.max(reservePx, pressureReserveTarget);
					const reserveStep = 1 - Math.exp(-elapsedMs / tuning.reserveResponseMs);
					reservePx += (effectiveReserveTarget - reservePx) * reserveStep;
					if (predictGrowth || runwayOffsetOf(nextPort) > .5) ensureRunway(nextPort, shiftSurfacesOf(nextPort), reservePx);
					const runwayOffset = runwayOffsetOf(nextPort);
					const contentHeight = nextPort.scrollHeight;
					const floorNow = Math.max(0, contentHeight - nextPort.clientHeight);
					const trajectoryActive = predictive && root.querySelector("[data-variant=\"think\"]") === null && runwayOffset > 0;
					let trajectoryShift;
					if (trajectoryActive) {
						const requestedMinLagPx = Math.max(20, runwayOffset - 32);
						const paintLimit = safeShiftLimit(nextPort, shiftSurfacesOf(nextPort));
						const maxLagPx = Math.max(0, paintLimit - 1);
						const minLagPx = Math.min(requestedMinLagPx, maxLagPx);
						if (trajectoryPositionPx === null || trajectoryFloorPx === null) {
							const currentShift = currentShiftOf(shiftSurfacesOf(nextPort).at(-1) ?? nextPort);
							trajectoryPositionPx = floorNow - Math.min(maxLagPx, Math.max(minLagPx, currentShift));
							trajectoryTargetVelocityPxPerMs = Math.max(0, speedCpsRef.current) * .4 / 1e3;
							trajectoryVelocityPxPerMs = trajectoryTargetVelocityPxPerMs;
							trajectoryGrowthAtMs = now;
						} else if (floorNow > trajectoryFloorPx + .5) {
							const intervalMs = Math.max(1, now - (trajectoryGrowthAtMs ?? now));
							if (trajectoryGrowthSamples > 0) {
								trajectoryAccumulatedGrowthPx += floorNow - trajectoryFloorPx;
								trajectoryAccumulatedGrowthMs += intervalMs;
								const measuredVelocity = trajectoryAccumulatedGrowthPx / trajectoryAccumulatedGrowthMs;
								const targetBlend = 1 - Math.exp(-intervalMs / 240);
								trajectoryTargetVelocityPxPerMs += (measuredVelocity - trajectoryTargetVelocityPxPerMs) * targetBlend;
							}
							trajectoryGrowthSamples += 1;
							trajectoryGrowthAtMs = now;
						} else if (floorNow < trajectoryFloorPx - .5) {
							trajectoryPositionPx = floorNow - minLagPx;
							trajectoryGrowthAtMs = now;
							trajectoryAccumulatedGrowthPx = 0;
							trajectoryAccumulatedGrowthMs = 0;
							trajectoryGrowthSamples = 0;
						}
						trajectoryFloorPx = floorNow;
						const phaseTarget = revealedCharsRef === void 0 ? floorNow : revealPhase.advance(floorNow, revealedCharsRef.current).targetPx;
						const trajectoryStep = computeFollowTrajectoryStep(elapsedMs, {
							positionPx: trajectoryPositionPx,
							velocityPxPerMs: trajectoryVelocityPxPerMs,
							targetPx: phaseTarget,
							targetVelocityPxPerMs: trajectoryTargetVelocityPxPerMs,
							minLagPx,
							maxLagPx,
							paintFloorPx: floorNow
						});
						trajectoryPositionPx = trajectoryStep.positionPx;
						trajectoryVelocityPxPerMs = trajectoryStep.velocityPxPerMs;
						trajectoryShift = trajectoryStep.shiftPx;
						trajectoryWasActive = true;
						const baselineShift = runwayOffset - Math.min(runwayOffset, Math.max(0, reservePx));
						animatedH = contentHeight - runwayOffset - Math.max(0, trajectoryShift - baselineShift);
						velocityPxPerSec = trajectoryVelocityPxPerMs * 1e3;
					} else {
						if (trajectoryWasActive) {
							const currentShift = currentShiftOf(shiftSurfacesOf(nextPort).at(-1) ?? nextPort);
							animatedH = contentHeight - runwayOffset - Math.max(0, currentShift);
							velocityPxPerSec = trajectoryVelocityPxPerMs * 1e3;
							trajectoryPositionPx = null;
							trajectoryWasActive = false;
						}
						const lag = Math.max(0, contentHeight - animatedH - runwayOffset);
						if (!controlScrollRef.current) {
							/* 动画关闭：不按速度追赶，直接落到当前底（瞬时跟随）。 */
							animatedH = contentHeight - runwayOffset;
							velocityPxPerSec = 0;
						} else {
							const step = computeFollowStep(dt, {
								lag,
								speedEma: speedCpsRef.current,
								velocityPxPerSec
							}, tuning);
							if (lag <= .1) {
								animatedH = contentHeight - runwayOffset;
								velocityPxPerSec = 0;
							} else {
								animatedH = Math.min(contentHeight - runwayOffset, animatedH + step.advancePx);
								velocityPxPerSec = step.velocityPxPerSec;
							}
						}
					}
					animatedH = applyVisual(nextPort, animatedH, reservePx, velocityPxPerSec, tuning.runwayPx, Number.POSITIVE_INFINITY, !predictGrowth, trajectoryShift, elapsedMs, !hostOwnsScroll);
					if (trajectoryActive) trajectoryPositionPx = floorNow - (followLastShiftPx.get(nextPort) ?? trajectoryShift ?? 0);
					updateRevealScale(nextPort, elapsedMs);
					reportFollow(nextPort, true);
					if (isLeader(nextPort)) {
						if (!activeRef.current) enforceReadingAnchor(nextPort);
						else measureReadingAnchor(nextPort);
					}
					if (Math.max(0, nextPort.scrollHeight - animatedH - runwayOffsetOf(nextPort)) <= .25) finishEntrance();
				};
				frame(performance.now());
				return () => {
					if (!controlScrollRef.current) {
						cancelAnimationFrame(rafId);
						if (port !== null) followActivePorts.delete(port);
						unsubscribeCommit?.();
						resize?.disconnect();
						mutations?.disconnect();
						if (port !== null) for (const name of GESTURE_EVENTS) port.removeEventListener(name, markGesture);
						if (interactTimer !== null) clearTimeout(interactTimer);
						const disabledHost = rootRef.current?.closest("[data-conversation-scroll]") ?? port;
						if (disabledHost !== null && !isOriginalSession(disabledHost)) stopSessionWork();
						else if (disabledHost !== null) {
							clearVisual(disabledHost);
							followLeaders.delete(disabledHost);
							debugRuntime.reportFollow(disabledHost, null);
						}
						releaseRevealScale();
						return;
					}
					cancelAnimationFrame(rafId);
					if (port !== null) followActivePorts.delete(port);
					unsubscribeCommit?.();
					if (interactTimer !== null) clearTimeout(interactTimer);
					resize?.disconnect();
					mutations?.disconnect();
					if (port !== null) for (const name of GESTURE_EVENTS) port.removeEventListener(name, markGesture);
					const host = rootRef.current?.closest("[data-conversation-scroll]") ?? port;
					if (host === null) return;
					holding = null;
					if (!isOriginalSession(host)) {
						stopSessionWork();
						return;
					}
					if (!isLeader(host)) return;
					const preserveReader = interacting && (readerGestureIntent || readerScrolledUp(host));
					if (!following || !primed) {
						if (!following && primed) followReaderHolds.set(host, { atMs: performance.now() });
						clearVisual(host);
						followLeaders.delete(host);
						releaseRevealScale();
						debugRuntime.reportFollow(host, null);
						return;
					}
					if (preserveReader) {
						handBackVisual(host);
						followReaderHolds.set(host, { atMs: performance.now() });
						clearVisual(host);
						followLeaders.delete(host);
						releaseRevealScale();
						debugRuntime.reportFollow(host, null);
						return;
					}
					let settleQuietMs = 0;
					let settleSig = "";
					if (!activeRef.current) {
						const finishInactive = () => {
							if (!isLeader(host)) return; // 下一行已接管，沿用同一份 motion state。
							if (!host.isConnected) { followLeaders.delete(host); releaseRevealScale(); return; }
							followTraceUntilMs = Math.max(followTraceUntilMs, performance.now() + 1e4);
							followTrace("fast-gate", {
								sh: host.scrollHeight,
								st: Math.round(host.scrollTop),
								pad: Math.round(flowPadOf(host))
							});
							restoreRunway(host);
							setFlowPad(host, 0);
							finishAtNaturalFloor(host, !startedAsEntrance, true);
							followLeaders.delete(host);
							followCompletionSettle.delete(host);
							releaseRevealScale();
							debugRuntime.reportFollow(host, null);
						};
						if (turnStatusOf(host) !== null) stopHandoff = waitForFollowHandoff(host, () => isLeader(host), () => true, finishInactive);
						else finishInactive();
						return;
					}
					const completionShift = currentShiftOf(shiftSurfacesOf(host).at(-1) ?? host);
					const completionShiftCeiling = startedAsEntrance && completionShift <= .25 ? Number.POSITIVE_INFINITY : completionShift;
					if (hostOwnsScroll) {
						clearVisual(host);
						setFollowScrollTop(host, Math.max(0, host.scrollHeight - host.clientHeight));
						host.removeAttribute(FOLLOW_OWNED_ATTR);
						followLeaders.delete(host);
						releaseRevealScale();
						debugRuntime.reportFollow(host, null);
						return;
					}
					followTraceUntilMs = performance.now() + 15e3;
					if (pruneDeadRunway(host)) {
						followTrace("cleanup-dead-margin", {
							sh: host.scrollHeight,
							st: Math.round(host.scrollTop),
							pad: Math.round(flowPadOf(host))
						});
						reservePx = 0;
					}
					const completionTuning = debugRuntime.activeTuning();
					const previousCompletionRunway = runwayOffsetOf(host);
					ensureRunway(host, shiftSurfacesOf(host), Math.max(reservePx, Math.max(0, completionTuning.runwayPx - flowPadOf(host))));
					const completionRunway = runwayOffsetOf(host);
					measureReadingAnchor(host);
					animatedH = Math.max(0, animatedH - (completionRunway - previousCompletionRunway));
					if (!hostOwnsScroll) settleAtFloor(host);
					animatedH = applyVisual(host, animatedH, reservePx, velocityPxPerSec, completionRunway, completionShiftCeiling, false, void 0, 0, !hostOwnsScroll);
					reportFollow(host, false);
					const runwayOffset = runwayOffsetOf(host);
					if (Math.max(0, host.scrollHeight - animatedH - runwayOffset) <= .25 && runwayOffset <= .25 && reservePx <= .25) {
						finishAtNaturalFloor(host, !startedAsEntrance, !hostOwnsScroll);
						followLeaders.delete(host);
						releaseRevealScale();
						debugRuntime.reportFollow(host, null);
						return;
					}
					for (const name of GESTURE_EVENTS) host.addEventListener(name, markGesture, { passive: true });
					const stopSettleListeners = () => {
						for (const name of GESTURE_EVENTS) host.removeEventListener(name, markGesture);
						resize?.disconnect();
						mutations?.disconnect();
						if (interactTimer !== null) {
							clearTimeout(interactTimer);
							interactTimer = null;
						}
					};
					if (typeof ResizeObserver !== "undefined") {
						resize = new ResizeObserver(() => restoreBeforePaint());
						resize.observe(host);
						const proxy = resizeProxyOf(host);
						if (proxy !== null) resize.observe(proxy);
					}
					if (typeof MutationObserver !== "undefined") {
						const flow = flowElementOf(host);
						if (flow !== null) {
							mutations = new MutationObserver(() => {
								restoreBeforePaint();
							});
							mutations.observe(flow, {
								childList: true,
								subtree: true
							});
						}
					}
					followCompletionSettle.add(host);
					followCompletionSettleRows.set(host, countUserRows(host));
					handedOff = true;
					let settleLast = performance.now();
					const settleFrame = (now) => {
						if (!isLeader(host)) {
							stopSettleListeners();
							return;
						}
						if (interacting && (readerGestureIntent || readerScrolledUp(host))) {
							readerGestureIntent = false;
							handBackVisual(host);
							clearVisual(host);
							followCompletionSettle.delete(host);
							followLeaders.delete(host);
							releaseRevealScale();
							debugRuntime.reportFollow(host, null);
							stopSettleListeners();
							return;
						}
						const dt = Math.min(32, Math.max(0, now - settleLast));
						const tuning = debugRuntime.activeTuning();
						settleLast = now;
						detectHostScroll(host, Math.max(0, host.scrollHeight - host.clientHeight));
						if (hostOwnsScroll) {
							clearVisual(host);
							setFollowScrollTop(host, Math.max(0, host.scrollHeight - host.clientHeight));
							host.removeAttribute(FOLLOW_OWNED_ATTR);
							followCompletionSettle.delete(host);
							followLeaders.delete(host);
							releaseRevealScale();
							debugRuntime.reportFollow(host, null);
							stopSettleListeners();
							return;
						}
						const guardDelta = !settleRetiring && !followActivePorts.has(host) ? enforceReadingAnchor(host, true) : null;
						settleQuietMs = !settleRetiring && (guardDelta === null || Math.abs(guardDelta) <= .5) ? settleQuietMs + dt : 0;
						const settleStatus = turnStatusOf(host);
						const ownedRunwayPx = runwayOffsetOf(host);
						if (ownedRunwayPx > .25) {
							const requestedTransferPx = settleStatus === null ? ownedRunwayPx : Math.min(reservePx, (tuning.runwayPx || 72) / FOLLOW_RUNWAY_RETIRE_MS * dt);
							const transferredPx = transferRunwayToFlowPad(host, requestedTransferPx);
							if (transferredPx > 0) setFlowPad(host, Math.max(0, flowPadOf(host) - transferredPx));
							reservePx = Math.max(0, reservePx - transferredPx);
							animatedH += transferredPx;
						}
						const runwayOffset = runwayOffsetOf(host);
						const lag = Math.max(0, host.scrollHeight - animatedH - runwayOffset);
						if (!settleRetiring && lag <= .25 && reservePx <= .25 && settleQuietMs >= 240 && flowPadOf(host) > .25) {
							followTrace("retire-start", {
								pad: Math.round(flowPadOf(host)),
								sh: host.scrollHeight,
								st: Math.round(host.scrollTop)
							});
							settleRetiring = true;
						}
						if (settleRetiring) {
							const padPx = flowPadOf(host);
							const retirePx = Math.min(padPx, (tuning.runwayPx || 72) / FOLLOW_RUNWAY_RETIRE_MS * dt);
							if (padPx - retirePx <= .25) {
								setFlowPad(host, 0);
								settleRetiring = false;
							} else setFlowPad(host, padPx - retirePx);
						}
						if (lag <= .25 && (reservePx <= .25 || settleStatus === null) && flowPadOf(host) <= .25 && settleQuietMs >= 240) {
							followTrace("finish", {
								st: Math.round(host.scrollTop),
								sh: host.scrollHeight,
								pad: Math.round(flowPadOf(host))
							});
							animatedH = host.scrollHeight;
							velocityPxPerSec = 0;
							finishAtNaturalFloor(host, !startedAsEntrance, !hostOwnsScroll);
							followLeaders.delete(host);
							releaseRevealScale();
							debugRuntime.reportFollow(host, null);
							stopSettleListeners();
							return;
						}
						const step = computeFollowStep(dt, {
							lag,
							speedEma: speedCpsRef.current,
							velocityPxPerSec
						}, tuning);
						animatedH = Math.min(host.scrollHeight - runwayOffset, animatedH + step.advancePx);
						velocityPxPerSec = step.velocityPxPerSec;
						if (!hostOwnsScroll) settleAtFloor(host);
						animatedH = applyVisual(host, animatedH, reservePx, velocityPxPerSec, runwayOffset, Number.POSITIVE_INFINITY, false, void 0, 0, !hostOwnsScroll);
						if (traceActive()) {
							const sig = `${Math.round(host.scrollTop)}|${host.scrollHeight}|${Math.round(flowPadOf(host))}|${Math.round(reservePx)}|${settleRetiring}`;
							if (sig !== settleSig) {
								followTrace("settle", {
									st: Math.round(host.scrollTop),
									sh: host.scrollHeight,
									pad: Math.round(flowPadOf(host)),
									reserve: Math.round(reservePx),
									lag: Math.round(lag * 10) / 10,
									retiring: settleRetiring
								});
								settleSig = sig;
							}
						}
						reportFollow(host, false);
						settleRafId = requestAnimationFrame(settleFrame);
					};
					settleRafId = requestAnimationFrame(settleFrame);
				};
			}, [
				active,
				rootRef,
				speedCpsRef,
				revealScaleRef,
				predictive,
				predictiveRef,
				controlScroll
			]);
			(0, react.useLayoutEffect)(() => {
				const host = rootRef.current?.closest("[data-conversation-scroll]") ?? null;
				if (host !== null) followFlowFillUsers.set(host, (followFlowFillUsers.get(host) ?? 0) + 1);
				return () => {
					if (host === null) return;
					const remaining = Math.max(0, (followFlowFillUsers.get(host) ?? 1) - 1);
					if (remaining > 0) {
						followFlowFillUsers.set(host, remaining);
						return;
					}
					followFlowFillUsers.delete(host);
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							if (!followLeaders.has(host) && !followFlowFillUsers.has(host)) restoreFlowFill(host);
						});
					});
				};
			}, [rootRef]);
		}
		//#endregion
		//#region src/client/useSmoothStreamContent.ts
		/**
		* Stream-smoothing reveal hook.
		*
		* Buffers the model's chunked text and reveals it at a cadence that tracks
		* the observed arrival rate, so a long reply never dumps whole paragraphs at
		* once and a fast stream never stutters. Port of lobe-ui's smoother: EMA
		* arrival cps + chunk size, backlog pressure, commit-interval widening with
		* tail length, and a flush-speed settle drain once the input idles. The
		* reveal decision is the pure {@link computeRevealStep} for unit tests.
		*
		* `shouldHoldBack` is the performance guard's veto: while it returns true the
		* loop keeps measuring but skips the DOM commit, so an offscreen reply never
		* competes with visible frames when the frame rate is degraded.
		*/
		const PRESET_CONFIG = {
			balanced: {
				activeInputWindowMs: 220,
				defaultCps: 80,
				emaAlpha: .35,
				flushCps: 180,
				largeAppendChars: 120,
				maxActiveCps: 360,
				maxCps: 240,
				maxFlushCps: 480,
				minCps: 24,
				settleAfterMs: 280,
				settleDrainMaxMs: 420,
				settleDrainMinMs: 120,
				targetBufferMs: 40
			},
			realtime: {
				activeInputWindowMs: 140,
				defaultCps: 120,
				emaAlpha: .45,
				flushCps: 240,
				largeAppendChars: 180,
				maxActiveCps: 480,
				maxCps: 320,
				maxFlushCps: 640,
				minCps: 32,
				settleAfterMs: 200,
				settleDrainMaxMs: 280,
				settleDrainMinMs: 100,
				targetBufferMs: 24
			},
			silky: {
				activeInputWindowMs: 280,
				defaultCps: 64,
				emaAlpha: .28,
				flushCps: 140,
				largeAppendChars: 100,
				maxActiveCps: 280,
				maxCps: 180,
				maxFlushCps: 400,
				minCps: 20,
				settleAfterMs: 360,
				settleDrainMaxMs: 520,
				settleDrainMinMs: 160,
				targetBufferMs: 56
			}
		};
		const QUEUE_ACCEL_EXPONENT = 1.25;
		const CATCHUP_SECONDS = .15;
		const clamp = (value, min, max) => {
			return Math.min(max, Math.max(min, value));
		};
		/** Float-debt queue integration from `ultimate_stream_physics_scroller.html`. */
		function computeAdaptiveQueueStep(backlog, dtMs, debt, revealScale = 1, tuning = DEFAULT_STREAM_DEBUG_TUNING) {
			if (backlog <= 0 || dtMs <= 0) return {
				revealChars: 0,
				debt: 0,
				speedCps: 0
			};
			const speedCps = Math.min(tuning.maxRevealCps, 90 + Math.pow(backlog, QUEUE_ACCEL_EXPONENT) * tuning.queuePressure);
			const effectiveScale = clamp(revealScale * tuning.revealScale, .05, 2);
			const accumulated = Math.max(0, debt) + speedCps * effectiveScale * (dtMs / 1e3);
			const revealChars = Math.min(backlog, Math.floor(accumulated));
			return {
				revealChars,
				debt: revealChars >= backlog ? 0 : accumulated - revealChars,
				speedCps
			};
		}
		/** Counts user-perceived characters (code points), not UTF-16 units. */
		const countChars = (text) => {
			let count = 0;
			for (const char of text) count += 1;
			return count;
		};
		/** Pure settle-drain decision shared by the frame loop and its tests. */
		function computeSettleDrain(config, input) {
			if (input.inputActive || !input.settling) return 0;
			const overflowCps = Math.max(0, input.backlog - 300) * 1e3 / 2;
			const drainTargetMs = clamp(input.backlog * 8, config.settleDrainMinMs, config.settleDrainMaxMs);
			const settleCps = input.backlog * 1e3 / drainTargetMs;
			return clamp(Math.max(settleCps, overflowCps), config.flushCps, config.maxFlushCps);
		}
		/**
		* Fixed velocity that closes a producer-complete queue within its deadline.
		* This completion-only target may exceed the live-stream flush ceiling.
		*/
		function computeCompletionDrain(config, backlog, initialCps = 0) {
			if (backlog <= 0) return 0;
			const deadlineSeconds = clamp(backlog * 8, config.settleDrainMinMs, config.settleDrainMaxMs) / 1e3;
			const rampAreaSeconds = SETTLE_RAMP_TAU_S * (1 - Math.exp(-deadlineSeconds / SETTLE_RAMP_TAU_S));
			const deadlineCps = (backlog - Math.max(0, initialCps) * rampAreaSeconds) / Math.max(.001, deadlineSeconds - rampAreaSeconds);
			return Math.max(deadlineCps, computeSettleDrain(config, {
				backlog,
				inputActive: false,
				settling: true
			}));
		}
		/**
		* Drain rate multiplier once the input ends: leftover backlog reveals at
		* this multiple of the steady rate, so the end never drags.
		*/
		const SETTLE_DRAIN_MULTIPLIER = 1.8;
		/** Time constant for ramping the completion-drain velocity up from streaming pace. */
		const SETTLE_RAMP_TAU_S = .09;
		/** Pure per-frame reveal decision shared by the loop and its tests. */
		function computeRevealStep(config, input, dtSeconds) {
			const trackedCps = Math.max(input.emaCps, input.arrivalCpsEma);
			const baseCps = clamp(trackedCps, config.minCps, config.maxFlushCps);
			const targetLagChars = input.inputActive ? Math.max(2, Math.round(baseCps * config.targetBufferMs / 1e3)) : 0;
			let currentCps;
			if (input.steadyCps !== void 0) currentCps = input.inputActive || input.settling ? clamp(input.steadyCps * (input.inputActive ? 1 : SETTLE_DRAIN_MULTIPLIER), config.minCps, config.maxFlushCps) : 0;
			else if (input.inputActive) {
				const overflow = Math.max(0, input.backlog - 32);
				const catchup = overflow > 0 ? overflow / CATCHUP_SECONDS : 0;
				currentCps = clamp(baseCps * 1.08 + catchup, config.minCps, config.maxFlushCps);
			} else if (input.settling) currentCps = computeSettleDrain(config, input);
			else {
				const idleFlushCps = Math.max(config.flushCps, baseCps * 1.8, input.arrivalCpsEma * .8);
				currentCps = clamp(idleFlushCps, config.flushCps, config.maxFlushCps);
			}
			const minRevealChars = input.inputActive ? 1 : 2;
			return {
				revealChars: Math.max(minRevealChars, Math.round(currentCps * dtSeconds)),
				targetLagChars
			};
		}
		/**
		* Smooth a chunked content stream into a reveal-paced display string.
		*
		* @param content - The full accumulated input so far.
		* @param options - Preset, guard, and steady-rate wiring.
		* @returns The displayed content, revealed at the smoothed cadence.
		*/
		function useSmoothStreamContent(content, { enabled = true, inputComplete = false, preset = "balanced", shouldHoldBack, steadyCps, defaultCps, speedCpsRef, revealedCharsRef, revealScaleRef, onRevealCommit } = {}) {
			const config = PRESET_CONFIG[preset];
			const seedCps = defaultCps ?? config.defaultCps;
			const initialContent = enabled ? "" : content;
			const [displayedContent, setDisplayedContent] = (0, react.useState)(initialContent);
			const displayedContentRef = (0, react.useRef)(initialContent);
			const displayedCountRef = (0, react.useRef)(countChars(initialContent));
			const targetContentRef = (0, react.useRef)(initialContent);
			const targetCharsRef = (0, react.useRef)([...initialContent]);
			const targetCountRef = (0, react.useRef)(countChars(initialContent));
			const emaCpsRef = (0, react.useRef)(seedCps);
			const lastInputTsRef = (0, react.useRef)(0);
			const lastInputCountRef = (0, react.useRef)(countChars(initialContent));
			const chunkSizeEmaRef = (0, react.useRef)(1);
			const arrivalCpsEmaRef = (0, react.useRef)(seedCps);
			const rafRef = (0, react.useRef)(null);
			const lastFrameTsRef = (0, react.useRef)(null);
			const queueDebtRef = (0, react.useRef)(0);
			const settleCpsRef = (0, react.useRef)(null);
			const lastDrainCpsRef = (0, react.useRef)(0);
			const holdBackRef = (0, react.useRef)(shouldHoldBack);
			const speedOutRef = (0, react.useRef)(speedCpsRef);
			speedOutRef.current = speedCpsRef;
			const revealedCharsOutRef = (0, react.useRef)(revealedCharsRef);
			revealedCharsOutRef.current = revealedCharsRef;
			const revealScaleOutRef = (0, react.useRef)(revealScaleRef);
			revealScaleOutRef.current = revealScaleRef;
			const onRevealCommitOutRef = (0, react.useRef)(onRevealCommit);
			onRevealCommitOutRef.current = onRevealCommit;
			const inputCompleteRef = (0, react.useRef)(inputComplete);
			inputCompleteRef.current = inputComplete;
			const streamIdRef = (0, react.useRef)(`stream-${Math.random().toString(36).slice(2)}`);
			(0, react.useEffect)(() => {
				holdBackRef.current = shouldHoldBack;
			}, [shouldHoldBack]);
			const stopFrameLoop = (0, react.useCallback)(() => {
				if (rafRef.current !== null) {
					cancelAnimationFrame(rafRef.current);
					rafRef.current = null;
				}
				lastFrameTsRef.current = null;
			}, []);
			const startFrameLoopRef = (0, react.useRef)(() => {});
			const syncImmediate = (0, react.useCallback)((nextContent) => {
				stopFrameLoop();
				const chars = [...nextContent];
				const now = performance.now();
				targetContentRef.current = nextContent;
				targetCharsRef.current = chars;
				targetCountRef.current = chars.length;
				displayedContentRef.current = nextContent;
				displayedCountRef.current = chars.length;
				queueDebtRef.current = 0;
				settleCpsRef.current = null;
				lastDrainCpsRef.current = 0;
				const speedOut = speedOutRef.current;
				if (speedOut !== void 0) speedOut.current = seedCps;
				setDisplayedContent(nextContent);
				emaCpsRef.current = seedCps;
				chunkSizeEmaRef.current = 1;
				arrivalCpsEmaRef.current = seedCps;
				lastInputTsRef.current = now;
				lastInputCountRef.current = chars.length;
			}, [seedCps, stopFrameLoop]);
			const startFrameLoop = (0, react.useCallback)(() => {
				if (rafRef.current !== null) return;
				const tick = (now) => {
					const targetCount = targetCountRef.current;
					const displayedCount = displayedCountRef.current;
					const backlog = targetCount - displayedCount;
					if (backlog <= 0) {
						queueDebtRef.current = 0;
						settleCpsRef.current = null;
						const speedOut = speedOutRef.current;
						if (speedOut !== void 0) speedOut.current = seedCps;
						debugRuntime.reportStream(streamIdRef.current, null);
						stopFrameLoop();
						return;
					}
					if (lastFrameTsRef.current === null) {
						lastFrameTsRef.current = now;
						rafRef.current = requestAnimationFrame(tick);
						return;
					}
					const frameIntervalMs = Math.max(0, now - lastFrameTsRef.current);
					const dtSeconds = Math.max(.001, Math.min(frameIntervalMs / 1e3, .12));
					lastFrameTsRef.current = now;
					const idleMs = now - lastInputTsRef.current;
					const producerComplete = inputCompleteRef.current;
					const debugTuning = debugRuntime.activeTuning();
					const inputActive = !producerComplete && idleMs <= config.activeInputWindowMs;
					const settling = producerComplete || !inputActive && idleMs >= config.settleAfterMs;
					if (!producerComplete) settleCpsRef.current = null;
					let revealChars;
					let revealSpeedCps;
					let nextQueueDebt = 0;
					if (producerComplete) {
						const previousCps = lastDrainCpsRef.current > 0 ? lastDrainCpsRef.current : Math.max(config.minCps, emaCpsRef.current);
						const drainTargetCps = settleCpsRef.current ?? computeCompletionDrain(config, backlog, previousCps);
						settleCpsRef.current = drainTargetCps;
						const rampedCps = previousCps + (drainTargetCps - previousCps) * (1 - Math.exp(-dtSeconds / SETTLE_RAMP_TAU_S));
						const settleCps = Math.min(drainTargetCps, Math.max(previousCps, rampedCps));
						lastDrainCpsRef.current = Math.min(drainTargetCps, rampedCps);
						const accumulated = Math.max(0, queueDebtRef.current) + settleCps * dtSeconds;
						revealChars = Math.min(backlog, Math.floor(accumulated));
						revealSpeedCps = settleCps;
						nextQueueDebt = revealChars >= backlog ? 0 : accumulated - revealChars;
						if (revealChars >= backlog) lastDrainCpsRef.current = 0;
					} else if (steadyCps !== void 0) {
						const step = computeRevealStep(config, {
							backlog,
							chunkSizeEma: chunkSizeEmaRef.current,
							arrivalCpsEma: arrivalCpsEmaRef.current,
							emaCps: emaCpsRef.current,
							inputActive,
							settling,
							steadyCps
						}, dtSeconds);
						revealChars = Math.min(Math.round(step.revealChars * debugTuning.revealScale), backlog);
						revealSpeedCps = frameIntervalMs > 0 ? revealChars * 1e3 / frameIntervalMs : 0;
					} else {
						const step = computeAdaptiveQueueStep(backlog, frameIntervalMs, queueDebtRef.current, revealScaleOutRef.current?.current ?? 1, debugTuning);
						revealChars = step.revealChars;
						revealSpeedCps = step.speedCps;
						nextQueueDebt = step.debt;
					}
					debugRuntime.reportStream(streamIdRef.current, {
						backlog,
						speedCps: revealSpeedCps,
						targetChars: targetCount,
						displayedChars: displayedCount,
						active: !producerComplete
					});
					if (holdBackRef.current?.() === true) {
						rafRef.current = requestAnimationFrame(tick);
						return;
					}
					queueDebtRef.current = nextQueueDebt;
					const speedOut = speedOutRef.current;
					if (speedOut !== void 0) speedOut.current = revealSpeedCps;
					if (revealChars <= 0) {
						rafRef.current = requestAnimationFrame(tick);
						return;
					}
					const nextCount = displayedCount + revealChars;
					const segment = targetCharsRef.current.slice(displayedCount, nextCount).join("");
					if (segment) {
						const nextDisplayed = displayedContentRef.current + segment;
						displayedContentRef.current = nextDisplayed;
						displayedCountRef.current = nextCount;
						setDisplayedContent(nextDisplayed);
					} else {
						displayedContentRef.current = targetContentRef.current;
						displayedCountRef.current = targetCount;
						setDisplayedContent(targetContentRef.current);
					}
					rafRef.current = requestAnimationFrame(tick);
				};
				rafRef.current = requestAnimationFrame(tick);
			}, [
				config,
				seedCps,
				stopFrameLoop,
				steadyCps
			]);
			(0, react.useLayoutEffect)(() => {
				const revealedCharsOut = revealedCharsOutRef.current;
				if (revealedCharsOut !== void 0) revealedCharsOut.current = displayedCountRef.current;
				if (displayedContent === "") return;
				onRevealCommitOutRef.current?.();
			}, [displayedContent]);
			(0, react.useEffect)(() => {
				startFrameLoopRef.current = startFrameLoop;
			}, [startFrameLoop]);
			(0, react.useEffect)(() => {
				if (!enabled) {
					syncImmediate(content);
					return;
				}
				const prevTargetContent = targetContentRef.current;
				if (content === prevTargetContent) return;
				const now = performance.now();
				if (!content.startsWith(prevTargetContent)) {
					syncImmediate(content);
					return;
				}
				const appendedChars = [...content.slice(prevTargetContent.length)];
				const appendedCount = appendedChars.length;
				targetContentRef.current = content;
				targetCharsRef.current.push(...appendedChars);
				targetCountRef.current += appendedCount;
				settleCpsRef.current = null;
				const hadSample = lastInputTsRef.current > 0;
				const deltaChars = targetCountRef.current - lastInputCountRef.current;
				const deltaMs = Math.max(1, now - lastInputTsRef.current);
				if (hadSample && deltaChars > 0) {
					const instantCps = deltaChars * 1e3 / deltaMs;
					const normalizedInstantCps = clamp(instantCps, config.minCps, config.maxFlushCps * 3);
					const chunkEmaAlpha = .45;
					chunkSizeEmaRef.current = chunkSizeEmaRef.current * .55 + appendedCount * chunkEmaAlpha;
					arrivalCpsEmaRef.current = arrivalCpsEmaRef.current * .55 + normalizedInstantCps * chunkEmaAlpha;
					emaCpsRef.current = emaCpsRef.current * (1 - config.emaAlpha) + normalizedInstantCps * config.emaAlpha;
				}
				lastInputTsRef.current = now;
				lastInputCountRef.current = targetCountRef.current;
				startFrameLoop();
			}, [
				content,
				enabled,
				config,
				startFrameLoop,
				syncImmediate
			]);
			(0, react.useEffect)(() => {
				return () => {
					stopFrameLoop();
					debugRuntime.reportStream(streamIdRef.current, null);
				};
			}, [stopFrameLoop]);
			return displayedContent;
		}
		//#endregion
		//#region src/client/useFpsGuard.ts
		/**
		* Performance guard for the streaming reveal.
		*
		* Feeds an EMA-smoothed frame-rate monitor from a rAF loop while streaming
		* and tracks whether the reply is on-screen. The returned `shouldHoldBack`
		* predicate is true only while the frame rate is below the threshold AND the
		* reply is offscreen — exactly the spec's "skip offscreen DOM updates when
		* FPS < 30" rule. The smoother consumes the predicate as its commit veto.
		*/
		const FPS_THRESHOLD = 30;
		const FPS_ALPHA = .12;
		const RECOVER_FRAMES = 6;
		const MAX_FRAME_MS = 100;
		function useFpsGuard(active) {
			const fpsRef = (0, react.useRef)({
				emaMs: 0,
				lastMs: 0,
				healthyRun: 0,
				degraded: false
			});
			const visibleRef = (0, react.useRef)(true);
			const elementRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!active) return;
				let rafId = 0;
				let lastDebugReport = 0;
				const frame = (now) => {
					rafId = requestAnimationFrame(frame);
					const fps = fpsRef.current;
					if (fps.lastMs === 0) {
						fps.lastMs = now;
						return;
					}
					const delta = Math.min(MAX_FRAME_MS, Math.max(1, now - fps.lastMs));
					fps.lastMs = now;
					fps.emaMs = fps.emaMs === 0 ? delta : fps.emaMs + FPS_ALPHA * (delta - fps.emaMs);
					const currentFps = 1e3 / fps.emaMs;
					if (currentFps < FPS_THRESHOLD) {
						fps.healthyRun = 0;
						fps.degraded = true;
					} else if (fps.degraded) {
						fps.healthyRun += 1;
						if (fps.healthyRun >= RECOVER_FRAMES) fps.degraded = false;
					}
					if (now - lastDebugReport >= 100) {
						debugRuntime.reportFps(currentFps, fps.emaMs, fps.degraded);
						lastDebugReport = now;
					}
				};
				rafId = requestAnimationFrame(frame);
				return () => {
					cancelAnimationFrame(rafId);
					fpsRef.current = {
						emaMs: 0,
						lastMs: 0,
						healthyRun: 0,
						degraded: false
					};
					debugRuntime.clearFps();
				};
			}, [active]);
			const ref = (0, react.useCallback)((element) => {
				elementRef.current = element;
			}, []);
			(0, react.useEffect)(() => {
				const element = elementRef.current;
				if (element === null || typeof IntersectionObserver === "undefined") return;
				const observer = new IntersectionObserver((entries) => {
					for (const entry of entries) visibleRef.current = entry.isIntersecting;
				}, { rootMargin: "120px 0px" });
				observer.observe(element);
				return () => observer.disconnect();
			});
			return {
				ref,
				shouldHoldBack: (0, react.useCallback)(() => {
					return active && fpsRef.current.degraded && !visibleRef.current;
				}, [active])
			};
		}
		//#endregion
		//#region \0dsh-css:/Users/dzlin/work/project/dsh-smooth-stream/src/client/LogarithmicFade.module.css.mjs
		const css$3 = ".g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-0),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-0){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 0.0%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-1),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-1){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 3.22581%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-2),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-2){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 6.45161%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-3),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-3){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 9.67742%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-4),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-4){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 12.9032%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-5),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-5){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 16.129%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-6),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-6){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 19.3548%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-7),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-7){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 22.5807%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-8),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-8){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 25.8065%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-9),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-9){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 29.0323%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-10),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-10){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 32.2581%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-11),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-11){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 35.4839%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-12),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-12){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 38.7097%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-13),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-13){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 41.9355%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-14),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-14){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 45.1613%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-15),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-15){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 48.3871%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-16),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-16){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 51.6129%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-17),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-17){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 54.8387%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-18),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-18){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 58.0645%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-19),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-19){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 61.2903%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-20),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-20){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 64.5161%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-21),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-21){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 67.7419%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-22),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-22){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 70.9677%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-23),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-23){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 74.1936%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-24),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-24){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 77.4194%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-25),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-25){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 80.6452%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-26),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-26){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 83.871%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-27),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-27){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 87.0968%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-28),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-28){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 90.3226%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-29),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-29){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 93.5484%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-30),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-30){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 96.7742%, transparent)}.g268Pa_scope::highlight(g268Pa_dsh-smooth-stream-log-fade-31),.g268Pa_scope ::highlight(g268Pa_dsh-smooth-stream-log-fade-31){color:color-mix(in srgb, var(--dsh-smooth-stream-fade-color,currentColor) 100.0%, transparent)}";
		const tagId$3 = "dsh-stream-think/LogarithmicFade.module.css";
		if (typeof document !== "undefined") {
			let tag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]");
			if (tag === null) {
				tag = document.createElement("style");
				tag.dataset.plugin = "dsh-stream-think";
				tag.dataset.pluginCss = tagId$3;
				document.head.appendChild(tag);
			}
			tag.textContent = css$3;
		}
		var LogarithmicFade_module_css_default = {
			"dsh-smooth-stream-log-fade-0": "g268Pa_dsh-smooth-stream-log-fade-0",
			"dsh-smooth-stream-log-fade-30": "g268Pa_dsh-smooth-stream-log-fade-30",
			"dsh-smooth-stream-log-fade-4": "g268Pa_dsh-smooth-stream-log-fade-4",
			"dsh-smooth-stream-log-fade-31": "g268Pa_dsh-smooth-stream-log-fade-31",
			"dsh-smooth-stream-log-fade-9": "g268Pa_dsh-smooth-stream-log-fade-9",
			"dsh-smooth-stream-log-fade-17": "g268Pa_dsh-smooth-stream-log-fade-17",
			"dsh-smooth-stream-log-fade-18": "g268Pa_dsh-smooth-stream-log-fade-18",
			"dsh-smooth-stream-log-fade-19": "g268Pa_dsh-smooth-stream-log-fade-19",
			"dsh-smooth-stream-log-fade-21": "g268Pa_dsh-smooth-stream-log-fade-21",
			"dsh-smooth-stream-log-fade-12": "g268Pa_dsh-smooth-stream-log-fade-12",
			"dsh-smooth-stream-log-fade-8": "g268Pa_dsh-smooth-stream-log-fade-8",
			"dsh-smooth-stream-log-fade-22": "g268Pa_dsh-smooth-stream-log-fade-22",
			"dsh-smooth-stream-log-fade-29": "g268Pa_dsh-smooth-stream-log-fade-29",
			"dsh-smooth-stream-log-fade-1": "g268Pa_dsh-smooth-stream-log-fade-1",
			"dsh-smooth-stream-log-fade-25": "g268Pa_dsh-smooth-stream-log-fade-25",
			"dsh-smooth-stream-log-fade-23": "g268Pa_dsh-smooth-stream-log-fade-23",
			"dsh-smooth-stream-log-fade-26": "g268Pa_dsh-smooth-stream-log-fade-26",
			"dsh-smooth-stream-log-fade-28": "g268Pa_dsh-smooth-stream-log-fade-28",
			"dsh-smooth-stream-log-fade-6": "g268Pa_dsh-smooth-stream-log-fade-6",
			"dsh-smooth-stream-log-fade-20": "g268Pa_dsh-smooth-stream-log-fade-20",
			"dsh-smooth-stream-log-fade-10": "g268Pa_dsh-smooth-stream-log-fade-10",
			"dsh-smooth-stream-log-fade-14": "g268Pa_dsh-smooth-stream-log-fade-14",
			"dsh-smooth-stream-log-fade-24": "g268Pa_dsh-smooth-stream-log-fade-24",
			"dsh-smooth-stream-log-fade-2": "g268Pa_dsh-smooth-stream-log-fade-2",
			"dsh-smooth-stream-log-fade-13": "g268Pa_dsh-smooth-stream-log-fade-13",
			"dsh-smooth-stream-log-fade-16": "g268Pa_dsh-smooth-stream-log-fade-16",
			"dsh-smooth-stream-log-fade-5": "g268Pa_dsh-smooth-stream-log-fade-5",
			"dsh-smooth-stream-log-fade-27": "g268Pa_dsh-smooth-stream-log-fade-27",
			"scope": "g268Pa_scope",
			"dsh-smooth-stream-log-fade-7": "g268Pa_dsh-smooth-stream-log-fade-7",
			"dsh-smooth-stream-log-fade-15": "g268Pa_dsh-smooth-stream-log-fade-15",
			"dsh-smooth-stream-log-fade-3": "g268Pa_dsh-smooth-stream-log-fade-3",
			"dsh-smooth-stream-log-fade-11": "g268Pa_dsh-smooth-stream-log-fade-11"
		};
		const FADE_STEPS = 32;
		const PREFIX = "dsh-smooth-stream-log-fade-";
		const COLOR_PROPERTY = "--dsh-smooth-stream-fade-color";
		const highlightName = (index) => LogarithmicFade_module_css_default[`${PREFIX}${index}`] ?? `${PREFIX}${index}`;
		const EXCLUDED = "pre,code,math,.katex,.katex-display,mjx-container,svg,script,style,textarea,input,button,select,[role=\"button\"],[contenteditable],[hidden],[aria-hidden=\"true\"],[aria-live]";
		function logarithmicOpacity(progress) {
			return 0 + 1 * (1 - Math.log1p(5 * (1 - (Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 1))) / Math.log(6));
		}
		function fadeTailSize(speedCps) {
			return Math.min(160, Math.max(24, Math.ceil((Number.isFinite(speedCps) ? Math.max(0, speedCps) : 0) * 240 / 1e3)));
		}
		const schedulers = /* @__PURE__ */ new WeakMap();
		const segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
		function schedule(scheduler) {
			if (scheduler.frame !== 0 || scheduler.pending.size === 0) return;
			scheduler.frame = scheduler.window.requestAnimationFrame((now) => {
				scheduler.frame = 0;
				for (const client of scheduler.pending) if (!client.paint(now)) scheduler.pending.delete(client);
				schedule(scheduler);
			});
		}
		function schedulerFor(root) {
			const doc = root.ownerDocument;
			const win = doc.defaultView;
			if (win === null) return null;
			const realm = win;
			if (typeof realm.Highlight !== "function" || !realm.CSS?.highlights || !realm.CSS.supports("color", "color-mix(in srgb, currentColor 15%, transparent)")) return null;
			let scheduler = schedulers.get(doc);
			if (scheduler === void 0) {
				const highlights = Array.from({ length: FADE_STEPS }, () => new realm.Highlight());
				for (const [index, highlight] of highlights.entries()) realm.CSS.highlights.set(highlightName(index), highlight);
				scheduler = {
					highlights,
					clients: /* @__PURE__ */ new Set(),
					pending: /* @__PURE__ */ new Set(),
					frame: 0,
					registry: realm.CSS.highlights,
					window: win
				};
				schedulers.set(doc, scheduler);
			}
			return scheduler;
		}
		/** Owns ranges only: React retains ownership of every element and Text node. */
		var LogarithmicFadeController = class LogarithmicFadeController {
			root;
			scheduler;
			previous = "";
			characters = [];
			colors = /* @__PURE__ */ new Map();
			enabled = false;
			active = false;
			speedCps = 100;
			pausedAt = null;
			disposed = false;
			observer;
			constructor(root, scheduler) {
				this.root = root;
				this.scheduler = scheduler;
				scheduler.clients.add(this);
				const win = root.ownerDocument.defaultView;
				this.observer = new win.MutationObserver(() => {
					this.reconcile();
				});
				this.observer.observe(root, {
					subtree: true,
					childList: true,
					characterData: true
				});
			}
			static create(root) {
				const scheduler = schedulerFor(root);
				return scheduler === null ? null : new LogarithmicFadeController(root, scheduler);
			}
			update(enabled, active, speedCps = 100, paused = false) {
				const now = this.scheduler.window.performance.now();
				if (paused && this.pausedAt === null) this.pausedAt = now;
				if (!paused && this.pausedAt !== null) {
					const pauseDuration = now - this.pausedAt;
					for (const character of this.characters) character.born += pauseDuration;
					this.pausedAt = null;
				}
				this.enabled = enabled;
				this.active = active;
				this.speedCps = speedCps;
				this.reconcile();
			}
			clearRanges() {
				for (const character of this.characters) this.scheduler.highlights[character.bucket]?.delete(character.range);
				this.characters = [];
				this.restoreColors();
			}
			restoreColors() {
				for (const [element, original] of this.colors) if (original.value === "") element.style.removeProperty(COLOR_PROPERTY);
				else element.style.setProperty(COLOR_PROPERTY, original.value, original.priority);
				this.colors.clear();
			}
			preserveColor(element) {
				if (this.colors.has(element)) return;
				const color = this.scheduler.window.getComputedStyle(element).color;
				this.colors.set(element, {
					value: element.style.getPropertyValue(COLOR_PROPERTY),
					priority: element.style.getPropertyPriority(COLOR_PROPERTY)
				});
				element.style.setProperty(COLOR_PROPERTY, color);
			}
			reconcile() {
				if (this.disposed) return;
				const text = this.root.textContent ?? "";
				const previous = this.previous;
				this.previous = text;
				const old = this.characters;
				this.clearRanges();
				if (!this.enabled) {
					this.root.classList.remove(LogarithmicFade_module_css_default.scope);
					this.scheduler.pending.delete(this);
					this.stopIfIdle();
					return;
				}
				this.root.classList.add(LogarithmicFade_module_css_default.scope);
				const now = this.pausedAt ?? this.scheduler.window.performance.now();
				let prefix = 0;
				while (prefix < previous.length && prefix < text.length && previous[prefix] === text[prefix]) prefix += 1;
				const appended = text.startsWith(previous);
				const nodes = [];
				const walker = this.root.ownerDocument.createTreeWalker(this.root, NodeFilter.SHOW_TEXT);
				let offset = 0;
				for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
					const end = offset + (node.textContent?.length ?? 0);
					nodes.push({
						node,
						start: offset,
						end,
						eligible: node.parentElement?.closest(EXCLUDED) === null
					});
					offset = end;
				}
				const segments = segmenter.segment(text);
				const tailSize = fadeTailSize(this.speedCps);
				const oldestLiveStart = old.reduce((start, character) => now - character.born < 240 && character.end <= prefix ? Math.min(start, character.start) : start, Infinity);
				let end = text.length;
				for (let count = 0; count < 160 && end > 0 && (count < tailSize || end > oldestLiveStart); count += 1) {
					const segment = segments.containing(end - 1);
					if (segment === void 0) break;
					const start = segment.index;
					const parts = nodes.filter((node) => node.end > start && node.start < end);
					const born = old.find((character) => character.start === start && character.end === end && end <= prefix)?.born ?? (this.active && appended && start >= previous.length ? now : null);
					if (born !== null && now - born < 240 && segment.segment.trim() !== "" && parts.length > 0 && parts.every((part) => part.eligible)) {
						const first = parts[0];
						const last = parts[parts.length - 1];
						const range = this.root.ownerDocument.createRange();
						range.setStart(first.node, start - first.start);
						range.setEnd(last.node, end - last.start);
						for (const part of parts) this.preserveColor(part.node.parentElement);
						this.characters.push({
							start,
							end,
							born,
							range,
							bucket: -1
						});
					}
					end = start;
				}
				if (this.paint(now)) {
					if (this.pausedAt === null) {
						this.scheduler.pending.add(this);
						schedule(this.scheduler);
					} else {
						this.scheduler.pending.delete(this);
						this.stopIfIdle();
					}
				} else {
					this.scheduler.pending.delete(this);
					this.stopIfIdle();
				}
			}
			paint(now) {
				this.characters = this.characters.filter((character) => {
					const progress = (now - character.born) / 240;
					if (progress >= 1 || !this.root.isConnected || !this.root.contains(character.range.startContainer)) {
						this.scheduler.highlights[character.bucket]?.delete(character.range);
						return false;
					}
					const bucket = Math.min(31, Math.round((logarithmicOpacity(progress) - 0) / 1 * 31));
					if (bucket !== character.bucket) {
						this.scheduler.highlights[character.bucket]?.delete(character.range);
						this.scheduler.highlights[bucket].add(character.range);
						character.bucket = bucket;
					}
					return true;
				});
				if (this.characters.length === 0) this.restoreColors();
				return this.characters.length > 0;
			}
			stopIfIdle() {
				if (this.scheduler.pending.size !== 0) return;
				this.scheduler.window.cancelAnimationFrame(this.scheduler.frame);
				this.scheduler.frame = 0;
			}
			dispose() {
				if (this.disposed) return;
				this.disposed = true;
				this.observer.disconnect();
				this.clearRanges();
				this.root.classList.remove(LogarithmicFade_module_css_default.scope);
				this.scheduler.pending.delete(this);
				this.scheduler.clients.delete(this);
				this.stopIfIdle();
				if (this.scheduler.clients.size === 0) {
					for (const [index, highlight] of this.scheduler.highlights.entries()) {
						const name = highlightName(index);
						if (this.scheduler.registry.get(name) === highlight) this.scheduler.registry.delete(name);
					}
					schedulers.delete(this.root.ownerDocument);
				}
			}
		};
		/** active admits new characters; enabled=false also cancels completion linger. */
		function useLogarithmicFade(rootRef, enabled, active, speedCpsRef, paused = false) {
			const controller = (0, react.useRef)(null);
			const committed = (0, react.useRef)(false);
			(0, react.useLayoutEffect)(() => {
				return () => {
					controller.current?.dispose();
					controller.current = null;
				};
			}, [rootRef]);
			(0, react.useLayoutEffect)(() => {
				const root = rootRef.current;
				if (controller.current === null && root !== null && enabled && active) {
					controller.current = LogarithmicFadeController.create(root);
					if (committed.current) controller.current?.update(false, false);
				}
				controller.current?.update(enabled, active, speedCpsRef?.current, paused);
				committed.current = true;
			});
		}
		//#endregion
		//#region src/client/FollowHost.tsx
		/**
		* Document-flow host that owns conversation-port follow while `active`.
		* Shared by assistant blocks and every other Agent Chat row. `onGrowth` lets
		* generic wrapped renderers re-arm one glide when their DOM grows without
		* requiring a business-kind-specific lifecycle predicate.
		*/
		function FollowHost({ active, entrance = false, onEntranceSettled, onGrowth, entranceExtentRef, speedCpsRef, revealedCharsRef, revealScaleRef, predictive = true, predictiveRef, controlScroll = true, hostRef, className, entranceActive, children }) {
			const localRootRef = (0, react.useRef)(null);
			const rootRef = hostRef ?? localRootRef;
			/* dsh-stream-think：滚动跟随整条停用（见 tools/derive.mjs「滚动一律交回官方」段）。
			 * useConversationFollow 只被注释保留在下方，运行时不再被调用。 */
			if (false) useConversationFollow(rootRef, active || entrance, speedCpsRef, revealScaleRef, predictive, entrance, onEntranceSettled, predictiveRef, entranceExtentRef, revealedCharsRef, controlScroll);
			(0, react.useEffect)(() => {
				if (onGrowth === void 0 || typeof ResizeObserver === "undefined") return;
				const root = rootRef.current;
				if (root === null) return;
				let previousHeight = null;
				let pendingGrowth = 0;
				let growthFrame = null;
				const flushGrowth = () => {
					growthFrame = null;
					if (pendingGrowth <= 0) return;
					const delta = pendingGrowth;
					pendingGrowth = 0;
					onGrowth(delta);
				};
				const observer = new ResizeObserver((entries) => {
					const measuredHeight = entries[0]?.contentRect.height;
					if (measuredHeight === void 0 || !Number.isFinite(measuredHeight)) return;
					const nextHeight = measuredHeight;
					if (previousHeight !== null && nextHeight > previousHeight + .5) {
						pendingGrowth += nextHeight - previousHeight;
						if (growthFrame === null) growthFrame = requestAnimationFrame(flushGrowth);
					}
					previousHeight = nextHeight;
				});
				observer.observe(root);
				return () => {
					observer.disconnect();
					if (growthFrame !== null) cancelAnimationFrame(growthFrame);
				};
			}, [onGrowth]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: rootRef,
				className: className === void 0 ? TypewriterAssistantNodeView_module_css_default.follow : `${TypewriterAssistantNodeView_module_css_default.follow} ${className}`,
				"data-entrance": entranceActive === void 0 ? void 0 : entranceActive ? "active" : "idle",
				children
			});
		}
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
		//#region src/client/TypewriterAssistantNodeView.tsx
		function usePrefersReducedMotion() {
			const [reduced, setReduced] = (0, react.useState)(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true);
			(0, react.useEffect)(() => {
				if (typeof window === "undefined" || window.matchMedia === void 0) return;
				const query = window.matchMedia("(prefers-reduced-motion: reduce)");
				const onChange = () => setReduced(query.matches);
				query.addEventListener("change", onChange);
				return () => query.removeEventListener("change", onChange);
			}, []);
			return reduced;
		}
		/**
		* Resolve whether the reveal engine should stay off for this view. The OS
		* preference wins only in `auto` mode: `force-smooth` keeps the engine on
		* machines where a system-wide reduce-motion switch (or a forced browser
		* flag) would otherwise silently bypass smoothing, and `force-reduced`
		* disables it even when the OS asks for motion. Credit: three-state design
		* proposed by @Zn-Dk in #21/#22.
		*/
		function useMotionReduced(preference) {
			const system = usePrefersReducedMotion();
			if (preference === "force-smooth") return false;
			if (preference === "force-reduced") return true;
			return system;
		}
		/** Conservative fallback before the streaming Markdown tail has geometry. */
		const PREDICTIVE_WRAP_FALLBACK_CHARS = 32;
		const STREAM_ANNOUNCEMENT_INTERVAL_MS = 800;
		const STREAM_ANNOUNCEMENT_MAX_CHARS = 320;
		function approximateInlineWidth(text, emPx) {
			let width = 0;
			for (const char of text) if (/\s/u.test(char)) width += emPx * .33;
			else if (/^[\x00-\x7f]$/u.test(char)) width += emPx * .56;
			else width += emPx;
			return width;
		}
		function measurePendingTextGeometry(root, visibleText) {
			if (typeof document.createTreeWalker !== "function" || typeof NodeFilter === "undefined") return {
				root,
				visibleText,
				fontSize: 14,
				wrapThresholdWidth: null
			};
			const rootRect = root.getBoundingClientRect();
			const rootWidth = Math.max(0, rootRect.width, rootRect.right - rootRect.left, root.clientWidth);
			if (rootWidth <= 0) return {
				root,
				visibleText,
				fontSize: 14,
				wrapThresholdWidth: null
			};
			const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
			let tail = null;
			for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) if ((node.textContent ?? "").length > 0) tail = node;
			const parent = tail?.parentElement ?? root;
			const fontSize = Number.parseFloat(getComputedStyle(parent).fontSize) || 14;
			if (tail === null || typeof document.createRange !== "function") return {
				root,
				visibleText,
				fontSize,
				wrapThresholdWidth: rootWidth
			};
			try {
				const length = tail.textContent?.length ?? 0;
				if (length <= 0) return {
					root,
					visibleText,
					fontSize,
					wrapThresholdWidth: rootWidth
				};
				const range = document.createRange();
				range.setStart(tail, Math.max(0, length - 1));
				range.setEnd(tail, length);
				const tailRect = range.getBoundingClientRect();
				const contentRight = rootRect.right;
				if (!Number.isFinite(tailRect.right) || tailRect.right <= rootRect.left || contentRight <= rootRect.left) return {
					root,
					visibleText,
					fontSize,
					wrapThresholdWidth: rootWidth
				};
				return {
					root,
					visibleText,
					fontSize,
					wrapThresholdWidth: Math.max(0, contentRight - tailRect.right) + fontSize * .35
				};
			} catch {
				return {
					root,
					visibleText,
					fontSize,
					wrapThresholdWidth: rootWidth
				};
			}
		}
		/** Whether buffered source can reach a new visual line before it drains. */
		function pendingTextCanGrow(root, visibleText, pending, geometryRef) {
			if (pending === "") return false;
			if (/[\r\n]/u.test(pending)) return true;
			const pendingChars = [...pending];
			if (root === null) return pendingChars.length >= PREDICTIVE_WRAP_FALLBACK_CHARS;
			let geometry = geometryRef.current;
			if (geometry?.root !== root || geometry.visibleText !== visibleText) {
				geometry = measurePendingTextGeometry(root, visibleText);
				geometryRef.current = geometry;
			}
			if (geometry.wrapThresholdWidth === null) return pendingChars.length >= PREDICTIVE_WRAP_FALLBACK_CHARS;
			return approximateInlineWidth(pending, geometry.fontSize) >= geometry.wrapThresholdWidth;
		}
		function announcementChunkEnd(source, start) {
			const hardEnd = Math.min(source.length, start + STREAM_ANNOUNCEMENT_MAX_CHARS);
			if (hardEnd === source.length) return hardEnd;
			const softStart = start + Math.floor(STREAM_ANNOUNCEMENT_MAX_CHARS * .6);
			for (let index = hardEnd - 1; index >= softStart; index -= 1) if (/[\s.,;:!?]/u.test(source[index] ?? "")) return index + 1;
			return hardEnd;
		}
		/** A commit-driven live region isolated from the visible Markdown subtree. */
		const StreamAnnouncement = (0, react.memo)(function StreamAnnouncement({ text, active }) {
			const [announcement, setAnnouncement] = (0, react.useState)({
				text: "",
				revision: 0,
				present: active
			});
			const sourceRef = (0, react.useRef)(text);
			const activeRef = (0, react.useRef)(active);
			const announcedOffsetRef = (0, react.useRef)(active ? 0 : text.length);
			const drainSourceRef = (0, react.useRef)(null);
			const timerRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				const clearTimer = () => {
					if (timerRef.current === null) return;
					clearTimeout(timerRef.current);
					timerRef.current = null;
				};
				const publishNext = (source) => {
					const start = Math.min(announcedOffsetRef.current, source.length);
					const end = announcementChunkEnd(source, start);
					if (end <= start) return false;
					announcedOffsetRef.current = end;
					setAnnouncement((previous) => ({
						text: source.slice(start, end),
						revision: previous.revision + 1,
						present: true
					}));
					return end < source.length;
				};
				const hideAfterLinger = () => {
					timerRef.current = setTimeout(() => {
						timerRef.current = null;
						if (activeRef.current) return;
						drainSourceRef.current = null;
						setAnnouncement((previous) => ({
							...previous,
							present: false
						}));
					}, STREAM_ANNOUNCEMENT_INTERVAL_MS);
				};
				const drainNext = () => {
					const source = drainSourceRef.current;
					if (source === null) return;
					if (!publishNext(source)) {
						hideAfterLinger();
						return;
					}
					timerRef.current = setTimeout(() => {
						timerRef.current = null;
						if (activeRef.current) return;
						drainNext();
					}, STREAM_ANNOUNCEMENT_INTERVAL_MS);
				};
				const scheduleLive = () => {
					if (timerRef.current !== null || announcedOffsetRef.current >= sourceRef.current.length) return;
					timerRef.current = setTimeout(() => {
						timerRef.current = null;
						if (!activeRef.current) return;
						const source = sourceRef.current;
						if (publishNext(source)) scheduleLive();
					}, STREAM_ANNOUNCEMENT_INTERVAL_MS);
				};
				const wasActive = activeRef.current;
				const previousSource = sourceRef.current;
				if (!(!active && !wasActive && drainSourceRef.current !== null) && (!text.startsWith(previousSource) || announcedOffsetRef.current > text.length)) announcedOffsetRef.current = 0;
				sourceRef.current = text;
				activeRef.current = active;
				if (active) {
					if (!wasActive) {
						clearTimer();
						drainSourceRef.current = null;
						setAnnouncement((previous) => ({
							text: "",
							revision: previous.revision + 1,
							present: true
						}));
					}
					scheduleLive();
					return;
				}
				if (!wasActive) {
					if (drainSourceRef.current === null) announcedOffsetRef.current = text.length;
					return;
				}
				clearTimer();
				drainSourceRef.current = text;
				drainNext();
			}, [active, text]);
			(0, react.useEffect)(() => () => {
				if (timerRef.current !== null) clearTimeout(timerRef.current);
				timerRef.current = null;
			}, []);
			if (!active && !announcement.present) return null;
			const activating = active && !activeRef.current;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: TypewriterAssistantNodeView_module_css_default.visuallyHidden,
				"aria-live": "polite",
				"aria-atomic": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: activating ? "" : announcement.text }, announcement.revision)
			});
		});
		/**
		* Smooth streaming text arm. While the reply runs, the accumulated source is
		* revealed through the smoother at a rate that tracks the model's arrival
		* and rendered by the Harness `MarkdownText`
		* streaming arm (incremental parse, frozen non-tail blocks), so there is no
		* raw-text tail and no text-to-markdown swap: the tree stays markdown
		* throughout. The last text block owns conversation-port follow so wraps
		* glide instead of snapping. Once the stream closes and the reveal queue
		* drains, the settled full parse (KaTeX math, fence highlighting, file
		* mentions) swaps in exactly once.
		*/
		function AnimatedMarkdownText({ text, labels, fileMentions, streaming, logarithmicFade, motionReduced, ownFollow, followSpeedCpsRef, followRevealedCharsRef, followRevealScaleRef, onPredictiveChange, preset, shouldHoldBack, controlScroll = true }) {
			const reduced = motionReduced;
			const [typing, setTyping] = (0, react.useState)(streaming);
			const localSpeedCpsRef = (0, react.useRef)(35);
			const followRootRef = (0, react.useRef)(null);
			const predictionSourceRef = (0, react.useRef)(null);
			const predictionStateRef = (0, react.useRef)(false);
			const predictionGeometryRef = (0, react.useRef)(null);
			const speedCpsRef = followSpeedCpsRef ?? localSpeedCpsRef;
			const displayed = useSmoothStreamContent(text, {
				enabled: false, // was: typing && !reduced（滚动交回官方：正文整段出）
				inputComplete: !streaming,
				preset,
				shouldHoldBack,
				speedCpsRef,
				revealedCharsRef: followRevealedCharsRef,
				revealScaleRef: followRevealScaleRef,
				onRevealCommit: () => {
					notifyFollowCommit(followRootRef.current);
				}
			});
			const shown = reduced ? text : displayed;
			const live = typing && !reduced;
			useLogarithmicFade(followRootRef, false, live, speedCpsRef); // 滚动交回官方：不逐字 → 不渐隐
			(0, react.useEffect)(() => {
				const root = followRootRef.current;
				if (root === null || typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(() => {
					if (predictionGeometryRef.current?.root === root) predictionGeometryRef.current = null;
				});
				observer.observe(root);
				return () => {
					observer.disconnect();
				};
			}, []);
			(0, react.useLayoutEffect)(() => {
				if (onPredictiveChange === void 0) return;
				const pending = text.slice(shown.length);
				const sourceChanged = predictionSourceRef.current !== text;
				const next = !live || !streaming || pending === "" ? false : sourceChanged ? pendingTextCanGrow(followRootRef.current, shown, pending, predictionGeometryRef) : predictionStateRef.current;
				predictionSourceRef.current = text;
				predictionStateRef.current = next;
				onPredictiveChange(next);
			}, [
				live,
				onPredictiveChange,
				shown,
				streaming,
				text
			]);
			(0, react.useEffect)(() => {
				if (typing && !streaming && shown.length === text.length) setTyping(false);
			}, [
				shown,
				streaming,
				text,
				typing
			]);
			(0, react.useEffect)(() => {
				if (streaming) setTyping(true);
			}, [streaming]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FollowHost, {
				active: live && ownFollow,
				speedCpsRef,
				revealedCharsRef: followRevealedCharsRef,
				revealScaleRef: followRevealScaleRef,
				predictive: streaming,
				controlScroll,
				hostRef: followRootRef,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
					text: live ? shown : text,
					streaming: live,
					labels,
					fileMentions: live ? void 0 : fileMentions
				})
			});
		}
		function imageLabels(t) {
			return {
				image: t("image.label"),
				open: t("image.openOriginal"),
				openNamed: (label) => t("image.openOriginalLabel", { label }),
				loading: t("image.loading"),
				loadFailed: t("image.loadFailed"),
				lightbox: {
					dialog: t("image.preview"),
					close: t("image.closePreview")
				}
			};
		}
		/**
		* Apply searchable hidden state without unmounting a stable subtree — the
		* Host's completion fold hides the answer-inline reasoning this way, so the
		* takeover renderer must reproduce it to stay inside the contract: the row
		* disappears into the Host's process summary and comes back on find-in-page.
		* (Mirrors the Harness chat kit's `useSearchableHidden`.)
		*/
		function useSearchableHidden(hidden, reveal) {
			const ref = (0, react.useRef)(null);
			(0, react.useLayoutEffect)(() => {
				const element = ref.current;
				if (element === null) return;
				if (hidden && element.contains(element.ownerDocument.activeElement)) {
					reveal();
					return;
				}
				if (hidden) element.setAttribute("hidden", "until-found");
				else element.removeAttribute("hidden");
			}, [hidden, reveal]);
			(0, react.useEffect)(() => {
				const element = ref.current;
				if (element === null) return;
				element.addEventListener("beforematch", reveal);
				return () => {
					element.removeEventListener("beforematch", reveal);
				};
			}, [reveal]);
			return ref;
		}
		/**
		* One answer-inline reasoning block wrapped in the Host's fold contract. The
		* Host computes the fold decision (turn closed, compact transcript, this node
		* is the answer) and delivers it through the `turnProcess` owner prop; when
		* folded the block hides into the Host's "thought" summary row instead of
		* staying mounted above the answer.
		*/
		function FoldableReasoning({ hidden, reveal, live, keepVisibleAfterLive, collapseDelayMs, children }) {
			/* Let the inner disclosure finish collapsing before restoring the Host fold. */
			const [visibleForLive, setVisibleForLive] = (0, react.useState)(live);
			(0, react.useLayoutEffect)(() => {
				if (live) { setVisibleForLive(true); return; }
				if (!visibleForLive || keepVisibleAfterLive) return;
				if (collapseDelayMs <= 0) { setVisibleForLive(false); return; }
				const timer = setTimeout(() => setVisibleForLive(false), collapseDelayMs);
				return () => clearTimeout(timer);
			}, [live, visibleForLive, keepVisibleAfterLive, collapseDelayMs]);
			const effectiveHidden = hidden && !visibleForLive;
			const ref = useSearchableHidden(effectiveHidden, reveal);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref,
				"data-turn-process-inline": effectiveHidden || void 0,
				children
			});
		}
		function firstLine(text) {
			const newline = text.indexOf("\n");
			return newline === -1 ? text : text.slice(0, newline);
		}
		function latestLine(text) {
			const visible = text.trimEnd();
			const newline = visible.lastIndexOf("\n");
			return newline === -1 ? visible : visible.slice(newline + 1);
		}
		/**
		* Built-in Think disclosure with a smoothed `text` feed. Chevron and row
		* click stay on the disclosure chrome, which the plugin's AnimatedDisclosure
		* renders with a height-animated body (the harness primitive would mount and
		* unmount it, which cannot glide). The row opens only while this block is
		* the streaming tail and closes as soon as thinking ends — a later block,
		* or the assistant node settling — not when the rest of the reply is
		* still streaming.
		*/
		function AnimatedReasoning({ text, running, preset, thinkAutoExpand, thinkAutoCollapse, motionReduced, logarithmicFade, shouldHoldBack, followSpeedCpsRef, followRevealScaleRef, t }) {
			const reduced = motionReduced;
			const [expanded, setExpanded] = (0, react.useState)(running && thinkAutoExpand);
			/* 只有「这段推理已结束」之后的手动操作才接管这一行；推理中的手动展开仍会在本段结束时被收起。 */
			const userToggledRef = (0, react.useRef)(false);
			const wasRunningRef = (0, react.useRef)(running);
			const previousAutoCollapseRef = (0, react.useRef)(thinkAutoCollapse);
			const expandedRef = (0, react.useRef)(expanded);
			expandedRef.current = expanded;
			const followThinkBodyRef = (0, react.useRef)(true);
			const lastRunningForScrollRef = (0, react.useRef)(running);
			const summaryRef = (0, react.useRef)(null);
			const fadeRootRef = (0, react.useRef)(null);
			const localFadeSpeedRef = (0, react.useRef)(35);
			const fadeSpeedRef = followSpeedCpsRef ?? localFadeSpeedRef;
			const commitAnchorRef = (0, react.useRef)(null);
			const displayed = useSmoothStreamContent(text, {
				enabled: false, // was: running && !reduced（同上）
				preset,
				shouldHoldBack,
				speedCpsRef: fadeSpeedRef,
				revealScaleRef: followRevealScaleRef,
				onRevealCommit: () => {
					notifyFollowCommit(commitAnchorRef.current);
				}
			});
			const shown = running && !reduced ? displayed : text;
			const summary = running ? latestLine(shown) : firstLine(text);
			useLogarithmicFade(fadeRootRef, false, running, fadeSpeedRef); // 同上
			(0, react.useLayoutEffect)(() => {
				const wasRunning = wasRunningRef.current;
				wasRunningRef.current = running;
				const autoCollapseJustEnabled = !previousAutoCollapseRef.current && thinkAutoCollapse;
				previousAutoCollapseRef.current = thinkAutoCollapse;
				if (!userToggledRef.current) {
					if (running) {
						/* 进入思考：按设置自动展开。 */
						setExpanded(thinkAutoExpand);
					} else if ((wasRunning || autoCollapseJustEnabled) && thinkAutoCollapse && expandedRef.current) {
						/* reasoning → 结算：只有确实展开着才收回。 */
						setExpanded(false);
					}
				}
				notifyFollowCommit(commitAnchorRef.current);
			}, [running, thinkAutoExpand, thinkAutoCollapse]);
			(0, react.useEffect)(() => {
				const element = summaryRef.current;
				if (element === null) return;
				/* 滚动交回官方：不再驱动摘录横向滚动。 */
			}, [running, summary]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: TypewriterAssistantNodeView_module_css_default.follow,
				ref: commitAnchorRef,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: TypewriterAssistantNodeView_module_css_default.think,
					"data-variant": "think",
					"data-state": running ? "running" : "ok",
					"aria-label": "think live=" + (running ? "1" : "0") + " auto=" + (thinkAutoExpand ? "1" : "0") + " open=" + (expanded ? "1" : "0"),
					children: [running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: TypewriterAssistantNodeView_module_css_default.visuallyHidden,
						children: t("row.running")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedDisclosure, {
						rowClassName: TypewriterAssistantNodeView_module_css_default.thinkRow,
						leadingClassName: TypewriterAssistantNodeView_module_css_default.thinkLeading,
						titleClassName: TypewriterAssistantNodeView_module_css_default.thinkTitle,
						chevronClassName: TypewriterAssistantNodeView_module_css_default.thinkChevron,
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconThinkOutlineRegular, { size: 14 }),
						title: "Think",
						open: expanded,
						onToggle: () => {
							/* 推理中的手动展开不设豁免：本段结束照样按设置收起；已完成的思考点开后才交给读者。 */
							if (!running) userToggledRef.current = true;
							setExpanded((value) => !value);
						},
						bodyTransition: !reduced,
						collapsedContent: void 0,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							ref: fadeRootRef,
							className: TypewriterAssistantNodeView_module_css_default.thinkBody,
							children: shown
						})
					})]
				})
			});
		}
		/**
		* Assistant node renderer for the typewriter overlay. Text observed while
		* streaming is revealed by the smoother through the Harness Markdown
		* renderer at a rate that tracks arrival. Reasoning blocks keep the
		* built-in Think disclosure and only receive a smoothed text feed; the
		* outer node owns conversation-port follow while streaming; the final text
		* block keeps ownership while its settled reveal queue drains. The FPS guard
		* holds offscreen reveals when the frame rate is degraded. Settled text
		* renders with the full Markdown pipeline.
		*/
		const TypewriterAssistantNodeView = (0, react.memo)(function TypewriterAssistantNodeView({ mode: _mode = DEFAULT_STREAM_CONFIG.mode, preset = DEFAULT_STREAM_CONFIG.preset, revealCharsPerSec: _revealCharsPerSec = DEFAULT_STREAM_CONFIG.revealCharsPerSec, scrollSpeedPxPerSec: _scrollSpeedPxPerSec = DEFAULT_STREAM_CONFIG.scrollSpeedPxPerSec, maxScrollSpeedPxPerSec: _maxScrollSpeedPxPerSec = DEFAULT_STREAM_CONFIG.maxScrollSpeedPxPerSec, thinkAutoExpand = DEFAULT_STREAM_SETTINGS.thinkAutoExpand, thinkAutoCollapse = true, logarithmicFade = DEFAULT_STREAM_SETTINGS.logarithmicFade, controlScroll = true, motionPreference = DEFAULT_STREAM_SETTINGS.motionPreference, node, useTurnData, openFile, loadImage, fileMentions, turnProcess, t }) {
			const data = node.data;
			const streaming = data.status === "running";
			const reduced = useMotionReduced(motionPreference);
			const reasoningHidden = turnProcess !== void 0 && turnProcess.foldable && turnProcess.spec.answerStep === data.step && turnProcess.spec.inlineReasoning && !turnProcess.open;
			const revealProcess = (0, react.useCallback)(() => {
				turnProcess?.setOpen(true);
			}, [turnProcess]);
			const { ref: guardRef, shouldHoldBack } = useFpsGuard(streaming);
			const rootSpeedRef = (0, react.useRef)(35);
			const rootRevealedCharsRef = (0, react.useRef)(0);
			const rootRevealScaleRef = (0, react.useRef)(1);
			const reasoningTailIndex = streaming ? findLiveReasoningIndex(data.blocks) : -1;
			const reasoningOwnsSpeed = reasoningTailIndex !== -1;
			const rootPredictiveRef = (0, react.useRef)(false);
			const previousReasoningTailRef = (0, react.useRef)(-1);
			if (reasoningTailIndex !== previousReasoningTailRef.current) {
				rootPredictiveRef.current = false;
				if (!reasoningOwnsSpeed) rootSpeedRef.current = 35;
				previousReasoningTailRef.current = reasoningTailIndex;
			}
			const updateTextPrediction = (0, react.useMemo)(() => (predictive) => {
				rootPredictiveRef.current = predictive;
			}, []);
			const turn = node.location.kind === "turn" || node.location.kind === "step" ? node.location.turn : void 0;
			const tail = useTurnData("turn-tail");
			const owner = (0, react.useMemo)(() => {
				if (turn?.status !== "closed" || data.finalNode === void 0) return void 0;
				if (tail?.closing?.finalNode.seq !== data.finalNode.seq) return void 0;
				return {
					turn,
					seq: data.finalNode.seq,
					openFile
				};
			}, [
				data.finalNode,
				openFile,
				tail,
				turn
			]);
			const mentions = (0, react.useMemo)(() => owner === void 0 ? void 0 : fileMentions(owner), [fileMentions, owner]);
			const markdownLabels = (0, react.useMemo)(() => ({
				code: {
					copyLabel: t("copy"),
					copiedLabel: t("copied")
				},
				footnotes: t("markdown.footnotes")
			}), [t]);
			const imageLoader = loadImage ?? (async () => {
				throw new Error(t("image.serviceUnavailable"));
			});
			if (!(streaming || data.status === "interrupted" || data.blocks.some((block) => block.kind !== "tool-call"))) return null;
			const announcementText = data.blocks.filter((block) => block.kind === "text").map((block) => block.text).join("\n");
			const rendered = [];
			const last = data.blocks.length - 1;
			let lastFollow = -1;
			for (let index = 0; index < data.blocks.length; index += 1) {
				const kind = data.blocks[index]?.kind;
				if (kind === "text" || kind === "reasoning") lastFollow = index;
			}
			for (let index = 0; index < data.blocks.length; index += 1) {
				const block = data.blocks[index];
				if (block === void 0) continue;
				switch (block.kind) {
					case "text":
						rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedMarkdownText, {
							text: block.text,
							labels: markdownLabels,
							fileMentions: mentions,
							streaming,
							logarithmicFade: logarithmicFade && data.status !== "interrupted",
							motionReduced: reduced,
							ownFollow: !streaming && index === lastFollow,
							followSpeedCpsRef: index === lastFollow ? rootSpeedRef : void 0,
							followRevealedCharsRef: index === lastFollow ? rootRevealedCharsRef : void 0,
							followRevealScaleRef: index === lastFollow ? rootRevealScaleRef : void 0,
							onPredictiveChange: index === lastFollow ? updateTextPrediction : void 0,
							preset,
							shouldHoldBack,
							controlScroll
						}, index));
						break;
					case "reasoning":
						rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FoldableReasoning, {
							hidden: shouldHideReasoning(reasoningHidden, streaming, thinkAutoExpand, data.blocks, index),
							live: streaming && thinkAutoExpand && isReasoningLive(data.blocks, index),
							keepVisibleAfterLive: shouldKeepReasoningDuringHandoff(thinkAutoCollapse, node.location?.turn?.status),
							collapseDelayMs: reduced ? 0 : 240,
							reveal: revealProcess,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AnimatedReasoning, {
								text: block.text,
								running: streaming && isReasoningLive(data.blocks, index),
								preset,
								thinkAutoExpand,
								thinkAutoCollapse,
								logarithmicFade: logarithmicFade && data.status !== "interrupted",
								motionReduced: reduced,
								shouldHoldBack,
								followSpeedCpsRef: reasoningOwnsSpeed && index === reasoningTailIndex ? rootSpeedRef : void 0,
								followRevealScaleRef: reasoningOwnsSpeed && index === reasoningTailIndex ? rootRevealScaleRef : void 0,
								t
							})
						}, index));
						break;
					case "image": {
						const start = index;
						const group = [block];
						while (index + 1 < data.blocks.length) {
							const next = data.blocks[index + 1];
							if (next === void 0 || next.kind !== "image") break;
							group.push(next);
							index += 1;
						}
						rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_attachment.ImageGallery, {
							images: group,
							load: imageLoader,
							align: "start",
							labels: imageLabels(t)
						}, start));
						break;
					}
					case "tool-call": break;
					case "other": rendered.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.JsonBlock, {
						label: t("message.unknownBlock"),
						payload: block.block,
						truncatedLabel: (total) => t("json.truncated", { total })
					}, index));
				}
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: guardRef,
				className: TypewriterAssistantNodeView_module_css_default.root,
				"data-streaming": streaming || void 0,
				"data-group-open": turnProcess !== void 0 && turnProcess.open ? "1" : "0",
				"data-group-foldable": turnProcess !== void 0 && turnProcess.foldable ? "1" : "0",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StreamAnnouncement, {
					text: announcementText,
					active: streaming && !reduced
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FollowHost, {
					active: streaming && !reduced,
					speedCpsRef: rootSpeedRef,
					revealedCharsRef: rootRevealedCharsRef,
					revealScaleRef: rootRevealScaleRef,
					predictiveRef: rootPredictiveRef,
					controlScroll,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: TypewriterAssistantNodeView_module_css_default.body,
						children: [rendered, data.status === "interrupted" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: TypewriterAssistantNodeView_module_css_default.stopped,
							children: t("message.stopped")
						})]
					})
				})]
			});
		});
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
					const kind = name === "todo_write" ? "task" : ["create_goal", "update_goal", "get_goal"].includes(name) ? "goal" : ["bash", "pwsh", "run_code", "exec_command", "write_stdin"].includes(name) || name?.startsWith("terminal_") ? "command" : ["read", "read_file", "read_text_file", "read_image", "view_image", "list_dir", "list_directory", "web_fetch"].includes(name) ? "read" : ["web_search", "file_search", "search_files", "grep", "glob"].includes(name) || name?.endsWith("_inspect") ? "search" : ["edit", "write", "apply_patch", "str_replace_editor"].includes(name) ? "edit" : "other";
					{
						let args = {};
						try { args = JSON.parse(block.call?.argsRaw ?? "{}"); } catch { /* Partial arguments: use tool name. */ }
						if (args === null || typeof args !== "object") args = {};
						const title = kind === "task" ? "任务清单" : kind === "goal" ? name === "create_goal" ? "创建目标" : name === "update_goal" ? "更新目标" : "查看目标" : kind === "command" ? "命令" : kind === "search" ? "搜索" : kind === "read" ? "读取" : kind === "edit" ? "编辑" : String(name ?? "工具");
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
				actions: highlights.actions.filter((action) => action.kind === "edit" ? settings.showEditedFiles : action.kind === "goal" ? settings.showGoals : action.kind === "command" ? settings.showCommands : action.kind === "read" ? settings.showReads : action.kind === "search" ? settings.showSearches : action.kind === "other" && settings.showOtherTools)
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
				const labeled = ["other", "goal"].includes(action.kind) ? (failed ? "失败 · " : "") + action.title + (detail === action.title ? "" : " · " + detail) : action.text;
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
		const THINK_SETTINGS_DEFAULTS = { autoExpand: true, autoCollapse: true, controlScroll: true, imageSettle: true, showTaskUpdates: true, showGoals: true, showEditedFiles: true, showThoughtSummary: true, showCommands: true, showReads: false, showSearches: false, showOtherTools: false };
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