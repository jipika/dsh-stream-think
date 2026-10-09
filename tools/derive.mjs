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

/** Think 摘录只选最近的实质性句子；切到新句时翻页，流式添字不反复重播。 */
const THOUGHT_SUMMARY_PICKER = String.raw`
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
/**
 * 图片加载后补回底部（2026-10-07）。
 *
 * 背景（实测取证，见 README「2026-10-07 图片撑高」段）：
 *   会话里的 `<img>` 在文本渲染后才解码完成，会把所在行撑高（实测一条 user 行
 *   118px → 406px，+288px）。官方 scroll restoration 只在渲染完成时贴一次底，
 *   图片随后撑高就把位置留在了"偏上一点"处 —— 用户看到的现象就是
 *   「明明滚到底了，切回去却在底部偏上」。
 *
 * 本模块只做一件事：当**图片撑高了内容**、且**撑高前那一刻本来就是贴底的**，
 * 把位置补回底部。任何其它情况一律不碰。
 *
 * 安全闸门（缺一不可，任一不满足就完全不动）：
 *   ① 开关 imageSettle 必须为真；
 *   ② 只响应 img 的 load/error（即"图片撑高"这一个原因），不做通用高度跟随；
 *   ③ 撑高前必须贴底（slack <= 2px）—— 读者停在中间时绝不补位；
 *   ④ 距上次「读者主动滚动」超过 QUIET_MS（读者没有任何近期平移意图）；
 *   ⑤ 会话切换后只观察 ARMED_MS 窗口，之后彻底撒手，不再管任何高度变化；
 *   ⑥ 同一次撑高只补一次（按内容高度去重），避免与官方反复争夺。
 *
 * 写入范围：只写 [data-conversation-scroll].scrollTop，且只在上述闸门全开时。
 * 不写样式、不造预留、不改任何元素属性。
 */
/**
 * 图片宽高比占位（治本，2026-10-07）。
 *
 * 病根（实测取证，见 README「2026-10-07 图片撑高」段）：
 *   消息里的图片（`dsh-codex-subscription` 的 `MessageImagePreview`）渲染
 *   `<img src alt>` 时**不带任何尺寸**，CSS 又是 `height:auto; max-height:320px`。
 *   于是图片解码完成前该行内容高度近似为零，解码后才被撑开。
 *
 *   官方 ChatViewport 靠 ResizeObserver 观察内容列来跟随底部，必须等布局提交后
 *   才收到通知，所以「内容撑高」与「滚动位置修正」天然隔了一帧：那一帧是用户
 *   看到的「先上去」，下一帧被修正回来就是「再下来」。这个 1 帧窗口无法从跟随侧
 *   消除，只能从「别让它撑高」入手。
 *
 * 治法：在图片**解码之前**把宽高比写进 `style.aspect-ratio`，内容高度第一次渲染
 * 就是最终值，撑高从机制上不再发生（实测：插入前写占位 → 行高从插入那刻起即最终
 * 值，跳动 0px）。
 *
 * 尺寸来源（同步可得，按可靠性排序）：
 *   ① React fiber 上的 `image.attachment.width/height`（官方渲染时就带着；
 *      实测从 `__reactFiber$*` 起点向上 1 层即命中）；
 *   ② 已解码图片的 `naturalWidth/naturalHeight`（兜底）。
 *   两者都读不到就什么都不做 —— 绝不猜比例，那会把高度写错。
 *
 * 写入范围：只写 `img.style.aspectRatio`（并且只在图片尚未解码、尚无任何比例来源时）。
 */
const IMAGE_PLACEHOLDER = String.raw`
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

`;

const IMAGE_SETTLE = String.raw`
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

