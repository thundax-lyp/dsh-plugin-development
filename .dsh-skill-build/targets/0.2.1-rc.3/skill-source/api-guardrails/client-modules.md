# modules：插件接入

## 对象关系

Host 从 enabled Loader 的裸包名行发现 dsh.client，./client 子路径行不携带浏览器半部。声明 platform:web、导出 ./client、预先构建 lib/client.js；普通 ESM 文件不是可加载 bundle。浏览器执行脚本只登记 factory，首次 materialization 才执行正文。baseline requests 由 shell 冻结模块表提供；external 只列精确的非 baseline request。缺供应者、同步循环和自请求使组合失败。删除 Host 行会等待异步清理，再淘汰无人引用的模块与样式。跨 Host release 的图不应用，改版需刷新页面。

## 选型与使用

- [entries 对象契约](api-client-modules-entries.md)。
- [entry-lifecycle 对象契约](api-client-modules-entry-lifecycle.md)。
- [index 对象契约](api-client-modules-index.md)。
- [manifest 对象契约](api-client-modules-manifest.md)。
- [release-change 对象契约](api-client-modules-release-change.md)。
- [system 对象契约](api-client-modules-system.md)。

完整操作见 [接入 modules](../how-to/how-to-client-modules.md#接入-modules)。
