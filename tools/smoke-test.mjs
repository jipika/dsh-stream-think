#!/usr/bin/env node
/**
 * smoke-test.mjs — 在不启动 DSH 的前提下，真实加载 dsh-stream-think 的两个半边：
 *
 *   1. lib/client.js 顶层执行 → 捕获 ModuleLoader.load 的 id/factory；
 *   2. factory(mockRequire) → 检查 exports.apply / exports.inject 存在；
 *   3. 用 mock ctx 调 apply() → 设置面板注册、CSS 变量投影都不许抛错；
 *   4. 验证思考状态、宿主折叠边界与滚动设置的副作用；
 *   5. 导入 Host 半边，检查对外导出。
 *
 * 它拦住的是「重启后才发现」这一类事故：语法通过但模块构造失败、apply 里引用了
 * 不存在的符号、图标名/导出名对不上、我们注入的代码块没进到作用域里。
 */

import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const PROFILE = process.env.DSH_PROFILE_DIR
  ?? join(process.env.HOME ?? '', '.dsh', 'profiles', 'web')

const require = createRequire(join(PROFILE, 'noop.js'))

/**
 * 真 react 优先（能连带验证 hooks 调用形态）；profile 的 pnpm 树里通常没有它
 * （react 由宿主客户端的 ModuleLoader 提供），此时退回一个够用的 stub ——
 * 本测试只构造模块与调用 apply()，不真正渲染，stub 足够覆盖引用错误。
 */
const REACT_STUB = {
  createElement: (type, props, ...children) => ({ type, props, children }),
  useState: (initial) => [typeof initial === 'function' ? initial() : initial, () => {}],
  useRef: (value) => ({ current: value }),
  useEffect: () => {},
  useLayoutEffect: () => {},
  useCallback: (fn) => fn,
  useMemo: (fn) => fn(),
  useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot(),
  memo: (component) => component,
  forwardRef: (component) => component,
  Fragment: Symbol('Fragment'),
}
const JSX_STUB = {
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props }),
  Fragment: Symbol('Fragment'),
}

let React = REACT_STUB
let reactKind = 'stub'
try {
  React = require('react')
  reactKind = 'real'
} catch { /* profile 里没有 react：用 stub */ }

