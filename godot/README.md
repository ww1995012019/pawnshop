# 轨道旧货局 · Godot 柜台切片

用 **Godot 4.6（GL Compatibility 渲染）** 重做的柜台垂直切片，用来判断换引擎之后的画面和交互感。只有一位来客、一件货物、两种鉴定仪器、一轮议价和一次成交，不包含完整经营规则。

网页版构建在仓库根目录的 `play-godot/`，本地用任意静态服务器打开 `index.html` 即可（不需要跨源隔离，导出时关闭了多线程）。

## 玩法

1. 按柜台左侧的服务铃，栗叔从右侧走进来，把折叠巡检蜂递到工作垫上。
2. 拖动实物，它会被拿起、倾斜、落下时扬起灰尘；右键或 `F` 翻面。
3. `2` 放大镜：镜片实时放大画面，移到机臂根部停留，找到补漆接缝。
4. `3` 紫外灯：店里的灯暗下来，翻到背面扫机腹，新漆下的旧编号会发光。
5. 每找到一条物证，估值区间收窄，客人会改口、降价，表情和动作随之变化。
6. 在右侧终端转动旋钮出价，客人会接受、还价或生气；耐心用完就带货离开。
7. 成交后钞票一张张飞进客人手里，收据打印出来并盖章，货物飞到后面的货架上。

## 画面做法

| 部分 | 实现 |
|---|---|
| 分层场景 | `tools/prepare_assets.py` 把原来的柜台整幅画拆成背景和前景两层：台面、台灯、显示器、杯子、植物用 GrabCut 抠出来，背景里被遮挡的部分用 OpenCV 补画。来客站在两层之间，被柜台挡住下半身；三层随鼠标做视差。 |
| 2D 光照 | 每张图由亮度生成法线贴图，配合 `PointLight2D`：台灯、窗光、顶灯、霓虹、样品管和吊灯都是真实光源，会闪烁、呼吸；`CanvasModulate` 压暗环境光，紫外模式下整体变暗。 |
| 人物 | 单张立绘铺在网格上，`shaders/customer.gdshader` 按身体部位做顶点变形：呼吸、点头、摇头、侧头、前倾后仰、耸肩，表情图之间交叉淡入。走进走出带步伐起伏。 |
| 鉴定仪器 | `lens.gdshader` 读取屏幕并放大，带折射边缘和色散；`item.gdshader` 只在镜片或紫外光范围内显示划痕、补漆接缝和荧光残留；`reveal.gdshader` 让旧编号只在紫外光下发光。 |
| 终端 | 报价屏是 SubViewport 加 `crt.gdshader`（弧面、扫描线、辉光、闪烁）；出价是可拖动的旋钮；按键会按下回弹。 |
| 收尾 | 屏幕暗角、冷暖分离和颗粒（`post.gdshader`），浮尘、杯子热气、样品管气泡用 CPUParticles2D，舷窗外的驳船和星光裁剪在玻璃区域内。 |

## 目录

```
godot/
  project.godot, main.tscn, export_presets.cfg
  scripts/   main.gd 流程与场景、customer.gd 人物、item.gd 实物、terminal.gd 终端、knob.gd 旋钮、bell.gd 服务铃、util.gd
  shaders/   customer / item / reveal / lens / crt / post
  assets/    由 tools/prepare_assets.py 从 assets/resources 生成
  tools/prepare_assets.py
```

## 命令

```bash
python3 godot/tools/prepare_assets.py             # 重新生成分层素材和法线贴图（需要 opencv-python-headless、Pillow）
godot --path godot                                # 编辑器或直接运行
godot --headless --path godot --export-release "Web" build/web/index.html
godot --path godot -- --capture=/tmp/shots        # 自动跑完整流程并截图
godot --path godot -- --dragtest=/tmp/shots       # 用合成鼠标事件验证拖放
```

## 已知限制

- 素材仍是旧版：货物每格只有 256 像素、放大两倍后偏软；人物是整张立绘，手臂不能单独动。换成分层出图（人物拆部件、货物单独 1024 像素以上）后，同一套代码可以直接接入骨骼动画。
- 网页首次加载约 60 MB（引擎 37.7 MB + 素材 23.8 MB，服务器 gzip 后小很多），比 Cocos 版重。
- 手机触屏还没有单独适配布局，也没在真机上测过。
