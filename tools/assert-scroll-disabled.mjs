#!/usr/bin/env node
/**
 * assert-scroll-disabled.mjs — 证明「插件不再操作任何滚动、也不再接管计时行」在生产产物里成立。
 *
 * 背景：跟随器（useConversationFollow）整条被 `if (false) …` 停用、原生计时行接管
 * 整体撤销后，产物里仍然留着所有相关代码 —— 静态看「有写点 / 有函数」不等于运行时能执行。
 * 本脚本用不动点闭包 + 状态守卫证明，回答两个问题：
 *
 *   ① 从插件对外的入口（apply / wrapAgentChatRows / 各 NodeView 组件）出发，
 *      有没有任何一条运行时路径能执行到「写宿主滚动或几何」的语句？
 *   ② 计时行接管（读标签 observer、clock-overlay、数字动画、辅助函数）是否已彻底消失，
 *      而八类摘要是否完好？
 *
 * 判定规则：
 *   ① 停用区 = { useConversationFollow, FollowHost }，外加一个函数：它的**全部**
 *      调用点都落在停用区内（自底向上求不动点）；
 *   ② 记账/查询函数（内部写点被「只有本插件创建的状态存在时才执行」的守卫包着，
 *      而这些状态的唯一写者又在停用区内）视为等价禁用 —— 目前只有
 *      releaseFollowSession 命中这条，脚本会显式列出并校验守卫；
 *   ③ 逐字器停用后 hook 体必须早退（`if (!enabled && records === void 0) return;`），
 *      早退之后的语句一行都不会执行。
 *
 * 用法（在插件根目录）：node tools/assert-scroll-disabled.mjs
 * 退出码非 0 = 有可达的滚动写入 / 计时行残留 / 摘要被误删，禁止交付。
 */

import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CLIENT = join(ROOT, 'lib', 'client.js')
const src = readFileSync(CLIENT, 'utf8')
const lines = src.split('\n')

const fail = []
const pass = []
const ok = (m) => pass.push(m)
const bad = (m) => fail.push(m)

