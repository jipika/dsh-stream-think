<div align="center">
  <img src="assets/icon.svg" width="72" alt="dsh-stream-think icon">
</div>

# dsh-stream-think

> **流式输出（dsh-smooth-stream）+ 思考盒（dsh-think-ux）二合一**，把 Think 行的
> 展开权从「两个插件各管一半」收回到**一个插件**。思考盒和列表跟随共用一处即时设置。

各 profile 的启用列表只保留 `dsh-stream-think`；原 `@jipika/dsh-think-ux`
与 `dsh-smooth-stream` 已从安装依赖清理，避免重复设置页和渲染接管。
上游构建产物保存在本包的 `vendor/dsh-smooth-stream`，派生脚本默认从这里生成。
若新插件尚无本地设置，会读取旧思考盒的展开、收起和预览行数偏好。

**拥有**：Think 行的**全部展开行为**（何时自动展开、何时自动收起、读者手动切换后谁说了算）
＋ 过程组的八类分组摘要 ＋ `/btw` 旁问卡片。
**不再拥有滚动**：跟随器整条停用，会话滚动完全交回官方（见「2026-10-07 滚动一律交回官方」）。
**不再需要**：`dsh-smooth-stream`、`@jipika/dsh-think-ux`（两者都已从 profile 的
`dsh.profile.bundles` 摘除）。
**回滚**：从 profile 的 `dsh.profile.bundles` 移除 `dsh-stream-think`；如需旧插件，需重新安装。
插件内部的回滚点是 `git checkout -- lib/ tools/`（`lib/*.js` 是派生产物，随时可由 `tools/derive.mjs` 重放）。

---

## 2026-10-04 精简：只保留官方没有的能力

DSH `0.2.0-rc.2` 的官方 Chat 渲染器（`@deepseek-ai/dsh-client-ui-chat`）已经自带下列能力，
本插件里与它们重复的实现已删除；**本文档下半部分对应段落的描述已不代表现状**：

| 已移除 | 官方现在的等价实现 |
| --- | --- |
| 思考体限高预览：`capLines` 4/12/24/48/不限、`[data-think-cap]`、推理期「跟到框底」、设置页那一段 | 过程组 body `max-height:min(400px,50vh)` + `overflow-y:auto` + 1px 阈值平滑贴底 + 上下渐隐遮罩 |
| 「展开 Think 时取消外层过程组限高与遮罩」的两条 CSS | 官方那套限高正是 0.2 的原生设计，不再压制 |
| 收起态 Think 行的摘录翻页组件（`RollingThinkSummary`） | 官方 `latestCompletedParagraphFirstLine` 摘录 + TextShimmer 高光 + 右端 48px 渐隐 |
| 过程计时数字 220ms 上滚、过程组标题 240ms 翻页 | 官方每秒刷新 + 等宽数字、无过渡（`installLiveRunningClock` / `installProcessTitleFlip` 只剩未被调用的定义） |
| ~~外层会话滚动跟随~~ **2026-10-04 晚改回插件执行，但语义收窄为「跟随动画」** | 见下节：跟随始终由本插件执行，`controlScroll` 只切「平滑 / 瞬时」；官方 `toBottom(..., "instant")` 那条链仅作为对照 |

**保留**（官方没有等价物）：八类分组摘要、打字机式正文流、Think 行自动展开 / 结束后自动收起 / 读者优先、
`/btw` 旁问卡片、`aria-label` 诊断探针。`selectThoughtSummary` 选句函数保留 —— 八类摘要里的「思考摘录」类目依赖它。

规模：具名补丁 89 → 76 处，`derive.mjs` 1921 → 1735 行，`lib/client.js` 333 → 327 KB。
验证：`node tools/derive.mjs --check && node tools/derive.mjs && node tools/smoke-test.mjs`（全绿）。

---

## 2026-10-05 残留清理 + 宿主样式收敛

**删掉的死代码 / 无效样式 / 死参数**（运行时零影响，但会误导后续维护）：

