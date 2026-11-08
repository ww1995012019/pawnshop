# 轨道旧货局 · Godot 4 版

用 **Godot 4.6（GL Compatibility 渲染）** 重做的完整游戏。经营规则从 Cocos 版逐行移植，用轨迹比对测试保证两边结果完全一致；界面采用正面像素店铺：点击店内设备打开操作抽屉，顾客、实物和待报价始终留在原柜台。

网页版在仓库根目录的 `play-godot/`，也部署在网站首页；原 Cocos 版在网站的 `/play/`。

## 能玩到的内容

和 Cocos 版规则完全相同：56 类货物、9 位人物、21 天经营、32 张订单、21 个每日事件、23 条维修/组装配方、抵押与赎回、来源核验与安检、租金与救济清仓、第 3 天起的设备升级和三种结局。

| 页面 | 交互 |
|---|---|
| 柜台 | 正面像素店面可直接操作：日牌看事件，玻璃柜选货，服务铃接客，仪表开鉴定、工具柜开维修，CRT 接订单、纸夹看人物、账本做日结。商品和居民采用统一像素美术，顾客收在服务窗口内。右侧像素报价机把读数、旋钮、物证插槽和交易按键收进同一个机壳；旋钮或 ±1/±10 调价，接受报价后再确认交割。设备面板收起后保留同一顾客、物品位置和报价。 |
| 鉴定 | 六种仪器各是一个小操作：放大镜（镜片实时放大画面，停在接缝上）、紫外灯（店里变暗，扫出暗纹）、光谱台（拖三根滑杆对齐参考谱）、万用探针（把红黑探针拖到发光接口上，看示波器）、力秤（先校零，再配砝码让指针归零）、负载夹（转旋钮把输出稳在绿区）。读数来自物件真实状态：故障件在负载下会掉电，复制品谱线和质量都偏移。 |
| 维修 | 三道工序都是手上的活：在实物上来回擦掉污垢、把新零件拖进发光槽位、按住负载复测在绿区松开。最后确认时才扣材料和 AP。也可以组装维护套组、拆解回收、采购耗材。 |
| 仓储 | 10×6 占格后仓，拖动换位、拖动时右键旋转，非法位置会标红。陈列架、隔离柜、抵押柜，扫描、登记、隔离、归还、赎回、救济清仓。 |
| 订单 | 可接 / 进行中 / 已结束三栏，交付前逐条显示规则校验结果。 |
| 日结 | 当日流水、维护费与租金、升级二选一、换天卷帘、21 天结局。 |

另外还有：每日站内消息（三选一）、人物档案、经营手册、设置（声音、减少动态、全屏、新开一家店）、标题画面、自动存档。

## 结构

```
godot/
  project.godot  main.tscn  export_presets.cfg
  data/game_data.json          由 tools/export_data.mjs 从 TS 源数据导出
  scripts/model/               model.gd（规则移植）、game_data.gd
  scripts/app/                 game.gd（全局状态与存档）、shell.gd（主店面/设备抽屉/弹窗）、ui_kit.gd、capture.gd
  scripts/pages/               counter / inspect / repair / warehouse / orders / report
  scripts/world/item_sprite.gd 实物；scripts/customer.gd 人物网格变形
  shaders/                     customer / item / reveal / lens / crt / post
  tests/                       replay.gd（规则比对）、input_test.gd（真实输入）
  tools/                       prepare_assets.py、export_data.mjs、trace.mjs
```

## 命令

```bash
python3 godot/tools/prepare_assets.py      # 生成场景并重建物品图集
python3 godot/tools/prepare_item_art.py    # 单独重建新物品图集（Pillow / NumPy / SciPy）
python3 godot/tools/prepare_shop_art.py    # 原创店铺、九位居民、设备与界面图标
node godot/tools/export_data.mjs           # 从 TS 源导出游戏数据
node godot/tools/trace.mjs 16 400          # 用 TS 规则录制随机对局轨迹
node godot/tools/trace.mjs 10 1400 0.1 long
godot --headless --path godot --script res://tests/replay.gd   # 逐步比对 GDScript 规则
XDG_DATA_HOME=/tmp/pawnshop-input-test godot --path godot -- --inputtest # 真实输入：接客、拖动、报价、店内设备、锁价、交割
XDG_DATA_HOME=/tmp/pawnshop-capture godot --path godot -- --capture=/tmp/shots # 页面截图
XDG_DATA_HOME=/tmp/pawnshop-art-test godot --headless --path godot --script res://tests/item_art_test.gd # 57件物品、114张正反面
XDG_DATA_HOME=/tmp/pawnshop-cursor-test godot --path godot --script res://tests/cursor_test.gd # 图形环境：指针状态
XDG_DATA_HOME=/tmp/pawnshop-ui-test godot --headless --path godot --script res://tests/ui_regression.gd
XDG_DATA_HOME=/tmp/pawnshop-orders-test godot --headless --path godot --script res://tests/orders_ui_test.gd
XDG_DATA_HOME=/tmp/pawnshop-workspace-test godot --path godot --script res://tests/workspace_test.gd
XDG_DATA_HOME=/tmp/pawnshop-colour-test godot --path godot --script res://tests/shader_color_test.gd
godot --headless --path godot --export-release "Web" build/web/index.html
```

输入测试失败会以非零状态退出。截图和输入测试会创建新游戏，请始终使用独立的 `XDG_DATA_HOME`，避免覆盖日常存档。店铺保持原始比例，窗口比例不同时延展周围场景来铺满画面；柜台工作面已加深，实物可在更大的二维范围内拖动。当前交易规则仍一次处理一件货物。

本次轨迹比对：16 局、6,394 步，与 TypeScript 规则逐字段一致（含金额、文案和存档结构）。

## 已知限制

- 物品使用新的像素精灵集：56 类货物和独立组装套组都有正反面；原始画稿保存在 `art-source/items-v2/`，导入工具生成固定像素密度的运行图集。新主店面、九位居民、28 个界面图标、六种仪器使用统一像素风；原始画稿保存在 `art-source/shop-v3/`。人物采用半身像及轻量动作，尚未拆分独立手臂。
- 网页首次加载约 55 MB（引擎 37.7 MB + 数据包约 17 MB，服务器 gzip 后更小）。
- 手机触屏还没有专门布局，也没在真机上测过。
- Cocos 版存档不会自动迁移到 Godot 版（两边存储位置不同）。