`;
const FOLLOW_SESSION_ISOLATION = String.raw`
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
				const [clock, setClock] = (0, react.useState)({ previous: "", current: "", sequence: 0 });
				const [highlights, setHighlights] = (0, react.useState)({ files: [], thoughts: [], actions: [] });
				const [openGroups, setOpenGroups] = (0, react.useState)({});
				const [visitedGroups, setVisitedGroups] = (0, react.useState)({});
				const [openThought, setOpenThought] = (0, react.useState)(null);
				const detailSettings = (0, react.useSyncExternalStore)(subscribeThinkSettings, getThinkSettings, getThinkSettings);
				const detailsEnabled = detailSettings.showTaskUpdates || detailSettings.showGoals || detailSettings.showEditedFiles || detailSettings.showThoughtSummary || detailSettings.showCommands || detailSettings.showReads || detailSettings.showSearches || detailSettings.showOtherTools;
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
				const oldParts = clockLabelParts(clock.previous);
				const parts = clockLabelParts(clock.current);
				const animate = canAnimateClockChange(clock.previous, clock.current);
				const content = parts.map((part, i) => {
					if (!animate || i % 2 === 0 || part === oldParts[i]) return part;
					return (0, react.createElement)("span", { className: "dsh-stream-think-clock-number", key: clock.sequence + ":" + i },
						(0, react.createElement)("span", { className: "dsh-stream-think-clock-old" }, oldParts[i]),
						(0, react.createElement)("span", { className: "dsh-stream-think-clock-next" }, part));
				});
				const visible = visibleProcessHighlights(props.nativeHighlights ?? highlights, detailSettings);
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
`

/** 思考行行为与折叠过程摘要设置。 */
const THINK_SETTINGS_BLOCK = [
  '\t\t//#region dsh-stream-think: 思考行展开设置（localStorage，不依赖 Host）',
  '\t\t/** 展开/收起/预览行数全部由本插件决定，改完立刻生效，不需要重启。 */',
  '\t\tconst THINK_SETTINGS_KEY = "dsh-stream-think:settings.v1";',
  '\t\tconst THINK_SETTINGS_DEFAULTS = { autoExpand: true, autoCollapse: true, controlScroll: true, imageSettle: true, showTaskUpdates: true, showGoals: true, showEditedFiles: true, showThoughtSummary: true, showCommands: true, showReads: false, showSearches: false, showOtherTools: false };',
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
  '\t\t\t\t\t\tif (typeof parsed.showGoals === "boolean") out.showGoals = parsed.showGoals;',
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
  '\t\t\t\t\t\tif (typeof parsed.imageSettle === "boolean") out.imageSettle = parsed.imageSettle;',
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
  '\t\t\ttry {',
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
  '\t\t\treturn h("div", { className: "dsh-stream-think-set" },',
  '\t\t\t\th("div", { className: "dsh-stream-think-set-desc" },',
  '\t\t\t\t\t"勾选的类别会直接出现在对话中，各类独立合并，点击标题展开；原生过程组的折叠不影响这些分类。修改立即生效并保存在本机。"),',
  '\t\t\t\t/* 展开/收起已交回官方（官方 Think 行默认收起、点开才展开），两个开关一并移除。 */',
  '\t\t\t\trow("controlScroll", "跟随动画（已停用）",',
  '\t\t\t\t\t"跟随已整条交回官方：本插件不再操作会话滚动。开关保留但当前没有任何效果。",',
  '\t\t\t\tswitchBtn(s.controlScroll, "平滑跟随动画（已停用）", "stream-think-control-scroll",',
  '\t\t\t\t\t() => updateThinkSettings({ controlScroll: !s.controlScroll }))),',
  '\t\t\t\trow("imageSettle", "图片加载后补回底部",',
  '\t\t\t\t\ts.imageSettle',
  '\t\t\t\t\t\t? "切回会话时若图片撑高了内容而落到偏上，自动补回底部（默认）"',
  '\t\t\t\t\t\t: "已关闭：偏上时不自动补位，由官方自身行为决定",',
  '\t\t\t\t\tswitchBtn(s.imageSettle, "图片加载后补回底部", "stream-think-image-settle",',
  '\t\t\t\t\t\t() => updateThinkSettings({ imageSettle: !s.imageSettle }))),',
  '\t\t\t\th("div", { className: "dsh-stream-think-set-heading" }, "直接显示在对话中"),',
  '\t\t\t\trow("showTaskUpdates", "任务清单", "显示最近一次有效清单及更新次数（默认）",',
  '\t\t\t\t\tswitchBtn(s.showTaskUpdates, "在对话中显示任务清单", "stream-think-show-task-updates", () => updateThinkSettings({ showTaskUpdates: !s.showTaskUpdates }))),',
  '\t\t\t\trow("showGoals", "目标操作", "目标的创建、更新与查看，独立于任务清单（默认）",',
  '\t\t\t\t\tswitchBtn(s.showGoals, "在对话中显示目标操作", "stream-think-show-goals", () => updateThinkSettings({ showGoals: !s.showGoals }))),',
  '\t\t\t\trow("showEditedFiles", "文件编辑", "显示本轮成功写入或编辑的所有文件（默认）",',
  '\t\t\t\t\tswitchBtn(s.showEditedFiles, "在对话中显示已修改文件", "stream-think-show-edited-files", () => updateThinkSettings({ showEditedFiles: !s.showEditedFiles }))),',
  '\t\t\t\trow("showThoughtSummary", "思考摘录", "每段已完成思考提取一句实质内容；点击查看原文（默认）",',
  '\t\t\t\t\tswitchBtn(s.showThoughtSummary, "在对话中显示思考摘录", "stream-think-show-thought-summary", () => updateThinkSettings({ showThoughtSummary: !s.showThoughtSummary }))),',
  '\t\t\t\trow("showCommands", "命令与代码执行", "从已完成的命令提取简短描述；失败会标记（默认）",',
  '\t\t\t\t\tswitchBtn(s.showCommands, "在对话中显示命令与代码执行", "stream-think-show-commands", () => updateThinkSettings({ showCommands: !s.showCommands }))),',
  '\t\t\t\trow("showReads", "读取与查看", "文件、图片、目录与网页内容；默认关闭以减少噪音",',
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

/**
 * 按上游 bundler 输出的 //#region 边界整段删除一个模块（连同它的 CSS region）。
 * 按 region 名定位而非行号，因此多个删除互不影响；边界缺失即记为失败。
 */
function removeRegion(source, name, regionName) {
  const startMarker = `\t\t//#region ${regionName}\n`
  const start = source.indexOf(startMarker)
  if (start < 0) {
    failures.push(`${name}: 找不到 region ${regionName}`)
    return source
  }
  const endMarker = '\t\t//#endregion\n'
  const end = source.indexOf(endMarker, start)
  if (end < 0) {
    failures.push(`${name}: region ${regionName} 缺 //#endregion`)
    return source
  }
  return swap(source, name, source.slice(start, end + endMarker.length), '')
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
  out = swap(out, 'client/turn-process-clock-wrapper', 'const next = wrapFollowNodeView(inner, useControlScroll);', 'const next = key === "turn-process" ? wrapTurnProcessClockNodeView(inner) : key === "command" ? wrapBtwCommandNodeView(inner) : inner;')
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
  out = swap(out, 'client/isReasoningLive-insert', '\t\tfunction processHighlights(', IS_REASONING_LIVE + '\t\tfunction processHighlights(')
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
    'function AnimatedReasoning({ text, running, preset, thinkAutoExpand, thinkAutoCollapse, motionReduced,',
  )
  out = swap(
    out,
    'client/reasoning-state',
    [
      '\t\t\tconst [autoClosed, setAutoClosed] = (0, react.useState)(false);',
      '\t\t\tconst summaryRef = (0, react.useRef)(null);',
    ].join('\n'),
    [
      '\t\t\t/* 只有「这段推理已结束」之后的手动操作才接管这一行；推理中的手动展开仍会在本段结束时被收起。 */',
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
      '\t\t\t\t\t\t\t/* 推理中的手动展开不设豁免：本段结束照样按设置收起；已完成的思考点开后才交给读者。 */',
      '\t\t\t\t\t\t\tif (!running) userToggledRef.current = true;',
      '\t\t\t\t\t\t\tsetExpanded((value) => !value);',
      '\t\t\t\t\t\t},',
    ].join('\n'),
  )
  out = swap(out, 'client/animate-auto-collapse', 'bodyTransition: !autoClosed,', 'bodyTransition: !reduced,')

  /* ── 用户要求「去掉影响外观的东西」：接管外壳与 Think 行不再另立一套度量，全部改回官方同源 ──
   * 官方基准（DSH 仓库 packages/client/ui-chat/src/client/chat/AssistantMarkdown.module.css
   * 与 packages/client/ui-primitives/src/DisclosureRow.module.css、chat/ReasoningRow.module.css）：
   *   .root  → font-size: var(--dsh-content-font-size, 14px) / line-height: calc(24px + var(--dsh-content-font-delta, 0px))
   *   .row   → height: calc(24px + delta)、color: tertiary、:hover 变 secondary
   *   .leading 16px 盒 + svg 14px，都随 delta 缩放；.title 用 secondary 字号档
   *   .thinkBody → padding: 4px 0 4px calc(22px + delta)，不设字号（继承 root）
   * 摘要分组（.dsh-stream-think-highlights / .dsh-stream-think-clock）是插件自己的元素，一律不动。 */
  out = swap(
    out,
    'client/think-root-typography-official',
    '.I17U7q_root{min-width:0;color:var(--dsw-alias-label-primary);flex-direction:column;font-size:16px;line-height:28px;display:flex}',
    '.I17U7q_root{min-width:0;color:var(--dsw-alias-label-primary);flex-direction:column;font-size:var(--dsh-content-font-size,14px);line-height:calc(24px + var(--dsh-content-font-delta,0px));display:flex}',
  )
  out = swap(
    out,
    'client/think-row-metrics-official',
    '.I17U7q_disclosureRow{cursor:pointer;align-items:center;min-width:0;height:24px;display:flex;position:relative;overflow:hidden}',
    '.I17U7q_disclosureRow{cursor:pointer;align-items:center;min-width:0;height:calc(24px + var(--dsh-content-font-delta,0px));color:var(--dsw-alias-label-tertiary);transition:color .1s ease;display:flex;position:relative;overflow:hidden}.I17U7q_disclosureRow:hover{color:var(--dsw-alias-label-secondary)}',
  )
  out = swap(
    out,
    'client/think-leading-metrics-official',
    '.I17U7q_disclosureLeading{width:16px;height:16px;color:var(--dsw-alias-label-tertiary);flex:none;justify-content:center;align-items:center;margin-right:6px;display:inline-flex;position:relative}',
    '.I17U7q_disclosureLeading{width:calc(16px + var(--dsh-content-font-delta,0px));height:calc(16px + var(--dsh-content-font-delta,0px));color:inherit;flex:none;justify-content:center;align-items:center;margin-right:6px;display:inline-flex;position:relative}.I17U7q_disclosureLeading svg:not([data-state]){width:calc(14px + var(--dsh-content-font-delta,0px));height:calc(14px + var(--dsh-content-font-delta,0px))}',
  )
  out = swap(
    out,
    'client/think-title-typography-official',
    '.I17U7q_disclosureTitle{color:var(--dsw-alias-label-secondary);flex:none;font-size:14px;line-height:24px}',
    '.I17U7q_disclosureTitle{color:inherit;flex:none;font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(24px + var(--dsh-content-font-delta,0px))}',
  )
  out = swap(
    out,
    'client/think-body-metrics-official',
    '.I17U7q_thinkBody{color:var(--dsw-alias-label-tertiary);white-space:pre-wrap;word-break:break-word;padding:4px 0 4px 22px;font-size:14px;line-height:24px}',
    '.I17U7q_thinkBody{color:var(--dsw-alias-label-tertiary);white-space:pre-wrap;word-break:break-word;padding:4px 0 4px calc(22px + var(--dsh-content-font-delta,0px));min-width:0}',
  )
  // 摘录已不渲染（见 client/think-summary-removed），连同扫描光斑一起删掉死样式。
  out = swap(
    out,
    'client/think-summary-css-removed',
    '.I17U7q_thinkSummary{min-width:0;color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;flex:auto;font-size:14px;line-height:24px;overflow:hidden}.I17U7q_thinkSummary[data-follow-end]{text-overflow:clip}',
    '',
  )
  out = swap(
    out,
    'client/think-separator-css-removed',
    '.I17U7q_thinkSeparator{background:var(--dsw-alias-label-caption);border-radius:1px;flex:none;width:2px;height:2px;margin:0 8px}',
    '',
  )
  out = swap(
    out,
    'client/think-sweep-removed',
    '.I17U7q_think[data-state=running] .I17U7q_thinkRow:after{content:\\"\\";inset-block:0;background:linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent) 55%, transparent 100%);pointer-events:none;width:300px;animation:2.6s ease-out infinite I17U7q_dsh-smooth-stream-think-sweep;position:absolute;left:0}@keyframes I17U7q_dsh-smooth-stream-think-sweep{0%{left:-300px}90%,to{left:100%}}',
    '',
  )
  out = swap(
    out,
    'client/think-stopped-radius-official',
    'border-radius:6px;align-self:flex-start;padding:0 6px;font-size:11px;line-height:18px}',
    'border-radius:var(--dsw-radius-sm);align-self:flex-start;padding:0 6px;font-size:11px;line-height:18px}',
  )
  // 规则删掉后，CSS module 的导出映射里还留着三条永不使用的条目（thinkRow 仍在用，不能删）。
  out = swap(out, 'client/think-summary-map-removed', ['', '\t\t\t"thinkSummary": "I17U7q_thinkSummary",'].join('\n'), '')
  out = swap(out, 'client/think-separator-map-removed', ['', '\t\t\t"thinkSeparator": "I17U7q_thinkSeparator",'].join('\n'), '')
  out = swap(out, 'client/think-sweep-map-removed', ['', '\t\t\t"dsh-smooth-stream-think-sweep": "I17U7q_dsh-smooth-stream-think-sweep",'].join('\n'), '')

  /* ── 死代码清理（第一批：整段无外部引用的 region）────────────────────────────
   * 判定手法：把 region 内每个顶层符号在「region 之外」搜一遍，全为 0 才整段删；
   * 同时删掉锚点落在该 region 里、随宿主一起消失的旧补丁。
   *   · useProgressiveDomText.ts：外部引用只有 TypewriterToolNodeView region 里的
   *     useProgressiveDomText(hostRef, …)（它自己的补丁改的就是这行）。 */
  out = removeRegion(out, 'client/progressive-dom-text-removed', 'src/client/useProgressiveDomText.ts')
  /* TypewriterToolNodeView.tsx（6 个顶层符号：openAgentLocation / isGrowingChatNode /
   * isFollowableChatNode / shouldAnimateChatNodeEntrance / liveAgentTailMode / wrapFollowNodeView，
   * region 外引用全为 0）与只被它引用的 AgentRowEntrance CSS。随宿主消失的 5 条旧补丁
   * （scroll-entrance / scroll-runtime-handoff / reveal-disabled-dom / scroll-growth-pulse /
   * entrance-attr）已在上面的补丁表里改成注释。 */
  out = removeRegion(out, 'client/tool-node-view-removed', 'src/client/TypewriterToolNodeView.tsx')
  out = removeRegion(out, 'client/agent-row-entrance-css-removed', '\\0dsh-css:/Users/dzlin/work/project/dsh-smooth-stream/src/client/AgentRowEntrance.module.css.mjs')

  /* ── 死代码清理（第三批：打字机渲染器与 boot 配置桥）────────────────────────
   * StreamConfiguredView 自 06f4995（assistant-step 交回官方）起不再被注册；
   * 它引用的 boot 配置（readBootConfig）随之只剩一个调用点。anchor 用「补丁表跑完
   * 之后」的文本，因此 configured 块里已是 thinkPrefs.* 形态。 */
  out = swap(
    out,
    'client/typewriter-configured-view-removed',
    [
      '\t\t\tconst configured = function StreamConfiguredView(props) {',
      '\t\t\t\tconst preferences = (0, react.useSyncExternalStore)(settings.subscribe, settings.getSnapshot, settings.getSnapshot);',
      '\t\t\t\treturn (0, react.createElement)(TypewriterAssistantNodeView, {',
      '\t\t\t\t\t...props,',
      '\t\t\t\t\tmode: config.mode,',
      '\t\t\t\t\tpreset: config.preset,',
      '\t\t\t\t\trevealCharsPerSec: config.revealCharsPerSec,',
      '\t\t\t\t\tscrollSpeedPxPerSec: config.scrollSpeedPxPerSec,',
      '\t\t\t\t\tmaxScrollSpeedPxPerSec: config.maxScrollSpeedPxPerSec,',
      '\t\t\t\t\tthinkAutoExpand: preferences.thinkAutoExpand,',
      '\t\t\t\t\tlogarithmicFade: preferences.logarithmicFade,',
      '\t\t\t\t\tcontrolScroll: preferences.controlScroll,',
      '\t\t\t\t\tmotionPreference: preferences.motionPreference',
      '\t\t\t\t});',
      '\t\t\t};',
    ].join('\n'),
    '\t\t\t/* 打字机渲染器已交回官方：StreamConfiguredView 死代码移除。 */',
  )
  /* boot 配置行已由 client/apply-settings-panel 一并去掉（打字机渲染器不再需要它）。 */
  out = swap(
    out,
    'client/boot-config-removed',
    [
      '\t\t/**',
      '\t\t* Read the Host-bridged boot config. The inline script is produced by this',
      "\t\t* plugin's Host half from a schema-validated value, so only the structural",
      '\t\t* guarantees that could break between the two halves are re-checked: the',
      '\t\t* global is absent when the client runs without its Host entry (defaults',
      '\t\t* apply), and any present-but-malformed value fails loudly instead of',
      '\t\t* rendering a half-configured view.',
      '\t\t* @returns The resolved configuration for the assistant node view.',
      '\t\t*/',
      '\t\tfunction readBootConfig() {',
      '\t\t\tconst raw = globalThis[STREAM_BOOT_GLOBAL];',
      '\t\t\tif (raw === void 0) {',
      '\t\t\t\tconsole.info("[dsh-stream-think] no host config bridge; using defaults");',
      '\t\t\t\treturn DEFAULT_STREAM_CONFIG;',
      '\t\t\t}',
      '\t\t\tif (typeof raw !== "object" || raw === null || !STREAM_MODES.includes(raw.mode) || !STREAM_PRESETS.includes(raw.preset) || typeof raw.revealCharsPerSec !== "number" || typeof raw.scrollSpeedPxPerSec !== "number" || typeof raw.maxScrollSpeedPxPerSec !== "number") throw new Error(`[dsh-stream-think] malformed ${STREAM_BOOT_GLOBAL} boot global: ${JSON.stringify(raw)}`);',
      '\t\t\treturn raw;',
      '\t\t}',
    ].join('\n'),
    '\t\t/* boot 配置桥已随打字机渲染器移除：客户端不再读 __DSH_STREAM_THINK_CONFIG__。 */',
  )
  // 第四批（上游设置数据源链）必须排在所有补丁之后执行 —— 它的 anchor 依赖
  // client/upstream-seats-removed 写下的注释与 client/all-rows-share-scroll-setting
  // 重写后的 useControlScroll，见文件末尾。

  /* ── Think 行交回官方（不再有自动展开，也没有插件那套摘录）─────────────────
   * 用户拍板「Think 自动展开去掉、摘录恢复官方」：删掉 assistant-step 的 -100 注册，
   * 官方 ReasoningRow 因此回归（默认收起、运行中/结算后自带一行摘录、点开才看全文）。
   * wrapAgentChatRows 必须留下 —— 它同时负责把摘要座位包到 turn-process 节点上。 */
  out = swap(
    out,
    'client/assistant-step-takeover-removed',
    [
      '\t\t\tctx.slots.inject("conversation.chat.node", () => {',
      '\t\t\t\tlet releaseTakeover;',
      '\t\t\t\tconst syncTakeover = () => {',
      '\t\t\t\t\tif (!settings.takeoverEnabled()) {',
      '\t\t\t\t\t\treleaseTakeover?.();',
      '\t\t\t\t\t\treleaseTakeover = void 0;',
      '\t\t\t\t\t\treturn;',
      '\t\t\t\t\t}',
      '\t\t\t\t\tif (releaseTakeover !== void 0) return;',
      '\t\t\t\t\tconst unwrap = wrapAgentChatRows(ctx, useControlScroll);',
      '\t\t\t\t\tconst unshadow = ctx.slots.register({',
      '\t\t\t\t\t\tname: "conversation.chat.node",',
      '\t\t\t\t\t\tkey: "assistant-step",',
      '\t\t\t\t\t\tpriority: -100,',
      '\t\t\t\t\t\tlocale: "conversation",',
      '\t\t\t\t\t\tregistrant: "dsh-smooth-stream"',
      '\t\t\t\t\t}, configured);',
      '\t\t\t\t\treleaseTakeover = () => {',
      '\t\t\t\t\t\tunwrap();',
      '\t\t\t\t\t\tunshadow();',
      '\t\t\t\t\t};',
      '\t\t\t\t};',
      '\t\t\t\tconst unsubscribe = settings.subscribe(syncTakeover);',
      '\t\t\t\tsyncTakeover();',
      '\t\t\t\treturn () => {',
      '\t\t\t\t\tunsubscribe();',
      '\t\t\t\t\treleaseTakeover?.();',
      '\t\t\t\t};',
      '\t\t\t});',
    ].join('\n'),
    [
      '\t\t\t/* Think 行的展开与摘录已交回官方；这里只保留 turn-process 的摘要座位包装。 */',
      '\t\t\tctx.slots.inject("conversation.chat.node", () => {',
      '\t\t\t\tconst unwrap = wrapAgentChatRows(ctx, useControlScroll);',
      '\t\t\t\treturn () => {',
      '\t\t\t\t\tunwrap();',
      '\t\t\t\t};',
      '\t\t\t});',
    ].join('\n'),
  )

  // 用户明确不要「收起态 Think 摘录」：整个 collapsedContent 置空，收起时只剩图标 + 标题 + 展开箭头。
  // summary / summaryRef / thinkSummary 的 CSS 都保留（不再渲染即无影响），单点改动以免上游升级时锚点漂移。
  out = swap(
    out,
    'client/think-summary-removed',
    [
      '\t\t\t\t\t\tcollapsedContent: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {',
      '\t\t\t\t\t\t\tclassName: TypewriterAssistantNodeView_module_css_default.thinkSeparator,',
      '\t\t\t\t\t\t\t"aria-hidden": true',
      '\t\t\t\t\t\t}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {',
      '\t\t\t\t\t\t\tref: summaryRef,',
      '\t\t\t\t\t\t\tclassName: TypewriterAssistantNodeView_module_css_default.thinkSummary,',
      '\t\t\t\t\t\t\t"data-follow-end": running || void 0,',
      '\t\t\t\t\t\t\tchildren: summary',
      '\t\t\t\t\t\t})] }),',
    ].join('\n'),
    '\t\t\t\t\t\tcollapsedContent: void 0,',
  )

  // 八类摘要里的「思考摘录」类目依赖这个选句函数（行内摘录组件已移除）。
  out = swap(out, 'client/thought-summary-picker-insert', '\t\tfunction processHighlights(', THOUGHT_SUMMARY_PICKER + '\t\tfunction processHighlights(')

  // 组件签名与调用点补上新 props
  out = swap(
    out,
    'client/nodeview-defaults',
    'thinkAutoExpand = DEFAULT_STREAM_SETTINGS.thinkAutoExpand, logarithmicFade = DEFAULT_STREAM_SETTINGS.logarithmicFade,',
    'thinkAutoExpand = DEFAULT_STREAM_SETTINGS.thinkAutoExpand, thinkAutoCollapse = true, logarithmicFade = DEFAULT_STREAM_SETTINGS.logarithmicFade,',
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
  out = swap(out, 'client/session-follow-owner', '\t\t\t\tlet port = null;\n\t\t\t\tlet resize = null;', '\t\t\t\tlet port = null;\n\t\t\t\tlet boundSession = null;\n\t\t\t\tlet boundLifetime = null;\n\t\t\t\tlet stopHandoff = null;\n\t\t\t\tlet settleRafId = 0;\n\t\t\t\tconst isOriginalSession = (element) => (boundLifetime === null || currentFollowSessionLifetime(element) === boundLifetime) && element.isConnected !== false && (boundSession === null || followSessionOf(element) === boundSession);\n\t\t\t\tlet resize = null;')
  out = swap(out, 'client/session-follow-leader', '\t\t\t\tconst isLeader = (next) => followLeaders.get(next)?.owner === owner;', '\t\t\t\tconst isLeader = (next) => isOriginalSession(next) && followLeaders.get(next)?.owner === owner;')
  out = swap(out, 'client/session-follow-cancel-owner', '\t\t\t\t\t\t\towner\n\t\t\t\t\t\t});', '\t\t\t\t\t\t\towner,\n\t\t\t\t\t\t\tcancel: () => stopSessionWork()\n\t\t\t\t\t\t});')
  out = swap(out, 'client/session-follow-cancel-work', '\t\t\t\t\tif (tail !== null) resize.observe(tail);\n\t\t\t\t};\n\t\t\t\tconst frame = (now) => {', [
    '\t\t\t\t\tif (tail !== null) resize.observe(tail);',
    '\t\t\t\t};',
    '\t\t\t\tconst stopSessionWork = () => {',
    '\t\t\t\t\tcancelAnimationFrame(rafId);',
    '\t\t\t\t\tcancelAnimationFrame(settleRafId);',
    '\t\t\t\t\tstopHandoff?.();',
    '\t\t\t\t\tstopHandoff = null;',
    '\t\t\t\t\tunsubscribeCommit?.();',
    '\t\t\t\t\tresize?.disconnect();',
    '\t\t\t\t\tmutations?.disconnect();',
    '\t\t\t\t\tif (port !== null) for (const name of GESTURE_EVENTS) port.removeEventListener(name, markGesture);',
    '\t\t\t\t\tif (interactTimer !== null) clearTimeout(interactTimer);',
    '\t\t\t\t\tinteractTimer = null;',
    '\t\t\t\t\treleaseRevealScale();',
    '\t\t\t\t};',
    '\t\t\t\tconst frame = (now) => {',
  ].join('\n'))
  out = swap(out, 'client/session-follow-observer', '\t\t\t\tconst restoreBeforePaint = () => {\n\t\t\t\t\tif (!following || port === null) return;', '\t\t\t\tconst restoreBeforePaint = () => {\n\t\t\t\t\tif (!following || port === null || !isOriginalSession(port)) return;')
  out = swap(out, 'client/reader-prepaint-ownership', '\t\t\t\t\tif (!following || port === null || !isOriginalSession(port)) return;', '\t\t\t\t\tif (!following || port === null || !isOriginalSession(port)) return;\n\t\t\t\t\tif (interacting && (readerGestureIntent || readerScrolledUp(port))) return; // 原生先处理读者滚动，下一帧交还跟随。')
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
    '\t\t\t\t\tconst nextPort = root.closest("[data-conversation-scroll]");\n\t\t\t\t\tif (nextPort === null) return;\n\t\t\t\t\tconst currentSession = followSessionOf(root);\n\t\t\t\t\tif (currentSession === null) return;\n\t\t\t\t\tif (!isOriginalSession(nextPort)) { stopSessionWork(); return; }\n\t\t\t\t\tif (boundSession === null) boundSession = currentSession;\n\t\t\t\t\tisolateFollowSession(nextPort, root);\n\t\t\t\t\tboundLifetime ??= currentFollowSessionLifetime(nextPort);\n\t\t\t\t\tif (entrancePending && isFollowSessionEntryRow(root)) finishEntrance();\n\t\t\t\t\tif (followSessionActivations.has(nextPort)) return; // 等宿主恢复该会话的阅读位置后再接管。\n\t\t\t\t\tbindPort(nextPort);',
  )
  out = swap(out, 'client/session-follow-cleanup', '\t\t\t\t\tif (host === null) return;\n\t\t\t\t\tholding = null;\n\t\t\t\t\tif (!isLeader(host)) return;', '\t\t\t\t\tif (host === null) return;\n\t\t\t\t\tholding = null;\n\t\t\t\t\tif (!isOriginalSession(host)) {\n\t\t\t\t\t\tstopSessionWork();\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tif (!isLeader(host)) return;')
  out = swap(out, 'client/session-follow-disabled-cleanup', '\t\t\t\t\t\tif (disabledHost !== null) {\n\t\t\t\t\t\t\tclearVisual(disabledHost);', '\t\t\t\t\t\tif (disabledHost !== null && !isOriginalSession(disabledHost)) stopSessionWork();\n\t\t\t\t\t\telse if (disabledHost !== null) {\n\t\t\t\t\t\t\tclearVisual(disabledHost);')

  // Returning to an already-running conversation is not a new-content entrance.
  // A fresh reserve moves physical bottom before a single new character arrives;
  // the mandatory trajectory lag then only partly cancels that movement.
  // A shrinking layout clamps scrollTop automatically. Compare the last accepted
  // position against that same new floor, as the native ChatViewport does, before
  // deciding that a pointer/key interaction meant the reader scrolled upward.
  out = swap(out, 'client/reader-layout-clamp',
    '\t\tfunction readerScrolledUp(port) {\n\t\t\treturn port.scrollTop < (followScrollLedgers.get(port) ?? 0) - 8;\n\t\t}',
    '\t\tfunction readerScrolledUp(port) {\n\t\t\tconst floor = Math.max(0, port.scrollHeight - port.clientHeight);\n\t\t\tconst previousTop = Math.min(followScrollLedgers.get(port) ?? 0, floor);\n\t\t\treturn port.scrollTop < previousTop - 8;\n\t\t}')
  out = swap(out, 'client/resume-growth-state', '\t\t\t\tlet primed = false;', '\t\t\t\tlet primed = false;\n\t\t\t\tlet waitingForContentGrowth = false;\n\t\t\t\tlet resumedContentHeight = 0;')
  // 宿主（useProgressiveDomText.ts）已在死代码清理中整段移除，这条补丁随之删除。
  out = swap(out, 'client/resume-no-synthetic-reserve',
    '\t\t\t\t\t\t\treservePx = Math.max(ownedBottomSpaceOf(nextPort), predictGrowth && (hasStatus || speedCpsRef.current > 90) ? computeFollowReserve(speedCpsRef.current, tuning.runwayPx) : 0);',
    '\t\t\t\t\t\t\twaitingForContentGrowth = !entrancePending;\n\t\t\t\t\t\t\treservePx = Math.max(ownedBottomSpaceOf(nextPort), !waitingForContentGrowth && predictGrowth && (hasStatus || speedCpsRef.current > 90) ? computeFollowReserve(speedCpsRef.current, tuning.runwayPx) : 0);')
  out = swap(out, 'client/resume-native-reading-policy',
    '\t\t\t\t\t\t\tfollowing = !readerScrolledUp(nextPort) && !followReaderHolds.has(nextPort);',
    '\t\t\t\t\t\t\tfollowing = (root.closest("[data-chat-following-tail]") !== null || reportedLag <= 1) && !readerScrolledUp(nextPort) && !followReaderHolds.has(nextPort);\n\t\t\t\t\t\t\treaderReleased = !following;')
  out = swap(out, 'client/resume-growth-baseline',
    '\t\t\t\t\t\tprimed = true;\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tif (!following',
    '\t\t\t\t\t\tresumedContentHeight = Math.max(0, nextPort.scrollHeight - runwayOffsetOf(nextPort));\n\t\t\t\t\t\tprimed = true;\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tif (!following')
  out = swap(out, 'client/resume-wait-real-growth',
    '\t\t\t\t\tconst predictGrowth = predictiveRef?.current ?? predictive;\n\t\t\t\t\tconst statusElement = turnStatusOf(nextPort);',
    '\t\t\t\t\tif (waitingForContentGrowth) {\n\t\t\t\t\t\tconst naturalHeight = Math.max(0, nextPort.scrollHeight - runwayOffsetOf(nextPort));\n\t\t\t\t\t\tif (naturalHeight <= resumedContentHeight + .5) {\n\t\t\t\t\t\t\tresumedContentHeight = naturalHeight;\n\t\t\t\t\t\t\tanimatedH = naturalHeight;\n\t\t\t\t\t\t\tsetFollowScrollTop(nextPort, floor);\n\t\t\t\t\t\t\treportFollow(nextPort, true);\n\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}\n\t\t\t\t\t\twaitingForContentGrowth = false;\n\t\t\t\t\t}\n\t\t\t\t\tconst predictGrowth = predictiveRef?.current ?? predictive;\n\t\t\t\t\tconst statusElement = turnStatusOf(nextPort);')

  // 旧行结束后等待实际接管或本轮结束；固定 260ms 在工具切换稍慢时仍会清空预留并跳底。
  out = swap(out, 'client/follow-handoff-helper', '\t\tfunction useConversationFollow(rootRef, active,', FOLLOW_HANDOFF + '\t\tfunction useConversationFollow(rootRef, active,')
  out = swap(out, 'client/session-handoff-timer-guard', 'if (endTimer === null) endTimer = setTimeout(() => { stop(); finish(); }, 180);', 'if (endTimer === null) endTimer = setTimeout(() => { stop(); if (isLeader()) finish(); }, 180);')
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
      '\t\t\t\t\t\tif (turnStatusOf(host) !== null) waitForFollowHandoff(host, () => isLeader(host), () => true, finishInactive);',
      '\t\t\t\t\t\telse finishInactive();',
      '\t\t\t\t\t\treturn;',
      '\t\t\t\t\t}',
    ].join('\n'),
  )
  out = swap(out, 'client/session-handoff-cancel', 'if (turnStatusOf(host) !== null) waitForFollowHandoff(host, () => isLeader(host), () => true, finishInactive);', 'if (turnStatusOf(host) !== null) stopHandoff = waitForFollowHandoff(host, () => isLeader(host), () => true, finishInactive);')
  // controlScroll 语义收窄为「跟随动画」：跟随始终由本插件执行，开关只切平滑 / 瞬时。
  out = swap(
    out,
    'client/animation-only-switch',
    '\t\t\t(0, react.useLayoutEffect)(() => {\n\t\t\t\tif (!controlScroll) return;\n\t\t\t\tif (!active) return;',
    '\t\t\t(0, react.useLayoutEffect)(() => {\n\t\t\t\t/* dsh-stream-think：controlScroll 只表示「跟随动画」。跟随始终由本插件执行，\n\t\t\t\t * 关闭时帧循环走瞬时落底分支（client/instant-follow-mode），不再把滚动交回宿主。 */\n\t\t\t\tif (!active) return;',
  )
  out = swap(
    out,
    'client/instant-follow-mode',
    '\t\t\t\t\t\tconst lag = Math.max(0, contentHeight - animatedH - runwayOffset);\n\t\t\t\t\t\tconst step = computeFollowStep(dt, {\n\t\t\t\t\t\t\tlag,\n\t\t\t\t\t\t\tspeedEma: speedCpsRef.current,\n\t\t\t\t\t\t\tvelocityPxPerSec\n\t\t\t\t\t\t}, tuning);\n\t\t\t\t\t\tif (lag <= .1) {\n\t\t\t\t\t\t\tanimatedH = contentHeight - runwayOffset;\n\t\t\t\t\t\t\tvelocityPxPerSec = 0;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tanimatedH = Math.min(contentHeight - runwayOffset, animatedH + step.advancePx);\n\t\t\t\t\t\t\tvelocityPxPerSec = step.velocityPxPerSec;\n\t\t\t\t\t\t}',
    '\t\t\t\t\t\tconst lag = Math.max(0, contentHeight - animatedH - runwayOffset);\n\t\t\t\t\t\tif (!controlScrollRef.current) {\n\t\t\t\t\t\t\t/* 动画关闭：不按速度追赶，直接落到当前底（瞬时跟随）。 */\n\t\t\t\t\t\t\tanimatedH = contentHeight - runwayOffset;\n\t\t\t\t\t\t\tvelocityPxPerSec = 0;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconst step = computeFollowStep(dt, {\n\t\t\t\t\t\t\t\tlag,\n\t\t\t\t\t\t\t\tspeedEma: speedCpsRef.current,\n\t\t\t\t\t\t\t\tvelocityPxPerSec\n\t\t\t\t\t\t\t}, tuning);\n\t\t\t\t\t\t\tif (lag <= .1) {\n\t\t\t\t\t\t\t\tanimatedH = contentHeight - runwayOffset;\n\t\t\t\t\t\t\t\tvelocityPxPerSec = 0;\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tanimatedH = Math.min(contentHeight - runwayOffset, animatedH + step.advancePx);\n\t\t\t\t\t\t\t\tvelocityPxPerSec = step.velocityPxPerSec;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}',
  )
  out = swap(
    out,
    'client/instant-no-runway',
    'reservePx = Math.max(ownedBottomSpaceOf(nextPort), !waitingForContentGrowth && predictGrowth && (hasStatus || speedCpsRef.current > 90) ? computeFollowReserve(speedCpsRef.current, tuning.runwayPx) : 0);',
    'reservePx = controlScrollRef.current ? Math.max(ownedBottomSpaceOf(nextPort), !waitingForContentGrowth && predictGrowth && (hasStatus || speedCpsRef.current > 90) ? computeFollowReserve(speedCpsRef.current, tuning.runwayPx) : 0) : 0;',
  )
  out = swap(out, 'client/session-settle-cancel-frame', '\t\t\t\t\t\trequestAnimationFrame(settleFrame);', '\t\t\t\t\t\tsettleRafId = requestAnimationFrame(settleFrame);')
  out = swap(out, 'client/session-settle-cancel-start', '\t\t\t\t\trequestAnimationFrame(settleFrame);', '\t\t\t\t\tsettleRafId = requestAnimationFrame(settleFrame);')

  /* ── 滚动一律交回官方（2026-10-07） ─────────────────────────────────────
   * 用户判定：跟随器的实现已经不如原生，任何滚动/布局写入都可能成为 BUG 源。
   * 于是把整条滚动实现停用，只保留「不改滚动」的能力（打字机/思考行展开收起/
   * 八类摘要/计时行接管/`btw`/诊断探针）。
   *
   * 停用方式：这些写入点全部只被 useConversationFollow 的帧循环与清理路径
   * （applyVisual→ensureRunway/setFlowPad/setFollowScrollTop、releaseFollowSession、
   * finishAtNaturalFloor、FollowHost 的 onGrowth 脉冲）调用，所以关掉这个 hook
   * 的启动条件即可一次性停掉：rAF 写 scrollTop、overflowAnchor/scrollBehavior 改写、
   * runway/settle 的 marginTop/paddingBottom、flow-fill 的 minHeight、
   * 消息行 transform 位移补偿、会话隔离与交接。官方既有 [data-conversation-scroll]
   * 的自动跟随，交还后行为与未派生版本一致。
   *
   * 下面每条锚点都带来源注释；上游改版导致失配时 derive 会整份失败并报出来。 */
  // ① 主入口：跟随器永不启动（原式 useConversationFollow(rootRef, active || entrance, …)）
  out = swap(
    out,
    'client/scroll-follow-disabled',
    '\t\t\tuseConversationFollow(rootRef, active || entrance,',
    [
      '\t\t\t/* dsh-stream-think：滚动跟随整条停用（见 tools/derive.mjs「滚动一律交回官方」段）。',
      '\t\t\t * useConversationFollow 只被注释保留在下方，运行时不再被调用。 */',
      '\t\t\tif (false) useConversationFollow(rootRef, active || entrance,',
    ].join('\n'),
  )
  // ② 入场动画是跟随器的副产物（entrance 只用于 glide 首屏高度），一并停掉
  // 宿主（TypewriterToolNodeView.tsx）已整段移除：入场判定随跟随器一起消失。
  // ③ 运行时接力（未知/终态行的 handoff）同样只喂入场动画
  // 宿主（TypewriterToolNodeView.tsx）已整段移除：运行时接力代码随之消失。
  // ④ DSH 0.2 的逐字器：正文每帧增长会把官方跟随逼成离散步进，随「滚动交回」一起关掉
  //    （useSmoothStreamContent 的 enabled=false 分支走 syncImmediate，content 一变即整段落盘）
  out = swap(out, 'client/reveal-disabled-markdown', '\t\t\t\tenabled: typing && !reduced,', '\t\t\t\tenabled: false, // was: typing && !reduced（滚动交回官方：正文整段出）')
  out = swap(out, 'client/reveal-disabled-think', '\t\t\t\tenabled: running && !reduced,', '\t\t\t\tenabled: false, // was: running && !reduced（同上）')
  //    注意锚点只覆盖到第二个实参，行内注释必须用 /* */ —— `//` 会把后面的实参一起注释掉
  // 宿主（TypewriterToolNodeView.tsx）已整段移除：逐字器调用随宿主消失。
  // ⑤ 对数渐隐是逐字器的高光副产物，没有逐字就没有它
  out = swap(out, 'client/log-fade-disabled-markdown', '\t\t\tuseLogarithmicFade(followRootRef, logarithmicFade && !reduced, live, speedCpsRef);', '\t\t\tuseLogarithmicFade(followRootRef, false, live, speedCpsRef); // 滚动交回官方：不逐字 → 不渐隐')
  out = swap(out, 'client/log-fade-disabled-think', '\t\t\tuseLogarithmicFade(fadeRootRef, logarithmicFade && !reduced && expanded, running, fadeSpeedRef);', '\t\t\tuseLogarithmicFade(fadeRootRef, false, running, fadeSpeedRef); // 同上')
  // ⑥ FollowHost 的 onGrowth 脉冲只为跟随器再武装一次 glide → 交给 wrapped 组件时不传
  // 宿主（TypewriterToolNodeView.tsx）已整段移除：onGrowth 脉冲参数随宿主消失。
  // ⑦ entrance 属性只服务那条 glide 动画（[data-entrance=active]），不再被点亮
  // 宿主（TypewriterToolNodeView.tsx）已整段移除：entrance 属性随宿主消失。
  // ⑧ 思考摘录自实现的横向滚动（推理中把摘录拖到尾部）也去掉，交给原生渲染
  out = swap(out, 'client/summary-scrollleft-disabled', '\t\t\t\telement.scrollLeft = running ? element.scrollWidth - element.clientWidth : 0;', '\t\t\t\t/* 滚动交回官方：不再驱动摘录横向滚动。 */')


  /* ── 原生计时行接管：撤销（2026-10-07） ────────────────────────────────
   * 用户只要摘要，不要「计时数字 / 过程标题过渡」。撤销范围严格限定在 clock：
   *   ① 读按钮标签的 MutationObserver + clock 状态
   *   ② clockLabelParts/canAnimateClockChange 数字逐位过渡
   *   ③ .dsh-stream-think-clock-overlay 那层 span
   *   ④ clock 专属 CSS 与 data-clock-ready 属性
   * 摘要（turn-process-overlay）整套保留：highlights 状态、processHighlights 读取、
   * .dsh-stream-think-highlights 渲染与八类分组开关都不动。
   * 摘要本就只用 `.dsh-stream-think-clock:has(.dsh-stream-think-highlights)` 做样式钩子，
   * 因此容器 div 与类名保留（改名会连带改 6 条 CSS 选择器，收益为零）。 */
  // ① 宿主的运行状态行不再被观察/改写 — live-* 与 process-title* 在注入块里早已无任何 DOM 使用，
  //    这里连 CSS 一起删掉（process-label 是摘要展开用的，保留）
  out = swap(
    out,
    'client/turn-process-live-css-removed',
    [
      '\t\t\t"[data-chat-running] .dsh-stream-think-live-content{position:relative}",',
      '\t\t\t"[data-chat-running] .dsh-stream-think-live-native{position:absolute;opacity:0;pointer-events:none}",',
      '\t\t\t"[data-chat-running] .dsh-stream-think-live-overlay{display:inline-block;min-width:0;white-space:nowrap;pointer-events:none;color:inherit;font:inherit;line-height:inherit;font-variant-numeric:tabular-nums}",',
    ].join('\n'),
    '\t\t\t/* 原生计时行接管已撤销：live-content / live-native / live-overlay 三条 CSS 一并删除 */',
  )
  out = swap(
    out,
    'client/turn-process-title-css-removed',
    [
      '\t\t\t"[data-step-process] button[data-process-activity].dsh-stream-think-process-title{position:relative;min-width:0;max-width:100%;overflow:visible}",',
      '\t\t\t".dsh-stream-think-process-title .dsh-stream-think-process-native{position:absolute;opacity:0;pointer-events:none}",',
      '\t\t\t".dsh-stream-think-process-viewport{display:block;position:relative;flex:0 1 auto;min-width:0;height:1lh;overflow:hidden;pointer-events:none}",',
    ].join('\n'),
    '\t\t\t/* 原生过程标题接管已撤销：process-title / process-native / process-viewport 三条 CSS 删除 */',
  )
  out = swap(
    out,
    'client/turn-process-clock-css-removed',
    [
      '\t\t\t".dsh-stream-think-clock[data-clock-ready] button[data-turn-process]>span:first-child{color:transparent!important;font-variant-numeric:tabular-nums}",',
      '\t\t\t".dsh-stream-think-clock-overlay{box-sizing:border-box;position:absolute;top:0;left:0;width:100%;height:calc(33px + var(--dsh-content-font-delta,0px));padding:0 0 8px;pointer-events:none;overflow:hidden;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(24px + var(--dsh-content-font-delta,0px));font-variant-numeric:tabular-nums}",',
      '\t\t\t".dsh-stream-think-clock:has(.dsh-stream-think-highlights) button[data-turn-process]{height:calc(28px + var(--dsh-content-font-delta,0px));padding:0;border-bottom:0}",',
      '\t\t\t".dsh-stream-think-clock:has(.dsh-stream-think-highlights) .dsh-stream-think-clock-overlay{top:2px;height:calc(24px + var(--dsh-content-font-delta,0px));padding:0}",',
      '\t\t\t".dsh-stream-think-clock:has(button[data-turn-process]:not(:disabled):hover) .dsh-stream-think-clock-overlay{color:var(--dsw-alias-label-primary)}",',
    ].join('\n'),
    '\t\t\t/* clock 接管已撤销：文字透明化 / clock-overlay / 两条 hover 规则删除；保留下面一条只服务摘要的布局规则 */',
  )
  out = swap(
    out,
    'client/turn-process-number-css-removed',
    [
      '\t\t\t".dsh-stream-think-clock-number{display:inline-block;position:relative;vertical-align:bottom;height:1lh;line-height:1lh;overflow:hidden}",',
      '\t\t\t".dsh-stream-think-clock-next{display:inline-block;animation:dsh-stream-think-clock-in .22s cubic-bezier(.2,.8,.2,1) both}",',
      '\t\t\t".dsh-stream-think-clock-old{position:absolute;top:0;left:0;animation:dsh-stream-think-clock-out .22s cubic-bezier(.2,.8,.2,1) both}",',
    ].join('\n'),
    '\t\t\t/* clock 数字逐位过渡已撤销 */',
  )
  out = swap(
    out,
    'client/turn-process-keyframes-removed',
    [
      '\t\t\t"@keyframes dsh-stream-think-clock-in{from{opacity:0;transform:translateY(.45em)}to{opacity:1;transform:translateY(0)}}",',
      '\t\t\t"@keyframes dsh-stream-think-clock-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-.45em)}}",',
      '\t\t\t"@keyframes dsh-stream-think-summary-in{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}",',
      '\t\t\t"@keyframes dsh-stream-think-summary-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(100%)}}",',
    ].join('\n'),
    '\t\t\t/* clock 数字与过程标题翻页的 keyframes 已撤销 */',
  )
  out = swap(
    out,
    'client/turn-process-reduced-motion-removed',
    '\t\t\t"@media (prefers-reduced-motion:reduce){.dsh-stream-think-clock-next,.dsh-stream-think-clock-old{animation:none}.dsh-stream-think-clock-old{display:none}}"',
    '\t\t\t/* clock 数字动画的 reduced-motion 兜底已随动画一并撤销 */',
  )
  // ② 读标签的 observer 与 clock 状态
  out = swap(
    out,
    'client/turn-process-clock-observer-removed',
    [
      '\t\t\t\tconst highlightId = (0, react.useId)();',
      '\t\t\t\tconst [clock, setClock] = (0, react.useState)({ previous: "", current: "", sequence: 0 });',
    ].join('\n'),
    '\t\t\t\tconst highlightId = (0, react.useId)();',
  )
  out = swap(
    out,
    'client/turn-process-clock-read-removed',
    [
      '\t\t\t\t(0, react.useLayoutEffect)(() => {',
      '\t\t\t\t\tconst root = rootRef.current;',
      '\t\t\t\t\tif (root === null) return;',
      '\t\t\t\t\tlet lastLabel = "";',
      '\t\t\t\t\tconst read = () => {',
      '\t\t\t\t\t\tconst label = root.querySelector("button[data-turn-process]>span:first-child");',
      '\t\t\t\t\t\tconst next = label?.textContent ?? "";',
      '\t\t\t\t\t\tif (next === lastLabel) return;',
      '\t\t\t\t\t\tlastLabel = next;',
      '\t\t\t\t\t\tsetClock((old) => old.current === next ? old : { previous: old.current, current: next, sequence: old.sequence + 1 });',
      '\t\t\t\t\t};',
      '\t\t\t\t\tread();',
      '\t\t\t\t\tconst observer = typeof MutationObserver === "undefined" ? null : new MutationObserver(read);',
      '\t\t\t\t\tobserver?.observe(root, { childList: true, characterData: true, subtree: true });',
      '\t\t\t\t\treturn () => observer?.disconnect();',
      '\t\t\t\t}, []);',
      '\t\t\t\tconst closed = props.node?.location?.turn?.status === "closed";',
    ].join('\n'),
    [
      '\t\t\t\t/* 原生计时行接管已撤销：不再读按钮标签、不做数字过渡。 */',
      '\t\t\t\tconst closed = props.node?.location?.turn?.status === "closed";',
    ].join('\n'),
  )
  // ③ 数字逐位过渡的计算与 clock-overlay 渲染
  out = swap(
    out,
    'client/turn-process-clock-content-removed',
    [
      '\t\t\t\tconst oldParts = clockLabelParts(clock.previous);',
      '\t\t\t\tconst parts = clockLabelParts(clock.current);',
      '\t\t\t\tconst animate = canAnimateClockChange(clock.previous, clock.current);',
      '\t\t\t\tconst content = parts.map((part, i) => {',
      '\t\t\t\t\tif (!animate || i % 2 === 0 || part === oldParts[i]) return part;',
      '\t\t\t\t\treturn (0, react.createElement)("span", { className: "dsh-stream-think-clock-number", key: clock.sequence + ":" + i },',
      '\t\t\t\t\t\t(0, react.createElement)("span", { className: "dsh-stream-think-clock-old" }, oldParts[i]),',
      '\t\t\t\t\t\t(0, react.createElement)("span", { className: "dsh-stream-think-clock-next" }, part));',
      '\t\t\t\t});',
      '\t\t\t\tconst visible = visibleProcessHighlights(props.nativeHighlights ?? highlights, detailSettings);',
    ].join('\n'),
    [
      '\t\t\t\t/* 原生计时行接管已撤销：不再计算数字过渡内容。 */',
      '\t\t\t\tconst visible = visibleProcessHighlights(props.nativeHighlights ?? highlights, detailSettings);',
    ].join('\n'),
  )
  out = swap(
    out,
    'client/turn-process-clock-node-removed',
    [
      '\t\t\t\treturn (0, react.createElement)("div", { ref: rootRef, className: "dsh-stream-think-clock", "data-clock-ready": clock.current !== "" || void 0, "data-live-empty": !closed && !showHighlights || void 0 },',
      '\t\t\t\t\t(0, react.createElement)(Inner, props),',
      '\t\t\t\t\tclock.current !== "" && (0, react.createElement)("span", { className: "dsh-stream-think-clock-overlay", "aria-hidden": true }, ...content),',
    ].join('\n'),
    [
      '\t\t\t\treturn (0, react.createElement)("div", { ref: rootRef, className: "dsh-stream-think-clock", "data-live-empty": !closed && !showHighlights || void 0 },',
      '\t\t\t\t\t(0, react.createElement)(Inner, props),',
    ].join('\n'),
  )

  // ④ clock 专属的死函数（撤销后无任何调用点）
  out = swap(
    out,
    'client/turn-process-clock-helpers-removed',
    [
      '\t\tfunction clockLabelParts(label) { return label.split(/(\\d+)/u); }',
      '\t\tfunction canAnimateClockChange(previous, current) {',
      '\t\t\tif (previous === "" || previous === current) return false;',
      '\t\t\tconst oldParts = clockLabelParts(previous);',
      '\t\t\tconst nextParts = clockLabelParts(current);',
      '\t\t\tif (oldParts.length !== nextParts.length) return false;',
      '\t\t\tlet changed = false;',
      '\t\t\tfor (let i = 0; i < nextParts.length; i++) {',
      '\t\t\t\tif (i % 2 === 0) {',
      '\t\t\t\t\tif (oldParts[i] !== nextParts[i]) return false;',
      '\t\t\t\t} else if (oldParts[i] !== nextParts[i]) {',
      '\t\t\t\t\tif (oldParts[i].length !== nextParts[i].length) return false;',
      '\t\t\t\t\tif (Number(nextParts[i]) - Number(oldParts[i]) !== 1) return false;',
      '\t\t\t\t\tchanged = true;',
      '\t\t\t\t}',
      '\t\t\t}',
      '\t\t\treturn changed;',
      '\t\t}',
    ].join('\n'),
    '\t\t/* clockLabelParts / canAnimateClockChange 已随计时行接管撤销删除。 */',
  )

  // ⑤ 过程标题收短函数同样只服务那次接管，撤销后是死代码
  out = swap(
    out,
    'client/turn-process-present-title-removed',
    [
      '\t\tfunction presentProcessTitle(title) {',
      '\t\t\tconst normalized = title.replace(/\\s+/g, " ").trim();',
      '\t\t\tconst fence = normalized.search(/\\x60{3}|~{3}/u);',
      '\t\t\tif (fence >= 0) {',
      '\t\t\t\tconst separator = normalized.indexOf(" · ");',
      '\t\t\t\tconst label = (separator >= 0 && separator < fence ? normalized.slice(0, separator) : normalized.slice(0, fence)).replace(/[\\s·:：]+$/u, "").trim();',
      '\t\t\t\treturn (label === "" ? "正在分析请求" : label) + " · 代码片段";',
      '\t\t\t}',
      '\t\t\tconst chars = [...normalized];',
      '\t\t\treturn chars.length > 100 ? chars.slice(0, 99).join("").trimEnd() + "…" : normalized;',
      '\t\t}',
    ].join('\n'),
    '\t\t/* presentProcessTitle 已随过程标题接管撤销删除。 */',
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
      '\t\t\t\t\t"aria-label": "think live=" + (running ? "1" : "0") + " auto=" + (thinkAutoExpand ? "1" : "0") + " open=" + (expanded ? "1" : "0"),',
    ].join('\n'),
  )

  // 打字机渲染器（StreamConfiguredView + boot 配置）已作为死代码整段移除：
  // configured-subscribe / control-scroll-source / configured-props 三条补丁的宿主随之消失。

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
      '\t\t\tapplyThinkSettings();',
      '\t\t\tensureThinkPanelStyle();',
      '\t\t\tensureTurnProcessClockStyle();',
      '\t\t\t/* 治本：图片解码前写好宽高比占位，让内容高度不再分两帧定型。 */',
      '\t\t\tconst uninstallImagePlaceholder = installImagePlaceholder();',
      '\t\t\t/* 兜底：挤掉 1 帧窗口仍然发生时，把位置补回底部（不是每次都需要）。 */',
      '\t\t\tconst uninstallImageSettle = installImageSettle();',
      '\t\t\tconst unwatchImageSettleSessions = watchImageSettleSessions();',
      '\t\t\tctx.effect(() => () => { uninstallImagePlaceholder(); uninstallImageSettle(); unwatchImageSettleSessions(); }, "dsh-stream-think: image placeholder + settle");',
      '\t\t\tctx.inject(["uiConversation"], (conversationCtx) => installBtwCommandVisibility(conversationCtx.uiConversation.events));',
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
  out = swap(out, 'client/settings-block-insert', '\t\tfunction apply(ctx) {', THINK_SETTINGS_BLOCK + IMAGE_PLACEHOLDER + IMAGE_SETTLE + '\t\tfunction apply(ctx) {')
  out = swap(
    out,
    'client/all-rows-share-scroll-setting',
    'const useControlScroll = () => (0, react.useSyncExternalStore)(settings.subscribe, () => settings.getSnapshot().controlScroll, () => settings.getSnapshot().controlScroll);',
    'const useControlScroll = () => (0, react.useSyncExternalStore)(subscribeThinkSettings, () => getThinkSettings().controlScroll, () => getThinkSettings().controlScroll);',
  )
  out = removeUpstreamCardField(out, 'controlScroll')
  out = removeUpstreamCardField(out, 'thinkAutoExpand')

  /* ── 用户要求「只保留摘要分组 + Think 展开 + 滚动」：摘掉上游设置卡与调试面板 ──
   * 先摘两个 seat（引用方消失），再删四个视图 region。已核实：
   *   · SmoothStreamCard_module_css_default ×71、DebugPanel_module_css_default ×35 全部落在各自 region 内；
   *   · SmoothStreamCardController 与 debugRuntime 在这四个 region 里 0 引用 —— 前者仍是
   *     SettingsCell.attach(card) 的设置数据源，后者被 teleprompterGlide 引用，两者都保留。 */
  out = swap(
    out,
    'client/upstream-seats-removed',
    [
      '\t\t\t\tsettingsCtx.slots.inject("settings.plugin.item", () => settingsCtx.slots.register({',
      '\t\t\t\t\tname: "settings.plugin.item",',
      '\t\t\t\t\tid: "smooth-stream",',
      '\t\t\t\t\tkey: STREAM_SETTINGS_NS,',
      '\t\t\t\t\torder: 30,',
      '\t\t\t\t\tlocale: NS,',
      '\t\t\t\t\tinject: () => card.inject()',
      '\t\t\t\t}, SmoothStreamCard));',
      '\t\t\t\tsettingsCtx.slots.inject("conversation.session.header.utilities", () => settingsCtx.slots.register({',
      '\t\t\t\t\tname: "conversation.session.header.utilities",',
      '\t\t\t\t\tid: "smooth-stream-debug",',
      '\t\t\t\t\torder: 40,',
      '\t\t\t\t\tlocale: NS,',
      '\t\t\t\t\tinject: () => debugRuntime.panelFace()',
      '\t\t\t\t}, DebugPanel));',
    ].join('\n'),
    '\t\t\t\t/* 上游设置卡（settings.plugin.item）与调试面板（conversation.session.header.utilities）已摘除：只保留插件自己的「思考盒」设置页 */',
  )
  out = removeRegion(out, 'client/upstream-card-css-removed', '\\0dsh-css:/Users/dzlin/work/project/dsh-smooth-stream/src/client/SmoothStreamCard.module.css.mjs')
  out = removeRegion(out, 'client/upstream-card-view-removed', 'src/client/SmoothStreamCard.tsx')
  out = removeRegion(out, 'client/debug-panel-css-removed', '\\0dsh-css:/Users/dzlin/work/project/dsh-smooth-stream/src/client/DebugPanel.module.css.mjs')
  out = removeRegion(out, 'client/debug-panel-view-removed', 'src/client/DebugPanel.tsx')

  /* ── 死代码清理（第四批：上游设置数据源链）—— 必须放在所有补丁之后 ──────────────
   * SettingsCell + SmoothStreamCardController 一直在按 RPC 轮询上游设置，但自从
   * assistant-step 交回官方后这些值已经没有消费者 —— 全量核对过 useControlScroll 只剩
   * 三处：apply 里的定义、本处调用、wrapAgentChatRows 的形参（它唯一的使用点
   * wrapFollowNodeView(inner, useControlScroll) 已在 06f4995 被三元替换掉）。
   * anchor 用的是「上面全部补丁跑完」之后的文本：useControlScroll 已被
   * client/all-rows-share-scroll-setting 重写，两个 seat 已变成注释。
   * 删掉这一块后，SmoothStreamCardController / createSmoothStreamSettingsApi /
   * settings-api / clientStore / locales 五个 region 才会失去引用。 */
  out = swap(
    out,
    'client/settings-cell-removed',
    [
      '\t\t\tconst settings = new SettingsCell();',
      '\t\t\tconst useControlScroll = () => (0, react.useSyncExternalStore)(subscribeThinkSettings, () => getThinkSettings().controlScroll, () => getThinkSettings().controlScroll);',
    ].join('\n'),
    '\t\t\t/* 上游设置数据源（SettingsCell + 卡片控制器）已摘除：只用自己的本地设置。 */',
  )
  out = swap(out, 'client/wrap-agent-rows-no-scroll-arg', 'const unwrap = wrapAgentChatRows(ctx, useControlScroll);', 'const unwrap = wrapAgentChatRows(ctx);')
  out = swap(
    out,
    'client/settings-data-source-removed',
    [
      '\t\t\tctx.inject([',
      '\t\t\t\t"slots",',
      '\t\t\t\t"locale",',
      '\t\t\t\t"connection"',
      '\t\t\t], (settingsCtx) => {',
      '\t\t\t\tconst card = new SmoothStreamCardController(createSmoothStreamSettingsApi(settingsCtx.get("connection")));',
      '\t\t\t\tconst detachSettings = settings.attach(card);',
      '\t\t\t\tconst syncDebug = () => {',
      '\t\t\t\t\tconst snapshot = card.getSnapshot();',
      '\t\t\t\t\tdebugRuntime.syncSettings({',
      '\t\t\t\t\t\tavailable: snapshot.debugAvailable,',
      '\t\t\t\t\t\tenabled: snapshot.debugEnabled,',
      '\t\t\t\t\t\twritable: snapshot.writable && !snapshot.saving,',
      '\t\t\t\t\t\tdirty: snapshot.dirty,',
      '\t\t\t\t\t\tstatus: snapshot.status,',
      '\t\t\t\t\t\ttuning: snapshot.debugTuning',
      '\t\t\t\t\t});',
      '\t\t\t\t};',
      '\t\t\t\tconst detachBinding = debugRuntime.bindSettings({',
      '\t\t\t\t\tedit: (patch) => {',
      '\t\t\t\t\t\tcard.inject().edit(patch);',
      '\t\t\t\t\t},',
      '\t\t\t\t\tsave: () => {',
      '\t\t\t\t\t\tcard.inject().save();',
      '\t\t\t\t\t},',
      '\t\t\t\t\tdiscard: () => {',
      '\t\t\t\t\t\tcard.inject().discard();',
      '\t\t\t\t\t}',
      '\t\t\t\t});',
      '\t\t\t\tconst detachDebug = card.subscribe(syncDebug);',
      '\t\t\t\tsyncDebug();',
      '\t\t\t\tcard.start();',
      '\t\t\t\tsettingsCtx.effect(() => settingsCtx.locale.register(NS, {',
      '\t\t\t\t\tzh,',
      '\t\t\t\t\ten',
      '\t\t\t\t}), "dsh-stream-think: settings dictionaries");',
      '\t\t\t\t/* 上游设置卡（settings.plugin.item）与调试面板（conversation.session.header.utilities）已摘除：只保留插件自己的「思考盒」设置页 */',
      '\t\t\t\treturn () => {',
      '\t\t\t\t\tcard.stop();',
      '\t\t\t\t\tdetachDebug();',
      '\t\t\t\t\tdetachSettings();',
      '\t\t\t\t\tdetachBinding();',
      '\t\t\t\t};',
      '\t\t\t});',
    ].join('\n'),
    '\t\t\t/* 上游设置数据源已摘除：settings RPC / locale 词典 / 调试绑定都不再需要。 */',
  )
  // 引用方消失后，这五个 region 的外部引用全部归零（settings-api / settings-api-client /
  // clientStore 三者互相引用，必须一起删）。
  out = removeRegion(out, 'client/card-controller-removed', 'src/client/smooth-stream-card-controller.ts')
  out = removeRegion(out, 'client/settings-api-removed', 'src/settings-api.ts')
  out = removeRegion(out, 'client/settings-api-client-removed', 'src/client/smooth-stream-settings-api.ts')
  // clientStore.ts 暂不能删：createSnapshotStore 还被 debugRuntime.ts 引用（跟随器批一起处理）。
  out = removeRegion(out, 'client/locales-removed', 'src/client/locales.ts')

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