- 死函数 `installLiveRunningClock`、`installProcessTitleFlip`（各有定义、无调用）；
- `THINK_CAP_CSS` 常量块、`.dsh-stream-think-summary*` 的 5 行 CSS；
- `capOptions`、`THINK_CAP_VAR`、`capLines` 的投影与解析块、`thinkCapLines` 的 5 处引用（含 `aria-label` 探针里的 `cap=` 字段）。

**删掉 3 条改官方行间距的 `!important`**（最容易被察觉为「和没装插件不一样」的地方）：它们此前会全局改写官方过程行的行间距——

```
[data-step-process-content] > [data-chat-flow-kind]{--dsh-chat-flow-gap:8px!important}
[data-step-process]:has([data-variant=think]) + [data-chat-group-part=response]{--dsh-chat-flow-gap:8px!important}
…同上 + :is([data-step-process],[data-chat-flow-kind=tool-call],…) 的长版本
```

删掉后行间距回到 DSH 默认。**保留的 3 条 `!important`** 都只在插件自己的标记属性/类存在时命中（空 clock 容器收高、把原生计时文字透明化、摘要块与下一过程的 4px 间距）。

规模：`lib/client.js` 321980 → 311880 B；`smoke-test.mjs` 同步删掉「0.2 运行计时 DOM 回归」整块（134 行）与 capLines 迁移断言，复跑全绿。

---

## 2026-10-07 滚动一律交回官方（当前形态）

**跟随器整条停用。** 插件不再对会话滚动做任何事：不写 `scrollTop`、不改
`overflowAnchor` / `scrollBehavior`、不造底部预留（runway / settle 的
`marginTop` / `paddingBottom`、flow-fill 的 `minHeight`）、不给消息行做
`transform` 位移补偿、不做会话隔离与交接。滚动、以及滚动过程中的一切观感，
完全由官方 `[data-conversation-scroll]` 的自带逻辑决定。

随之停用的还有两处「只为滚动服务」的东西：

| 停用 | 原因 |
| --- | --- |
| 打字机式正文流（`useSmoothStreamContent` 的逐字揭示）+ 工具行逐字（`useProgressiveDomText`） | 逐字会让内容每帧增长，把官方跟随逼成离散步进；关掉后正文按 token 到达整段出现，观感最接近原生 |
| 对数渐隐（`useLogarithmicFade`）、消息行入场 glide（entrance）、跟随脉冲 | 都是逐字/跟随的副产物，没有逐字就没有它们 |

**仍然保留**（这些都不碰滚动）：Think 行的自动展开 / 结束后自动收起 / 读者优先、
过程组八类分组摘要（任务 / 目标 / 文件编辑 / 思考摘录 / 命令 / 读取 / 搜索 / 其他工具）、
`/btw` 旁问卡片、`aria-label` 诊断探针。

### 2026-10-07 追加：图片占位（治本「先上去再下来」）

用户的原始症状是「切过去在底部偏上、**先上去再下来**」。实测（8ms + rAF 双采样）取证到：

```
t=1290ms  top=1761  sh=2501  行0高=118   ← 内容暂定（图片还没就位）
t=1408ms  top=1745  sh=2789  行0高=406   ← 内容涨高，位置被留在 1745（"先上去"）
t=1410ms  top=2049  sh=2789              ← 官方 ResizeObserver 修正（"再下来"）
```

`1745` **不是任何 JS 写入的**（setter 劫持证明全部写入只有 1785 与 2049，都精确到底）——
它是内容高度变化时浏览器的位置保持。而官方靠 `ResizeObserver` 观察内容列，
**必须等布局提交后才收到通知**，这一帧窗口必然被渲染出来。

**治法**：让图片容器的**高度从第一帧就正确**，内容高度不再是「先矮后高」。

关键教训（踩了才明白）：**占位要写在容器 `button.codexImageThumb` 上，不能写在 `img` 上**。
因为 `MessageImagePreview` 首帧只渲染「…」文本，`<img>` 要等异步 `loadImage` 完成才插入；
而 button 在单图模式下是 `height:auto`。实测对比：

| 占位位置 | 图片插入前 | 插入后 | 结果 |
| --- | --- | --- | --- |
| 写在 `img` 上 | 34px | 322px | ❌ +288px 撑高 |
| **写在 `button` 上** | **323px** | **323px** | ✅ 零增长 |

