# PTC Runtime 的程序与 Host binding

## 目标与入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-ptc-runtime` 默认导出抽象 `PtcRuntime` 服务 `ctx.ptcRuntime`，公开 `PtcRunRequest`、`PtcRunSpec`、`PtcRunResult`、`PtcBindingNamespace` 等类型及跨语言命名保留集。已发布 `@deepseek-ai/dsh-ptc-runtime-node` 在新的受管 Node 进程运行可擦除 TypeScript。Host 插件可直接消费 `resolve/run`，向一次程序提供授权后的异步 JSON bindings；完整例见[运行带 Host binding 的程序](how-to-run-program-with-host-binding.md)。`dsh-tools` 的 PTC 模型模式和 `workflow-ptc` 是不同消费者，拥有自己的工具可见性、日志和授权规则。

## 请求、解析与结果

`PtcRuntime` 的 `resolve` 接受 `PtcRunRequest` 并形成 `PtcRunSpec`；`run` 返回 `PtcRunResult`。这些是运行期请求、已决议执行参数和程序结果三个不同对象，不能互相替代。

`resolve({program,bindings,cwd?,timeoutMs?,sandboxPolicy?,signal?})` 验证 provider 支持的选择，补齐执行世界绝对 cwd、数值或 null deadline 与权限策略，再把 `PtcRunSpec` 交给 `run(spec)`。语言由 `ptcRuntime.language` 描述，`isolation` 是 substrate 名称而非安全证明；`executionInstructions`、`timeout` 和 `sandboxMode` 给消费者展示当前 provider 的用法和可支持选项。Node provider 以异步函数体执行程序，允许顶层 `await`/`return`，每次运行隔离，不保留前次 JS 变量。

`PtcBindingNamespace` 的 `global` 是可移植标识符，不能使用 ECMAScript/Python 保留字或 runtime 保留全局；`functions` 以 JSON 参数和 lossless JSON 返回值跨边界。可选 `errorClass` 把某成员拒绝映射成程序可捕获的命名错误。绑定函数的 `args` 是 `unknown`，Host 必须对参数、调用者身份、作用域、并发、取消和返回值逐次校验；程序能调用绑定不代表已获准任意 Host 动作。

`PtcBindingFunction` 是 `(args: unknown) => Promise<PtcJsonValue>`；`PtcJsonValue` 只允许无损 JSON 值。可选 `PtcBindingErrorClass` 的 `name` 是程序侧构造器和 `Error.name`，`memberNameProperty` 指定携带成员名的字段；Host 不应把任意异常直接视作已声明的类型化拒绝。

`run()` 的程序级异常、超时、abort、worker-exit、invalid-output、output-limit、protocol、sandbox-unavailable 作为已解析结果中的 `error.kind` 返回，`value?` 是 lossless JSON，`logs` 是有界文本，`sandbox?` 分别报告模式、denied 和可能的 `full|partial` 强度。无效 spec、保留名或卸载后调用是契约误用，可 reject。调用方必须将供模型看的唯一规范工具 JSON 结果写入 Session 日志；运行时不负责 Session、工具注册或模型消息。日志与值不能隐式拼成多份冲突的工具结果。

`PtcRunFailure` 的 `kind` 是上述失败分类，`message` 供诊断或模型自修正，不等于可重试保证。`PtcRunSandbox` 的 `mode`、`denied` 和可选 `enforcement` 只描述本次执行的策略及观察，不应从 `denied: false` 推断完整文件隔离。

## 执行边界与恢复

Node provider 需要同一执行世界的 `ctx.fs`、`ctx.subprocess`、`ctx.sandbox`、`ctx.sandboxPolicy`，并由 Session projection 支撑策略。Node 直接 API 的文件效果受所选 OS sandbox 的实际 enforcement 限制；`danger-full-access` 不限制文件写入，不能因为进程隔离或空 `process.env` 就推断安全。`timeoutMs` 是总耗时预算，不是 CPU 或内存总量上限；取消会硬停程序，已在 Host 开始的 binding 工作由调用方另行结算。runtime fiber 卸载会终止并等待活动 run；结果和程序状态不由 runtime 持久化，恢复只能从已写的 Session 事实判断。

## 验证边界

隔离 npm rc.1 消费包实际装载 Node provider 及依赖、通过发布包 `process.js` 运行程序，验证 Host binding、类型化拒绝、JSON、空程序环境和程序异常。此 smoke 使用 `danger-full-access`，未验证 confinement、模型工具权限、Session 持久化、超时/取消和跨平台执行。
