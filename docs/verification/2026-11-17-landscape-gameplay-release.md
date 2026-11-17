# 横屏交互与玩法优化发布记录 · 2026-11-17

已发布到原 [游戏地址](https://ww1995012019.github.io/pawnshop/?v=c7e0cdad663cb6a2)。本次包含手机统一横屏、顶部按钮防误触、居中图标关闭、长列表可读性，以及两批鉴定、议价、委修报价、工具记录与经营评价调整；也包含收尾验收发现的工作灯说明和浏览器兼容提示修正。

- 游戏源码提交：`216083054fc860f5487c9912dde6e83de90baa4b`，已推送 `main`。
- 发布提交：`463c5f649716009b9b52d66204b299a436e5622f`，已推送 `gh-pages`。
- Release：`c7e0cdad663cb6a2`。
- 游戏包：`workbench-f62e0c2c228a5200.pck`，SHA256 为 `f62e0c2c228a5200c7d68c05f10b4d0d13e1f956ff6422781fac31114641ad4b`。
- 确切发布提交对应的 [GitHub Pages 部署](https://github.com/ww1995012019/pawnshop/actions/runs/44050091239) 已成功；`build`、`deploy`、`report-build-status` 三个任务均为 `success`。

发布前重新执行完整 `npm test`，151/151 组原生回归通过，资源相关检查、打包 7 项、字体 1 项及加载布局 4 项通过。桌面、手机触摸模拟及实际首日存读档流程的证据见 [收尾验收记录](/workspace/pawnshop/docs/superpowers/specs/2026-11-17-final-acceptance-report.md)。源码分支额外的 [GitHub Actions 检查](https://github.com/ww1995012019/pawnshop/actions/runs/44050000124) 在交付记录生成时仍运行中，未将其计为已通过。

发布目录基于上一线上版本重新包装，同一游戏包与本地已验收包逐字节一致；因保留的上一版资源清单不同，发布 Release ID 与本地验收 ID `0c7911dff9419f89` 不同。33 个清单文件的大小与 SHA256 全部核对通过；上一线上版本的 27 个当前文件仍可访问，除更新后的 HTML 外旧资源字节一致，旧入口跳转保留。上一版 `workbench-17c089e4365083c7.pck` 及 gzip 包仍在发布提交中。

普通静态服务器、无 gzip 适配的独立浏览器冷启动在 18.441 秒进入游戏，初始 1200 Cr/12 AP 正确，未发现页面、脚本、控制台错误或失败请求。GitHub connector 另对确切发布提交中的 HTML、发布清单和部署元数据做了远端逐字节核对，确认源码、Release 和游戏包一致。执行环境直连 `github.io` 的 HTTP 检查被网络代理以 403 阻断，因此没有将其记为线上试玩或线上 HTTP 字节校验通过；发布完成状态来自上述确切提交的 Pages 成功部署。

本地证据：[完整测试日志](/workspace/pawnshop/work/publish/npm-test.log)、[阶段包核对](/workspace/pawnshop/work/publish/staged-release-audit.json)、[远端内容核对](/workspace/pawnshop/work/publish/remote-publication-audit.json)、[部署结果](/workspace/pawnshop/work/publish/deployment-result.json)。
