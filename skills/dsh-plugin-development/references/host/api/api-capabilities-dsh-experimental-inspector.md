# @deepseek-ai/dsh-experimental-inspector 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

在 Chrome DevTools 中检查一个运行中的 dsh Host 及其浏览器 Client：Host 与 Client Console context、Host Sources 与调试、Host fetch 采集和共享 Cordis 树，全部 CDP 状态都在 Worker 中。

可选的开发者工具组合包 同时启用 NodeJS 诊断和会话数据诊断，并开启 Host fetch 采集。Web startup 不需要也不接受 `--inspect`。

### 使用本包

可信本地开发可通过 `pnpm run demo:inspector`，经普通 Web profile 显式挂载源码 overlay。Host 会打印调试链接，检查该目标需要 Chrome。fetch 采集包含密钥等敏感信息，本地调试端口允许执行任意代码。

组合包将 `experimental-inspector` 设置为 `disabled: false`，并设置 `captureFetch: true`。Host 可选的 `--inspect` 参数处理仅负责打开外部 Chrome 窗口，不控制 Inspector 是否运行。

启用此组件后，按 **Ctrl/Cmd+Shift+.** 可展开或收起整宽底部面板中的 **NodeJS 诊断**，无需选中 Session。拖动上边缘可调整面板高度，占用上方内容的可用空间；收起和切换页面时保留所选高度。聚焦分隔条后也可使用上/下方向键、Home 和 End。iframe 首次展开时加载，收起、切换 Session 或主面板时保持挂载；卸载此组件会重置前端。X 按钮和快捷键会在原打开控件仍连接时恢复其焦点。iframe 自动连接当前 Host 并打开 Console；不包含手动 Connection 面板。每个内嵌前端的 Console、Sources 和 Cordis 树只显示 Host 与嵌入它的页面所对应的 Client；打印的 `devtools://` 链接仍显示全部 Client。

Host 在相对于应用根目录的 `inspector/devtools/devtools_app.html` 路径提供镜像后的 DevTools 前端，沿用现有 Web 登录鉴权。`inspector/devtools` 前缀重定向到该入口；GET 和 HEAD 提供文件，缺失资源返回 404，其他方法返回 405。其 `cdp` WebSocket 路由鉴权同一浏览器会话，只转发到当前 Inspector 的 Worker page target。底部面板将已声明的页面 `clientSourceId` 传给入口及自动 WebSocket 端点，重连时继续选择同一逻辑 Client。没有选择参数时包含全部 Client；指定 Client 不在线时保留 Host；空值或重复参数以 400 拒绝升级。显式 `ws` 或 `wss` query 参数覆盖自动端点及其选择范围。

构建使用官方 `chrome-devtools-frontend@1.0.1638082` TypeScript 源码及根 workspace 固定的 Vite 依赖。该 npm 快照是 Chromium 150 发布分支的祖先，不是其后续稳定版的逐字节副本。源码配置与包清单共同固定版本。普通 npm 安装提供源码和工具链；构建不需要 appspot、下载或启动浏览器，也不需要提取 PAK。workspace 安装和发布包安装都不运行 DevTools 下载 hook。

分发构建将 ESM 入口、共享 chunk、显式 Worker、注入脚本与运行时资源输出到 `lib/devtools`，保留原始模块相对资源 URL，包括部署子路径。CSS 文本模块、图片变量和最小英文 locale 常量替代 GN 生成输入，不修改 npm 源码。前端直接使用上游模块内的英文 UIStrings，不包含翻译文件或词条生成器，其他语言偏好回退英文。所有上游面板均保留，包括 Lighthouse。Memory 带有解析 Worker，Performance 记录 Host CPU。发布包包含构建资源、完整性清单和 Chromium license，不包含构建用 npm 源码或 Vite 依赖。

前端在构建时选择浏览器运行时适配器、排除 Node 专用传输，不使用 import map。同源连接 bootstrap 先于应用入口执行。底部面板添加 `disableLocaleInfoBar=true`，bootstrap 设置 DevTools 自己的 `disable-locale-info-bar` 偏好，不改变语言。升级前端时，需要一起调整 npm 版本和源码配置，然后重跑面板和 Worker 检查；不兼容的源码变动会使构建失败。

### 运行时布局

