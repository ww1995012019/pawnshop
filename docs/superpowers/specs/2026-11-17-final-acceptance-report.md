# 收尾验收记录 · 2026-11-17

结论：本轮检查的桌面、手机触摸、首日经营、旧档与继续经营路径均通过；未发现阻断这些路径的剩余问题。修正两处已复现的说明错误，未新增玩法或调整数值。本次为此前两批修改的收尾验收。

验证版本：本地 Web 导出 `0c7911dff9419f89`，Godot 4.6.3。代码和测试已留在工作区，未提交、推送或部署线上。

## 本轮修正

1. **工作灯说明与实际效果一致。** 原规则是安装后每件原物首次记录均免 AP，旧说明却写“每天第一次”，鉴定台还一直显示首次消耗 1 AP。统一了升级卡、升级通知、帮助与鉴定台说明；鉴定台根据是否安装工作灯显示费用。保留次日起增加 1 Cr/日电费，未改变实际收费规则。真实升级及两件不同原物的 UI 探针通过 4 项检查。
2. **浏览器功能缺失提示准确。** 缺少 WebGL2 时提示更新浏览器、检查图形加速或更换兼容浏览器，按钮为“重新检测”；真正下载失败仍提示检查网络。缺失功能回归先复现失败，再在修复后的导出中通过。

对应代码：[鉴定台](/workspace/pawnshop/godot/scripts/pages/inspect_page.gd:414)、[升级卡](/workspace/pawnshop/godot/scripts/pages/report_page.gd:249)、[升级通知](/workspace/pawnshop/godot/scripts/model/model.gd:778)、[帮助](/workspace/pawnshop/godot/scripts/app/shell.gd:1731)、[加载页](/workspace/pawnshop/godot/web/shell.html)。

## 新游戏实际 UI 路径

使用当前 Web 导出、新浏览器存档和正常初始资源，实际点击可见按钮；报告页通过原有页面入口打开。每一步保存当前画面和状态，交割及跨日另核对存档。

| 步骤 | 健康状态与核对结果 | 当前截图 |
| --- | --- | --- |
| 1. 新游戏入口 | 通过；初始现金 1200 Cr、12 AP | [新游戏](/workspace/pawnshop/work/final-acceptance/screenshots/01-new-game.png) |
| 2. 接待首位顾客 | 通过；柜台货物可选择，原物标识确定 | [首位顾客](/workspace/pawnshop/work/final-acceptance/screenshots/02-first-visitor.png) |
| 3. 放大镜记录物证 | 通过；现金不变，AP 12→11，显示 1/3 项和估价区间 | [物证记录](/workspace/pawnshop/work/final-acceptance/screenshots/03-recorded-evidence.png) |
| 4. 确认购买 | 通过；确认后仍为 1200 Cr、11 AP，未提前扣款 | [确认购买](/workspace/pawnshop/work/final-acceptance/screenshots/04-confirmed-purchase.png) |
| 5. 实际交割 | 通过；支付 46 Cr，现金 1154 Cr、10 AP；同一原物入库，购入流水只有一条 | [实际交割](/workspace/pawnshop/work/final-acceptance/screenshots/05-paid-original-retained.png) |
| 6. 送客与首日日结 | 通过；电费 8 Cr、清洁费 8 Cr，共付 16 Cr，余额 1138 Cr | [日结账本](/workspace/pawnshop/work/final-acceptance/screenshots/06-day-one-report.png) |
| 7. 刷新后继续营业 | 通过；日结报告和 1138 Cr 保留，无重复扣费 | [读档报告](/workspace/pawnshop/work/final-acceptance/screenshots/07-reloaded-report.png) |
| 8. 进入第 2 天 | 通过；AP 恢复 12，余额仍为 1138 Cr，原物和唯一购入流水保留 | [次日营业](/workspace/pawnshop/work/final-acceptance/screenshots/08-next-day.png) |

此路径未产生页面异常或浏览器控制台错误。状态证据：[journey.json](/workspace/pawnshop/work/final-acceptance/journey.json)。

![当前日结账本与居中的图标关闭按钮](/workspace/pawnshop/work/final-acceptance/screenshots/06-day-one-report.png)

## 原手机界面问题复验

