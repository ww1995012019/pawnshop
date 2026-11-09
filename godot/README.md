# 轨道旧货局 · Godot 4 版

用 **Godot 4.6（GL Compatibility 渲染）** 重做的完整游戏。包含基础经营、流动商人、新人物和伪装交易。界面采用正面像素店铺：点击店内设备打开操作抽屉，顾客、实物和待报价始终留在原柜台。

网页版生成在仓库根目录的 `play-godot/`，根目录首页跳转到此入口。

## 能玩到的内容

56 类货物、13 位人物（含店主）、21 天经营、32 张订单、每日事件（含失窃和赃物）、23 条维修/组装配方、抵押与赎回、来源核验与安检、租金与救济清仓、第 3 天起的设备升级和三种结局。

| 页面 | 交互 |
|---|---|
| 柜台 | 正面像素店面可直接操作：日牌看事件，玻璃柜选货，服务铃接客，仪表开鉴定、工具柜开维修，CRT 接订单、纸夹看人物、账本做日结。商品和居民采用统一像素美术，顾客收在服务窗口内。右侧像素报价机把读数、旋钮、物证插槽和交易按键收进同一个机壳；旋钮或 ±1/±10 调价，接受报价后再确认交割。设备面板收起后保留同一顾客、物品位置和报价。 |
| 鉴定 | 按物品选择适用的通用仪器：侧光、紫外、光谱、称量，带电部件还可用探针或负载夹。每件货物另有自己的逐步功能检测，例如磁靴吸附与解锁、咖啡机萃取和压力检查；专属检测同样记录物证并反映实物状态。 |
| 维修 | 三道工序都是手上的活：在实物上来回擦掉污垢、把新零件拖进发光槽位、按住负载复测在绿区松开。最后确认时才扣材料和 AP。也可以组装维护套组、拆解回收；维修材料要等流动商人到店才能购买。 |
| 仓储 | 10×6 占格后仓，拖动换位、拖动时右键旋转，非法位置会标红。陈列架、隔离柜、抵押柜，扫描、登记、隔离、归还、赎回、救济清仓；也可以给符合条件的自有货做有风险的伪装。 |
| 订单 | 可接 / 进行中 / 已结束三栏，交付前逐条显示规则校验结果。 |
| 日结 | 当日流水、维护费与租金、升级二选一、换天卷帘、21 天结局。 |

另外还有：每日站内消息（按事件选择处理方式）、人物档案、经营手册、设置（声音、减少动态、全屏、新开一家店）、标题画面、自动存档。

流动商人绫舟在第 1 天的前四位客人之后首次到店，之后不定时出现。到店期间每种基础维修材料各有 5 份，可购买或以半价出售自己的多余材料；还有概率带来一件稀有物品，并以真实估值回收来源已核验的自有旧物。材料买卖不耗 AP，稀有货购买和旧物回收各耗 1 AP。商人离开后不能采购，库存随存档保留，不会因重新打开游戏刷新。

仓储中的「伪装造假」消耗导电纤维×1、合规封签×1和 1 AP。它只改变交易时呈现给顾客的品相、功能与真伪，保留实物真实状态；顾客可能识破，导致交易受阻、风险上升和对应阵营关系下降。受托、占用、封存或来源未核验的货物不能伪装。

第 3 天起，部分非固定日期的站内消息会出现后仓失窃或疑似赃物事件。守住后仓消耗 1 AP；若放任小偷，可能损失一件未封存的店铺自有货。疑似赃物可以拒收、直接通知站务，或暂存隔离柜；暂存会增加风险，随后可在仓储中移交站务。赃物不能通过普通来源登记转为可出售货物。事件只可处理一次，结果随存档保留。

## 结构

```
godot/
  project.godot  main.tscn  export_presets.cfg
  data/game_data.json          基础游戏数据，直接维护此 JSON
  data/extra_residents.json    新增人物数据
  scripts/model/               model.gd（基础规则）、commerce.gd（商人和伪装）、crime_events.gd（失窃和赃物）、game_data.gd
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

基础数据直接编辑 `godot/data/game_data.json`；美术生成工具所需的共享原画位于 `art-source/shared/`，字体和音效直接保存在 `godot/assets/`。

## 其他开发命令

```bash
python3 godot/tools/prepare_assets.py      # 生成场景并重建物品图集
python3 godot/tools/prepare_item_art.py    # 单独重建新物品图集（Pillow / NumPy / SciPy）
python3 godot/tools/prepare_shop_art.py    # 原创店铺、九位居民、设备与界面图标
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

## 已知限制

- 物品使用新的像素精灵集：56 类货物和独立组装套组都有正反面；原始画稿保存在 `art-source/items-v2/`，导入工具生成固定像素密度的运行图集。主店面、十三位人物、28 个界面图标、六种仪器使用统一像素风；原始画稿保存在 `art-source/shop-v3/`。人物采用半身像及轻量动作，尚未拆分独立手臂。
- 网页引擎与游戏包原始约 45.6 MB，其中数据包约 7.9 MB；相同 gzip 条件下合计约 17.0 MB。实际传输量取决于服务器的压缩与缓存配置。
- 手机横屏入口与店内触控操作已通过 Chromium 触控模拟；六种实物仪器仍使用原有画布交互，尚未完成手机真机测试。