高度 = 容器实测宽 × 图片比例（单图容器 240px），超过官方 `max-height:320px` 时截断。
尺寸来自 React fiber 的 `image.attachment.width/height`（渲染时就带着，同步可读）。

**实测效果**：8/8 冷启动**零偏上帧**（改前 8/8 各有 1 帧偏上 304px）。
轨迹从 `1761/2501 → 1745/2789 → 2049/2789` 变成 `2050/2790` 一步到位。

**同时撤销：原生计时行接管**（用户同日要求）。过程行的计时文字、过程标题过渡
整体交回官方，插件不再读按钮标签、不再渲染 `clock-overlay`、不再做数字逐位动画；
相关的 6 条 CSS、2 个 keyframes、`clockLabelParts` / `canAnimateClockChange` /
`presentProcessTitle` 三个函数一并删除。**摘要不受影响** —— 它本来就是独立的一套
（`highlights` 状态 + `processHighlights` 读取 + `.dsh-stream-think-highlights` 渲染）。
容器 div 与类名 `dsh-stream-think-clock` 保留：摘要只用
`.dsh-stream-think-clock:has(.dsh-stream-think-highlights)` 做样式钩子，改名要连带改
6 条选择器而收益为零。

实现方式：`tools/derive.mjs` 的「滚动一律交回官方」段与「原生计时行接管：撤销」段
（段内注释写明了每条锚点的出处），滚动侧 11 处、计时侧 12 处具名补丁。

验证：`node tools/assert-scroll-disabled.mjs`。它用不动点闭包证明**产物里没有任何
运行时可达的宿主滚动/几何写入**（当前：14 个写点函数全部落进 50 个成员的停用区，
或由状态守卫证明必然 no-op），逐条核对停用痕迹，并断言计时行接管痕迹已消失、
八类摘要渲染符号完好。改动任何一条相关补丁后，这个脚本都必须重跑。

`controlScroll` 设置项及其「跟随动画」开关已无对象（跟随不再由本插件执行）：
字段与开关保留，但不再有任何运行时效果。

---

## 2026-10-04（晚）`controlScroll` 收窄为纯「跟随动画」开关

> 已被上面 2026-10-07 的改动取代：跟随器整体停用，本节的开关语义不再生效，
> 仅留作派生脚本的补丁出处说明。

跟随**始终**由本插件执行（effect 开头的 `if (!controlScroll) return;` 已删除），开关只决定动画形式：

| 开关 | 行为 |
| --- | --- |
| 开（默认） | 平滑：帧循环按速度逐帧追到底（`computeFollowStep` + 底部预留 runway） |
| 关 | 瞬时：每帧直接 `animatedH = contentHeight - runwayOffset` 落到底，并把 `reservePx` 归零（不造预留、不做速度积分） |

相关补丁：`client/animation-only-switch`（不再交回宿主）、`client/instant-follow-mode`（帧循环两条分支）、
`client/instant-no-runway`（瞬时模式不预留）。`waitForFollowHandoff` 的 `enabled` 也从
`() => controlScrollRef.current` 改为 `() => true` —— 跟随常驻，交接等待不再因为「关了动画」而提前放弃。

---

## 一、它修的是什么

### 症状

模型还在推理时（尤其界面显示「正在分析请求…」「深度求索中」的那一段），
**思考行不会自动展开**；思考盒插件里的「自动展开」开关看起来完全无效。
手动点开又能用。

### 根因（一处判定同时废掉两个插件）

上游 `dsh-smooth-stream@0.6.1` 的 `TypewriterAssistantNodeView` 把 reasoning 块的
「思考中」判定写成了：

```js
running: streaming && index === last,      // last = data.blocks.length - 1
```

`tool-call` 块**不渲染但占 index**。于是「正在分析 → 准备调工具」时的 block 序列

```
[ reasoning, tool-call ]
```

里 reasoning 的 `index(0) !== last(1)`，被判成**已结算**：

1. 它自己不会自动展开（`running=false` → `expanded=false`）；
2. `data-state` 也被写成 `"ok"` —— 而 `dsh-think-ux` 正是靠
   `[data-variant="think"][data-state="running"]` 判断要不要自动展开，
   于是**第二个插件的自动展开也跟着失效**；
