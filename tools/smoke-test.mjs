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
  useId: () => 'smoke-instance',
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
  if (clockEntry.component.name === 'ProcessHighlightsView' && toolEntry.component.name === 'TypewriterFollowNodeView') {
    ok('原生计时行使用专用数字动画，工具行保留流式包装')
  } else {
    bad('计时行包装', `${clockEntry.component.name} / ${toolEntry.component.name}`)
  }
  if (reactKind === 'stub') {
    let liveRow = clockEntry.component({ node: { kind: 'turn-process', data: { turn: 7 }, location: { turn: { status: 'open' } } } })
    while (typeof liveRow?.type === 'function') liveRow = liveRow.type(liveRow.props)
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
    const saved = JSON.parse(store.get('dsh-stream-think:settings.v1'))
    if (saved.autoExpand === false && saved.autoCollapse === false && saved.controlScroll === true) {
      ok('三项设置点击后立即写入本地设置')
    } else bad('设置开关生效', JSON.stringify(saved))
    click('stream-think-show-edited-files')
    click('stream-think-show-thought-summary')
    click('stream-think-show-commands')
    click('stream-think-show-task-updates')
    click('stream-think-show-goals')
    for (const id of ['stream-think-show-reads', 'stream-think-show-searches', 'stream-think-show-other-tools']) { click(id); click(id) }
    const details = JSON.parse(store.get('dsh-stream-think:settings.v1'))
    if (details.showTaskUpdates === false && details.showGoals === false && details.showEditedFiles === false && details.showThoughtSummary === false && details.showCommands === false && details.showReads === false && details.showSearches === false && details.showOtherTools === false) {
      ok('组外八类内容可独立关闭，且可全部关闭')
    } else bad('组外内容开关', JSON.stringify(details))
  }
} else {
  bad('exports.apply', '缺失或不可调用')
}

/* BTW commands remain Session rows and their complete reply has no disclosure. */
try {
  const begin = clientSource.indexOf('function isBtwCommandNode(node) {')
  const end = clientSource.indexOf('function wrapTurnProcessClockNodeView(', begin)
  if (begin < 0 || end < 0) throw new Error('找不到 BTW 适配')
  const { installBtwCommandVisibility, wrapBtwCommandNodeView } = vm.runInNewContext(
    clientSource.slice(begin, end) + '\n; ({ installBtwCommandVisibility, wrapBtwCommandNodeView })', { react: REACT_STUB })
  const listeners = new Set()
  let refreshes = 0
  const definitions = []
  const registry = {
    entries: () => definitions,
    subscribe(callback) { listeners.add(callback); return () => listeners.delete(callback) },
    refresh() { refreshes++; for (const callback of [...listeners]) callback() },
  }
  const original = function (context) { if (this.kind !== 'command') throw new Error('definition receiver lost'); return context.node }
  const definition = { kind: 'command', buildViewNode: original }
  const unbind = installBtwCommandVisibility(registry)
  definitions.push(definition)
  registry.refresh() // native command plugin may register after this plugin
  const Wrapped = wrapBtwCommandNodeView('NativeCommand')
  for (const [name, outcome] of [['运行中', null], ['多行答复', {kind: 'success', text: '第一段\n第二段\n完整第三段'}], ['错误', {kind: 'error', text: '旁问失败详情'}]]) {
    for (const location of [{kind: 'step', turn: {status: 'open'}, step: {status: 'open'}}, {kind: 'turn', turn: {status: 'closed'}}]) {
      const data = {commandId: 'btw-1', name: 'btw', args: '附带问题', outcome}
      const node = {key: 'command:btw-1', kind: 'command', anchorSeq: 12, target: {seq: 12}, location, data}
      const projected = definition.buildViewNode({node})
      if (projected.location.kind !== 'session' || projected.key !== node.key || projected.anchorSeq !== 12 || projected.data !== data || projected.target !== node.target || node.location !== location) throw new Error(name + '投影改变了身份或仍可折叠')
      const rendered = Wrapped({node: projected})
      const answer = rendered.children[1]
      if (rendered.type !== 'section' || answer.type !== 'div' || answer.children[0] !== (outcome === null ? '旁问中…' : outcome.text) || rendered.props['aria-busy'] !== (outcome === null)) throw new Error(name + '未完整显示')
      if (outcome?.kind === 'error' && answer.props.role !== 'alert') throw new Error('错误语义丢失')
    }
  }
  const other = {kind: 'command', location: {kind: 'turn'}, data: {name: 'other'}}
  if (definition.buildViewNode({node: other}) !== other || Wrapped({node: other}).type !== 'NativeCommand') throw new Error('改变了其他命令')
  if (definition.buildViewNode({node: null}) !== null) throw new Error('空投影未保持')
  const wrapOnce = definition.buildViewNode
  registry.refresh()
  if (definition.buildViewNode !== wrapOnce || refreshes > 4) throw new Error('重复包装或刷新递归')
  unbind()
  if (definition.buildViewNode !== original || listeners.size !== 0) throw new Error('卸载未恢复宿主')
  ok('BTW 运行、完成、失败与历史记录都独立于过程折叠，多行答复完整显示')
  ok('BTW 适配支持延迟注册，保持节点身份，其他命令不变且卸载恢复')
} catch (error) { bad('BTW 原生命令适配', error) }

