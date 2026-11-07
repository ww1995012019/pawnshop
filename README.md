# 轨道旧货局 Cocos Creator 网页版

使用 **Cocos Creator 3.8.8 与 TypeScript** 开发的空间站当铺经营游戏，按[太空当铺游戏设计与素材需求文档](page://page_f44de03a1914819194a52f23e05cf877)的 P0 页面、物品与首三天流程实现。当前界面版本为 `orbital-p0-v5`；游戏中的场景、货物、人物、工具和 UI 均由原生 Cocos 节点绘制，HTML 只承载画布和加载页。

## 当前实现范围

- 空间站营业柜台、鉴定/维修工作台、仓储/安检区三个场景视图；视觉围绕“旧港仪器店”的烟熏玻璃、磨损合金、暖白丝印和琥珀按键组织。
- UI-001 至 UI-008：柜台、鉴定、维修、仓储安检、议价、订单、日结、设置；底部六个固定入口贯穿主要业务。
- 24 件 P0 交易货物、6 种鉴定工具、6 种材料、5 位主要角色、12 张订单；另有 5 条维修配方和 1 条维护套组装配方。
- 每日 12 AP、1200 Cr 开局、每日维护 20 Cr；第 7/14/21 天租金为 450/495/545 Cr。模型支持 21 日经营，首三天围绕交易、委修、来源安检与首次设备升级展开。
- 实物正反面切换、拖动、旋转、缩放、六种取证操作、证据报价、原子交割、抵押/赎回、维修拆解组装、10×6 占格仓库、来源登记/隔离及原物订单交付。

内容 ID 与页面的对应关系见 [设计实施对应表](docs/design-traceability.md)。完整 P1 的 60 件货物、8 场景、12 角色与黑市、拍卖、物流、完整施工系统尚未交付。

## 画面与界面

柜台以场景、半身顾客和台面货物为主体。人物位于原画台沿之后，货物和手部在台面上形成前后关系；两侧终端收缩为局部信息区，顶栏保留经营读数，六个入口嵌在底部控制导轨中。鉴定中央直接使用工作垫放置可操作实物，工具插槽、证据读数和旋转/翻面控件围绕它安排。

六种工具使用独立的透明仪器图集。烟玻璃、合金、橡胶托槽、琥珀键与控制导轨使用九宫格材质；主操作和导轨保留实体质感，次要按钮采用较平的表面与低对比底沿。暖白承担正文，琥珀强调当前主动作，青色用于测量、扫描和当前工具。

## 运行与构建

```sh
npm ci
npm run engine:prepare
npm run typecheck
npm test
npm run build:web
npm run preview
```

打开 `http://localhost:4174`。`dist/` 为静态网页产物，可部署到 HTTPS 静态服务器。`npm run build:pages` 另将产物复制到 `play/`，保留仓库既有 GitHub Pages 路径；不要手工修改生成的 `play/game.js`。

`npm run test:orbital` 单独运行空间站规则测试，`npm test` 同时保留旧灰线模型回归检查。模型、旧版浏览器与当前视觉版本分别记录；`orbital-p0-v5` 的实际构建和画面验收结果见 [验证记录](docs/validation.md)。

无编辑器构建链使用官方 `@cocos/ccbuild` 编译真实 Cocos 引擎，源码固定提交 `411f98df047c25902f93440d4b22925c2fb65461`，不使用模拟 `cc` 或替代渲染器。首次准备需要 Git、Node.js 22 或更新版本及网络；之后复用 `.cache/cocos/`。相关 WebGL 内置材质说明见 [vendor/README.md](vendor/README.md)。

## Creator 工程

使用 Cocos Dashboard 导入本目录，选择 Creator 3.8.8，资源导入后打开 `assets/scenes/Main.scene`，网页发布目标选择 **Web Desktop**。场景保留 `CreatorMain` 的脚本 UUID，组件继承 `orbital/OrbitalMain`；标准工程和源码引擎网页运行同一份逻辑。

当前云环境没有 Creator 编辑器，Dashboard 导入、资源重新导入与正式编辑器 CLI 构建尚未在本机验证。运行画布为 1600×900，使用 `SHOW_ALL` 适配横屏浏览器；原设计的高清素材源文件交付规格不因画布适配而视为完成。

## 操作与存档

底部入口切换柜台、鉴定、维修、仓储、订单、日结；设置从顶部进入。鉴定台支持拖动物件、滚轮或按钮缩放、`R` 旋转、`F` 切换独立正背面。工具界面分别提供疑点定位、背面紫外扫描、谱峰对齐、双探针接入、校零配重和负载采样。`Esc` 返回；动画播放时空格可快进。设置包含声音、减少动态、放大文字、导出档案和重新开始。

新版档案键为 **`orbital-save-v3`**，设置键为 **`orbital-prefs-v3`**。新版只读取 schema 3，不将旧世界观的票币、旧物与七日进度转换为 Cr 或空间站物品。原 `greyline-save-v1`、`greyline-save-v2` 与旧设置键保留，重新开始新版不会删除它们。清理浏览器站点数据前可先导出档案；不同域名的本地存档不会自动互通。

## 代码与素材

| 路径 | 内容 |
| --- | --- |
| `assets/scripts/CreatorMain.ts` | 标准 Creator 场景入口，继承新版游戏组件 |
| `assets/scripts/orbital/OrbitalMain.ts` | 场景、导航、鉴定、议价、输入与存档 |
| `assets/scripts/orbital/OrbitalPanels.ts` | 维修、仓储安检、订单、日结与设置 |
| `assets/scripts/orbital/OrbitalUI.ts` | 仪器材质、半身人物、工具图集、原生控件和物体状态叠层 |
| `assets/scripts/orbital/OrbitalMotion.ts` | 人物、手递、取证、维修、扫描、结算等表现 |
| `assets/scripts/orbital/data.ts`、`types.ts`、`model.ts` | 内容、类型、经济规则与存档校验 |
| `assets/resources/art/orbital-*` | 三张场景、正/背面货物、五角色六姿态、六仪器与界面材质图集 |
| `tests/orbital.test.cjs` | 新版状态、经济、归属与异常边界测试 |
| `assets/scripts/game/`、`tests/model.test.cjs` | 保留的旧版模型及回归测试 |

当前三张场景是 1672×941 单张背景；货物正、背面各一张 1536×1024 图集，故障、开盖与修复标记还结合程序叠层。新增六仪器图集与界面九宫格材质图集各为 1536×1024。它们不是已交付的 4K 分层生产源文件。五角色已有常态、专注、疑问、满意、拒绝、疲惫六组姿态/表情切换，每组2172×724图集包含五人物；配合进出、呼吸和四姿势手部表现。它们不是 Spine 骨骼、完整口型或逐帧角色行走成品。当前内容与后续素材边界见 [UI 与动画说明](docs/ui-motion.md)。

中文字体与许可保存在资源目录；网页构建将 PNG 转为 WebP，保留 Creator 工程中的 PNG 与 `.meta`。程序提示音仍为原型音效；Cocos 引擎与测试 effect 按 MIT 许可分发，许可见 `vendor/COCOS-LICENSE.txt`。