3. 等它真的结算时，两个插件的收起逻辑又会互相抢方向盘。

一处判定错，两个插件一起哑 —— 这就是「思考盒的默认展开无效」的完整解释。

### 根因二：接管被 `pending` 静默挡住（插件「装了但像没装」）

修好判定之后仍未展开。实机诊断（把状态投影到 `aria-label`，再从可访问性树读）暴露出第二个根因：

```js
// 上游 dsh-smooth-stream
takeoverEnabled() { return !this.pending && this.value.enabled; }
```

`pending` 在设置 RPC 解析期间为真。只要 RPC 慢、失败，或 Host 半边没挂上（设置服务未就绪），
`assistant-step` 就**永远不会被接管** —— 界面静默退回 DSH 的官方 `ReasoningRow`，
而官方**本来就不自动展开**（它只在 `running || policy.settledReasoningPreview` 时显示摘要预览）。
迷惑点在于：`window.__DSH_BOOT__.entries` 里有这个模块、设置页也能正常打开，只有行为像没装。

修法：接管只看 `enabled`（默认 true），设置未就绪时用默认值先接管。

```js
// dsh-stream-think
takeoverEnabled() { return this.value.enabled; }
```

### 自诊断：`aria-label` 探针

每个 Think 行的根节点带一条状态（零视觉影响，但可访问性树可读，无需 DevTools）：

```
aria-label = "think live=1 auto=1 open=1 cap=24"
             │     │       │      │      └ 预览行数设置
             │     │       │      └ 该行此刻是否展开
             │     │       └ 自动展开是否生效
             │     └ 是否被判为「仍在思考」（根因一的修复点）
             └ 渲染归属确认：本插件渲染才有此属性；官方渲染器用 MuR-fW_* 类
```

实测判据（desktop 19387，**正在推理时**采样）：`live=1 auto=1 open=1` 且
`[data-disclosure-content]` 无 `data-collapsed` = 自动展开生效；结算后转 `live=0 open=0` = 自动收起生效。
注意工具执行期间 assistant step 已结算，此时查一定是 `live=0` —— 要抓 `live=1` 必须并行采样。

### 修法

```js
// dsh-stream-think: 正文还没开始、且后面没有更新的 reasoning 块 → 仍在思考
running: streaming && isReasoningLive(data.blocks, index),
```

真值表（`tools/smoke-test.mjs` 里逐条断言）：

| block 序列 | 判定 | 为什么 |
| --- | --- | --- |
| `[reasoning]` | 思考中 | 就是最后一块 |
| `[reasoning, tool-call]` | **思考中** | ← 上游 bug 点：正在分析、准备调工具 |
| `[reasoning, tool-call, tool-call]` | 思考中 | 工具还没吐正文 |
| `[reasoning, text]` | 已结算 | 正文开始了，思考该收 |
| `[reasoning, reasoning]`（前） | 已结算 | 有更新的思考块 |
| `[reasoning, reasoning]`（后） | 思考中 | 它是新的那个 |
| `[text, reasoning]` | 思考中 | 正文之后又进入思考 |

### 展开控制与宿主折叠

`AnimatedReasoning` 的展开不再由「流状态」单方面改写，而是：

- **自动展开**（`autoExpand`，默认开）：进入思考时展开；
- **结束后自动收起**（`autoCollapse`，默认开）：从思考 → 结算那一次转换才收起，
  且只在**确实展开着**时收；先播放内层高度过渡，再恢复宿主折叠；关闭时保留本轮刚生成的思考；
  **推理中手动展开的同样算在内** —— 这一段结束时照样收起；
- **读者优先只在「这段推理结束之后」生效**：`userToggledRef` 只在 `!running` 的手动操作里置位，
  所以已完成的思考一旦被点开，自动逻辑就再也不动它（不会再被流抢回去）；
- **上游设置卡的开关不再参与**：`thinkAutoExpand` 只认本插件这一份设置。上游那个开关在排障时
  会变成干扰源 —— 任何一处关过，都会让另一边看起来「明明开着却不生效」（本次故障的第二个根因就藏在
  这条链路上）。