const failures = []
const notes = []
function ok(name, extra = '') { notes.push(`   ✓ ${name}${extra ? ' — ' + extra : ''}`) }
function bad(name, error) { failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`) }

/* ---------------- mock 环境 ---------------- */

const cssTags = new Map()
function mockElement(tag = 'div') {
  return {
    tagName: tag,
    style: { values: {}, setProperty(name, value) { this.values[name] = value }, },
    dataset: {},
    textContent: '',
    id: '',
    className: '',
    children: [],
    appendChild(child) { this.children.push(child); return child },
  }
}
const head = mockElement('head')
head.appendChild = (child) => {
  if (child.id) cssTags.set(child.id, child)
  head.children.push(child)
  return child
}
const documentElement = mockElement('html')
const document = {
  head,
  documentElement,
  title: 'smoke',
  getElementById: (id) => cssTags.get(id) ?? null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: (tag) => mockElement(tag),
  addEventListener() {},
  removeEventListener() {},
}

const store = new Map()
store.set('dsh-stream-think:settings.v1', JSON.stringify({ controlScroll: false }))
class FakeElement {
  scrollTo() {}
  scrollIntoView() {}
}
const nativeScrollTo = FakeElement.prototype.scrollTo
const nativeScrollIntoView = FakeElement.prototype.scrollIntoView
let loaded = null
const windowObj = {
  __ModuleLoader__: {
    load(entry) { loaded = entry },
  },
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)) },
    removeItem: (k) => { store.delete(k) },
  },
  document,
  fetch: undefined,
  setTimeout,
  clearTimeout,
  requestAnimationFrame: (cb) => setTimeout(() => cb(Date.now()), 0),
  cancelAnimationFrame: (id) => clearTimeout(id),
}

const sandbox = {
  window: windowObj,
  document,
  console: { log() {}, info() {}, warn() {}, error(...args) { failures.push('console.error: ' + args.join(' ')) }, debug() {} },
  localStorage: windowObj.localStorage,
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: windowObj.requestAnimationFrame,
  cancelAnimationFrame: windowObj.cancelAnimationFrame,
  performance: { now: () => Date.now() },
  navigator: { userAgent: 'smoke' },
  MutationObserver: class { observe() {} disconnect() {} takeRecords() { return [] } },
  ResizeObserver: class { observe() {} disconnect() {} },
  IntersectionObserver: class { observe() {} disconnect() {} },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
  getComputedStyle: () => ({ getPropertyValue: () => '', overflowY: 'auto' }),
  documentElement,
  Element: FakeElement,
  requestIdleCallback: (cb) => setTimeout(cb, 0),
}
sandbox.globalThis = sandbox
sandbox.self = sandbox
vm.createContext(sandbox)

/* ---------------- 1. 顶层执行 ---------------- */

const clientSource = readFileSync(join(ROOT, 'lib', 'client.js'), 'utf8')
try {
  vm.runInContext(clientSource, sandbox, { filename: 'lib/client.js' })
  ok('lib/client.js 顶层执行')
} catch (error) {
  bad('lib/client.js 顶层执行', error)
}
if (loaded === null) {
  bad('ModuleLoader.load 未被调用', '顶层没有注册模块')
} else {
  if (loaded.id === 'dsh-stream-think') ok('模块 id', loaded.id)
  else bad('模块 id', `期望 dsh-stream-think，实际 ${String(loaded.id)}`)
}

/* ---------------- 2. factory 构造 ---------------- */

const PRIMITIVE_EXPORTS = [
  'IconChevronDownOutlineRegular', 'IconCloseOutlineRegular', 'IconCodeOutlineRegular',
  'IconCopyOutlineRegular', 'IconQuestionOutlineRegular', 'IconRefreshOutlineRegular',
  'IconThinkOutlineRegular', 'IconThinkOutline14',
]
function stubComponent() { return null }
const primitives = {}
for (const name of PRIMITIVE_EXPORTS) primitives[name] = stubComponent

const requireMap = {
  'react': React,
  'react-dom': { createPortal: (n) => n, flushSync: (fn) => fn() },
  'react/jsx-runtime': (() => { try { return require('react/jsx-runtime') } catch { return JSX_STUB } })(),
  '@deepseek-ai/dsh-client-ui-primitives': primitives,
  '@deepseek-ai/dsh-client-ui-attachment': { AttachmentList: stubComponent, ImageGallery: stubComponent },
}
const missingRequires = []
const mockRequire = (spec) => {
  if (spec in requireMap) return requireMap[spec]
  missingRequires.push(spec)
  return new Proxy({}, { get: () => stubComponent })
}

let exportsObj = null
if (loaded !== null && typeof loaded.factory === 'function') {
  try {
    exportsObj = loaded.factory(mockRequire)
    ok('factory 构造 exports', Object.keys(exportsObj).join(', '))
  } catch (error) {
    bad('factory 构造 exports', error)
  }
}
if (missingRequires.length > 0) notes.push(`   · factory 请求了未 mock 的模块：${missingRequires.join(', ')}`)

/* ---------------- 3. apply() ---------------- */

const registered = []
const clockEntry = { options: { key: 'turn-process' }, component: stubComponent }
const toolEntry = { options: { key: 'tool' }, component: stubComponent }
let settingsPanelComponent = null
if (exportsObj !== null && typeof exportsObj.apply === 'function') {
  const ctx = {
    // 刻意不执行 post-inject 回调：那段是上游的设置卡控制器，要真实 Host RPC +
    // connection 服务才能构造（mock 下 card.getSnapshot() 为 null 会抛）。本测试
    // 验证的是「bundle 能构造 + 我们的设置面板/样式在 apply 里注册成功」。
    inject: () => {},
    slots: {
      inject: (name, cb) => { registered.push(name); return cb() },
      register: (options, component) => {
        registered.push('register:' + options.name + ':' + String(options.id ?? options.key ?? ''))
        if (options.name === 'settings.plugins.tab') settingsPanelComponent = component
        return () => {}
      },
      entries: (name) => name === 'conversation.chat.node' ? [clockEntry, toolEntry] : [],
    },
    on: () => () => {},
  }
  try {
    exportsObj.apply(ctx)
    ok('apply(ctx) 未抛错')
  } catch (error) {
    bad('apply(ctx)', error)
  }
  const capVar = documentElement.style.__lastCapVar
  if (registered.some((entry) => entry.startsWith('register:settings.plugins.tab'))) {
    ok('设置面板已注册', registered.filter((entry) => entry.includes('settings.plugins.tab')).join(' | '))
  } else {
    bad('设置面板注册', `已注册: ${registered.join(', ') || '(无)'}`)
  }
  if (exportsObj.inject !== undefined) ok('exports.inject', JSON.stringify(exportsObj.inject))
  else bad('exports.inject', '缺失')
  if (FakeElement.prototype.scrollTo === nativeScrollTo && FakeElement.prototype.scrollIntoView === nativeScrollIntoView) {
    ok('关闭跟随不改写全局滚动方法')
  } else {
    bad('关闭跟随', 'Element.prototype 的滚动方法被改写')
  }
  if (clockEntry.component.name === 'TurnProcessClockNodeView' && toolEntry.component.name === 'TypewriterFollowNodeView') {
    ok('原生计时行使用专用数字动画，工具行保留流式包装')
  } else {
    bad('计时行包装', `${clockEntry.component.name} / ${toolEntry.component.name}`)
  }
  if (reactKind === 'stub') {
    const liveRow = clockEntry.component({ node: { kind: 'turn-process', data: { turn: 7 }, location: { turn: { status: 'open' } } } })
    if (liveRow?.props?.['data-live-empty'] === true && cssTags.get('dsh-stream-think-turn-process-clock')?.textContent.includes('[data-chat-flow-kind=turn-process]:has(.dsh-stream-think-clock[data-live-empty])')) ok('0.2 运行中没有记录时隐藏空白过程行')
    else bad('0.2 空白过程行', String(liveRow?.type))
  }
  const clockStyle = cssTags.get('dsh-stream-think-turn-process-clock')
  if (clockStyle?.textContent.includes('prefers-reduced-motion:reduce') && clockStyle.textContent.includes('font-variant-numeric:tabular-nums')) {
    ok('计时样式含等宽数字和减少动态效果支持')
  } else {
    bad('计时样式', '未注入或缺少减少动态效果/等宽数字规则')
  }
  if (reactKind === 'stub' && typeof settingsPanelComponent === 'function') {
    const findTestId = (node, id) => {
      if (Array.isArray(node)) {
        for (const child of node) { const found = findTestId(child, id); if (found) return found }
        return null
      }
      if (node?.props?.['data-testid'] === id) return node
      for (const child of node?.children ?? []) {
        const found = findTestId(child, id)
        if (found) return found
      }
      return null
    }
    const click = (id) => findTestId(settingsPanelComponent(), id)?.props?.onClick?.()
    click('stream-think-auto-expand')
    click('stream-think-auto-collapse')
    click('stream-think-control-scroll')
    click('stream-think-cap-12')
    const saved = JSON.parse(store.get('dsh-stream-think:settings.v1'))
    if (saved.autoExpand === false && saved.autoCollapse === false && saved.controlScroll === true && saved.capLines === 12 && documentElement.style.values['--dsh-stream-think-cap-lines'] === '12') {
      ok('四项设置点击后立即写入并投影到运行时样式')
    } else bad('设置开关生效', JSON.stringify(saved))
    click('stream-think-show-edited-files')
    click('stream-think-show-thought-summary')
    click('stream-think-show-commands')
    click('stream-think-show-task-updates')
    for (const id of ['stream-think-show-reads', 'stream-think-show-searches', 'stream-think-show-other-tools']) { click(id); click(id) }
    const details = JSON.parse(store.get('dsh-stream-think:settings.v1'))
    if (details.showTaskUpdates === false && details.showEditedFiles === false && details.showThoughtSummary === false && details.showCommands === false && details.showReads === false && details.showSearches === false && details.showOtherTools === false) {
      ok('组外七类内容可独立关闭，且可全部关闭')
    } else bad('组外内容开关', JSON.stringify(details))
  }
} else {
  bad('exports.apply', '缺失或不可调用')
}

/* ---------------- 4a. 计时与过程组标题过渡边界 ---------------- */

const clockStart = clientSource.indexOf('function clockLabelParts(label) {')
const clockEnd = clientSource.indexOf('function wrapTurnProcessClockNodeView(', clockStart)
if (clockStart < 0 || clockEnd < 0) {
  bad('计时过渡函数提取', '产物里找不到计时函数')
} else {
  const thoughtSelectorStart = clientSource.indexOf('function selectThoughtSummary(text) {')
  const thoughtSelectorEnd = clientSource.indexOf('function RollingThinkSummary(', thoughtSelectorStart)
  if (thoughtSelectorStart < 0 || thoughtSelectorEnd < 0) bad('思考摘要选择函数提取', '产物里找不到摘要选择函数')
  else vm.runInContext(clientSource.slice(thoughtSelectorStart, thoughtSelectorEnd), sandbox)
  const { canAnimateClockChange, presentProcessTitle, editPathsFromToolNode, actionSummariesFromToolNode, processHighlights, visibleProcessHighlights, buildProcessHighlightGroups, shouldShowProcessHighlights, sameTaskSnapshot } = vm.runInContext(
    clientSource.slice(clockStart, clockEnd) + '\n; ({ canAnimateClockChange, presentProcessTitle, editPathsFromToolNode, actionSummariesFromToolNode, processHighlights, visibleProcessHighlights, buildProcessHighlightGroups, shouldShowProcessHighlights, sameTaskSnapshot })', sandbox)
  if (presentProcessTitle('正在分析请求 · 尝试： ```js JSON.stringify({ ctx: document.body.innerText })') === '正在分析请求 · 代码片段' && [...presentProcessTitle('正在分析请求 · ' + '很长的标题'.repeat(30))].length <= 100) ok('原生活动详情含代码时收成短标题，普通长标题限制长度')
  else bad('过程标题代码溢出', '代码块或长标题未被收短')
  const cases = [
    ['同一秒不重复动画', '深度求索中，用时34秒', '深度求索中，用时34秒', false],
    ['秒数递增滚动', '深度求索中，用时34秒', '深度求索中，用时35秒', true],
    ['进位数字滚动', '深度求索中，用时59秒', '深度求索中，用时60秒', true],
    ['位数增加直接更新', '深度求索中，用时9秒', '深度求索中，用时10秒', false],
    ['切后台跳秒直接更新', '深度求索中，用时34秒', '深度求索中，用时40秒', false],
    ['结束状态直接更新', '深度求索中，用时34秒', '用时34秒', false],
    ['时间单位变化直接更新', '深度求索中，用时59秒', '深度求索中，用时1分0秒', false],
  ]
  for (const [name, before, after, want] of cases) {
    const got = canAnimateClockChange(before, after)
    if (got === want) ok(name)
    else bad(name, `期望 ${want}，实际 ${got}`)
  }
  // 0.2 的运行中计时已移到 [data-chat-running]；验证真实 DOM 适配路径。
  const liveEnd = clientSource.indexOf('function editPathsFromToolNode(', clockStart)
  try {
    let animationStarts = 0
    class Node {
      constructor(tag = 'span', text = '') {
        this.nodeType = 1; this.tagName = tag; this.value = text; this.children = []
        this.isConnected = true; this.classes = new Set(); this.dataset = {}; this.attributes = {}
        this.classList = { add: (name) => this.classes.add(name), remove: (name) => this.classes.delete(name), contains: (name) => this.classes.has(name) }
      }
      get firstElementChild() { return this.children.find((child) => child.nodeType === 1) }
      get lastElementChild() { return [...this.children].reverse().find((child) => child.nodeType === 1) }
      get textContent() { return this.children.length ? this.children.map((child) => child.textContent).join('') : this.value }
      set textContent(value) { this.value = value; this.children = [] }
      appendChild(child) { child.parent = this; this.children.push(child); return child }
      append(...children) { children.forEach((child) => this.appendChild(child)) }
      setAttribute(name, value) { this.attributes[name] = value }
      animate(keyframes, options) {
        animationStarts += 1
        const animation = { keyframes, options, cancel() { this.oncancel?.() } }
        this.animation = animation
        return animation
      }
      replaceChildren(fragment) { this.children = fragment.children }
      remove() { if (this.parent) this.parent.children = this.parent.children.filter((child) => child !== this) }
      matches(selector) { return selector === '[data-chat-running]' ? this.running === true : selector === '[data-step-process] button[data-process-activity]' && this.processTitle === true }
      querySelectorAll(selector) {
        const found = []
        for (const child of this.children) {
          if (child.matches?.(selector)) found.push(child)
          found.push(...(child.querySelectorAll?.(selector) ?? []))
        }
        return found
      }
    }
    const body = new Node('body')
    const row = new Node('div'); row.running = true
    const content = new Node('span')
    const native = new Node('span')
    const source = new Node('span', '深度求索中，用时34秒...')
    native.append(source, new Node('span', '深度求索中，用时34秒...'))
    content.append(new Node('svg'), native)
    row.append(new Node('span'), new Node('span'), content)
    body.appendChild(row)
    const observers = []
    class Observer {
      constructor(callback) { this.callback = callback; observers.push(this) }
      observe(target) { this.target = target }
      disconnect() { this.target = null }
    }
    const fakeDocument = {
      body,
      createElement: (tag) => new Node(tag),
      createTextNode: (value) => ({ nodeType: 3, textContent: value }),
      createDocumentFragment: () => ({ children: [], appendChild(child) { this.children.push(child) } }),
    }
    const { installLiveRunningClock } = vm.runInNewContext(
      clientSource.slice(clockStart, liveEnd) + '\n; ({ installLiveRunningClock })',
      { document: fakeDocument, MutationObserver: Observer })
    const detach = installLiveRunningClock()
    const overlay = content.lastElementChild
    if (native.classes.has('dsh-stream-think-live-native') && overlay.textContent === source.textContent) ok('0.2 运行状态行接管且首帧文字完整')
    else bad('0.2 运行状态行接管', '未正确显示初始计时')
    source.textContent = '深度求索中，用时35秒...'
    observers.find((observer) => observer.target === source)?.callback([])
    if (overlay.textContent.includes('35秒') && overlay.children.some((child) => child.className === 'dsh-stream-think-clock-number')) ok('0.2 运行中秒数滚动')
    else bad('0.2 运行中秒数滚动', overlay.textContent)
    source.textContent = '深度求索中，用时42秒...'
    observers.find((observer) => observer.target === source)?.callback([])
    if (overlay.textContent === source.textContent && !overlay.children.some((child) => child.className === 'dsh-stream-think-clock-number')) ok('0.2 跳秒直接更新')
    else bad('0.2 跳秒直接更新', overlay.textContent)
    detach()
    if (!native.classes.has('dsh-stream-think-live-native') && !content.classes.has('dsh-stream-think-live-content')) ok('0.2 卸载恢复原生计时')
    else bad('0.2 卸载恢复原生计时', '原生文本仍被隐藏')

    const group = new Node('div')
    const button = new Node('button'); button.processTitle = true
    const titleNative = new Node('span')
    const label = new Node('span')
    const titleText = new Node('span', '正在分析请求 · 检查文件')
    label.appendChild(titleText)
    titleNative.appendChild(label)
    titleNative.querySelector = () => label
    button.append(new Node('span'), titleNative)
    group.appendChild(button)
    body.appendChild(group)
    let motionPreference = 'auto'
    let titleNow = 0
    const { installProcessTitleFlip } = vm.runInNewContext(
      clientSource.slice(clockStart, liveEnd) + '\n; ({ installProcessTitleFlip })',
      { document: fakeDocument, MutationObserver: Observer, performance: { now: () => titleNow }, window: { matchMedia: () => ({ matches: false }) } })
    const detachTitle = installProcessTitleFlip(() => motionPreference)
    const titleViewport = button.children[2]
    const titleOverlay = titleViewport.children[0]
    titleText.textContent = '正在分析请求 · 修复滚动'
    observers.find((observer) => observer.target === titleNative)?.callback([])
    const firstOld = titleViewport.children.find((child) => child.dataset.old === '')
    const firstTransition = titleOverlay.textContent === titleText.textContent && firstOld?.textContent === '正在分析请求 · 检查文件' && titleOverlay.animation?.options.duration === 240
    const firstAnimationStarts = animationStarts
    titleNow = 150
    titleText.textContent = '正在分析请求 · 检查动画'
    observers.find((observer) => observer.target === titleNative)?.callback([])
    const noRestart = animationStarts === firstAnimationStarts
    titleOverlay.animation?.onfinish?.()
    const settled = titleOverlay.textContent === titleText.textContent && !titleViewport.children.some((child) => child.dataset.old === '')
    if (firstTransition && noRestart && settled) ok('0.2 高频标题更新合并，当前翻页完成后呈现最新内容')
    else bad('过程组标题高频更新', `动画启动 ${animationStarts - firstAnimationStarts} 次；settled=${settled}`)
    motionPreference = 'force-reduced'
    titleText.textContent = '正在分析请求 · 完成'
    observers.find((observer) => observer.target === titleNative)?.callback([])
    if (titleOverlay.textContent === titleText.textContent && !titleViewport.children.some((child) => child.dataset.old === '')) ok('过程标题遵守减少动态效果')
    else bad('过程标题减少动态效果', '仍保留动画旧层')
    motionPreference = 'auto'
    const beforeBurst = animationStarts
    for (let index = 0; index < 20; index += 1) {
      titleNow += 150
      titleText.textContent = `正在分析请求 · 第 ${index} 次更新`
      observers.find((observer) => observer.target === titleNative)?.callback([])
    }
    const decorative = new Node('span', titleText.textContent)
    titleNative.appendChild(decorative)
    observers.find((observer) => observer.target === titleNative)?.callback([])
    if (animationStarts === beforeBurst && titleOverlay.textContent === titleText.textContent && !titleOverlay.textContent.includes(titleText.textContent + titleText.textContent)) {
      ok('连续 150ms 更新不重启动画，装饰副本不重复显示')
    } else bad('高频过程标题', `动画启动 ${animationStarts - beforeBurst} 次；标题=${titleOverlay.textContent}`)
    titleNow += 1000
    titleText.textContent = '正在分析请求 · 尝试： ```js JSON.stringify(document.body.innerText)'
    observers.find((observer) => observer.target === titleNative)?.callback([])
    if (titleOverlay.textContent === '正在分析请求 · 代码片段') ok('实际过程标题动画不展示原始代码')
    else bad('过程标题代码正文', titleOverlay.textContent)
    detachTitle()
    if (!button.classes.has('dsh-stream-think-process-title') && !titleNative.classes.has('dsh-stream-think-process-native') && button.children.length === 2) ok('过程标题卸载恢复原生 DOM')
    else bad('过程标题卸载', '原生标题仍被隐藏或留有叠层')
  } catch (error) { bad('0.2 运行计时 DOM 回归', error) }
  const result = (name, argsRaw, isError = false) => ({ kind: 'tool-result', callId: name, isError, call: { name, argsRaw }, subCalls: [] })
  const toolNode = (root) => ({ kind: 'tool-call', data: { root } })
  const edits = [
    ['成功的 edit 提取文件', result('edit', JSON.stringify({ path: '/work/a.ts' })), ['/work/a.ts']],
    ['失败的 edit 不算已修改', result('edit', JSON.stringify({ path: '/work/a.ts' }), true), []],
    ['apply_patch 提取多文件', result('apply_patch', JSON.stringify({ patch: '*** Begin Patch\n*** Update File: src/a.ts\n*** Add File: src/b.ts\n*** End Patch' })), ['src/a.ts', 'src/b.ts']],
    ['读取文件不算编辑', result('read_file', JSON.stringify({ path: '/work/a.ts' })), []],
  ]
  for (const [name, root, want] of edits) {
    const got = [...editPathsFromToolNode(toolNode(root))]
    if (JSON.stringify(got) === JSON.stringify(want)) ok(name)
    else bad(name, `期望 ${JSON.stringify(want)}，实际 ${JSON.stringify(got)}`)
  }
  const actions = [
    ...actionSummariesFromToolNode(toolNode(result('bash', JSON.stringify({ description: '检查模型与视频帧', command: 'ffprobe video.mp4' })))),
    ...actionSummariesFromToolNode(toolNode(result('read_image', JSON.stringify({ path: '/tmp/frame.jpg' })))),
    ...actionSummariesFromToolNode(toolNode(result('grep', JSON.stringify({ pattern: 'TODO' }), true))),
    ...actionSummariesFromToolNode(toolNode(result('todo_write', JSON.stringify({ todos: [{ content: '把内容底板升级为分区域取色', status: 'in_progress' }, { content: '验证颜色', status: 'completed' }] })))),
    ...actionSummariesFromToolNode(toolNode(result('custom_tool', JSON.stringify({ description: '检查工作区' })))),
    ...actionSummariesFromToolNode(toolNode(result('edit', JSON.stringify({ path: '/work/a.ts' })))),
  ]
  if (actions.length === 6 && actions[0].kind === 'command' && actions[0].text === '检查模型与视频帧' && actions[1].kind === 'read' && actions[1].text === '/tmp/frame.jpg' && actions[2].kind === 'search' && actions[2].text === '失败 · TODO' && actions[3].kind === 'task' && actions[3].text.includes('1/2 已完成 · 把内容底板升级为分区域取色') && actions[4].kind === 'other' && actions[5].kind === 'edit') ok('命令、读取、搜索、任务清单、编辑和其他工具独立分类')
  else bad('执行摘要分类', JSON.stringify(actions))
  const invalidTask = actionSummariesFromToolNode(toolNode(result('todo_write', JSON.stringify({ todos: [{ content: '重复', status: 'pending' }, { content: '重复', status: 'completed' }] }))))[0]
  if (actions[3].todos?.length === 2 && actions[3].todos[0].status === 'in_progress' && actions[3].todos[1].content === '验证颜色' && invalidTask.todos === undefined && sameTaskSnapshot(actions[3].todos, actions[3].todos) && !sameTaskSnapshot(actions[3].todos, [{ ...actions[3].todos[0], status: 'completed' }, actions[3].todos[1]])) ok('任务清单沿用原生 todo_write 完整快照，状态变化会刷新')
  else bad('任务清单快照', JSON.stringify({ valid: actions[3], invalid: invalidTask }))
  if (actionSummariesFromToolNode(toolNode({ phase: 'start', argsRaw: '{}' })).length === 0) ok('未完成调用不进入组外摘要')
  else bad('未完成调用', '泄出执行中的半截内容')
  const commandCompat = ['exec_command', 'write_stdin', 'terminal_run'].every((name) => actionSummariesFromToolNode(toolNode(result(name, JSON.stringify({ description: '检查运行结果' }))))[0]?.kind === 'command')
  const readCompat = ['read_file', 'read_text_file', 'list_dir'].every((name) => actionSummariesFromToolNode(toolNode(result(name, JSON.stringify({ path: '/work/a.ts' }))))[0]?.kind === 'read')
  const taskCompat = ['create_goal', 'update_goal'].every((name) => actionSummariesFromToolNode(toolNode(result(name, '{}')))[0]?.kind === 'task')
  if (commandCompat && readCompat && taskCompat) ok('DSH 0.2 命令、读取和任务工具归入对应开关')
  else bad('DSH 0.2 工具分类', `command=${commandCompat} read=${readCompat} task=${taskCompat}`)
  const rows = [
    {
      dataset: { chatTurn: '7', chatFlowKind: 'tool-call' },
      querySelector: (selector) => selector === '[data-stream-think-edit-files]'
        ? { dataset: { streamThinkEditFiles: JSON.stringify(['/work/a.ts']) } }
        : { dataset: { streamThinkActions: JSON.stringify(actions.slice(0, 2)) } },
      querySelectorAll: () => [],
    },
    {
      dataset: { chatTurn: '7', chatFlowKind: 'assistant-step' },
      querySelector: () => null,
      querySelectorAll: () => [
        { dataset: { state: 'ok' }, querySelector: () => ({ textContent: '先检查输入\n最终结论：文件已经修好。' }) },
        { dataset: { state: 'ok' }, querySelector: () => ({ textContent: '第二次思考\n接着检查颜色方案。' }) },
        { dataset: { state: 'running' }, querySelector: () => ({ textContent: '还没完成的半截思考' }) },
      ],
    },
    {
      dataset: { chatTurn: '7', chatFlowKind: 'tool-call' },
      querySelector: (selector) => selector === '[data-stream-think-actions]'
        ? { dataset: { streamThinkActions: JSON.stringify([actions[3]]) } }
        : selector === '[data-tool="todo_write"]'
          ? { querySelector: (part) => ({ textContent: part.includes('summarySuffix') ? '新增 2 · 移除 0' : '1/2 已完成 · 把内容底板升级为分区域取色' }) }
          : null,
      querySelectorAll: () => [],
    },
    {
      dataset: { chatTurn: '8', chatFlowKind: 'tool-call' },
      querySelector: () => ({ dataset: { streamThinkEditFiles: JSON.stringify(['/other.ts']) } }),
      querySelectorAll: () => [],
    },
    {
      dataset: { chatTurn: '7', chatFlowKind: 'tool-call' },
      querySelector: (selector) => selector === '[data-stream-think-actions]' ? { dataset: { streamThinkActions: JSON.stringify([actions[0]]) } } : null,
      querySelectorAll: () => [],
    },
  ]
  let highlightSelector = ''
  const highlights = processHighlights({ querySelectorAll: (selector) => { highlightSelector = selector; return rows } }, '7')
  if (highlightSelector === '[data-chat-flow-kind][data-chat-turn]' && JSON.stringify([...highlights.files]) === JSON.stringify(['/work/a.ts']) && JSON.stringify(highlights.thoughts.map((thought) => thought.summary)) === JSON.stringify(['最终结论：文件已经修好。', '接着检查颜色方案。']) && highlights.thoughts[0].content.startsWith('先检查输入') && highlights.actions.length === 3 && highlights.actions[2].kind === 'task' && highlights.actions[2].text.includes('新增 2 · 移除 0')) {
    ok('按轮次提取已完成记录，独立于原生折叠设置，重复调用不重复显示')
  } else bad('关键进展提取', JSON.stringify(highlights))
  const shortThoughtRows = [{ dataset: { chatTurn: '7', chatFlowKind: 'assistant-step' }, querySelectorAll: () => [{ dataset: { state: 'ok' }, querySelector: () => ({ textContent: '调用。' }) }] }]
  const shortHighlights = processHighlights({ querySelectorAll: () => shortThoughtRows }, '7')
  const shortGroup = buildProcessHighlightGroups({ files: [], thoughts: shortHighlights.thoughts, tasks: [], actions: [] }, (path) => path)[0]
  if (shortHighlights.thoughts[0]?.summary === '' && shortGroup?.preview === '' && shortGroup.items[0]?.text === '第 1 段思考' && shortGroup.items[0]?.content === '调用。') ok('短思考不显示空泛摘要，原文仍在分组内可展开')
  else bad('短思考摘要回退', JSON.stringify({ shortHighlights, shortGroup }))
  const sample = { files: ['/work/a.ts'], thoughts: [{ summary: '检查完成', content: '先检查输入\n检查完成' }], actions }
  const allOff = { showTaskUpdates: false, showEditedFiles: false, showThoughtSummary: false, showCommands: false, showReads: false, showSearches: false, showOtherTools: false }
  const hidden = visibleProcessHighlights(sample, allOff)
  const choices = [
    ['showTaskUpdates', (v) => v.tasks.length === 1 && v.tasks[0].kind === 'task'],
    ['showEditedFiles', (v) => v.files.length === 1 && v.actions.length === 1 && v.actions[0].kind === 'edit'],
    ['showThoughtSummary', (v) => v.thoughts.length === 1],
    ['showCommands', (v) => v.actions.length === 1 && v.actions[0].kind === 'command'],
    ['showReads', (v) => v.actions.length === 1 && v.actions[0].kind === 'read'],
    ['showSearches', (v) => v.actions.length === 1 && v.actions[0].kind === 'search'],
    ['showOtherTools', (v) => v.actions.length === 1 && v.actions[0].kind === 'other'],
  ]
  if (!shouldShowProcessHighlights(hidden) && buildProcessHighlightGroups(hidden, (path) => path).length === 0 && choices.every(([key, check]) => {
    const visible = visibleProcessHighlights(sample, { ...allOff, [key]: true })
    const groups = buildProcessHighlightGroups(visible, (path) => path.slice('/work/'.length))
    return check(visible) && shouldShowProcessHighlights(visible) && groups.length === 1 && groups[0].items.length > 0 && groups[0].preview !== ''
  })) ok('七类开关分别控制对话中的独立分组')
  else bad('分类开关显示逻辑', '单类开关或分组内容未生效')
  const allGroups = buildProcessHighlightGroups(visibleProcessHighlights(sample, Object.fromEntries(Object.keys(allOff).map((key) => [key, true]))), (path) => path.slice('/work/'.length))
  if (JSON.stringify(allGroups.map((group) => group.key)) === JSON.stringify(['edit', 'read', 'command', 'search', 'task', 'thought', 'other']) && allGroups[0].title === '编辑了 1 个文件' && allGroups[0].items.length === 1 && allGroups[0].items[0].text === 'a.ts') ok('编辑、读取、命令等按类型合并，编辑文件不重复列出')
  else bad('分类分组合并', JSON.stringify(allGroups))
  const finishedTask = { ...actions[3], id: 'task-finished', text: '2/2 已完成', todos: actions[3].todos.map((todo) => ({ ...todo, status: 'completed' })) }
  const latestTaskGroup = buildProcessHighlightGroups({ files: [], thoughts: [], actions: [], tasks: [actions[3], finishedTask] }, (path) => path)[0]
  if (latestTaskGroup?.title === '任务清单更新 2 次' && latestTaskGroup.preview === '2/2 已完成' && latestTaskGroup.items.length === 1 && latestTaskGroup.items[0].action.todos.every((todo) => todo.status === 'completed')) ok('任务分组展开只显示最新快照，已完成后不残留旧状态')
  else bad('任务分组最新状态', JSON.stringify(latestTaskGroup))
  const failedEditGroup = buildProcessHighlightGroups({ files: ['/work/a.ts'], thoughts: [], tasks: [], actions: [{ id: 'failed-edit', kind: 'edit', title: '编辑', text: '失败 · b.ts' }] }, (path) => path.slice('/work/'.length))[0]
  if (failedEditGroup.title.includes('1 次失败') && failedEditGroup.items.length === 2 && failedEditGroup.items[1].text === '失败 · b.ts') ok('同轮成功编辑和失败编辑都能看到')
  else bad('编辑失败记录', JSON.stringify(failedEditGroup))
  const wrapperEnd = clientSource.indexOf('\t\t//#endregion', clockEnd)
  const hookSlots = []
  let hookCursor = 0
  let layoutEffects = []
  let selectedSettings = { ...allOff, showTaskUpdates: true }
  const scope = { querySelectorAll: (selector) => selector.includes('[data-step-process]') ? [{ dataset: { chatTurn: '7' } }] : rows }
  let nativeClicks = 0
  const rootElement = { closest: () => scope, querySelector: (selector) => selector.includes('button[data-turn-process]') ? { click: () => { nativeClicks += 1 } } : null }
  const observedScopes = []
  const pendingFrames = []
  class HighlightObserver {
    constructor(callback) { this.callback = callback }
    observe(target) { if (target === scope) observedScopes.push(this) }
    disconnect() {}
  }
  const fakeReact = {
    createElement(type, props, ...children) {
      if (props?.className === 'dsh-stream-think-clock') props.ref.current = rootElement
      return { type, props, children }
    },
    useRef(value) { const i = hookCursor++; if (!(i in hookSlots)) hookSlots[i] = { current: value }; return hookSlots[i] },
    useState(value) { const i = hookCursor++; if (!(i in hookSlots)) hookSlots[i] = value; return [hookSlots[i], (next) => { hookSlots[i] = typeof next === 'function' ? next(hookSlots[i]) : next }] },
    useLayoutEffect(effect) { layoutEffects.push(effect) },
    useSyncExternalStore: (_subscribe, get) => get(),
  }
  const wrapTurnProcessClockNodeView = vm.runInNewContext(
    clientSource.slice(clockEnd, wrapperEnd) + '\n; wrapTurnProcessClockNodeView',
    { react: fakeReact, getThinkSettings: () => selectedSettings, subscribeThinkSettings() {}, processHighlights, visibleProcessHighlights, buildProcessHighlightGroups, shouldShowProcessHighlights, sameTaskSnapshot, clockLabelParts: () => [], canAnimateClockChange: () => false, MutationObserver: HighlightObserver, requestAnimationFrame: (callback) => { pendingFrames.push(callback); return pendingFrames.length }, cancelAnimationFrame() {}, setTimeout: () => 1, clearTimeout() {} },
  )
  const TurnProcess = wrapTurnProcessClockNodeView(() => null)
  const props = { node: { data: { turn: 7 }, location: { turn: { status: 'closed' } } }, turnProcess: { open: false } }
  const renderPinned = (nextProps = props) => { hookCursor = 0; layoutEffects = []; return TurnProcess(nextProps) }
  const findClass = (tree, className) => {
    if (Array.isArray(tree)) return tree.map((part) => findClass(part, className)).find(Boolean)
    if (tree?.props?.className === className) return tree
    return findClass(tree?.children ?? [], className)
  }
  const findAllClass = (tree, className) => Array.isArray(tree) ? tree.flatMap((part) => findAllClass(part, className)) : tree === null || tree === undefined ? [] : [...(tree.props?.className === className ? [tree] : []), ...findAllClass(tree.children ?? [], className)]
  const findKind = (tree, kind) => {
    if (Array.isArray(tree)) return tree.map((part) => findKind(part, kind)).find(Boolean)
    if (tree?.props?.['data-kind'] === kind) return tree
    return findKind(tree?.children ?? [], kind)
  }
  renderPinned()
  layoutEffects[1]()
  const pinnedTask = findKind(renderPinned(), 'task')
  selectedSettings = allOff
  const turnedOff = findKind(renderPinned(), 'task')
  selectedSettings = { ...allOff, showTaskUpdates: true }
  const opened = findKind(renderPinned({ ...props, turnProcess: { open: true } }), 'task')
  const taskHeader = findClass(pinnedTask, 'dsh-stream-think-highlight-header')
  const taskPreview = findClass(pinnedTask, 'dsh-stream-think-highlight-preview')
  if (pinnedTask && !turnedOff && opened && taskHeader?.props?.['aria-expanded'] === false && taskPreview?.children?.[0]?.includes('新增 2 · 移除 0') && !findClass(pinnedTask, 'dsh-stream-think-highlight-text')) ok('任务分组直接显示在对话里，原过程组展开也保留，明细按需挂载')
  else bad('任务清单分组渲染', `pinned=${!!pinnedTask} off=${!!turnedOff} open=${!!opened} preview=${String(taskPreview?.children?.[0])}`)
  taskHeader?.props?.onClick()
  const expandedTask = findKind(renderPinned(), 'task')
  const taskRows = findAllClass(expandedTask, 'dsh-stream-think-task-item')
  const taskContents = findAllClass(expandedTask, 'dsh-stream-think-task-content')
  if (findClass(expandedTask, 'dsh-stream-think-highlight-header')?.props?.['aria-expanded'] === true && findClass(expandedTask, 'dsh-stream-think-highlight-body')?.props?.['data-open'] === true && taskRows.length === 2 && taskRows[0].props['data-status'] === 'in_progress' && taskRows[1].props['data-status'] === 'completed' && taskContents.map((part) => part.children[0]).join('|') === '把内容底板升级为分区域取色|验证颜色') ok('展开任务分组显示原生 todo_write 的完整任务和状态')
  else bad('分类分组展开', '标题开关或分组明细未同步')
  selectedSettings = { ...allOff, showTaskUpdates: true, showThoughtSummary: true }
  const thoughtGroup = findKind(renderPinned(), 'thought')
  findClass(thoughtGroup, 'dsh-stream-think-highlight-header')?.props?.onClick()
  const thoughtOpened = findKind(renderPinned(), 'thought')
  const thoughtButton = findClass(thoughtOpened, 'dsh-stream-think-highlight-item')
  thoughtButton?.props?.onClick()
  const thoughtExpanded = findKind(renderPinned(), 'thought')
  const thoughtDetail = findClass(thoughtExpanded, 'dsh-stream-think-highlight-thought')
  const taskAfterThought = findKind(renderPinned(), 'task')
  if (thoughtDetail?.children?.[0]?.includes('先检查输入') && findClass(taskAfterThought, 'dsh-stream-think-highlight-header')?.props?.['aria-expanded'] === true && nativeClicks === 0) ok('思考摘要仅在当前分组内展开，不收起其他分类且不打开原生过程组')
  else bad('思考摘要局部展开', `detail=${!!thoughtDetail} nativeClicks=${nativeClicks}`)
  findClass(thoughtExpanded, 'dsh-stream-think-highlight-header')?.props?.onClick()
  const thoughtClosing = findKind(renderPinned(), 'thought')
  if (findClass(thoughtClosing, 'dsh-stream-think-highlight-body')?.props?.['data-open'] === false && findClass(thoughtClosing, 'dsh-stream-think-highlight-thought')) ok('收起时保留明细供高度过渡，避免瞬间跳变')
  else bad('分组收起过渡', '收起时明细提前卸载')
  if (clientSource.includes('max-height:min(42vh,360px);overflow:hidden') && clientSource.includes('overflow-y:auto;overscroll-behavior:contain')) ok('分组内容限高并在组内滚动')
  else bad('分组内部滚动', '缺少限高或内部滚动样式')
  hookSlots.length = 0
  const liveProps = { ...props, node: { ...props.node, location: { turn: { status: 'open' } } }, turnProcess: { open: true } }
  renderPinned(liveProps)
  layoutEffects[1]()
  const liveTask = findKind(renderPinned(liveProps), 'task')
  if (findClass(liveTask, 'dsh-stream-think-highlight-preview')?.children?.[0]?.includes('新增 2 · 移除 0')) ok('运行中已完成的工具记录实时显示在对话里')
  else bad('运行中工具外显', '原生 turn-process 尚未显示时，分类记录未渲染')
  const liveObserver = observedScopes.at(-1)
  const addedGroup = (turn) => ({ nodeType: 1, closest: () => ({ dataset: { chatTurn: turn } }), matches: () => true })
  liveObserver?.callback([{ type: 'childList', addedNodes: [addedGroup('8')] }])
  const ignoredOtherTurn = pendingFrames.length === 0
  liveObserver?.callback([{ type: 'childList', addedNodes: [addedGroup('7')] }])
  if (liveObserver && ignoredOtherTurn && pendingFrames.length === 1) ok('新过程组触发刷新，其他轮次变化不重算')
  else bad('过程组动态观察', `observer=${!!liveObserver} ignored=${ignoredOtherTurn} frames=${pendingFrames.length}`)
  if (clientSource.includes('padding-bottom:16px;scroll-padding-bottom:16px') && clientSource.includes('lastRunningForScrollRef') && clientSource.includes('mask-image:none;scrollbar-gutter:auto')) {
    ok('Think 预览补足底部空间，并去除展开时的外层滚动截断')
  } else bad('Think 底部修复', '产物缺少底部空间或外层滚动规则')
  if (clientSource.includes('.I17U7q_disclosureContent[data-collapsed]>.I17U7q_thinkBody{padding-top:0;padding-bottom:0;overflow:hidden}') && clientSource.includes('.I17U7q_disclosureContent[data-no-transition]>.I17U7q_thinkBody{transition:none}')) {
    ok('Think 收起后清除预览留白，减少动态效果时不播放补偿动画')
  } else bad('Think 收起行距', '收起状态仍可能保留底部留白')
}