Worker 不访问实时 Cordis 对象；共享 Host/Client collector 会在传输前把它们投影成已验证快照。Cordis 负责插件组合、注册 `ctx.inspector`、注入 bootstrap 和 dispose（资源释放）。后加载的 Client 通过已鉴权的 Host 路由获取 bootstrap。Host 在启动 Worker 之前注册该路由，请求会等到 Worker 就绪后返回 bootstrap，启动失败时返回 `503`；请求中止时立即停止等待。当前平台无法运行 Worker 并报告 Node 的 `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` 时（例如浏览器预览的 Worker host），Host 记录一条警告，插件仍照常启动，只保留该路由并返回 `503`，不提供 `ctx.inspector`、DevTools 路由、bootstrap 注入或 `devtools://` URL；其他任何启动错误仍使插件启动失败。初始注入与主动获取两条路径中，bootstrap 传输或 source 建立失败均记录警告并保留连接重置后的重试；bootstrap 数据非法或服务注册失败则使启动失败。替换 source 会等待旧服务消费者清理完成，再申请新 source；卸载已激活插件会取消其未完成的 bootstrap 刷新。

Host 插件启动 Worker 并连接专用 `MessagePort`。Client 使用注入或主动获取的浏览器 source 参数，直接向 Worker 打开带鉴权的 WebSocket，不接收 DevTools URL。Chrome DevTools 连接 Worker 的 CDP WebSocket。每条 DevTools 连接在 Worker 中独占一个连接 Host 主线程的 `node:inspector.Session`，因此 Host JavaScript 暂停时仍可调试 Host。

源码树遵循这些执行环境：`client/` 与 `host/` 提供镜像的适配器 entry path，`worker/` 只包含 Worker thread orchestration 与 Chrome protocol 状态，`shared/` 包含与环境无关的 Cordis 和 network model、规范化 realm 后端接口及内部 bridge protocol。Worker 侧 Client 与 Host 适配器镜像放在 `worker/realms/` 下；其中的 Client 适配器仍然在 Worker 中执行。

Host 与 Client producer 发送内部观测记录，不发送 CDP 消息。记录包含 source generation、sequence、source 时钟时间、topic 和 JSON payload。Worker 验证每个进程或网络帧，独占 source 状态与保留历史，并把已识别 topic 转换成标准 CDP domain。

Client source 声明类型化 Runtime、Console 和只读 Sources 能力。`Runtime.enable` 只发布默认 Host execution context，并为此 DevTools 连接范围内的每个已连接 Client 发布一个 synthetic context；不列出 Node internal 和额外 VM context。选择 Client context 后，求值、属性读取、函数调用、Promise await 和对象释放都会路由到该浏览器 realm。Client Console argument 使用同一份会话本地 object table；`Debugger.enable` 发布构建后的 `lib/client.js` catalog，`Debugger.getScriptSource` 读取有界 content chunk。Source map 地址来自已加载脚本末尾的 `sourceMappingURL`，保留 combo URL 和部署前缀。Client script 断点、step 和 call frame 仍不支持；target-wide pause 与 resume 只控制 Host debugger。

Client 在 `pagehide` 时同步关闭 source，缓存页面恢复并收到 `pageshow` 后，使用同一逻辑身份重新连接。仍然存活的页面切到后台不会断开。已关闭的 generation 不会在异步操作完成后发布执行上下文或 script catalog。

两个插件端运行同一份可在浏览器中安全运行的 Cordis collector。它把可达 Context 与 Fiber 对象转换成有版本的 `CordisTreeSnapshot`；Worker 存储这份与 CDP 无关的表示，并把每个 Host 或 Client source 投影到 Elements 面板。

### 配置

Host 插件注入 `webServer` 和 `connection`，接受以下字段：