/* ---------------- 4a. 计时与过程组标题过渡边界 ---------------- */

const clockStart = clientSource.indexOf('function clockLabelParts(label) {')
const clockEnd = clientSource.indexOf('function wrapTurnProcessClockNodeView(', clockStart)
if (clockStart < 0 || clockEnd < 0) {
  bad('计时过渡函数提取', '产物里找不到计时函数')
} else {
  const thoughtSelectorStart = clientSource.indexOf('function selectThoughtSummary(text) {')
  const thoughtSelectorEnd = clientSource.indexOf('function AnimatedReasoning({', thoughtSelectorStart)
  if (thoughtSelectorStart < 0 || thoughtSelectorEnd < 0) bad('思考摘要选择函数提取', '产物里找不到摘要选择函数')
  else vm.runInContext(clientSource.slice(thoughtSelectorStart, thoughtSelectorEnd), sandbox)
  vm.runInContext(clientSource.slice(clientSource.indexOf('function findLiveReasoningIndex(blocks) {'), clientSource.indexOf('function AnimatedReasoning({')), sandbox)
  const { canAnimateClockChange, presentProcessTitle, editPathsFromToolNode, actionSummariesFromToolNode, toolDataHighlights, thoughtDataHighlights, EMPTY_PROCESS_SOURCE, processHighlights, visibleProcessHighlights, buildProcessHighlightGroups, shouldShowProcessHighlights, sameTaskSnapshot } = vm.runInContext(
    clientSource.slice(clockStart, clockEnd) + '\n; ({ canAnimateClockChange, presentProcessTitle, editPathsFromToolNode, actionSummariesFromToolNode, toolDataHighlights, thoughtDataHighlights, EMPTY_PROCESS_SOURCE, processHighlights, visibleProcessHighlights, buildProcessHighlightGroups, shouldShowProcessHighlights, sameTaskSnapshot })', sandbox)
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
  const goalCompat = ['create_goal', 'update_goal', 'get_goal'].every((name) => actionSummariesFromToolNode(toolNode(result(name, '{}')))[0]?.kind === 'goal')
  if (commandCompat && readCompat && goalCompat) ok('DSH 0.2 命令、读取和目标工具归入对应开关')
  else bad('DSH 0.2 工具分类', `command=${commandCompat} read=${readCompat} goal=${goalCompat}`)
  const emptyGoal = actionSummariesFromToolNode(toolNode(result('get_goal', '{}')))[0]
  if (emptyGoal?.text === '查看目标' && buildProcessHighlightGroups({ files: [], thoughts: [], tasks: [], actions: [emptyGoal] }, (path) => path)[0]?.items[0]?.text === '查看目标') ok('无参数目标查询显示操作语义，不泄露工具名')
  else bad('目标查询回退文案', JSON.stringify(emptyGoal))
  const failedGoal = actionSummariesFromToolNode(toolNode(result('get_goal', '{}', true)))[0]
  if (buildProcessHighlightGroups({ files: [], thoughts: [], tasks: [], actions: [failedGoal] }, (path) => path)[0]?.items[0]?.text === '失败 · 查看目标') ok('失败目标操作只显示一次失败和操作名称')
  else bad('失败目标文案', JSON.stringify(failedGoal))
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
      querySelectorAll: (selector) => selector === '[data-tool="todo_write"]'
        ? [{ querySelector: (part) => ({ textContent: part.includes('summarySuffix') ? '新增 2 · 移除 0' : '1/2 已完成 · 把内容底板升级为分区域取色' }) }]
        : [],
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
  const secondTaskAction = { ...actions[3], id: 'todo-second', text: '2/2 已完成' }
  const parallelTaskRow = {
    dataset: { chatTurn: '7', chatFlowKind: 'tool-call' },
    querySelector: (selector) => selector === '[data-stream-think-actions]' ? { dataset: { streamThinkActions: JSON.stringify([actions[3], secondTaskAction]) } } : null,
    querySelectorAll: () => [{ querySelector: () => ({ textContent: '错误共享的原生摘要' }) }],
  }
  const parallelTasks = processHighlights({ querySelectorAll: () => [parallelTaskRow] }, '7').actions
  if (parallelTasks.length === 2 && parallelTasks[0].text === actions[3].text && parallelTasks[1].text === '2/2 已完成') ok('同一工具行多个清单不共享错误摘要')
  else bad('并行任务摘要', JSON.stringify(parallelTasks))
  const failedRow = {
    dataset: { chatTurn: '7', chatFlowKind: 'tool-call' },
    querySelector: (selector) => selector === '[data-stream-think-actions]' ? { dataset: { streamThinkActions: JSON.stringify([actionSummariesFromToolNode(toolNode(result('todo_write', JSON.stringify({ todos: [{ content: '失败任务', status: 'pending' }] }), true)))[0]]) } } : null,
    querySelectorAll: () => [{ querySelector: () => ({ textContent: '错误的原生成功摘要' }) }],
  }
  const failedRowActions = processHighlights({ querySelectorAll: () => [failedRow] }, '7').actions
  if (failedRowActions.length === 1 && failedRowActions[0].failed && failedRowActions[0].text.startsWith('失败 · ')) ok('失败的清单调用保留失败标记，不被原生摘要覆盖')
  else bad('失败清单摘要覆盖', JSON.stringify(failedRowActions))
  const shortThoughtRows = [{ dataset: { chatTurn: '7', chatFlowKind: 'assistant-step' }, querySelectorAll: () => [{ dataset: { state: 'ok' }, querySelector: () => ({ textContent: '调用。' }) }] }]
  const shortHighlights = processHighlights({ querySelectorAll: () => shortThoughtRows }, '7')
  const shortGroup = buildProcessHighlightGroups({ files: [], thoughts: shortHighlights.thoughts, tasks: [], actions: [] }, (path) => path)[0]
  if (shortHighlights.thoughts[0]?.summary === '' && shortGroup?.preview === '' && shortGroup.items[0]?.text === '第 1 段思考' && shortGroup.items[0]?.content === '调用。') ok('短思考不显示空泛摘要，原文仍在分组内可展开')
  else bad('短思考摘要回退', JSON.stringify({ shortHighlights, shortGroup }))
  const goalAction = actionSummariesFromToolNode(toolNode(result('create_goal', JSON.stringify({ objective: '完成界面核查' }))))[0]
  const sample = { files: ['/work/a.ts'], thoughts: [{ summary: '检查完成', content: '先检查输入\n检查完成' }], actions: [...actions, goalAction] }
  const allOff = { showTaskUpdates: false, showGoals: false, showEditedFiles: false, showThoughtSummary: false, showCommands: false, showReads: false, showSearches: false, showOtherTools: false }
  const hidden = visibleProcessHighlights(sample, allOff)
  const choices = [
    ['showTaskUpdates', (v) => v.tasks.length === 1 && v.tasks[0].kind === 'task'],
    ['showGoals', (v) => v.actions.length === 1 && v.actions[0].kind === 'goal'],
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
  })) ok('八类开关分别控制对话中的独立分组')
  else bad('分类开关显示逻辑', '单类开关或分组内容未生效')
  const allGroups = buildProcessHighlightGroups(visibleProcessHighlights(sample, Object.fromEntries(Object.keys(allOff).map((key) => [key, true]))), (path) => path.slice('/work/'.length))
  if (JSON.stringify(allGroups.map((group) => group.key)) === JSON.stringify(['edit', 'read', 'command', 'search', 'task', 'goal', 'thought', 'other']) && allGroups[0].title === '编辑了 1 个文件' && allGroups[0].items.length === 1 && allGroups[0].items[0].text === 'a.ts' && allGroups[1].title === '读取与查看 1 项' && allGroups[2].title === '命令与代码执行 1 次' && allGroups[5].items[0].text === '创建目标 · 完成界面核查') ok('编辑、读取、目标等按类型合并，编辑文件不重复列出')
  else bad('分类分组合并', JSON.stringify(allGroups))
  const finishedTask = { ...actions[3], id: 'task-finished', text: '2/2 已完成', todos: actions[3].todos.map((todo) => ({ ...todo, status: 'completed' })) }
  const latestTaskGroup = buildProcessHighlightGroups({ files: [], thoughts: [], actions: [], tasks: [actions[3], finishedTask] }, (path) => path)[0]
  if (latestTaskGroup?.title === '任务清单更新 2 次' && latestTaskGroup.preview === '2/2 已完成' && latestTaskGroup.items.length === 1 && latestTaskGroup.items[0].action.todos.every((todo) => todo.status === 'completed')) ok('任务分组展开只显示最新快照，已完成后不残留旧状态')
  else bad('任务分组最新状态', JSON.stringify(latestTaskGroup))
  const failedTask = actionSummariesFromToolNode(toolNode(result('todo_write', JSON.stringify({ todos: [{ content: '不可写入', status: 'pending' }] }), true)))[0]
  const taskAfterFailure = buildProcessHighlightGroups({ files: [], thoughts: [], actions: [], tasks: [actions[3], failedTask] }, (path) => path)[0]
  if (taskAfterFailure?.title === '任务清单更新 1 次 · 1 次失败' && taskAfterFailure.preview === actions[3].text && taskAfterFailure.items.length === 2 && taskAfterFailure.items[0].type === 'task' && taskAfterFailure.items[1].text.startsWith('失败 · ')) ok('失败的任务调用不冒充更新，仍保留上次有效清单')
  else bad('任务失败状态', JSON.stringify(taskAfterFailure))
  const goalOnly = buildProcessHighlightGroups(visibleProcessHighlights({ files: [], thoughts: [], actions: [goalAction] }, { ...allOff, showGoals: true }), (path) => path)
  if (goalOnly.length === 1 && goalOnly[0].key === 'goal' && goalOnly[0].items[0].text === '创建目标 · 完成界面核查') ok('目标操作独立于任务清单')
  else bad('目标与清单语义', JSON.stringify(goalOnly))
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
    useId: () => 'test-instance',
    createElement(type, props, ...children) {
      if (props?.className === 'dsh-stream-think-clock') props.ref.current = rootElement
      return { type, props, children }
    },
    useRef(value) { const i = hookCursor++; if (!(i in hookSlots)) hookSlots[i] = { current: value }; return hookSlots[i] },
    useState(value) { const i = hookCursor++; if (!(i in hookSlots)) hookSlots[i] = value; return [hookSlots[i], (next) => { hookSlots[i] = typeof next === 'function' ? next(hookSlots[i]) : next }] },
    useLayoutEffect(effect) { layoutEffects.push(effect) },
    useMemo: (fn) => fn(),
    useSyncExternalStore: (_subscribe, get) => get(),
  }
  const wrapTurnProcessClockNodeView = vm.runInNewContext(
    clientSource.slice(clockEnd, wrapperEnd) + '\n; wrapTurnProcessClockNodeView',
    { react: fakeReact, getThinkSettings: () => selectedSettings, subscribeThinkSettings() {}, toolDataHighlights, thoughtDataHighlights, EMPTY_PROCESS_SOURCE, processHighlights, visibleProcessHighlights, buildProcessHighlightGroups, shouldShowProcessHighlights, sameTaskSnapshot, clockLabelParts: () => [], canAnimateClockChange: () => false, MutationObserver: HighlightObserver, requestAnimationFrame: (callback) => { pendingFrames.push(callback); return pendingFrames.length }, cancelAnimationFrame() {}, setTimeout: () => 1, clearTimeout() {} },
  )
  const TurnProcess = wrapTurnProcessClockNodeView(() => null)
  const props = { node: { data: { turn: 7 }, location: { turn: { status: 'closed' } } }, turnProcess: { open: false } }
  const renderPinned = (nextProps = props) => {
    hookCursor = 0; layoutEffects = []
    let tree = TurnProcess(nextProps)
    while (typeof tree?.type === 'function') tree = tree.type(tree.props)
    return tree
  }
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
  if (pinnedTask && !turnedOff && opened && taskHeader?.props?.['aria-expanded'] === false && taskHeader?.props?.['aria-controls'] === 'dsh-stream-think-test-instance-task' && taskPreview?.children?.[0]?.includes('新增 2 · 移除 0') && !findClass(pinnedTask, 'dsh-stream-think-highlight-text')) ok('任务分组直接显示在对话里，原过程组展开也保留，明细按需挂载')
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
  hookSlots.length = 0
  const observedBefore = observedScopes.length
  const requestedTurns = []
  let taskSnapshot = [{ root: { ...result('todo_write', JSON.stringify({ todos: [{ content: '核对最后状态', status: 'pending' }] })), callId: 'native-task' } }]
  let stepSnapshot = [{ status: 'running', blocks: [{ kind: 'reasoning', text: '正在检查实际会话切换的滚动位置。' }, { kind: 'tool-call' }] }]
  const nativeStore = { turnDataSource(turn, kind) {
    requestedTurns.push(turn)
    return { subscribe: () => () => {}, getSnapshot: () => kind === 'tool-call' ? taskSnapshot : stepSnapshot }
  } }
  const nativeProps = { ...liveProps, useChat: (select) => select({ nodes: nativeStore }) }
  const nativeFirst = renderPinned(nativeProps)
  layoutEffects[1]()
  if (findKind(nativeFirst, 'task') && !findKind(nativeFirst, 'thought') && observedScopes.length === observedBefore && requestedTurns.every((turn) => turn === 7)) ok('0.2 首次提交已有分类，无需等待工具 DOM；订阅仅限当前轮')
  else bad('原生数据首次渲染', `task=${!!findKind(nativeFirst, 'task')} thought=${!!findKind(nativeFirst, 'thought')} observers=${observedScopes.length-observedBefore}`)
  taskSnapshot = [{ root: { ...result('todo_write', JSON.stringify({ todos: [{ content: '核对最后状态', status: 'completed' }] })), callId: 'native-task' } }]
  stepSnapshot = [{ status: 'settled', blocks: stepSnapshot[0].blocks }]
  findClass(findKind(renderPinned(nativeProps), 'task'), 'dsh-stream-think-highlight-header')?.props?.onClick()
  const nativeUpdated = renderPinned(nativeProps)
  if (findKind(nativeUpdated, 'thought') && findAllClass(findKind(nativeUpdated, 'task'), 'dsh-stream-think-task-item')[0]?.props?.['data-status'] === 'completed') ok('原生数据结算后思考和最新任务状态即时更新')
  else bad('原生数据状态刷新', '仍显示运行中思考或旧任务状态')
  const duplicateData = { root: { ...result('read_file', JSON.stringify({ path: '/work/a.ts' })), callId: 'shared-call' } }
  if (toolDataHighlights([duplicateData, duplicateData]).actions.length === 1 && thoughtDataHighlights([{ status: 'running', blocks: [{ kind: 'reasoning', text: '先核对已经修改的文件。' }, { kind: 'reasoning', text: '现在继续检查其它内容。' }] }]).length === 1) ok('原生分类合并重复调用，运行中只收录已结束思考')
  else bad('原生数据去重与思考状态', '出现重复或半截思考')
}

