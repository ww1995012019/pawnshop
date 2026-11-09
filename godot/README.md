# 轨道旧货局 · Godot 4 版

用 **Godot 4.6（GL Compatibility 渲染）** 重做的完整游戏。包含基础经营、流动商人、新人物和伪装交易。界面采用正面像素店铺：点击店内设备打开操作抽屉，顾客、实物和待报价始终留在原柜台。

网页版生成在仓库根目录的 `play-godot/`，根目录首页跳转到此入口。

## 能玩到的内容

15 款虚构品牌手表、13 位人物、21 天经营，以及维修、仓储、订单、抵押与赎回、失窃与赃物事件。分类仅在数据中保留，界面按型号显示。

### 三种检验与说明书

- 放大镜：移动镜片或固定观察点，放大实物 logo，对照型号的标准标识。
- 紫外线：翻到背面，用灯照亮隐藏编号，记录实际字符并查阅编号规则。
- 电子秤：空秤归零，把同一只表放上秤盘，等待读数稳定后记录，再取回。桌面支持拖放，触屏也可使用放表按钮。

检验说明书可从标题、经营手册或检验工具面板打开，提供全部 15 款的正反面、标准 logo、编号规则、重量与表带配置。查看免费，关闭后保留原物位置和工具状态。

检验只提供物证，不给精确售价。真品可能缺件，仿品也可能重量正常；工具不能证明走时精度、防水或所有内部故障。

### NPC 与交易

手表维修师、收藏者、表商、港务人员和普通人分别具有标识、编号、结构、行情方面的能力。对方报价按自己的认识、预算和动机形成，不会随玩家私下检测自动变化；玩家主动出示的物证才会进入对方知识，专业能力影响理解程度。

基础维修仍有清洁、换件、复核装配，材料等流动商人到店购买。修复缺件会改变同一只表的实际重量。来货、订单、商人稀有货与事件奖励只使用当前手表目录，旧物品的组装和拆解已关闭。

服务铃点击或“接待下一位来客”都会触发原场景铃铛的按压回弹，重复点击不会重复接客。人物导入会清除与主体分离的杂点。

### 经营进度

手表版本使用独立的 `orbital-watch-save-v4.json`。旧版档案保留原文件，并另存一次备份；设置中可导出旧版档案。新内容从手表新店开始，不把旧物品强行转换为手表。

## 结构

```
godot/
  project.godot  main.tscn  export_presets.cfg
  data/game_data.json          15款手表、工具、订单、NPC与事件
  data/extra_residents.json    新增人物数据
  scripts/model/               model.gd、watch_rules.gd、commerce.gd、crime_events.gd、game_data.gd
  scripts/app/                 game.gd（全局状态与存档）、shell.gd（主店面/设备抽屉/弹窗）、ui_kit.gd、capture.gd
  scripts/pages/               counter / inspect / repair / warehouse / orders / report
  scripts/world/item_sprite.gd 实物；scripts/customer.gd 人物网格变形
  shaders/                     customer / item / reveal / lens / crt / post
  tests/                       规则、界面、真实输入和资源回归
  tools/                       美术生成与导入脚本
```

## 网页构建、预览与检查

使用 Godot **4.6.3**，与 `vendor/godot-web/runtime.json` 中固定的网页引擎一致：

```bash
npm run build:godot        # 导入资源、导出数据包、生成 play-godot/
npm run preview:godot      # http://127.0.0.1:4174/，支持 gzip、ETag 与缓存
npm run test:godot         # 原生回归和打包/缓存测试
python3 -m pip install -r scripts/requirements-web-test.txt
python3 -m playwright install chromium
npm run test:godot:web     # 先启动预览；桌面、真实音频输出与手机触控
```

构建只使用 `--export-pack`，无需下载完整导出模板。脚本验证固定引擎文件的 SHA-256，
为引擎、数据包和触控资源生成内容指纹，并生成 gzip 文件与 `release.json`。
未使用的旧场景、旧人物与旧 UI 素材不进入网页包；源画稿保留。