/* ── 1. 模块级定义表 ─────────────────────────────────────────────────────── */
const defs = []
lines.forEach((l, i) => {
  let m = /^\t\tfunction ([A-Za-z0-9_$]+)\s*\(/.exec(l)
  if (m) return defs.push({ name: m[1], start: i, defLine: i })
  m = /^\t\t(?:const|let|var) ([A-Za-z0-9_$]+) = (?:\(|function)/.exec(l)
  if (m) return defs.push({ name: m[1], start: i, defLine: i })
  m = /^\t\t(?:var|const) ([A-Za-z0-9_$]+) = class/.exec(l)
  if (m) return defs.push({ name: m[1], start: i, defLine: i })
})
defs.forEach((d, i) => { d.end = (defs[i + 1] ? defs[i + 1].start : lines.length) - 1 })
const byName = new Map(defs.map((d) => [d.name, d]))
const owner = (n) => defs.find((d) => n > d.start && n <= d.end)
const isCode = (l) => !/data-plugin-css|^\s*\*|^\s*\/\*|^\s*\/\//.test(l)

const callSites = (name) => {
  const d = byName.get(name)
  if (d === undefined) return []
  const re = new RegExp('(^|[^A-Za-z0-9_$.])' + name.replace(/\$/g, '\\$') + '\\s*\\(')
  const out = []
  lines.forEach((l, i) => {
    if (i === d.defLine || !isCode(l) || !re.test(l)) return
    out.push(i)
  })
  return out
}

/* ── 2. 写点：真正写宿主滚动/几何的语句 ──────────────────────────────────── */
const WRITE_RE = /\.scrollTop\s*=|\.scrollLeft\s*=(?!=)|scrollTo\(|scrollIntoView\(|\.overflowAnchor\s*=|\.scrollBehavior\s*=|\.paddingBottom\s*=|\.minHeight\s*=|\.marginTop\s*=|\.transform\s*=|style\[[a-zA-Z]|\.style\.(?!aspectRatio\b)[a-zA-Z]+\s*=/
const writeLines = []
lines.forEach((l, i) => { if (WRITE_RE.test(l) && isCode(l)) writeLines.push(i) })
const writeFns = new Set()
for (const w of writeLines) {
  const o = owner(w)
  if (o) writeFns.add(o.name)
}

/* ── 3. 不动点：停用区 ───────────────────────────────────────────────────── */
const disabled = new Set(['useConversationFollow', 'FollowHost'])
const why = new Map([['useConversationFollow', '如果跟随器本身'], ['FollowHost', '只被跟随器驱动的宿主壳']])
const converge = () => {
  let grew = true
  while (grew) {
    grew = false
    for (const d of defs) {
      if (disabled.has(d.name)) continue
      const sites = callSites(d.name)
      if (sites.length === 0) continue
      if (sites.every((i) => { const o = owner(i); return o && disabled.has(o.name) })) {
        disabled.add(d.name)
        why.set(d.name, '调用点全在停用区内')
        grew = true
      }
    }
  }
}
converge()

/* ── 4. 守卫豁免清单（2026-10-09 已清空）─────────────────────────────────────
 * 原先只有一个成员 releaseFollowSession（跟随器的会话记账函数）。跟随器
 * （useConversationFollow / FollowHost / teleprompterGlide）已整段移除，
 * 会话滚动完全交回官方，这里不再需要豁免条目。 */
const GUARDED = {}
const guardedOk = new Set()
for (const [name, spec] of Object.entries(GUARDED)) {
  const d = byName.get(name)
  if (d === undefined) { bad(`守卫豁免 ${name}: 产物里找不到该函数`); continue }
  const body = lines.slice(d.start, d.end + 1)
  const guardIdx = body.findIndex((l) => l.includes(spec.guard))
  if (guardIdx < 0) { bad(`守卫豁免 ${name}: 找不到守卫 ${spec.guard}`); continue }
  const writes = body.map((l, i) => (WRITE_RE.test(l) && isCode(l) ? i : -1)).filter((i) => i >= 0)
  const beforeGuard = writes.filter((i) => i < guardIdx)
  if (beforeGuard.length > 0) { bad(`守卫豁免 ${name}: 第 ${d.start + beforeGuard[0] + 1} 行的写点在守卫之前`); continue }
  // 守卫状态变量的写者要么已停用，要么就是本函数自身
  const setters = new Set()
  lines.forEach((l, i) => {
    if (new RegExp(spec.stateVar + '\\.(set|delete)\\(').test(l)) {
      const o = owner(i)
      if (o && o.name !== name) setters.add(o.name)
    }
  })
  const foreign = [...setters].filter((n) => !disabled.has(n))
  if (foreign.length > 0) { bad(`守卫豁免 ${name}: ${spec.stateVar} 的写者未停用 (${foreign.join(', ')})`); continue }
  guardedOk.add(name)
  disabled.add(name)
  ok(`记账函数 ${name} 的 ${writes.length} 处写点全部在 \`${spec.guard}\` 之后，且 ${spec.stateVar} 的外来写者（${[...setters].join(', ') || '无'}）全在停用区 → 等价 no-op`)
}
converge()

/* ── 5. 结论：还有没有可达的写点 ─────────────────────────────────────────── */
// 唯一豁免：image-settle（图片撑高后补回底部）。它不是"不可达"，而是**受闸门约束的
// 唯一写入点** —— 第 8 节逐条证明那六道闸门还在，因此这里只做排除，不当作违规。
const IMAGE_SETTLE_FNS = new Set([
  'settleAfterImage', 'armImageSettle', 'imageSettleSnapshot',
  'installImageSettle', 'watchImageSettleSessions', 'noteImageSettleReaderIntent',
  'scheduleImageSettleRecovery',
  'applyImagePlaceholder', 'installImagePlaceholder',
  'patchImageSrc', 'prepareImageNode',
  'applyImageBoxPlaceholder', 'scanImageBoxes',
])
const reachable = [...writeFns].filter((n) => !disabled.has(n) && !guardedOk.has(n) && !IMAGE_SETTLE_FNS.has(n))
if (reachable.length === 0) {
  ok(`宿主滚动/几何写入函数 ${writeFns.size} 个：除 image-settle 外全部被停用区（${disabled.size} 个成员）或守卫证明隔离`)
} else {
  for (const n of reachable) {
    const d = byName.get(n)
    bad(`可达写点: ${n} (行${d.start + 1})，调用点 ${callSites(n).map((i) => `${i + 1}@${(owner(i) || {}).name ?? 'top'}`).join(', ')}`)
  }
}

/* ── 6. 死代码清理后：逐字器与工具行包装器已从产物整段消失 ───────────────── */
for (const [needle, label] of [
  ['function useProgressiveDomText(', 'useProgressiveDomText 函数'],
  ['function wrapFollowNodeView(', 'wrapFollowNodeView 函数'],
  ['isFollowableChatNode(', 'isFollowableChatNode 调用'],
]) {
  if (!src.includes(needle)) ok(`${label}已从产物移除`)
  else bad(`${label}仍出现在产物里（死代码清理未生效）`)
}

/* ── 7. 关键补丁痕迹（防上游改版后静默退化） ────────────────────────────── */
const traces = [
  ['/* 原生计时行接管已撤销：不再读按钮标签、不做数字过渡。 */', '计时行标签观察撤销'],
  ['/* 原生计时行接管已撤销：不再计算数字过渡内容。 */', '计时行数字过渡撤销'],
  ['/* clockLabelParts / canAnimateClockChange 已随计时行接管撤销删除。 */', '计时行死函数删除'],
]
for (const [needle, label] of traces) {
  if (src.includes(needle)) ok(label)
  else bad(`${label}: 产物里找不到痕迹 ${JSON.stringify(needle.slice(0, 50))}`)
}

/* ── 8. 计时行接管的运行时痕迹必须消失（摘要不受影响） ─────────────────── */
const gone = [
  ['clock-overlay"', 'clock-overlay 渲染'],
  ['dsh-stream-think-clock-number', 'clock 数字节点'],
  ['dsh-stream-think-clock-old', 'clock 旧数字节点'],
  ['dsh-stream-think-clock-next', 'clock 新数字节点'],
  ['data-clock-ready', 'clock ready 属性'],
  ['clockLabelParts(', 'clockLabelParts 调用'],
  ['canAnimateClockChange(', 'canAnimateClockChange 调用'],
  ['setClock(', 'clock state 写入'],
]
for (const [needle, label] of gone) {
  if (!src.includes(needle)) ok(`${label}已消失`)
  else bad(`计时行接管残留: ${label} 仍出现在产物里`)
}
// 摘要必须完好（撤销 clock 不能连带删摘要）
const keep = [
  'dsh-stream-think-highlights',
  'dsh-stream-think-highlight-header',
  'dsh-stream-think-highlight-list',
  'dsh-stream-think-task-update',
  'visibleProcessHighlights(',
  'buildProcessHighlightGroups(',
  'shouldShowProcessHighlights(',
]
const missingKeep = keep.filter((n) => !src.includes(n))
if (missingKeep.length === 0) ok(`八类摘要渲染完好（核对 ${keep.length} 个符号）`)
else bad(`摘要被误删: ${missingKeep.join(', ')}`)

/* ── 8. image-settle：唯一允许的滚动写入，逐条证明六道闸门 ──────────────── */
{
  const settle = byName.get('settleAfterImage')
  if (settle === undefined) {
    bad('image-settle: 产物里找不到 settleAfterImage')
  } else {
    const body = lines.slice(settle.start, settle.end + 1).join('\n')
    // 闸门 ①：开关
    if (/if \(!imageSettleEnabled\(\)\) return;/.test(body)) ok('image-settle 闸门①：开关关闭时直接返回')
    else bad('image-settle 闸门①：缺少 imageSettleEnabled 检查')
    // 闸门 ②：只有两个触发源 —— img 的 load/error 回调，和窗口期内盯高度的 ResizeObserver。
    // 前者在 installImageSettle 内，后者在 watchImageSettleHeight 内；两处都必须能
    // 看到各自的授权上下文，且都不接受外部直接调用。
    const callers = callSites('settleAfterImage')
    const allowedContext = /onImageDone|watchImageSettleHeight|settleAfterImage\(port, img\)|settleAfterImage\(current, null\)/
    const allSanctioned = callers.length > 0 && callers.every((i) => {
      const head = lines.slice(Math.max(0, i - 12), i + 1).join('\n')
      return allowedContext.test(head)
    })
    if (allSanctioned) ok(`image-settle 闸门②：${callers.length} 个触发源都限定在图片回调/高度观察内`)
    else bad(`image-settle 闸门②：存在未授权的调用点 ${callers.map((i) => i + 1).join(', ')}`)
    // 闸门 ③：撑高前必须贴底（用撑高发生**之前**记录的状态判定）
    // 闸门 ③：撑高前必须贴底（或近贴底）。两个条件合起来才算"读者本意就在底部"：
    //   · wasAtBottom —— 上一次观察到贴底
    //   · slack <= CANDIDATE_PX —— 或当前离底足够近（覆盖官方补偿留下的十几像素）
    // 读者真正停在中间时两者都不成立 → 绝不补位。
    const gate3 = /const wasAtBottom = state\.atBottom;/.test(body)
      && /if \(!wasAtBottom && slack > IMAGE_SETTLE_CANDIDATE_PX\) return;/.test(body)
    if (gate3) ok('image-settle 闸门③：撑高前非贴底（且离底较远）则绝不补位')
    else bad('image-settle 闸门③：缺少 wasAtBottom / CANDIDATE_PX 守卫')
    // atBottom 只能由「观察到贴底」或「读者动过」改写，不能被"当前非贴底"清掉
    const snapshot = byName.get('imageSettleSnapshot')
    const snapBody = snapshot === undefined ? '' : lines.slice(snapshot.start, snapshot.end + 1).join('\n')
    if (/if \(imageSettleAtBottom\(port\)\) state\.atBottom = true;/.test(snapBody) && !/state\.atBottom = false/.test(snapBody)) ok('image-settle 基线：atBottom 不被「当前非贴底」清掉（防官方补偿误伤）')
    else bad('image-settle 基线：atBottom 可能被官方补偿误判为 false')
    // 闸门 ④：读者静默（含"读者上翻"这一条 scroll 判据）
    if (/IMAGE_SETTLE_QUIET_MS\) return;/.test(body)) ok('image-settle 闸门④：读者近期滚动过则不补位')
    else bad('image-settle 闸门④：缺少读者静默检查')
    // 闸门 ⑤：只在武装窗口内
    if (/IMAGE_SETTLE_ARMED_MS\) return;/.test(body)) ok('image-settle 闸门⑤：超出会话观察窗口后彻底撒手')
    else bad('image-settle 闸门⑤：缺少武装窗口检查')
    // 闸门 ⑥：同一次撑高只补一次
    if (/state\.done\.has\(key\)\) return;/.test(body)) ok('image-settle 闸门⑥：同一次撑高只补一次，不与官方争夺')
    else bad('image-settle 闸门⑥：缺少去重')
    // 闸门⑦：会话切换后的「位置恢复纠偏」必须同时满足 4 个条件，缺一不可。
    // 这条修的是「官方把偏上值记住并忠实恢复」——撑高路径拦不住它（高度没变）。
    const recover = byName.get('scheduleImageSettleRecovery')
    const recBody = recover === undefined ? '' : lines.slice(recover.start, recover.end + 1).join('\n')
    const gate7 = [
      [/if \(slack <= IMAGE_SETTLE_SLACK_PX\) return;/, '已到底则不动作'],
      [/if \(slack > IMAGE_SETTLE_RECOVER_MAX_PX\) return;/, '离底过远（读者本意）则不动作'],
      [/if \(port\.scrollHeight !== state\.height\) \{/, '内容仍在长高则不动作'],
      [/IMAGE_SETTLE_QUIET_MS\) return;/, '读者近期动过则不动作'],
      [/performance\.now\(\) - imageSettleArmedAt > IMAGE_SETTLE_ARMED_MS\) return;/, '超出观察窗口则不动作'],
    ].filter(([re]) => !re.test(recBody)).map(([, label]) => label)
    if (recover !== undefined && gate7.length === 0) ok('image-settle 闸门⑦：切会话纠偏只处理「贴底但没到底、内容已定型、读者没动过、窗口内」')
    else bad(`image-settle 闸门⑦ 缺失: ${gate7.join(', ') || '找不到 scheduleImageSettleRecovery'}`)

    // 闸门⑧（治本路径）：图片占位只写 aspect-ratio，且只在「没写过 + 图未解码 + 拿到同步尺寸」时写。
    const ph = byName.get('applyImagePlaceholder')
    const phBody = ph === undefined ? '' : lines.slice(ph.start, ph.end + 1).join('\n')
    if (ph === undefined) {
      bad('image-placeholder: 产物里找不到 applyImagePlaceholder')
    } else {
      const gate8 = [
        [/img\.hasAttribute\(IMAGE_PLACEHOLDER_ATTR\)\) return false;/, '已写过则跳过'],
        [/img\.style\.aspectRatio !== ""\) return false;/, '已有其它比例来源则让位'],
        [/img\.complete && img\.naturalWidth > 0/, '已解码的图不写（无意义样式写入）'],
        [/if \(size === null\) return false;/, '拿不到尺寸则放弃（绝不猜比例）'],
        [/img\.style\.aspectRatio = size\.width \+ " \/ " \+ size\.height;/, '只写 aspect-ratio'],
      ].filter(([re]) => !re.test(phBody)).map(([, label]) => label)
      if (gate8.length === 0) ok('image-placeholder 闸门⑧：只写 aspect-ratio，且「未写过 + 图未解码 + 有同步尺寸」缺一不可')
      else bad(`image-placeholder 闸门⑧ 缺失: ${gate8.join(', ')}`)
      // 整个占位模块**不得**触碰滚动相关属性
      const phAll = ['readDeclaredImageSize', 'readLoadedImageSize', 'applyImagePlaceholder', 'prepareImageNode', 'patchImageSrc', 'installImagePlaceholder']
        .map((n) => { const d = byName.get(n); return d === undefined ? '' : lines.slice(d.start, d.end + 1).join('\n') }).join('\n')
      const strayWrites = phAll.split('\n').filter((l) => isCode(l) && /\.scrollTop\s*=|\.scrollHeight\s*=|scrollTo\(|scrollIntoView\(|\.paddingBottom\s*=|\.minHeight\s*=|\.marginTop\s*=/.test(l))
      if (strayWrites.length === 0) ok('image-placeholder 不触碰任何滚动/布局属性（只写 aspect-ratio）')
      else bad(`image-placeholder 越界写入: ${strayWrites.map((l) => l.trim()).join(' | ')}`)
    }

    // 闸门⑨（治本）：容器占位只写 height，四项准入缺一不可。
    const boxFn = byName.get('applyImageBoxPlaceholder')
    const boxBody = boxFn === undefined ? '' : lines.slice(boxFn.start, boxFn.end + 1).join('\n')
    if (boxFn === undefined) {
      bad('image-placeholder: 产物里找不到 applyImageBoxPlaceholder')
    } else {
      const gate9 = [
        [/box\.hasAttribute\(IMAGE_PLACEHOLDER_ATTR\)\) return false;/, '已写过则跳过'],
        [/box\.style\.height !== ""\) return false;/, '已有高度来源则让位'],
        [/if \(size === null\) return false;/, '拿不到尺寸则放弃'],
        [/if \(!\(width > 0\)\) return false;/, '未布局出宽度则放弃（不猜）'],
        [/box\.style\.height = height \+ "px";/, '只写 height'],
      ].filter(([re]) => !re.test(boxBody)).map(([, label]) => label)
      if (gate9.length === 0) ok('image-placeholder 闸门⑨：容器占位只写 height，四项准入缺一不可')
      else bad(`image-placeholder 闸门⑨ 缺失: ${gate9.join(', ')}`)
      const stray = boxBody.split('\n').filter((l) => isCode(l) && /\.scrollTop\s*=|scrollTo\(|scrollIntoView\(|\.paddingBottom\s*=|minHeight\s*=|\.marginTop\s*=/.test(l))
      if (stray.length === 0) ok('image-placeholder 容器占位不触碰滚动/布局属性')
      else bad(`容器占位越界: ${stray.map((l) => l.trim()).join(' | ')}`)
    }

    // 写入范围：只允许写 scrollTop
    const writes = body.split('\n').filter((l) => WRITE_RE.test(l) && isCode(l))
    const onlyScrollTop = writes.every((l) => /\.scrollTop\s*=/.test(l))
    if (onlyScrollTop) ok(`image-settle 写入范围：仅 ${writes.length} 处 scrollTop，不写样式/属性`)
    else bad(`image-settle 越过写入范围: ${writes.filter((l) => !/\.scrollTop\s*=/.test(l)).map((l) => l.trim()).join(' | ')}`)
  }
  // 开关必须存在且默认为开
  const defaultsLine = lines.find((l) => l.includes('THINK_SETTINGS_DEFAULTS = {'))
  if (defaultsLine !== undefined && /imageSettle: true/.test(defaultsLine)) ok('image-settle 设置项存在且默认开启')
  else bad('image-settle 设置项缺失或默认值不为 true')
  // 设置页必须有对应开关
  if (src.includes('"stream-think-image-settle"')) ok('image-settle 设置页开关已注册')
  else bad('image-settle 设置页开关缺失')
}

/* ── 输出 ────────────────────────────────────────────────────────────────── */
console.log(`[assert-scroll-disabled] 产物: ${CLIENT} (${src.length} B)`)
console.log(`  停用区成员 ${disabled.size} 个：${[...disabled].sort().join(', ')}\n`)
for (const m of pass) console.log('   ✓ ' + m)
for (const m of fail) console.log('   ✗ ' + m)
if (fail.length > 0) {
  console.log(`\n[assert-scroll-disabled] ❌ ${fail.length} 项未通过`)
  process.exit(1)
}
console.log('\n[assert-scroll-disabled] ✅ 除 image-settle 补位外，无任何可达的宿主滚动/几何写入')
