# 暖橙柜台与仪器交互 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 完成用户截图中的八项修改，真实操作、画面和存档保持一致。

**Architecture:** 各任务在现有 Godot 控件与原物动作上修复。秤使用绑定机身的真实控件，人物/对白与桌面通缉令采用小型独立组件；公共柜台文件按函数边界协作。

**Tech Stack:** Godot 4.6.3、GDScript、现有漫画资源、Python/Playwright。

**Spec:** `docs/superpowers/specs/2026-11-17-orange-counter-tools-design.md`

## Global Constraints

- 价格、AP、证据、电费、来源和所有权判定不变；名单继续保存在 documents。
- 沿用当前漫画原画与减少动态效果，不修改通用 FloatingDocument 的手机语义。
- 日期采用北京时间；实际截图与真实点击/拖放作为最终证据。

## Review Focus

- 台面拖放经过子格子与库存空白时结果一致；模型拒绝必须归位且说明原因。
- 交易中的来客原物不能被当成自有库存；自有物取消展示不重复结算。
- 密集手表、长对白与名单同屏时没有交互区域相交或隐藏遮挡。
- 静止 NPC 不上下漂移；入场、离店、换屏和关闭时无残影。
- 原画覆盖层之上能看到 hover/focus；禁用按钮不产生有效操作反馈。

### Task 1: 真实秤体控件

**Files:** `inspect_page.gd`、`watch_tools_polish_test.gd`、必要的仪器布局回归。
**Interfaces:** 保留 `_scale_tare()`、`_scale_place()`、稳定状态与记录路径；真实 `tare_button`、`place_button` 和读数矩形位于机身内。
- [x] 复现机身点击无效及三个方向的分离几何。
- [x] 绑定真实控件、删除重复栏；检验未归零、重新称量、稳定等待与费用。
- [x] 运行针对性原生回归和一次浏览器多尺寸真实操作。

### Task 2: 对白与人物稳定

**Files:** 独立柜台对白/人物布局 helper；`strict_counter_view.gd` 的 `_sync_speech`、人物/离店函数及针对性测试。
**Interfaces:** `_sync_speech(text: String)`、`_update_visitor_pose()` 和布局 hook 由此任务提供，root 接入 `_build/_refresh/_process/_layout_desktop`。
- [x] 以四行/长对白及最大 nod/lean 复现裁切和整幅位移。
- [x] 测量完整对白、统一人像可见边界/比例和固定基线，保留入离场。
- [x] 验证长短文本切换、打字中途、全部来客类型和减少动态效果。

### Task 3: 暖橙与全界面反馈

**Files:** `ui_kit.gd`、`comic_paper.gd`；StrictCounter 样式/按钮 helper；`quick_trade_list.gd` 的皮肤。
**Interfaces:** 幂等 `_bind_button_feedback(button: Button)` 提供给 root 的库存卡、桌面表；新增覆盖层鼠标忽略且不改变按钮几何。
- [x] 确认纸纹背景、空样式和原画覆盖导致的不可见状态。
- [x] 实现暖橙状态、实际纸纹调制、覆盖层与禁用/焦点清理；root 接入公共 build 里的原画控件。
- [x] 检验对比度与实际 hover/pressed/focus 像素变化。

### Task 4: 桌面通缉令

**Files:** `wanted_notice.gd`、新 `wanted_desk_paper.gd`；名单相关的旧柜台/手机入口、仓库文案与 shell 层级；名单 UI 测试。
**Interfaces:** `WantedDeskPaper extends Button`，`setup(owner_shell)`、`refresh()`；root 在 StrictCounter 预留桌面区域接入，库存容器不插名单。此任务处理手机和旧柜台入口。
- [x] 复现手表计数多一、名单线索裁切和竖屏字号问题。
- [x] 做桌面纸张、完整通缉令与单独手机重排；保持旧存档、关闭/拖动、领取/收回，修正展开纸张层级。
- [x] 验证满仓、六人完整字段、点击/关闭/重载、移动端滚动及窗口输入归属。

### Task 5: 陈列与桌面回仓

**Files:** `strict_counter_view.gd` 的库存/陈列/drop 函数、`counter_dialogue.gd` 的原子回仓动作及 `counter_storage_return_test.gd`。
**Interfaces:** `CounterDialogue.storage_problem(state, uid)` 共用保管校验；`COUNTER_STORE` 同时核对 `tradeId/version/uid` 后撤回并回仓，失败保持原状态。
- [x] 复现第六槽被放到第三层及桌面返回经过子控件的差异。
- [x] 每层三列并保留可用空目标；实现仓库整区接收与正确的原物撤回/下架路径。
- [x] 验证同 UID、实际存储地址、满仓拒绝、来客/受限原物、现金和 AP、重载恢复。

### Task 6: 集成与验收

- [x] root 按函数边界接入人物、纸张、hover helper，注册新回归组并运行完整原生检查。
- [x] 统一构建，按顺序做桌面与两种手机方向的真实 UI 验收，修正实图发现的问题后定向复验，避免同时争用渲染器。
- [x] 独立整体检查一次，修复确认问题；把截图与结果补入修改文档。
