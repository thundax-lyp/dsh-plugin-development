# @deepseek-ai/dsh-hook-protocol 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-hook-protocol` 让两个桥接以相同方式处理你的钩子：它定义钩子能做什么、运行时会发生什么。你无需自行安装或配置它——选择 `dsh-hooks-claude-code` 或 `dsh-hooks-codex`，把它指向你现有的 `hooks.json`，这些规则就会作用于你的钩子。通过任一桥接，钩子都可以带一条模型可见的消息阻塞提示词或工具调用、向对话附加额外上下文，或请求运行停止。只有 command 钩子会运行；`http`、`mcp_tool`、`prompt` 与 `agent` handler 会被跳过并给出警告。

### 使用本包

你无需直接安装或配置本包——挂载 `dsh-hooks-claude-code` 或 `dsh-hooks-codex` 就会把这些规则应用到你的 `hooks.json` 钩子上。用本页了解钩子能做什么、运行时会发生什么；两个桥接页面列出各方言支持的事件。

#### 何时选择

当你持有现有的 Claude Code 或 Codex 钩子、希望它们在 agent（智能体）运行期间继续工作时，选择 `dsh-hooks-claude-code` 或 `dsh-hooks-codex`。你永远不会直接选择本包。没有参考工具对应物的定制行为请避开整个组：原生 Cordis 插件拥有完整的 harness API，无需中间的钩子协议。

#### 钩子能做什么

- **带消息阻塞操作**——退出码为 2 的钩子会停止提示词或工具调用，其错误输出会作为原因展示。
- **工具运行前请求确认**——Claude Code 钩子可以请求确认而非直接阻塞；Codex 桥接不呈现此选项。
- **附加上下文**——钩子可以返回额外文本，模型会在下一次请求中看到。
- **在选定时刻运行**——钩子配置按名称或 pattern 选择触发的事件；缺失、空或 `'*'` pattern 表示该类的每个事件。
- **失败不停止运行**——除 2 以外的任何退出码都是非阻塞失败：操作继续，失败被记录；完全无法启动的钩子按同样方式处理。
- **请求运行停止**——钩子可以请求运行停止（`{"continue": false}`）；该请求会被记录，但没有运行级效果（见已知限制）。

#### 钩子运行时你会看到什么

- 钩子阻塞时，操作不会发生，钩子的消息会被展示。
- 钩子附加上下文时，模型会在下一次请求中看到该文本。
- 失败的钩子——命令错误、崩溃或除 2 以外的任何退出码——会被记录，不会停止 agent。
- 如果钩子配置无法读取或解析，桥接会记录警告且不运行任何钩子；agent 仍会启动。
- 混合钩子类型的配置仍然可用：`http`、`mcp_tool`、`prompt` 与 `agent` handler 会被跳过并给出警告，其 command 钩子照常运行。

-----

### 已知限制与延期工作

这些限制描述钩子目前还无法通过共享引擎做到的事情。它们是当前包约束，而非任务积压。

- **折叠出的停止没有运行级效果**——`mergeHookOutputs` 把 `continue: false` 折叠为粘性 `stop`，但拦截点没有硬停止原语，因此桥接只记录该停止并保留 hook 的逐点效果。
- **只有 command 形态会运行**——协议只执行 `{ type: 'command', command, timeout? }`；桥接会解析并跳过其方言定义的其他形态（`http`、`mcp_tool`、`prompt`、`agent`）。

