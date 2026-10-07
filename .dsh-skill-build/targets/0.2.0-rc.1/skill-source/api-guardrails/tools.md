# 模型工具注册与执行契约

## 适用范围与入口

目标版本为 `dsh-v0.2.0-rc.1`。Host 插件从 `@deepseek-ai/dsh-tools` 导入 `defineTool` 与相关类型，并在 `inject = ['tools']` 的 Cordis 插件中调用 `ctx.tools.register()`。装载的 `dsh-tools` 提供 `ctx.tools: ToolRuntime`；Profile 中未挂载它时，依赖该 Service 的插件无法激活。可安装 bundle、Profile 配置和一次真实调用的完整文件见[制作并装载工具](how-to-register-model-tool.md)。

这个入口适用于模型可以主动调用、输入可由 JSON Schema 表达且成功结果能作为单份规范 JSON 值的能力。需要在 Agent 轮次之外保存模型可见事实时，由插件设计 Session 事件和纯重放投影，不能只依赖工具进程内状态。

## 契约与运行语义

`defineTool<const S extends ParameterSchemaSpec, const O extends ValueSchemaSpec>(options: DefineToolOptions<S, O>): ToolDefinition` 从参数与输出 schema 推断 `execute` 的输入和成功返回类型。`register(definition: ToolDefinition): () => void` 在当前插件或 Agent scope 注册工具，返回精确撤销函数；同一层的重名工具和保留名 `run_code` 会失败。Cordis effect 管理属于插件 scope 的注册，卸载时撤销。

调用时先验证模型参数，再经过 `tools/pre-execute`、单调拒绝 guard、`tools/execute`、`tools/post-execute`、内容终结和只读 `tools/result`。执行体只返回一份与 `output.schema` 匹配的规范值；`output.render(args, value)` 纯函数地把已验证值转换为模型文本块。结果的 UI 卡与模型文本是不同投影；Host 的 `presentCall`/`presentResult` 是纯呈现函数，内置 Web Client 则使用自己的 keyed renderer 和持久元数据。

`mode: native` 将可见工具 schema 提交给模型；`ptc` 只直接呈现 `run_code` 与生成 SDK，内部子调用重入同一工具执行链；`both` 提供两种方式。非 native 模式还需要已挂载、语言受支持的 `ctx.ptcRuntime`，否则 prompt 组装失败。`maxParallelSubCalls` 的默认值为 10，值为 1 时 PTC 子调用串行；是否可并发仍取决于每个工具的 `isConcurrencySafe`。

`dsh-tools.Config` 控制 mode 与 PTC 并发；`DefineToolOptions` 的 `name`、`description`、`parameters`、`output` 和 `execute` 构成最小注册。可选 `deferLoading` 延迟 schema，`timeoutMs` 由另装策略执行，`projectContent`/`finalizeContent` 只变换呈现内容。`ToolDefinition` 保留这些 `projectContent`、`finalizeContent`、`timeoutMs` 决定供执行链使用，不允许工具体返回第二份权威结果。`ToolCallView`、`ToolResultView` 是纯展示形状；`dsh-agent-tool-presentation`、`dsh-tool-present` 和 `dsh-tools/invariant` 各自导出的 `name` 只是具体插件的诊断名，不是工具名或动态注册入口。

`ToolExecutionInput` 是直接执行请求：`callId`、`name`、`arguments`、`signal` 必须来自调用方，`agent?` 表示实际 Agent，`parent?` 与 `rootCallId?` 仅由 PTC 嵌套链传入。执行体收到 `ToolRunContext`，含相同的 `callId`、`name`、`arguments`、`signal`、`agent`、`parent`、`rootCallId`，并可调用 `deferContext` 或 `concludeTurn`；它不是持久 Session 的替代物。`ToolExecutionResult` 的规范值和模型内容为一份执行结果，`isError` 标出失败、`meta?` 是可重放的展示元数据；`ToolResult` 是呈现回调读取的完成态，含 `isError` 与 `meta?`。`ToolRuntime` 的 `get`/`schemas` 只读当前 scope，`restrict` 只缩小继承工具；注册、执行和 guard 的细签名见下表。

### 对象类型与成员

