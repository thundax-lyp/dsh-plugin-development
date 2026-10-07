# 观察 Web Client 插件热更

## 目标与前置

目标版本 `dsh-v0.2.0-rc.1`。让一个已安装的 Web Client 插件重建后在当前页面卸载旧 fiber、加载新产物。先按 [构建并装载 Web Client 插件](how-to-build-and-load-web-client-plugin.md)完成独立包的 `dsh.client`、`./client`、裸包名 Loader 行和真实页面激活；再读 [Client HMR](api-client-hmr.md)、[Client 模块装载](api-client-modules.md) 与 [Profile](api-profile-bundle.md)。本任务的 Host 图刷新和浏览器 fiber 替换分别验证。

## 实现步骤

1. 在隔离 Web Profile 启用该包并启动 Web 页面。确认旧版 Client `apply` 的可见标记与 disposer，保留页面。目标 Web 组合须有 Host `client-hmr`、Client modules 和浏览器 `client-hmr` 半边；普通业务包不自行发 SSE。
2. 保持包名、`dsh.client.platform: web` 和 `./client` 导出不变。把 Client 入口的可见文本从旧值改为新值，运行该包自己的构建命令，确保新的 `lib/client.js` 已完整写完，再让构建器更新入口文件的元数据。构建失败时不应宣称热更已发布。
3. Host 按 `pollIntervalMs` 检查图中 bundle 文件，`clientModules.rebuilt(id)` 在修订变化后发出 `rebuilt`；检查 `/plugins/events` 的相应帧和 Host `graph().entries` 中的 id/rev。`PluginsEventFrame` 只是传输事实，不能替代页面检查。
4. 在仍打开的页面观察旧节点消失和新节点出现，确认旧 fiber 的 DOM、事件与样式 disposer 已执行。若下载或 materialize 失败，读取 Client module loader 的错误状态及浏览器控制台，不能把 SSE 帧当成成功。再禁用或移除 Loader 行，观察图变化、页面中的最终清理；有必要时刷新页面确认新的基线一致。

## 验证与限制

独立 Client presence 包已经在真实 Chrome 页面通过初次装载和运行中移除；本次尚未修改其构建产物并观察 `rebuilt` 与页面替换，故上面热更验收仍待运行。目标仓库的 Host/Client HMR 测试源码只验证其各自路径，不能替代该消费包的真实构建刷新。跨重连业务状态必须从 Session 或 Host owner 重建，组件局部状态不会因热更自动恢复。