/* ---------------- 4. 思考状态与宿主折叠真值表 ---------------- */

const handoffStart = clientSource.indexOf('function waitForFollowHandoff(host, isLeader, enabled, finish) {')
const handoffEnd = clientSource.indexOf('function useConversationFollow(', handoffStart)
if (handoffStart < 0 || handoffEnd < 0 || !clientSource.includes('waitForFollowHandoff(host, () => isLeader(host), () => true, finishInactive)')) {
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
    { window: { localStorage: { getItem: (key) => key === 'dsh-think-ux:settings.v1' ? JSON.stringify({ autoExpand: false, showLookups: true, showEditedFiles: false }) : null } } },
  )
  const migrated = readThinkSettings()
  if (migrated.showReads && migrated.showSearches && !migrated.showEditedFiles && migrated.showTaskUpdates && !migrated.autoExpand) ok('旧思考盒偏好迁移到新入口，新任务开关采用默认值')
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

/* Think 摘录选句规则：八类摘要的「思考摘录」类目依赖它（行内翻页组件已移除）。 */
const summaryStart = clientSource.indexOf('function selectThoughtSummary(text) {')
const summaryEnd = clientSource.indexOf('function AnimatedReasoning({', summaryStart)
if (summaryStart < 0 || summaryEnd < 0) {
  bad('Think 摘要选句函数提取', '找不到选句函数')
} else {
  const { selectThoughtSummary } = vm.runInNewContext(clientSource.slice(summaryStart, summaryEnd) + '\n; ({ selectThoughtSummary })', {})
  const meaningful = selectThoughtSummary('先检查输入。\n已定位到分组按钮多出 22px 左边距。\n调用。')
  const short = selectThoughtSummary('调用。')
  const start = selectThoughtSummary('开始。')
  const longLine = selectThoughtSummary('已确认读取结果，并定位到缓存键错误。调用。')
  if (meaningful.text === '已定位到分组按钮多出 22px 左边距。' && !meaningful.followEnd && short.text === '' && start.text === '' && longLine.text === '已确认读取结果，并定位到缓存键错误。') ok('Think 摘要跳过末尾空泛短句，运行中与完成后都不伪装成结论')
  else bad('Think 摘要选句', JSON.stringify({ meaningful, short, start, longLine }))
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
  let session = 'A'
  const sessionElement = { getAttribute: () => session }
  const port = { flow: oldFlow, closest: () => sessionElement, get scrollTop() { return position }, set scrollTop(value) { writes += 1; position = value } }
  const root = { closest: () => sessionElement }
  isolateFollowSession(port, root)
  setFlowPad(port, 24)
  maps.followLeaders.set(port, { owner: 'A' })
  sets.followCompletionSettle.add(port)
  port.flow = newFlow
  session = 'B'
  isolateFollowSession(port, root)
  const resetOnce = clears === 1 && flowFills === 1 && oldFlow.style.paddingBottom === '8px' && newFlow.style.paddingBottom === '12px' && !padRegistry.has(port) && !maps.followLeaders.has(port) && !sets.followCompletionSettle.has(port) && writes === 0
  isolateFollowSession(port, root)
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
  if (resetOnce && duplicateSkipped && blankCleared && clears === 3 && oldMicrotasksIgnored && restoredAfterCommit) ok('切换两个运行会话时清理旧滚动归属和预留，等待宿主恢复新会话阅读位置')
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

/* 语义：推理中的手动展开不设豁免（本段结束仍按设置收起）；只有已完成的思考点开后才交给读者。 */
const toggleAt = clientSource.indexOf('onToggle: () => {')
const toggleSeg = toggleAt < 0 ? '' : clientSource.slice(toggleAt, toggleAt + 400)
if (toggleSeg.includes('if (!running) userToggledRef.current = true;')) ok('推理中手动展开仍会在本段结束时收起，已完成的思考点开后不再被打扰')
else bad('自动收起语义', 'onToggle 缺少「仅已完成的思考才设读者豁免」分支')
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