| 对象与成员                                    | 精确公开类型或返回值                                                                          | 插件作者需要遵守的语义                                                                                                     |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `DefineToolOptions.name`、`description`       | `string`、`string`                                                                            | 必填；名称在可见层唯一，描述发送给模型。                                                                                   |
| `parameters`                                  | `S extends ParameterSchemaSpec`                                                               | 必填；定义模型可提交的参数对象，`defineTool` 先验证再调用执行体。                                                          |
| `output.schema`                               | `O extends ValueSchemaSpec`                                                                   | 必填；每个成功值或策略替换值都必须符合此规范结果 schema。                                                                  |
| `output.render`                               | `(args: InferArgs<S>, value: InferValue<O>) => ContentBlock[]`                                | 必填且应为纯函数；只投影模型可见内容，不产生第二份权威结果。                                                               |
| `output.presentationMeta?`                    | `(args, value) => JsonValue`                                                                  | 可选；产生可重放的展示元数据，不应承载模型事实。                                                                           |
| `execute`                                     | `(args: InferArgs<S>, exec: ToolRunContext) => Promise<InferValue<O>>`                        | 必填；观察或转发 `exec.signal`，自有异步资源到安静状态后才结算。                                                           |
| `timeoutMs?`                                  | `number`                                                                                      | 可选正有限数；由另行挂载的超时策略执行，不会单靠声明产生强制终止。                                                         |
| `isConcurrencySafe?`                          | `(args) => boolean`                                                                           | 可选纯分类器；仅 `true` 表示可与同批兄弟调用重叠。                                                                         |
| `projectContent?`、`finalizeContent?`         | 同步内容投影函数                                                                              | 可选；前者在后置策略前，后者在规范化完成后变换模型内容，不得另造规范值。                                                   |
| `presentCall?`、`presentResult?`              | 纯 `ToolCallView` / `ToolResultView` 投影                                                     | 可选；供 Host 呈现，不能用时钟、I/O 或非持久临时状态决定重放结果。                                                         |
| `ToolRunContext.signal`                       | `AbortSignal`                                                                                 | 调用方拥有取消；执行体必须合作停止。                                                                                       |
| `ToolRunContext.deferContext`、`concludeTurn` | `(context: UserMessage) => void`、`() => void`                                                | 前者把附加上下文延到该结果之后，后者仅在成功结果上终结当前 turn；仅在确有任务语义时调用。                                  |
| `ToolRuntime.get`、`schemas`                  | `get(name, scope?)` 返回 `ToolDefinition \| undefined`；`schemas(scope?)` 返回 `ToolSchema[]` | 读取指定 scope 可见工具或模型 schema；不会返回另一 scope 的私有注册。                                                      |
| `ToolRuntime.execute`                         | `(exec: ToolExecutionInput) => Promise<ToolExecutionResult>`                                  | 直接运行规范 pipeline；`ToolExecutionInput` 要求 `callId`、`name`、`arguments`、`signal`，Agent 轮次由 loop 提供 `agent`。 |
| `ToolRuntime.guard`、`restrict`               | 注册后返回撤销函数                                                                            | guard 的拒绝不能被后续监听器撤销；restrict 只缩小继承的全局工具，对本 scope 自有工具无效。                                 |

`ToolExecutionResult` 是规范执行结果，成功分支携带规范 `value`，失败分支携带错误结果；两者还包含模型呈现内容。调用方须按结果分支处理，不能从文字反解析规范值。`ToolResult` 是 Host 呈现回调读取的已完成内容、`isError` 和可选 `meta`，不等于执行体返回值。

`dsh-tools.Config` 控制注册表默认执行模式和 PTC 并发上限。`DefineToolOptions.deferLoading` 决定工具 schema 是否延迟进入模型可见列表，须与路由策略一起使用。`ToolExecutionInput.parent` 与 `rootCallId` 标识 PTC 嵌套调用的父调用和根调用，不应由普通工具体虚构；Agent loop 负责传入。

## 生命周期与状态

工具注册绑定当前 Cordis scope；显式持有 disposer 的插件也可以提前撤销。Agent scope 中注册的工具只对相应 Agent 及子 scope 可见。`execute` 中开启的计时器、网络请求或子进程由工具实现负责跟踪并在取消及卸载时结束；registry 无法硬杀同进程代码。规范结果经 Agent loop 写入 Session 工具事件后可重放；`presentCall`/`presentResult` 只能从持久参数、内容和元数据重建呈现。

## 失败、权限与边界

无效参数在执行体前变成普通工具错误。预取消也产生错误结果，不执行工具体。`register()` 会同步拒绝缺失的 `output`、不支持的输出 schema、非正超时及保留名；注册冲突仍需按当前 scope 检查。权限插件可通过 `tools/pre-execute` 与 `guard` 拒绝调用；普通工具错误不会自动结束整个 Agent turn。异步执行中的取消是合作式的，不能把 `AbortSignal` 当作强制停止保证。

## 验证

对照目标版本的 `@deepseek-ai/dsh-tools` package exports、`src/index.ts`、`src/schema.ts`、`src/json-schema.ts` 及 `tests/tools.spec.ts`、`tests/schema.spec.ts` 审核签名和 pipeline。独立消费项目的 `greet` 示例已完成声明编译、打包、Profile 加载、直接工具调用、无效参数、预取消及移除后重启；Agent 轮次、Session 日志、模型可见结果、执行中取消和跨重启恢复尚未验证。以上路径的精确证据待写入 `maintenance/source-map.md`。