宿主原本会在过程组收起时隐藏作答步骤里的 inline reasoning。这是 DSH 的折叠规则，
不是本插件新增的折叠。本插件以前照搬这个 `hidden` 判定，导致内层 Think 虽然已展开，
外层仍把它藏住。现在对**当前正在生成的 reasoning**放行；一段思考结束后，
本轮仍在执行时保留一行摘录，避免旧行先消失、下一行后出现造成会话上下跳动。
整轮结束后等待内层收起动画结束，再交还宿主折叠。关闭「自动收起」时，Think 的内层保持展开；
宿主过程组本身仍可折叠，对话中保留分类摘要。插件不再调用 `turnProcess.setOpen()` 抢过程组状态，
避免列表反复伸缩。

收起状态的 Think 摘录最多占一行。插件从最近的内容中选取有具体信息的句子，
跳过「调用。」「开始。」等空泛短句；整段都没有可用摘录时只显示 Think，
点开仍能看到原文。切换到新句时，旧文字向下离开、新文字从上方进入，
轨道裁切让两句不重叠；同一句持续添字直接更新，避免高速 token 流中反复重启动画。
横向跟随每帧最多更新一次，不在 React 提交时强制读取布局。完成后沿用同一选句规则。

DSH 0.2 截图中的「正在分析请求 · …」是**原生过程组标题**。插件保留它的按钮、
图标和读屏文字；停顿后的标题变化才播放 240 毫秒翻页，连续变化合并到最新文字，
不打断正在播放的翻页。轨道裁切避免新旧文字视觉重复；卸载时恢复原生标题。
开启「减少动态效果」时直接切换文字。旧流式行结束时，滚动跟随保留原来的布局预留，
直到下一行实际接管同一个会话滚动容器，或本轮结束后再释放；不再按固定 260 毫秒清空并跳底。
DSH 0.2 的运行状态行使用 `[data-chat-running]`。跟随器现在识别这条真实状态行，
把滚动预留放在它前面；新增消息替换旧行时，预留不会被误当成旧消息一起移除。
短对话中，输入框高度变化会重新计算消息区的填充高度；内容尚未溢出时保持原位向下展开，
只有真实超出可视区域后才跟随滚动。
DSH 0.2 在切换对话时会复用外层滚动容器，因此本插件按会话隔离跟随状态：
切换时清理旧会话的动画位移、底部预留和完成回调，不向新会话写入旧的滚动位置。
新会话的阅读位置仍由 DSH 的会话滚动记忆恢复。
跟随还绑定具体会话容器与其本次挂载：即使快速 A→B→A、同 id 容器更换，
或者旧行先卸载、新会话后提交，旧动画帧、等待接管与结束回调都会失效。
旧行清理不会替新会话建立状态；历史行入场在首次布局阶段同步取消，
按原生节点身份识别，重新分组换 DOM 时也不会重播已有文字。
重新进入仍在运行的对话时，首批已有行直接显示，不重播入场或逐字显示，
也不凭运行状态重新制造滚动预留。只有实际内容增长后才启动跟随动画；
原本在底部就保持贴底，原本在历史内容处就保留阅读位置，无需额外开关。
内容收起或输入框变矮导致浏览器自动夹紧滚动位置时，按新的实际底部判断，
不误判成用户向上翻阅。发送自己的消息后沿用宿主的自动贴底行为，随后继续跟随输出。
「深度求索中」上方的分隔线保留原生显示条件、颜色与上下间距。

`/btw` 旁问始终作为独立的会话内容显示，不进入步骤或本轮过程的折叠区域。
问题、等待状态、多行答复和错误都直接呈现；其他原生命令仍使用宿主的显示方式。
DSH 0.2 的分类记录直接订阅当前轮的原生节点数据，首次显示即可生成分组，
避免在宿主恢复阅读位置后等待工具 DOM 挂载、再补出分组造成第二次高度变化。
已完成记录按数据对象缓存解析；旧宿主缺少数据源时使用 DOM 提取作为兼容路径。