手机先横屏再加载大型资源；手机上首次点屏即进入全屏并锁定横屏（浏览器只允许在点按时进入，退出后下次点按会自动恢复，iPhone Safari 不支持网页全屏）。画布铺满整个屏幕，没有额外的网页按钮栏：接客铃、报价机、鉴定仪、维修台、仓储柜、订单终端和账本都直接在店里点按；仓储详情里的「旋转方向」代替桌面上拖动时的右键旋转。
报价、交割、现金与 AP 检查始终由 Godot 原有规则执行；旋转和关闭鉴定抽屉保留当前来客及还价。

`play-godot/` 是忽略的生成目录。引擎作为固定依赖保留在 `vendor/godot-web/`，游戏发布包由 CI
生成并保存为 14 天的工作流产物。清理源码中的旧包不会重写已有 Git 历史。
同一输出目录连续构建会保留当前及上一版的指纹资源，避免正在打开的页面立即失效。
正式托管接入发布流程时，也应保留旧指纹资源至少一个发布窗口，不能直接清空资源目录。

预览缓存策略：HTML 与清单使用 `no-cache`；带指纹的资源使用一年 `immutable` 缓存；
按 `Accept-Encoding` 提供 gzip 并设置 `Vary`、`ETag`。静态/CDN 托管需要配置相同的
`Content-Encoding` 和缓存规则；仅上传 `.gz` 文件不代表服务器会自动使用它。

基础数据直接编辑 `godot/data/game_data.json`；店铺人物原画位于 `art-source/shop-v3/`，手表由生成脚本与像素标识数据定义，字体和音效直接保存在 `godot/assets/`。

## 其他开发命令

```bash
python3 godot/tools/prepare_assets.py      # 生成场景并重建物品图集
python3 scripts/generate-watch-art.py     # 重建15款手表与logo像素数据（Pillow）
python3 godot/tools/prepare_shop_art.py    # 店铺、铃铛、九位居民、设备与界面图标
python3 godot/tools/prepare_extra_residents.py # 另外四位居民
XDG_DATA_HOME=/tmp/pawnshop-input-test godot --path godot -- --inputtest # 真实输入：接客、拖动、报价、店内设备、锁价、交割
XDG_DATA_HOME=/tmp/pawnshop-capture godot --path godot -- --capture=/tmp/shots # 页面截图
XDG_DATA_HOME=/tmp/pawnshop-art-test godot --headless --path godot --script res://tests/item_art_test.gd # 15款手表、30张正反面
XDG_DATA_HOME=/tmp/pawnshop-cursor-test godot --path godot --script res://tests/cursor_test.gd # 图形环境：指针状态
XDG_DATA_HOME=/tmp/pawnshop-ui-test godot --headless --path godot --script res://tests/ui_regression.gd
XDG_DATA_HOME=/tmp/pawnshop-orders-test godot --headless --path godot --script res://tests/orders_ui_test.gd
XDG_DATA_HOME=/tmp/pawnshop-workspace-test godot --path godot --script res://tests/workspace_test.gd
XDG_DATA_HOME=/tmp/pawnshop-colour-test godot --path godot --script res://tests/shader_color_test.gd
godot --headless --path godot --export-release "Web" build/web/index.html
```

输入测试失败会以非零状态退出。截图和输入测试会创建新游戏，请始终使用独立的 `XDG_DATA_HOME`，避免覆盖日常存档。店铺保持原始比例，窗口比例不同时延展周围场景来铺满画面；柜台工作面已加深，实物可在更大的二维范围内拖动。当前交易规则仍一次处理一件货物。

## 已知限制

- 三种工具无法证明所有内部功能，检验说明书明确记录适用范围。
- 网页引擎与游戏包约 44 MB，gzip 后约 15.4 MB。实际传输量取决于托管服务器的压缩与缓存配置。
- 已覆盖 Chromium 桌面与触屏模拟；尚未完成手机真机验收。

## 素材与检验回归

当前手表图集由 `scripts/generate-watch-art.py` 生成，运行时的同一实物按实例叠加标识差异。原始店铺与人物画稿保留在 `art-source/shop-v3/`；人物通过导入器去除分离杂点，铃铛从原画提取并独立动画，原画本身保持不变。

```sh
python3 godot/tools/test_portrait_import.py
python3 godot/tools/test_bell_art.py
```

这两项素材测试需要 Pillow。原生回归入口 `scripts/test-godot-native.py` 包含 23 组检查，覆盖交易、工作面布局、三工具、15款素材、NPC知识、手册、独立存档和铃铛两个接客入口。