/* ---------------- 4. 思考状态与宿主折叠真值表 ---------------- */

const handoffStart = clientSource.indexOf('function waitForFollowHandoff(host, isLeader, enabled, finish) {')
const handoffEnd = clientSource.indexOf('function useConversationFollow(', handoffStart)
if (handoffStart < 0 || handoffEnd < 0 || !clientSource.includes('waitForFollowHandoff(host, () => isLeader(host), () => controlScrollRef.current, finishInactive)')) {
  bad('滚动交接逻辑', '产物缺少等待真实接管的路径')
} else {
  const timeouts = []
  const intervals = []
  const frames = []
  let status = true
  let observer
  let finished = 0
  class HandoffObserver {
    constructor(callback) { this.callback = callback; observer = this }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const waitForFollowHandoff = vm.runInNewContext(
    clientSource.slice(handoffStart, handoffEnd) + '\n; waitForFollowHandoff',
    {
      MutationObserver: HandoffObserver,
      turnStatusOf: () => status ? {} : null,
      requestAnimationFrame: (callback) => { frames.push(callback); return frames.length },
      cancelAnimationFrame: () => {},
      setTimeout: (callback, ms) => { const timer = { callback, ms, cleared: false }; timeouts.push(timer); return timer },
      clearTimeout: (timer) => { timer.cleared = true },
      setInterval: (callback) => { const timer = { callback, cleared: false }; intervals.push(timer); return timer },
      clearInterval: (timer) => { timer.cleared = true },
    },
  )
  const host = { isConnected: true }
  let leader = true
  let enabled = true
  waitForFollowHandoff(host, () => leader, () => enabled, () => { finished += 1 })
  intervals.at(-1).callback()
  intervals.at(-1).callback()
  const heldWhileRunning = finished === 0 && timeouts.length === 0
  leader = false
  observer.callback([])
  frames.shift()?.()
  const yieldedToNext = finished === 0 && observer.disconnected && intervals.at(-1).cleared
  leader = true
  waitForFollowHandoff(host, () => leader, () => enabled, () => { finished += 1 })
  status = false
  observer.callback([])
  frames.shift()?.()
  const afterTurnEnd = timeouts.at(-1)
  if (!afterTurnEnd?.cleared) afterTurnEnd.callback()
  const endedOnce = finished === 1
  status = true
  enabled = false
  waitForFollowHandoff(host, () => leader, () => enabled, () => { finished += 1 })
  if (heldWhileRunning && yieldedToNext && afterTurnEnd?.ms === 180 && endedOnce && finished === 2) ok('旧行保留滚动预留直到新行接管或本轮结束，关闭跟随立即清理')
  else bad('滚动交接时机', `held=${heldWhileRunning} yielded=${yieldedToNext} endDelay=${afterTurnEnd?.ms} finished=${finished}`)
}

const settingsStart = clientSource.indexOf('const THINK_SETTINGS_KEY = "dsh-stream-think:settings.v1";')
const settingsEnd = clientSource.indexOf('let thinkSettings = readThinkSettings();', settingsStart)
if (settingsStart < 0 || settingsEnd < 0) bad('组外开关旧设置迁移', '找不到设置读取函数')
else {
  const readThinkSettings = vm.runInNewContext(
    clientSource.slice(settingsStart, settingsEnd) + '\n; readThinkSettings',
    { window: { localStorage: { getItem: (key) => key === 'dsh-think-ux:settings.v1' ? JSON.stringify({ autoExpand: false, capLines: 12, showLookups: true, showEditedFiles: false }) : null } } },
  )
  const migrated = readThinkSettings()
  if (migrated.showReads && migrated.showSearches && !migrated.showEditedFiles && migrated.showTaskUpdates && !migrated.autoExpand && migrated.capLines === 12) ok('旧思考盒偏好迁移到新入口，新任务开关采用默认值')
  else bad('组外开关旧设置迁移', JSON.stringify(migrated))
}

const helpersStart = clientSource.indexOf('function findLiveReasoningIndex(blocks) {')
const helpersEnd = clientSource.indexOf('function AnimatedReasoning({', helpersStart)
if (helpersStart < 0 || helpersEnd < 0) {
  bad('思考判定函数提取', '产物里找不到判定函数')
} else {
  const helpers = vm.runInContext(clientSource.slice(helpersStart, helpersEnd) + '\n; ({ findLiveReasoningIndex, isReasoningLive, shouldHideReasoning, shouldKeepReasoningDuringHandoff })', sandbox)
  const { findLiveReasoningIndex, isReasoningLive, shouldHideReasoning, shouldKeepReasoningDuringHandoff } = helpers
  const cases = [
    { name: '[reasoning] 单独一块 → 思考中', blocks: [{ kind: 'reasoning' }], index: 0, want: true },
    { name: '[reasoning, tool-call] 正在分析请求 → 思考中（上游 bug 点）', blocks: [{ kind: 'reasoning' }, { kind: 'tool-call' }], index: 0, want: true },
    { name: '[reasoning, tool-call, tool-call] → 思考中', blocks: [{ kind: 'reasoning' }, { kind: 'tool-call' }, { kind: 'tool-call' }], index: 0, want: true },
    { name: '[reasoning, text] 正文已开始 → 已结算', blocks: [{ kind: 'reasoning' }, { kind: 'text' }], index: 0, want: false },
    { name: '[reasoning, reasoning] 旧块 → 已结算', blocks: [{ kind: 'reasoning' }, { kind: 'reasoning' }], index: 0, want: false },
    { name: '[reasoning, reasoning] 新块 → 思考中', blocks: [{ kind: 'reasoning' }, { kind: 'reasoning' }], index: 1, want: true },
    { name: '[text, reasoning] → 思考中', blocks: [{ kind: 'text' }, { kind: 'reasoning' }], index: 1, want: true },
  ]
  for (const item of cases) {
    const got = isReasoningLive(item.blocks, item.index)
    if (got === item.want) ok(item.name, String(got))
    else bad(item.name, `期望 ${item.want}，实际 ${got}`)
  }
  const active = [{ kind: 'reasoning' }, { kind: 'tool-call' }]
  if (findLiveReasoningIndex(active) === 0) ok('工具调用尾部仍由思考行持有流速')
  else bad('思考流速归属', '未找到活动中的 reasoning')
  const visibility = [
    { name: '活动思考越过宿主折叠', native: true, streaming: true, auto: true, want: false },
    { name: '用户关闭自动展开时遵守宿主折叠', native: true, streaming: true, auto: false, want: true },
    { name: '结算后遵守宿主折叠', native: true, streaming: false, auto: true, want: true },
    { name: '宿主展开时保持可见', native: false, streaming: true, auto: true, want: false },
  ]
  for (const item of visibility) {
    const got = shouldHideReasoning(item.native, item.streaming, item.auto, active, 0)
    if (got === item.want) ok(item.name)
    else bad(item.name, `期望 hidden=${item.want}，实际 ${got}`)
  }
  if (shouldKeepReasoningDuringHandoff(true, 'open') && !shouldKeepReasoningDuringHandoff(true, 'closed') && shouldKeepReasoningDuringHandoff(false, 'closed')) {
    ok('轮次未结束时保留旧摘要，结束后才交还宿主折叠')
  } else bad('思考行交接', '未遵守轮次状态与自动收起设置')
}

/* A line flip must keep one measured row, while ordinary token growth stays quiet. */
const summaryStart = clientSource.indexOf('function selectThoughtSummary(text) {')
const summaryEnd = clientSource.indexOf('function AnimatedReasoning({', summaryStart)
if (summaryStart < 0 || summaryEnd < 0) {
  bad('Think 摘要组件提取', '找不到翻页组件')
} else {
  const slots = []
  let cursor = 0
  let layoutEffects = []
  let effects = []
  let summaryNow = 0
  let scheduledFrames = 0
  let pendingScrollFrame = null
  const summaryElement = { scrollLeft: 0, get scrollWidth() { throw new Error('流式摘要不应同步测量布局') } }
  const fakeReact = {
    createElement(type, props, ...children) {
      if (props?.ref) props.ref.current = summaryElement
      return { type, props, children }
    },
    useRef(value) {
      const index = cursor++
      if (!(index in slots)) slots[index] = { current: value }
      return slots[index]
    },
    useState(value) {
      const index = cursor++
      if (!(index in slots)) slots[index] = value
      return [slots[index], (next) => { slots[index] = next }]
    },
    useLayoutEffect(effect) { layoutEffects.push(effect) },
    useEffect(effect) { effects.push(effect) },
  }
  const { selectThoughtSummary, RollingThinkSummary } = vm.runInNewContext(clientSource.slice(summaryStart, summaryEnd) + '\n; ({ selectThoughtSummary, RollingThinkSummary })', {
    react: fakeReact,
    cx: (...parts) => parts.filter(Boolean).join(' '),
    TypewriterAssistantNodeView_module_css_default: { thinkSummary: 'native-think-summary' },
    performance: { now: () => summaryNow },
    setTimeout, clearTimeout,
    requestAnimationFrame(callback) { scheduledFrames += 1; pendingScrollFrame = callback; return scheduledFrames },
    cancelAnimationFrame() { pendingScrollFrame = null },
  })
  const render = (text, reduced = false) => {
    cursor = 0
    layoutEffects = []
    effects = []
    const tree = RollingThinkSummary({ text, line: text.trimEnd().lastIndexOf('\n'), followEnd: true, reduced })
    for (const effect of layoutEffects) effect()
    effects[1]()
    return tree
  }
  const first = render('正在分析')
  const growing = render('正在分析请求')
  render('正在分析请求\n检查文件')
  const flipped = render('正在分析请求\n检查文件')
  const continued = render('正在分析请求\n检查文件列表')
  render('正在分析请求\n检查文件列表\n下一行')
  const rapidLine = render('正在分析请求\n检查文件列表\n下一行')
  summaryNow = 600
  render('正在分析请求\n检查文件列表\n下一行\n完成')
  const settledLine = render('正在分析请求\n检查文件列表\n下一行\n完成')
  render('正在分析请求\n检查文件列表\n下一行', true)
  const reduced = render('正在分析请求\n检查文件列表\n下一行', true)
  if (first.children[1] === false && growing.children[1] === false && flipped.children[1]?.props['aria-hidden'] === true && flipped.children[0]?.props.className.includes('summary-enter') && continued.children[1]?.children[0] === '正在分析请求' && rapidLine.children[1] === false && settledLine.children[1]?.props['aria-hidden'] === true && reduced.children[1] === false) {
    ok('Think 摘要首次换行翻页，密集换行与减少动态效果直接更新')
  } else bad('Think 摘要翻页', '换行、添字或减少动态效果的渲染不符预期')
  const meaningful = selectThoughtSummary('先检查输入。\n已定位到分组按钮多出 22px 左边距。\n调用。')
  const short = selectThoughtSummary('调用。')
  const start = selectThoughtSummary('开始。')
  const longLine = selectThoughtSummary('已确认读取结果，并定位到缓存键错误。调用。')
  if (meaningful.text === '已定位到分组按钮多出 22px 左边距。' && !meaningful.followEnd && short.text === '' && start.text === '' && longLine.text === '已确认读取结果，并定位到缓存键错误。') ok('Think 摘要跳过末尾空泛短句，运行中与完成后都不伪装成结论')
  else bad('Think 摘要选句', JSON.stringify({ meaningful, short, start, longLine }))
  try {
    pendingScrollFrame?.()
    if (scheduledFrames === 1 && summaryElement.scrollLeft === 1e9) ok('高频添字合并为单帧横向滚动，无强制布局读取')
    else bad('摘要滚动合批', `排队 ${scheduledFrames} 帧，scrollLeft=${summaryElement.scrollLeft}`)
  } catch (error) { bad('摘要滚动布局', error) }
  if (clientSource.includes('.dsh-stream-think-summary{position:relative;display:block;flex:auto;min-width:0;height:24px;overflow:hidden')) {
    ok('Think 摘要过渡固定行高，不推动外层会话')
  } else bad('Think 摘要固定高度', '缺少固定 24px 容器')
}

/* DSH keeps the same scroll element while changing the active Session. */
const padStart = clientSource.indexOf('function setFlowPad(port, px) {')
const padEnd = clientSource.indexOf('function ownedBottomSpaceOf(port) {', padStart)
const sessionFollowStart = clientSource.indexOf('const followSessionOwners = new WeakMap();')
const sessionFollowEnd = clientSource.indexOf('function useConversationFollow(rootRef, active,', sessionFollowStart)
if (padStart < 0 || padEnd < 0 || sessionFollowStart < 0 || sessionFollowEnd < 0) {
  bad('跨会话滚动状态提取', '找不到底部预留或会话归属函数')
} else {
  const mapNames = ['followLeaders', 'followCompletionSettleRows', 'followReaderHolds', 'followHostScrollPorts', 'followScrollLedgers', 'followGuardAnchors', 'followRunwayOffsetHistory', 'followFloorHistory', 'followActivityAt']
  const maps = Object.fromEntries(mapNames.map((name) => [name, new WeakMap()]))
  const sets = { followCompletionSettle: new WeakSet(), followActivePorts: new WeakSet(), followSlackTransition: new WeakSet() }
  const padRegistry = new WeakMap()
  let clears = 0
  let flowFills = 0
  const sessionMicrotasks = []
  const { setFlowPad, isolateFollowSession, followSessionActivations } = vm.runInNewContext(clientSource.slice(padStart, padEnd) + clientSource.slice(sessionFollowStart, sessionFollowEnd) + '\n; ({ setFlowPad, isolateFollowSession, followSessionActivations })', {
    followSettlePads: padRegistry,
    flowElementOf: (port) => port.flow,
    clearVisual: () => { clears += 1 },
    restoreFlowFill: () => { flowFills += 1 },
    queueMicrotask: (callback) => { sessionMicrotasks.push(callback) },
    debugRuntime: { reportFollow() {} },
    ...maps,
    ...sets,
  })
  const oldFlow = { style: { paddingBottom: '8px' } }
  const newFlow = { style: { paddingBottom: '12px' } }
  let writes = 0
  let position = 420
  const port = { flow: oldFlow, get scrollTop() { return position }, set scrollTop(value) { writes += 1; position = value } }
  let session = 'A'
  const root = { closest: () => ({ getAttribute: () => session }) }
  isolateFollowSession(port, root)
  setFlowPad(port, 24)
  maps.followLeaders.set(port, { owner: 'A' })
  sets.followCompletionSettle.add(port)
  port.flow = newFlow
  session = 'B'
  isolateFollowSession(port, root)
  const resetOnce = clears === 1 && flowFills === 1 && oldFlow.style.paddingBottom === '8px' && newFlow.style.paddingBottom === '12px' && !padRegistry.has(port) && !maps.followLeaders.has(port) && !sets.followCompletionSettle.has(port) && writes === 0
  isolateFollowSession(port, root)
  const guarded = clientSource.includes('else if (boundSession !== currentSession) return;') && clientSource.includes('if (!following || port === null || !isOriginalSession(port)) return;') && clientSource.includes('if (!isOriginalSession(host)) {\n\t\t\t\t\t\tisolateFollowSession(host, host);') && clientSource.includes('if (disabledHost !== null && !isOriginalSession(disabledHost)) isolateFollowSession(disabledHost, disabledHost);') && clientSource.includes('if (followSessionActivations.has(nextPort)) return;')
  const duplicateSkipped = clears === 1
  setFlowPad(port, 18)
  session = null
  isolateFollowSession(port, root)
  const blankCleared = clears === 2 && flowFills === 2 && newFlow.style.paddingBottom === '12px' && !padRegistry.has(port) && writes === 0
  session = 'A'
  isolateFollowSession(port, root)
  const latestActivation = followSessionActivations.get(port)
  for (const callback of sessionMicrotasks.slice(0, -1)) callback()
  const oldMicrotasksIgnored = followSessionActivations.get(port) === latestActivation
  sessionMicrotasks.at(-1)?.()
  const restoredAfterCommit = !followSessionActivations.has(port)
  if (resetOnce && duplicateSkipped && blankCleared && clears === 3 && guarded && oldMicrotasksIgnored && restoredAfterCommit && clientSource.includes('isolateFollowSession(nextPort, root);\n\t\t\t\t\tif (followSessionActivations.has(nextPort)) return;')) ok('切换两个运行会话时清理旧滚动归属和预留，等待宿主恢复新会话阅读位置')
  else bad('跨会话滚动隔离', JSON.stringify({ clears, flowFills, oldPad: oldFlow.style.paddingBottom, newPad: newFlow.style.paddingBottom, writes, resetOnce, duplicateSkipped, blankCleared, oldMicrotasksIgnored, restoredAfterCommit }))
}

/* The fold wrapper keeps the live row mounted until its disclosure transition ends. */
const queueStart = clientSource.indexOf('const QUEUE_ACCEL_EXPONENT = 1.25;')
const queueEnd = clientSource.indexOf('/** Counts user-perceived characters', queueStart)
if (queueStart < 0 || queueEnd < 0) {
  bad('高速流式队列提取', '找不到自适应显示函数')
} else {
  const defaultMaxRevealCps = Number(clientSource.match(/maxRevealCps: (\d+),/)?.[1])
  const { computeAdaptiveQueueStep } = vm.runInNewContext(
    clientSource.slice(queueStart, queueEnd) + '\n; ({ computeAdaptiveQueueStep })',
    { DEFAULT_STREAM_DEBUG_TUNING: { revealScale: 1, queuePressure: .85, maxRevealCps: defaultMaxRevealCps } },
  )
  // 300 token/s 的英文或代码约可达 1500 字符/s；8 秒后不应积压数秒内容。
  let backlog = 0
  let debt = 0
  for (let frame = 0; frame < 8 * 60; frame += 1) {
    backlog += 25
    const step = computeAdaptiveQueueStep(backlog, 1000 / 60, debt)
    backlog -= step.revealChars
    debt = step.debt
  }
  if (backlog < 600) {
    ok('300 token/s 高速输入持续 8 秒，显示积压小于 0.4 秒', `${backlog} 字符`)
  } else bad('高速流式吞吐', `8 秒后积压 ${backlog} 字符`)
}

const foldStart = clientSource.indexOf('function FoldableReasoning({')
const foldEnd = clientSource.indexOf('function firstLine(', foldStart)
if (foldStart < 0 || foldEnd < 0) {
  bad('折叠过渡组件提取', '找不到 FoldableReasoning')
} else {
  const makeFold = () => {
    let visibleState
    const effects = []
    const fakeReact = {
      useState(initial) {
        if (visibleState === undefined) visibleState = initial
        return [visibleState, (next) => { visibleState = next }]
      },
      useLayoutEffect(fn) { effects.push(fn) },
    }
    const fold = vm.runInNewContext(clientSource.slice(foldStart, foldEnd) + '\n; FoldableReasoning', {
      react: fakeReact,
      react_jsx_runtime: { jsx: (_type, props) => props },
      useSearchableHidden: () => null,
      setTimeout, clearTimeout,
    })
    return (props) => {
      effects.length = 0
      const rendered = fold({ reveal() {}, children: null, ...props })
      for (const effect of effects) effect()
      return rendered['data-turn-process-inline'] === true
    }
  }
  const fold = makeFold()
  const liveProps = { hidden: false, live: true, keepVisibleAfterLive: false, collapseDelayMs: 1 }
  const settledProps = { ...liveProps, hidden: true, live: false }
  const hiddenLive = fold(liveProps)
  const hiddenBeforeTransition = fold(settledProps)
  await new Promise((resolve) => setTimeout(resolve, 5))
  const hiddenAfterTransition = fold(settledProps)
  if (!hiddenLive && !hiddenBeforeTransition && hiddenAfterTransition) ok('内层收起后才恢复宿主折叠')
  else bad('折叠过渡', `live=${hiddenLive} before=${hiddenBeforeTransition} after=${hiddenAfterTransition}`)

  const keptFold = makeFold()
  keptFold(liveProps)
  const keptHidden = keptFold({ ...settledProps, keepVisibleAfterLive: true })
  if (!keptHidden) ok('关闭自动收起后保持当前思考可见')
  else bad('关闭自动收起', '宿主折叠提前隐藏了当前思考')
}

/* ---------------- 5. Host 半边导入 ---------------- */

try {
  const host = await import('../lib/index.js')
  if (host.name === 'dsh-stream-think' && typeof host.apply === 'function' && host.Config !== undefined) ok('Host 半边导入与导出')
  else bad('Host 半边导出', 'name / apply / Config 不完整')
  const hostSource = readFileSync(join(ROOT, 'lib', 'index.js'), 'utf8')
  if (hostSource.includes('maxRevealCps: 1800,') && hostSource.includes('maxRevealCps: Schema.number().min(120).max(2400)') && hostSource.includes('tuning.maxRevealCps <= 2400') && clientSource.includes('key: "maxRevealCps",\n\t\t\t\tlabel: "debugMaxReveal",\n\t\t\t\ttip: "debugTipMaxReveal",\n\t\t\t\tmin: 120,\n\t\t\t\tmax: 2400,')) {
    ok('高速显示上限在客户端、Host 校验和调试面板保持一致')
  } else bad('高速显示设置边界', '客户端与 Host 上限不一致')
} catch (error) {
  bad('Host 半边导入', error)
}

/* ---------------- 结果 ---------------- */

console.log("[smoke] " + ROOT + "  (react: " + reactKind + ")")
for (const line of notes) console.log(line)
if (failures.length > 0) {
  console.error(`\n[smoke] ❌ ${failures.length} 项失败：`)
  for (const line of failures) console.error('   · ' + line)
  process.exit(1)
}
console.log('\n[smoke] ✅ 全部通过')