| 字段 | 默认值 | 含义 |
|---|---:|---|
| `host` | `127.0.0.1` | Worker endpoint 监听地址；只接受 loopback |
| `port` | `9230` | Worker endpoint 起始端口；端口占用时向上递增，`0` 表示由操作系统分配 |
| `clientOrigins` | `[]` | `/ingest` 额外接受的精确浏览器 origin；loopback origin 始终允许 |
| `captureFetch` | `true` | 包装 `globalThis.fetch` 并发布之后的每次调用 |
| `maxRequestBodyBytes` | 8 MiB | 每次请求保留的 request body 前缀 |
| `maxResponseBodyBytes` | 32 MiB | 每次请求保留的 response body 前缀 |
| `maxBodyChunkBytes` | 48 KiB | base64 编码前一条 body 记录携带的原始字节数 |
| `maxJournalBytes` | 256 MiB | Worker 保留的请求与响应 body 总字节数 |
| `maxRetainedRequests` | `2000` | Worker 保留的进行中与已完成请求总数 |
| `maxSourceFrameBytes` | 128 KiB | 编码后的 source frame 上限 |
| `maxSourceRecordsPerFrame` | `128` | 每个 source batch 的记录数 |
| `maxQueuedRecords` | `2048` | 每个 producer 等待发送的记录数 |
| `maxQueuedBytes` | 16 MiB | 每个 producer 等待发送的编码字节数 |
| `startupTimeoutMs` | 10 秒 | Worker ready 截止时间 |
| `stopTimeoutMs` | 5 秒 | 强制终止前的 Worker 优雅关闭期限 |
| `clientReconnectBaseMs` | 250 ms | Client 首次重连退避上限 |
| `clientReconnectMaxMs` | 5 秒 | Client 最大重连退避上限 |
| `clientRuntimeTimeoutMs` | 30 秒 | 一次 Worker 到 Client Runtime 或 Sources 命令的截止时间 |
| `queryTimeoutMs` | 10 秒 | 一次非 CDP 语义查询的截止时间 |
| `maxClientRuntimeObjects` | `10000` | 每条 DevTools 连接保留的 Client 实时对象 handle 数 |
| `maxClientRuntimeProperties` | `2000` | 单次 Client 对象检查返回的属性描述符数 |
| `maxClientSourceBytes` | 8 MiB | 单个 Client script 或 source map 允许读取的最大编码字节数 |
| `maxCordisNodes` | `2048` | 一个 realm 快照截断前允许的 Context 与 Fiber 节点数 |
| `maxDisconnectedCordisTrees` | `8` | 作为非实时快照保留的最近断联 realm 树数量 |

Worker 监听后，Host 会记录一个 `devtools://` URL。同一个 Worker 提供 `/json`、`/json/list`、`/json/version`、`/devtools/page/<id>` target WebSocket 和 `/ingest` Client source。

### 已知限制与延期工作

- **Memory 和 Performance 检查 Host** — Memory 抓取 Host 堆快照，Performance 记录 Host CPU 采样。Client Runtime context 不提供浏览器堆快照或渲染轨迹。
- **同源转发运行在 Host 主线程** — 暂停 Host JavaScript 也会暂停转发。断点调试和恢复执行应使用启动时打印的 Worker 直连 DevTools 端点。
- **Client active debugging 不受支持**——Console event、Runtime 求值、RemoteObject 访问和只读 `lib/client.js` Sources 可用。Client script debugger request 返回明确的 unsupported error；target-wide pause 与 resume 只控制 Host。
- **Client Sources 只暴露 Inspector bundle**——本包不收录页面中的其他 script。
- **Client 求值使用页面 JavaScript**——页面 Content Security Policy 可能阻止动态求值；synthetic context 不提供 DevTools command-line helper 或原生 REPL 声明语义。
- **Client 身份仲裁依赖 Web Locks**——缺少该 API 的浏览器仍会通过 `sessionStorage` 保持重连与刷新身份，但无法区分从同一存储状态复制出的两个同时存活 tab。
- **fetch 拦截范围是 `globalThis.fetch`**——直接调用 Undici API，以及激活前保存的 fetch 引用不会被观察。
- **body clone 有运行成本**——完整采集会 tee 请求与响应流，直至达到配置上限，可能增加内存与 I/O 压力。保留 body 的上限不包含流 tee 内部的缓冲，包括来源提供的超大 chunk，或为读取较慢的应用分支排队的数据。
- **不自动重启 Worker**——Worker 意外退出会使当前 Inspector 实例失败；生命周期恢复留待后续改动。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config extends Omit<InspectorOptions, 'clientOrigins'> {
    clientOrigins?: string[];
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## InspectorService（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface InspectorService {
    publish(topic: string, payload: InspectorJsonValue, monotonicMs?: number): void;
    readonly cordis: CordisRuntimeTreeReader;
}
```

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`InspectorService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cordis`、`publish`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): Promise<void>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-experimental-inspector`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "experimental-inspector";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

相关对象：[snapshot](api-capabilities-dsh-experimental-inspector-snapshot.md)。

相关对象：[model](api-capabilities-dsh-experimental-inspector-model.md)。

相关对象：[reader](api-capabilities-dsh-experimental-inspector-reader.md)。

相关对象：[control](api-capabilities-dsh-experimental-inspector-control.md)。

相关对象：[controller](api-capabilities-dsh-experimental-inspector-controller.md)。

相关对象：[json](api-capabilities-dsh-experimental-inspector-json.md)。

相关对象：[observation](api-capabilities-dsh-experimental-inspector-observation.md)。

相关对象：[plugin](api-capabilities-dsh-experimental-inspector-plugin.md)。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    inspector: InspectorService;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `inspector` | `inspector: InspectorService` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-experimental-inspector.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