高速流式输入时，正文仍按浏览器帧合批更新。默认显示上限从 600 提高到
1800 字符/秒，以容纳约 300 token/秒的英文或代码输出；调试面板允许在
120–2400 字符/秒间调整。这里的单位是字符而非 token，实际跟随速度也受
低帧率保护和滚动回压控制。

### 在对话中按类别显示关键进展

整轮完成后的 `turn-process` 和内层 `step-process` 折叠是 DSH 原生行为，不是
「推理结束后自动收起」开关造成的。插件保留原生折叠，同时在对话正文中
提供八类可独立开关的分组：**任务清单**、**目标操作**、**成功修改的文件**、**每段已完成思考的摘录**、
**命令与代码执行**、**读取与查看**、**搜索**、**其他工具**。前五类默认开启，后三类默认关闭；
八类可以全部关闭。每类在对话里占一行，显示数量和最新内容预览，点击后只展开该类的记录；
例如编辑、读取和命令分别合并。任务清单只统计有效 `todo_write` 更新，失败与无效调用另行标明；展开时显示最近一次有效清单的完整任务、顺序和状态。目标的创建、更新与查看单独归类。
文件名可直接打开；思考摘录使用上述选句规则，短思考用段号标识，点击后只在当前分组内展开完整内容，不会展开整轮原生过程。摘录来自原文选句，不声称是模型生成的概括。
已选择的任务、文件、思考和执行记录不受固定条数限制。长列表在分组内滚动。
执行中，已完成的记录也实时显示在对话中；尚未结束的工具调用和半截思考不会提前显示。
这些分组独立于原生过程组的展开状态。

### 展开预览（2026-10-04 已移除）

限高预览（默认 24 行、框内滚动、`[data-think-cap]`、设置项「展开时的预览行数」，
以及为它压制外层过程组限高的两条 CSS）已全部删除 —— 现在由官方的过程组滚动盒接管：
`max-height:min(400px,50vh)` + `overflow-y:auto` + 1px 阈值平滑贴底 + 上下渐隐遮罩。

### 过程计时（2026-10-07 接管已整体撤销）

DSH 0.2.0-rc.1 将运行中的「深度求索中，用时…」移到会话末尾的 `[data-chat-running]` 状态行；
`turn-process` 只显示已结束轮次的用时。两处现在**完全按官方原样渲染**，插件不再介入
（220ms 数字上滚、240ms 标题翻页先于 2026-10-04 停止调用，2026-10-07 连同读标签的
observer、`clock-overlay` 层、相关 CSS 与三个辅助函数一起删除）。

---

## 二、装了什么

| 半边 | 文件 | 职责 |
| --- | --- | --- |
| Host | `lib/index.js` | boot config 桥（把 profile 里的 `mode/preset/...` 注入页面）+ 设置 RPC（`/stream-think`）+ 设置卡（设置 → 插件配置 → 流式输出） |
| Client | `lib/client.js` | `assistant-step` 渲染接管（Think 行展开/收起；正文按 token 整段出）、过程组八类摘要、`settings.plugins.tab` 的**思考盒**设置页 |

Client 半边派生自内置的 `vendor/dsh-smooth-stream`（上游 `dsh-smooth-stream@0.6.1` 构建产物，MIT，见 `LICENSE.upstream`），
Host 半边同理。**所有差异都由 `tools/derive.mjs` 具名补丁生成**，不是手改 bundle。

### 设置入口（两个，各管一段）

1. **设置 → 插件 → 思考盒**（本插件新增，存 localStorage，改完立刻生效）
   - 生成时自动展开 Think —— 仅作用于当前单条 Think（推理中手动展开的，也会在这一段结束时收起）
   - **跟随动画** —— 平滑（逐帧追到底，默认）或瞬时（内容一变就落底）；跟随本身始终由本插件执行，过程组和 Think 框可独立滚动
   - 单段推理结束后收起 Think —— 不控制 DSH 原生的过程组折叠；**推理中手动展开的同样会被收起**，已完成的思考点开后不再自动收
   - 直接显示在对话中：任务清单、目标操作、文件编辑、思考摘录、命令、读取、搜索、其他工具；八类独立开关和展开
2. **设置 → 插件配置 → 流式输出**（沿用上游设置卡，存 Host 设置）
   - 启用 / 对数渐隐 / 动效偏好；上游的重复滚动与自动展开开关已从卡片移除

