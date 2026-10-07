# 插件消费测试支持包

## 目标和公开入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。下列五个包均发布 `0.2.0-rc.1`，并以包根导出；它们是不同测试层级的辅助包，需按插件所在的 Host、Client 或完整 Profile 选择。一个可独立运行的 `@deepseek-ai/dsh-remote-mock` 例子见[测试 Client Remote 调用](how-to-test-client-remote-call.md)。

| 包                                     | 插件作者可用的测试任务                                                                                                                                                                                                                                                        | 边界                                                                                                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@deepseek-ai/dsh-agent-loop-testkit`  | Host AgentLoop 插件的服务装载及真实 Agent/Inbox 驱动。`mountAgentLoopTestDependencies` 装载前置服务，`mountAgentLoopTestHarness` 装载生产 AgentLoop；调用方先装适配器和有顺序要求的插件，再调用 `create`/`claim`。见[测试 AgentLoop Inbox](how-to-test-agent-loop-inbox.md)。 | 调用方保有 Context、适配器、Agent 和清理责任；它不替代模型适配器、Session 断言或权限测试。                                                                                    |
| `@deepseek-ai/dsh-client-test-runtime` | 目标源码 workspace 的 Vitest/jsdom Client UI 插件测试：`SlotTestRuntime.create` 提供真实 Slots/renderer 及 Session、Workspace、Remote 测试替身；`TestClient` 是更完整的 web roster 测试层。该源码 workspace 的测试方式由包内测试示例展示。                                    | 独立 npm 消费包编译通过，但 Vitest 因发布物引用缺失的 renderer `src/client/bind.ts` 而收集失败；当前不能把它标为已验证的独立消费路径。每例应调用 `dispose`。                  |
| `@deepseek-ai/dsh-loader-smoke`        | 已有 app bin 和真实 Loader 配置时，用 `runLoaderSmoke` 在隔离 cwd/`DSH_HOME`/`DSH_AGENTS_HOME` 启动进程，检查 stdout/stderr、退出码和世界状态。需在实际 Profile 项目内配置。                                                                                                  | 需要实际可启动的配置；默认关闭 stdin，测试本身不为插件生成 Profile，也不证明交互式浏览器。                                                                                    |
| `@deepseek-ai/dsh-remote-mock`         | Client Remote 调用的端点响应、错误、流脚本、取消及遗漏请求断言。`RemoteMock.create`、`unary`、`stream`、`mock.rpc`、`log`、`assertNoUnmatched` 是主要入口。                                                                                                                   | `mock.rpc` 是解码后的进程内 `ClientConnectionRpc`；它不是 HTTP/WebSocket、真实 Host、浏览器或权限边界。没有生成的 Typert namespace map 时，`mock.remote` 类型会退化为 `any`。 |
| `@deepseek-ai/dsh-session-snapshot`    | ACP Session 日志的场景、规范化、持久化文件名和快照夹具；只在已有 ACP e2e/snapshot corpus 的发布兼容性测试中使用。                                                                                                                                                             | 包根导入 `suite.ts`，它导入 Vitest；还需 ACP 可执行环境、录制场景和预期快照。普通插件功能测试不建立这套发布快照体系，故本 Skill 不设独立通用任务。                            |
| `@deepseek-ai/dsh-llm-mock-server`     | 本地 Messages HTTP/SSE 故障脚本，`startMockLlmServer({sequence,...})` 返回 `baseURL`、`requests`、`close()`；可用于自有 LLM 适配器的失败与重试测试。见[测试 LLM 适配器故障](how-to-test-llm-adapter-faults.md)。                                                              | 服务不执行适配器策略；顺序脚本、随机权重和请求日志只证明 mock wire 行为，调用方另断言适配器结果。                                                                             |
| `@deepseek-ai/dsh-llm-replay`          | 从录制 Session 与 sidecar 重建模型流，服务于 keyless 快照 corpus。                                                                                                                                                                                                            | 依赖历史 Session 格式、脚本次序和覆盖 sidecar；只作快照回放设施，不作为一般插件单元测试或 live provider 模板。                                                                |

`AgentLoopTestDependenciesOptions` 可提供 `systemPrompt` 和 `tools` 依赖覆盖，避免测试隐式继承全局服务。`MockLlmServerOptions` 的 `sequence`、`host`、`port`、`retryAfterMs` 等字段定义本地 HTTP/SSE 脚本；默认仅监听测试地址。`MockLlmServer.port` 是实际绑定端口，`baseURL` 可交给待测 Adapter，结束时必须 `await close()`。

## Remote mock 组合和清理

`mock.unary(endpoint, rule)` 登记单次响应规则，`mock.stream(endpoint, script)` 登记流脚本。`mock.rpc.call(channel, endpoint, { args })` 与 Client Connection carrier 同形；响应规则使用 `{ ok: true, value }` 或 `{ ok: false, error: { code, message, details } }`。规则处理器得到位置参数，不包含尾部 `AbortSignal`。完整 Client 测试可将 `mock.rpc` 作为 Connection 的 `transport.rpc`；Node 独立测试可把它注入仅依赖 `ClientConnectionRpc` 的调用逻辑。每例创建新 mock，结束时调用 `assertNoUnmatched()`；流例还须使打开的流结束或取消，释放 Client/Context 所属资源。

`mock.log` 记录经 carrier 的调用，`mock.remote` 原生 Vitest spy 也记录直接 proxy 调用；二者观察面不同。缺失规则会失败并记入 unmatched，不能用缺省成功掩盖新端点。`RemoteMock.create` 自带 `$events` ready 流以供完整 Client 装载；纯 RPC 单测不会打开它。

| 公开流脚本辅助                                  | 测试作者的用法与清理                                                                                      |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `frames(items)`                                 | 依次送出给定帧并结束流。                                                                                  |
| `openStream(initial?)`                          | 送出初始帧后保持打开；测试必须通过 `StreamHandle.end()`/`fail(error)` 或取消结束。                        |
| `StreamScript` / `StreamHandle`                 | 脚本得到端点参数与 handle；`push`、`end`、`fail` 控制下行，`signal` 反映取消，`uplink` 供双向流测试读取。 |
| `streamHandle(source)` / `streamMethod(method)` | 将测试用异步迭代器包装成生成 Client 方法期望的流 handle；包装的 uplink 方法为空操作，不验证真实双向发送。 |

## 验证边界

独立 npm 消费者已编译并实际调用 `mock.rpc` 的成功与失败 envelope，断言端点请求并通过 `assertNoUnmatched`。另有独立消费者运行 `agent-loop-testkit` 的 Agent/Inbox 和 `llm-mock-server` 的 429→SSE 成功脚本；后者未调用真实适配器。Client runtime 独立包编译通过但 Vitest 装载失败。已观察到发布的 `@deepseek-ai/dsh-client-connection/client` 运行时入口是浏览器 bundle，不能在 Node 中直接 import 其 `installConnection`；其声明虽公开，不构成 Node 可运行证据。未运行真实 Loader/Profile、ACP 快照和浏览器测试。