## CommandHook（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface CommandHook {
    command: string;
    timeoutSec?: number;
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`CommandHook`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`command`、`timeoutSec`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## DEFAULT_HOOK_TIMEOUT_MS（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`DEFAULT_HOOK_TIMEOUT_MS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_HOOK_TIMEOUT_MS = 600000;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## DEFAULT_STDERR_SUMMARY_MAX_CHARS（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`DEFAULT_STDERR_SUMMARY_MAX_CHARS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_STDERR_SUMMARY_MAX_CHARS = 500;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## DetachedRuns（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DetachedRuns {
    readonly signal: AbortSignal;
    track(run: Promise<unknown>): void;
    drain(): Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`DetachedRuns`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`drain`、`signal`、`track`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## HookDialect（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type HookDialect = 'claude-code' | 'codex';
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`HookDialect`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## HookInvocation（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HookInvocation {
    turn: number;
    point: string;
    dialect: HookDialect;
    handlerId: string;
    matcher?: string | undefined;
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`HookInvocation`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`dialect`、`handlerId`、`matcher`、`point`、`turn`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## HookOutput（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HookOutput {
    exitCode: number | undefined;
    stderr: string;
    stdout: string;
    continue?: boolean;
    stopReason?: string;
    decision?: 'approve' | 'allow' | 'block' | 'deny' | 'ask';
    reason?: string;
    hookEventName?: string;
    additionalContext?: string;
    systemMessage?: string;
    updatedInput?: Record<string, unknown>;
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`HookOutput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`additionalContext`、`continue`、`decision`、`exitCode`、`hookEventName`、`reason`、`stderr`、`stdout`、`stopReason`、`systemMessage`、`updatedInput`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## HookResultRecord（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface HookResultRecord {
    turn: number;
    point: string;
    handlerId: string;
    output: HookOutput;
    stderrSummaryMaxChars: number;
    durationMs: number;
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`HookResultRecord`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`durationMs`、`handlerId`、`output`、`point`、`stderrSummaryMaxChars`、`turn`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## MatcherGroup（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface MatcherGroup {
    matcher?: string;
    hooks: CommandHook[];
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`MatcherGroup`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`hooks`、`matcher`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## MatcherMode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type MatcherMode = 'claude-code' | 'codex';
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`MatcherMode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## MergedDecision（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type MergedDecision = 'allow' | 'ask' | 'deny' | 'none';
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`MergedDecision`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## MergedHookOutcome（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface MergedHookOutcome {
    decision: MergedDecision;
    reason?: string;
    stop: boolean;
    stopReason?: string;
    additionalContext: string[];
    systemMessages: string[];
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`MergedHookOutcome`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`additionalContext`、`decision`、`reason`、`stop`、`stopReason`、`systemMessages`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## RunHookOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface RunHookOptions {
    payload: unknown;
    env?: Record<string, string>;
    cwd?: string;
    readonly signal: AbortSignal;
    trailingNewline: boolean;
    defaultTimeoutMs: number;
    expectedEventName?: string;
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`RunHookOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`cwd`、`defaultTimeoutMs`、`env`、`expectedEventName`、`payload`、`signal`、`trailingNewline`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## RunHookResult（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface RunHookResult {
    output: HookOutput;
    durationMs: number;
}
```

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`RunHookResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`durationMs`、`output`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## appendHookInvoked（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`appendHookInvoked`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function appendHookInvoked(session: Session, invocation: HookInvocation): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## appendHookResult（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`appendHookResult`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function appendHookResult(session: Session, record: HookResultRecord): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## createDetachedRuns（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`createDetachedRuns`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function createDetachedRuns(): DetachedRuns;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## matcherDiagnostic（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`matcherDiagnostic`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function matcherDiagnostic(matcher: string | undefined, mode: MatcherMode): string | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## matchesMatcher（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`matchesMatcher`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function matchesMatcher(matcher: string | undefined, query: string, mode: MatcherMode): boolean;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## mergeHookOutputs（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`mergeHookOutputs`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function mergeHookOutputs(outputs: HookOutput[]): MergedHookOutcome;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## parseHookOutput（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`parseHookOutput`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function parseHookOutput(exitCode: number | undefined, stdout: string, stderr: string, expectedEventName?: string): HookOutput;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## runHook（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`runHook`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function runHook(bash: Pick<ShellExecutor, 'resolve' | 'execute'>, hook: CommandHook, options: RunHookOptions, now: () => number): Promise<RunHookResult>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## selectHookGroups（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`selectHookGroups`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function selectHookGroups(groups: readonly MatcherGroup[] | undefined, query: string, mode: MatcherMode): MatcherGroup[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## summarizeStderr（.）

公开导入：`@deepseek-ai/dsh-hook-protocol`；公开符号：`summarizeStderr`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function summarizeStderr(stderr: string, maxChars: number): string | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-hook-protocol.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