---

## 三、开发与维护

```sh
# 1. 校验补丁能否命中当前上游 bundle（不写盘）
node tools/derive.mjs --check

# 2. 重新派生 lib/client.js 与 lib/index.js
node tools/derive.mjs
node tools/derive.mjs --source /path/to/node_modules/dsh-smooth-stream   # 指定源

# 2.5 不变式：无可达滚动写入（除 image-settle）+ 图片占位只写尺寸 + 计时行撤销 + 摘要完好
node tools/assert-scroll-disabled.mjs

# 3. 冒烟测试：真实加载两个半边 + isReasoningLive 真值表
node tools/smoke-test.mjs

# 4. 浏览器布局回归：对照 DSH 0.2 原生文字，检查字号、窄宽和动画中的行高
python3 tools/alignment-browser.py  # 需要 Playwright 与 Pillow
python3 tools/think-layout-browser.py  # 同时加载两层生成样式，验证收起零高度与展开底部
python3 tools/short-conversation-browser.py
python3 tools/follow-status-browser.py
python3 tools/session-resume-browser.py  # 运行中切换、布局收缩、状态行完整露出与发送后跟随
python3 tools/session-lifecycle-browser.py  # 卸载/切换顺序、快速往返、容器更换和离页
python3 tools/session-entry-browser.py  # 历史首帧/重新分组不重播，新记录仍有入场
# 实际 React 18 + Chromium：300 条历史挂载、字体缩放与内部跟随
DSH_TEST_NODE_MODULES=/path/to/existing/node_modules python3 tools/history-layout-performance-browser.py

# 5. 配置层静态验证（不需要启动应用）
dsh --profile web --dump-config | grep -A6 'id: stream-think'
```

`derive.mjs` 的每一处补丁都带**期望命中次数**：上游改版导致锚点失配时整份失败并逐条
列出诊断，绝不静默产出半成品。`smoke-test.mjs` 在 Node 里模拟 ModuleLoader + mock
document/localStorage 真跑一遍 `factory` 与 `apply`，拦住「重启后才发现」那一类事故。

### 依赖说明

Host 半边需要 `@deepseek-ai/schemastery`（宿主提供）。link 安装时本包目录不在 profile
的 node_modules 解析链上，因此：

- 本包自带 `node_modules/@deepseek-ai/schemastery` → 指向 profile 里那一份；
- 且 `lib/index.js` 把它改成**可选动态导入 + 链式 Proxy 兜底** —— 链接断裂时只降级
  「Config 校验」，不会让 Host 半边加载失败拖累整棵插件树。

---

## 四、冲突与边界

- **与 `dsh-theme-manager`**：消息行保留 DSH 的原生隐藏行为。主题统一层不对
  `_flowItem` 设置 `content-visibility:auto` 或估算占位高度；这些规则会覆盖
  `hidden="until-found"`，使旧步骤漏出并在会话切换时改变布局。
- **与 `dsh-plugin-polish`**：本插件自 2026-10-07 起不再触碰会话滚动（跟随器整条停用），
  滚动与位置恢复都归官方与 polish；`--dsh-scrollbar-width` 仍以 polish 为准。
- **与 `dsh-think-ux`**：**互斥，不要同时启用**。老插件用合成点击 toggle
  `[data-disclosure-row]`，本插件用 React state 控制同一行 —— 同时开会在结算时互相
  抵消（一个收起、另一个又点开）。已从 bundles 摘除。
- **与 `dsh-smooth-stream`**：同理互斥（同 id 的渲染接管 + 同一设置卡）。
  已从 bundles 摘除。
- 官方过程组的内部滚动盒（`max-height` + `overflow-y:auto`）与本插件无关，一直由官方提供；
  跟随器停用后，框内滚动、会话滚动都属于原生路径。

---

## 五、许可

派生自 [dsh-smooth-stream](https://github.com/Laplace-bit/dsh-smooth-stream)（MIT）
与 [dsh-think-ux](https://github.com/el16z3c/dsh-think-ux)（MIT）的思路；本包同为 MIT。
上游版权归各自作者，本包不是它们的发布渠道。
