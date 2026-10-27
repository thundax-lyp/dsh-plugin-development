# 注册模型工具并验证规范结果

## 注册并执行一个模型工具

相关对象：

- [DefineToolOptions](../api/api-core-dsh-tools-root-1.md#definetooloptions-公开契约)。
- [ToolExecutionInput](../api/api-core-dsh-tools-root-8.md#toolexecutioninput-公开契约)。
- [ToolExecutionResult](../api/api-core-dsh-tools-root-8.md#toolexecutionresult-公开契约)。
- [ToolRunContext](../api/api-core-dsh-tools-root-9.md#toolruncontext-公开契约)。
- [ToolRuntime](../api/api-core-dsh-tools-root-10.md#toolruntime-公开契约)。
- [defineTool](../api/api-core-dsh-tools-root-11.md#definetool-公开契约)。

目标：工具通过标准参数校验与执行链返回一份规范 JSON 结果，卸载时注册被撤销。适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

1. 查看 [ToolRuntime 与工具定义](../api/api-core-dsh-tools-root-overview.md) 和 [SystemPrompt](../api/api-core-dsh-system-prompt-root-overview.md)。插件声明 `inject = ['tools']`；最小组合要装载 `dsh-system-prompt` 和 `dsh-tools`，后者依赖前者。已有完整 profile 通常已提供它们，不能重复装载第二个同名 provider。
2. 按 [完整工具示例](../examples/example-core-tool.md) 创建公开包与 bundle。`defineTool` 由 `parameters` 推导 args，校验无效输入，在 `output.schema` 声明唯一规范结果；`execute` 只返回该值（执行局部的value本身不写入耐久事件，重放依赖content与meta），`output.render` 从参数和值纯转换为内容块，禁止再次读文件、访问网络或变更状态。
3. `ctx.tools.register` 的注册属于调用 fiber，卸载会撤销；需要临时提前移除时使用其返回 disposer。使用隔离的工具名，验证重复注册行为，不能用静默覆盖协调两个互不知情的插件。
4. 用真实 `ctx.tools.execute`、唯一 callId 和 AbortSignal 调用；检查参数错误不进入业务 execute，成功结果符合 output schema，并在 `tools/result` 中获得与调用结果一致的内容。若有 pre/guard/around/post 扩展，分别测试允许、拒绝和取消。异步 gate 必须观察 exec.signal，框架会等其 Promise 落定。
5. 停用插件后确认工具不可发现且不可调用，重新启用无重复。模型可见结果应由 Session 记录重建；内存缓存、独立 UI 状态或日志输出不能替代耐久事件。

完成判据：有效输入只执行一次，无效输入不产生业务副作用；取消不会返回伪成功；规范结果和渲染相符；卸载后注册消失。工具模式（native/PTC）影响模型调用入口，不能据工具已注册断言模型一定能直接调用它。

## 添加执行策略与纯展示投影

相关对象：

- [PostToolDecision](../api/api-core-dsh-tools-root-4.md#posttooldecision-公开契约)。
- [PreToolDecision](../api/api-core-dsh-tools-root-4.md#pretooldecision-公开契约)。
- [ToolCallView](../api/api-core-dsh-tools-root-7.md#toolcallview-公开契约)。
- [ToolExecution](../api/api-core-dsh-tools-root-7.md#toolexecution-公开契约)。
- [ToolGuard](../api/api-core-dsh-tools-root-8.md#toolguard-公开契约)。
- [ToolResultView](../api/api-core-dsh-tools-root-9.md#toolresultview-公开契约)。
- [ToolRuntime](../api/api-core-dsh-tools-root-10.md#toolruntime-公开契约)。

目标：策略控制真实调用和规范值，展示可从已记录事实重放，并且不同 UI 保持能力边界。

1. 核对 [工具与策略对象](../api/api-core-dsh-tools-root-overview.md)；使用 `tools/pre-execute` waterfall 做可重排 allow/deny/ask 策略，调用 next 才延续。安全不变量使用 `ctx.tools.guard(exec => reasonOrUndefined)`，同步 guard 只能增加拒绝，后续插件不能强制允许它已拒绝的调用。
2. `tools/execute` 包裹执行生命周期，只有 exec.signal 可替换；重试前判断副作用是否已经发生，未知结果不能机械重放。`tools/post-execute` 是显式结果变换；单改 content 仍保留程序访问 value，保密要求必须阻断或替换 value。`tools/result` 只观察不可变最终结果，observer 失败被包含，不能用它回滚已执行副作用。
3. `presentCall`、`presentResult` 与 output.presentationMeta 只能由 args、规范值/最终结果纯计算；禁止时钟、随机、I/O 或读取当前 Session。presentationMeta 持久保存有界结构事实，不能保存 React props 或另一个权威业务结果。
4. Native 卡片意图有 generic、terminal、diff 等；完成态还可表示 read/search/web。内置 Web Client 不读取 presentCall/presentResult：它从原始 tool/call、tool/result 与持久 meta 通过 keyed `tool.call.toolview` slot 派生 UI。只写 Host presenter 不会让 Web 自动出现专用卡片。
5. 测试拒绝不进入 execute，多个 guard 不会互相放行；policy 替代值仍被 output schema 校验；重放在没有旧内存资源时产生等价展示；畸形历史参数回退 generic 而非崩溃。卸载后 guard、waterfall 与 presenter 相关注册均撤销。

完成判据：PTC读取最终策略后的规范值，模型读取由该结果渲染的内容，敏感数据不因只改显示文案而留在 value，Web 专用卡片有真实 Client 注册与重放验证。

## 添加提示词段与动态上下文

相关对象：

- [Config](../api/api-core-dsh-system-prompt-root-1.md#config-公开契约)。
- [PromptAssembly](../api/api-core-dsh-system-prompt-root-1.md#promptassembly-公开契约)。
- [PromptContext](../api/api-core-dsh-system-prompt-root-1.md#promptcontext-公开契约)。
- [PromptSection](../api/api-core-dsh-system-prompt-root-2.md#promptsection-公开契约)。
- [SystemPrompt](../api/api-core-dsh-system-prompt-root-2.md#systemprompt-公开契约)。
- [renderPrompt](../api/api-core-dsh-system-prompt-root-3.md#renderprompt-公开契约)。

目标：给选定 Agent 添加有序指导或可刷新事实，不污染其他 Agent 的模型上下文。

1. 查询 [SystemPrompt](../api/api-core-dsh-system-prompt-root-overview.md) 并 inject systemPrompt。`section({name,order,text})` 提供静态或按上下文求值的段；顺序先有限 order 数值，再名称代码单元顺序。通过 agent.ctx 注册会遮蔽同名全局项，只影响该 Agent。
2. 动态运行时事实使用 context provider，变量用 `variable(name, resolver)` 注册后在模板 `{{name}}` 引用。text含字面模板花括号时设 interpolate:false。不能依赖不存在的内置 cwd 变量；工作目录由独立上下文 owner 提供。
3. complete:true 的有效段只能有一个，多个完整提示词使组装失败。toolOrder 必须恰有一个 `<unlisted-tools>` 标记且无重复；显式名称若未注册会使每次 assemble 失败。工具生产者通常交给 ToolRuntime 自动提供 schema，不再注册第二份。
4. `assemble()` 求值段、变量与工具，`renderPrompt()` 才进行严格插值；未知/无值/畸形变量在发送模型前失败。`refreshContext()` 在 pre-step 与路由准备之后刷新注册的动态事实，保留已接纳段、工具、变量与 waterfall 额外上下文。
5. suppressRuntimeContext 只移除作用域可选上下文，required贡献仍可见；卸载抑制器后恢复。对两个 Agent、未知变量、重复complete、缺工具名、卸载与刷新分别测试。

完成判据：作用域只覆盖目标 Agent，模型请求前能明确拒绝无效完整组合，取消或卸载不会遗留提示词注册。