| 检查范围 | 状态与结果 |
| --- | --- |
| 顶部手册、经营、声音、设置 | 通过；点击中心和边缘均响应对应按钮，间隙点击不触发动作；目标至少 44 CSS px，互不重叠 |
| 设置及鉴定、维修、仓库、订单、账本关闭 | 通过；关闭按钮仅显示居中 X；弹窗接管点击，未触发背后的声音按钮 |
| 夜间记录二级弹窗 | 通过；X 关闭记录后仍保留外层账本 |
| 长下拉列表 | 通过；可打开并选到最后一项，选项可读 |
| 手机竖屏进入 | 通过；390×844 触摸视口显示旋转后的横屏布局；不是另一套竖屏游戏页面 |
| 手机旋转 | 通过；切到 844×390 再转回，选中的原物保留，工作区仍可关闭和操作 |

桌面复验为 1280×720 触摸浏览器环境；手机为 DPR 2 的触摸、视口及旋转模拟。截图：[顶部及鉴定台](/workspace/pawnshop/work/landscape-ui/desktop-inspect.png)、[长列表末项](/workspace/pawnshop/work/landscape-ui/upright-dropdown-last.png)、[竖屏时旋转布局](/workspace/pawnshop/work/landscape-ui/upright-inspect.png)、[夜间记录关闭按钮](/workspace/pawnshop/work/landscape-ui/desktop-night-records.png)。其中长列表和夜间记录使用专用状态夹具，覆盖深列表与第 22 天嵌套弹窗；不代表从新游戏手玩到该天数。

![夜间记录使用独立居中 X，保留外层账本](/workspace/pawnshop/work/landscape-ui/desktop-night-records.png)

## 玩法数值与旧档

正常初始 1200 Cr、每日 12 AP 和初始材料下，服务经营探针实际派发检查、报价、维修、交付与日结，不额外发放资金、AP 或材料，仅在流动商人实际出现时补货。

| 已捕获经营路径 | 成功日结 / 交付 | 最后现金 | 最低剩余 AP | 房租 |
| --- | --- | --- | --- | --- |
| 善意报价，种子 A | 7 天 / 14 件 | 1794 Cr | 3.5 | 450 Cr 一次 |
| 高价报价，种子 B | 7 天 / 14 件 | 2163 Cr | 3 | 450 Cr 一次 |
| 标准报价，ORBITAL-P0 | 20 天 / 40 件 | 3547 Cr | 3 | 未捕获最终租金汇总 |

以上路径未发现现金、AP 或材料软锁，重复交付与 JSON 读档后重试未重复付款或奖励。三条路径种子不同，不能据此比较报价策略的收益。标准路径在第 20 天日结后达到进程时间上限，未输出最终租金账本汇总，不计为完整 21 天通关；房租幂等性、第 21 天与继续经营由专项检查覆盖。完整证据：[数值记录](/workspace/pawnshop/work/final-acceptance/balance.md)。

旧档专项共 209 项断言、6 个进程通过，覆盖旧版已批准/待交付/过期合同、约定费用、原物 UID、独立工具记录、旧奖励兼容、重复交付、保存后的第 21 天评价，以及第 22 天一次性继续经营。组合探针经过实际派发、JSON 读档和重复操作，保留旧原物与首轮评价。完整证据：[旧档记录](/workspace/pawnshop/work/final-acceptance/legacy.md)。旧档来源为符合旧结构的隔离夹具，未收到外部玩家存档。

## 验证与边界

- 当前 Web 导出成功；加载页桌面、横屏、竖屏、进度、减少动态效果、网络失败及缺失 WebGL2 回归通过。
- 新游戏八步 UI 路径、桌面边界与手机旋转触摸两组检查通过。
- 打包 7 项、字体 1 项、加载布局 4 项通过。
- 数值专项 10 组通过，另有旧档专项 5 组及组合探针；两者重叠的组不重复计数。本轮未重新执行整套原生测试。
- [浏览器及导出日志](/workspace/pawnshop/work/final-acceptance/browser-logs)、[原生旧档日志](/workspace/pawnshop/work/final-acceptance/legacy-logs)均保存在本地。

共享桌面的 Chrome 本身缺少 WebGL2，已确认其失败提示；实际游戏流程使用项目现有 Chromium 软件 WebGL 环境运行。尚未覆盖实体 iPhone/Safari、全部随机种子与策略，也未开展完整屏幕阅读器或 WCAG 合规审计。这些边界不改变上述已检查路径的结果。
