# 构建并装载浏览器半部

## 接入 modules

目标结果：独立浏览器包能经裸包名 Profile 行发现并以 lazy-CJS factory 装载与撤销。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。目标是让一个外部包的 Client apply 随 Host Profile 的启用行被浏览器装载、停用时撤销。Host 侧由 [ClientModuleRegistry](../api/api-client-modules-index.md) 发现包与发布图，浏览器由 [ClientModuleSystem](../api/api-client-modules-system.md) 和 [ClientEntries](../api/api-client-modules-entries.md) 装载与协调；boot wire 与 factory 交接见 [manifest](../api/api-client-modules-manifest.md)。

### 实现步骤

1. 创建 [完整独立包](../examples/example-client-overlay.md) 中的 Host 空入口、Client 入口、package exports、bundle patch 与单入口 factory 构建。对外安装版本使用 rc.3；包名必须等于 __ModuleLoader__.load 的 id，./client 指向构建产物。
2. dsh.client 声明 platform:web。inject 是包名依赖信息，不代替 Client 模块的 Cordis `export const inject` 服务依赖。baseline external 不写进 external；其它 runtime request 用精确字符串声明，包括 /client 子路径。type-only import 会擦除，不产生请求。
3. 保持 react、react/jsx-runtime、Cordis、store、slots、primitives 等 baseline 身份由 shell 提供。外部包不要内联另一个 React 或 Cordis；只有类型的跨插件接口协作优先 import type，运行协作通过 ctx 服务或 slot。
4. 构建后检查 lib/index.js、lib/client.js 与声明都存在，并用 npm pack --dry-run 检查文件集合。上游 clientBundle 是仓库内 preset，不能作为已发布 npm 构建入口导入；最小示例仅覆盖单 entry、无 CSS、无 split chunk 的 factory。
5. 在独立 DSH_HOME 初始化 web Profile，再用 dsh plugin --profile web add file:绝对包目录 安装 bundle。patch 的根行必须是裸包名，挂 /子路径的 Loader 行不携带浏览器半部。
6. 启动 dsh web，打开实际地址。观察 bundle 请求无 404，模块已登记且 apply 的 slot 贡献可见。Client body 到首次 materialization 才运行；脚本下载成功本身不证明 apply 已激活。

### 失败、更新与完成边界

缺 built bundle 会在 Host 激活时给出构建提示；缺 external、自引用与同步依赖环会使图失败。先修 manifest、构建与供应者，不在浏览器上注入伪全局代替模块依赖。普通停用等待异步 effects 清理，再驱逐无引用模块与 owned styles；重启只产生一份实例。Host release 改变时现页不应用另一版图，刷新才载入新 release；Plugins 页重试不会绕过此边界。

完成至少验证独立包解析、Host/Client 分开编译、factory 构建、实际 module import、一次可见行为与 fiber 卸载。页面几何、原生键盘与真实重连还需要浏览器 smoke；jsdom 模块与 slot 测试只能验证其实际断言的范围。

相关对象契约：

- [`ClientReleaseChange`](../api/api-client-modules-release-change.md)。
- [`tearDownEntryFiber`](../api/api-client-modules-entry-lifecycle.md)。
