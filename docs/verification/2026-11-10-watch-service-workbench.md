# 手表维修与造假工作台验证记录

2026 年 11 月 10 日。已按批准方案实现并在本地导出 Web 版本；未推送或发布线上。

## 实现结果

- 保留擦灰，污垢绘制与完成率共用实际透明轮廓遮罩。按连续轨迹计算，不依赖帧数；支持残留提示、半途保存和读档后提交已经擦净的结果。
- 新增开盖拆检、洗件干燥、故障件修复更换、定点润滑回装、走时校验交工五类工序。根据同一只表固定保存的故障按需组合，不再使用通用线圈和绿区进度条。
- 33 款表有明确的机芯、后盖与适用零件配置；石英与机械、旋入式与压入式及螺钉式后盖使用对应动作。拆下的部件进入零件盘，回装、供能恢复、校表与封盖分别表现。
- 造假移入修表台：标识逐笔形成、紫外编号逐字覆印、配重实际放置并封盖，同一只表移到秤盘后读数稳定。加工保留实际故障、缺件、真伪及加工痕迹。
- 按成功完成的对应工序扣资源，重复完成不重复收费；未收妥的开盖物品不能出售或交单。旧档升级前保留原始文件备份，原本正常或已经修好的表不会重新变坏。
- 工序完成后手表保留在台面；提示不会遮住工具或拦截下一步点击，切换加工选项等待本次触控事件结束。

## 自动验证

| 检查 | 结果 |
| --- | --- |
| `python3 scripts/test-godot-native.py` | 37/37 组通过，包含新增维修规则、清洁、动画与界面回归 |
| `python3 scripts/test-godot-packaging.py` | 7 项通过 |
| `python3 scripts/test-game-font.py` | 通过 |
| `python3 scripts/build-godot-web.py` | Web 导出成功，初始引擎与资源约 40.95 MB，gzip 约 12.34 MB |
| `python3 scripts/test-watch-appraisal-web.py` | 桌面及手机触控均通过三项鉴定、修表台加工、旧物证失效与复测、WebFS 保存恢复 |
| `python3 scripts/test-watch-service-web.py --desktop-only` | 连续擦灰、切页及刷新续修、石英维修、机械拆洗润滑校表，以及三种加工完整通过 |
| `python3 scripts/test-watch-service-web.py --phone-only` | 手机擦灰、切页及刷新恢复和石英维修通过；后续加工选择的提示遮挡问题由专项复验覆盖 |
| `python3 scripts/test-watch-service-web.py --phone-only --mechanical-only` | 手机实际触控完成机械表拆检、清洗、干燥、润滑、校表及封盖 |
| `python3 scripts/test-watch-service-web.py --phone-only --forgery-only` | 修正提示遮挡后，手机三种加工通过；真实状态不被改写，每项仅扣一次费用，缩小视口与横竖屏切换保留原表 |
| Python 语法检查、`git diff --check` | 通过 |

浏览器使用 Chromium WebGL，桌面 1440×900，手机 844×390、2 倍像素密度，并检查 667×375 及竖屏切换。触屏事件与原生按钮、零件拖放走同一套游戏规则；不使用浏览器命令直接完成维修或加工。浏览器存档样例由正常游戏规则生成，并以独立原生用户目录运行，不改个人存档。

## 审阅后修复的中断问题

1. 隐藏加工动画继续运行可能把另一个任务标记完成。现在隐藏动画暂停，信号同时检查当前任务身份。
2. 配重中途读档可能因开盖状态改变而重建较短动作表。现在保存初始开盖基准，恢复同一份操作序列及零件位置。
3. 擦灰遮罩先保存为零、费用提交尚未落盘时，读档可能卡在 0%。现在提供“提交清洁结果”，按原工序原子提交，重复操作不重复扣费。
4. 保存动画反复显示同一提示，以及完成提示拦截手机加工选项。现在静默保存帧进度，提示面板与文字不接受点击，方法切换延后执行。

上述问题均保留对应回归。一次较早的原生运行出现 Godot 音频进程崩溃；单独重跑及后续完整 37 组运行均通过，没有屏蔽产品断言。已有的进程退出时资源占用提示仍按原测试脚本规则处理。

## 画面与录屏

- [手机机械表维修完整录屏](/workspace/pawnshop/work/watch-repair/watch-mechanical-phone.webm)
- [手机三种造假加工完整录屏](/workspace/pawnshop/work/watch-repair/watch-forgery-phone.webm)
- [手机配重完成画面](/workspace/pawnshop/work/watch-repair/phone-forgery-final/phone-forge-weight-finished.png)
- [桌面配重与稳定称重画面](/workspace/pawnshop/work/watch-repair/final-browser/desktop-forge-weight-finished.png)

完整桌面录屏与关键帧保存在 `work/watch-repair/final-browser/`，手机机械维修在 `work/watch-repair/phone-mechanical/`，手机三种加工在 `work/watch-repair/phone-forgery-final/`。日志保存在 `work/watch-repair/`，原生分组日志在 `work/godot-tests/`。

本次没有在真实 iPhone Safari 硬件上测试；手机覆盖来自 Chromium 触控仿真。动作与用时按游戏节奏压缩，不宣称完成现实防水检验。
