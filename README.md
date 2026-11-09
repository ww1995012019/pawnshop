# 轨道旧货局 · 回环九号

使用 **Godot 4.6.3** 开发的空间站旧货店经营游戏。包含鉴定、维修、仓储、议价、订单、流动商人、失窃与赃物事件，以及 21 天经营流程。

## 开发与验证

安装 Godot 4.6.3 后，在仓库根目录运行：

```sh
godot --path godot
python3 scripts/build-godot-web.py
python3 scripts/serve-godot-web.py
```

网页版生成到 `play-godot/`，预览地址为 `http://127.0.0.1:4174/`。仓库根目录首页跳转到此目录。网页引擎固定保存在 `vendor/godot-web/`，构建无需导出模板。

```sh
python3 scripts/test-godot-native.py
python3 scripts/test-godot-packaging.py
```

浏览器回归另需 `scripts/requirements-web-test.txt` 中的依赖和 Chromium，启动预览后运行 `npm run test:godot:web`。`package.json` 仅提供命令快捷方式，不需要安装 Node 依赖。

## 项目结构

- `godot/`：游戏代码、数据、场景、资源与测试。
- `art-source/`：Godot 美术生成工具使用的原画。
- `scripts/`：Godot 网页构建、预览与回归检查。
- `vendor/godot-web/`：固定版本的网页引擎及许可。
- `play-godot/`：忽略的构建输出。

玩法、资源生成、测试与发布包说明见 [Godot 开发文档](godot/README.md)。
