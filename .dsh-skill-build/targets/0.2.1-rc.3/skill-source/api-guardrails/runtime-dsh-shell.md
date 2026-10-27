# @deepseek-ai/dsh-shell：Shell 命令、期限与持久执行句柄

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Shell 命令、期限与持久执行句柄任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-shell.md)。

## CollectedOutput 契约

完整公开声明：

```text
export interface CollectedOutput {
    text: string;
    truncated: boolean;
    spillPath?: string;
}
```


从 `@deepseek-ai/dsh-shell` 导入 `CollectedOutput`。`CollectedOutput` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## DSH_ENV_PREFIX 契约

完整公开声明：

```text
export declare const DSH_ENV_PREFIX: "DSH_";
```


从 `@deepseek-ai/dsh-shell` 导入 `DSH_ENV_PREFIX`。`DSH_ENV_PREFIX` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## DshEnvironment 契约

完整公开声明：

```text
export type DshEnvironment = Readonly<Record<DshEnvironmentKey, string>>;
```


从 `@deepseek-ai/dsh-shell` 导入 `DshEnvironment`。`DshEnvironment` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## DshEnvironmentKey 契约

完整公开声明：

```text
export type DshEnvironmentKey = `${typeof DSH_ENV_PREFIX}${string}`;
```


从 `@deepseek-ai/dsh-shell` 导入 `DshEnvironmentKey`。`DshEnvironmentKey` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ParsedExitStatus 契约

从 `@deepseek-ai/dsh-shell` 导入 `ParsedExitStatus`。`ParsedExitStatus` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ParsedExitStatus = {
    body: string;
} & ({
    exitCode: number;
} | {
    signal: string;
});
```

成员检索：`body`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellExecRequest 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellExecRequest`。`ShellExecRequest` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ShellExecRequest {
    command: string;
    workdir?: string | undefined;
    timeoutMs?: number | undefined;
    onExpiry?: ShellExpiryPolicy | undefined;
    stdoutMaxBytes?: number | undefined;
    signal?: AbortSignal | undefined;
    stdin?: string | undefined;
    env?: Record<string, string> | undefined;
    dshEnv?: DshEnvironment | undefined;
    sandboxPolicy?: SandboxExecutionPolicy | undefined;
}
```

成员检索：`command`、`dshEnv`、`env`、`onExpiry`、`sandboxPolicy`、`signal`、`stdin`、`stdoutMaxBytes`、`timeoutMs`、`workdir`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellExecSpec 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellExecSpec`。`ShellExecSpec` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ShellExecSpec {
    command: string;
    workdir: string;
    timeoutMs: number;
    onExpiry: ShellExpiryPolicy;
    stdoutMaxBytes: number;
    signal?: AbortSignal | undefined;
    stdin?: string | undefined;
    env?: Record<string, string> | undefined;
    dshEnv?: DshEnvironment | undefined;
    sandboxPolicy: SandboxExecutionPolicy | undefined;
}
```

成员检索：`command`、`dshEnv`、`env`、`onExpiry`、`sandboxPolicy`、`signal`、`stdin`、`stdoutMaxBytes`、`timeoutMs`、`workdir`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellExecution 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellExecution`。`ShellExecution` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ShellExecution extends ShellProcess {
    result(): Promise<ShellRunResult>;
}
```

成员检索：`done`、`exitCode`、`kill`、`observed`、`readOutput`、`result`、`sandbox`、`signal`、`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellExecutor 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellExecutor`。ctx.shell 的抽象 provider；先 resolve 再 execute。普通非零退出/超时/abort 是描述性 result，基础设施失败才 reject；done 不 reject。

```text
export declare abstract class ShellExecutor extends Service {
    constructor(ctx: Context);
    get sandboxMode(): SandboxMode | undefined;
    abstract resolve(request: ShellExecRequest): ShellExecSpec;
    abstract execute(spec: ShellExecSpec): Promise<ShellExecution>;
}
```

成员检索：`execute`、`resolve`、`sandboxMode`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellExpiryPolicy 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellExpiryPolicy`。`ShellExpiryPolicy` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ShellExpiryPolicy = 'kill' | 'none';
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellProcess 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellProcess`。`ShellProcess` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ShellProcess {
    status: ShellProcessStatus;
    exitCode: number | null;
    signal: NodeJS.Signals | null;
    readonly done: Promise<void>;
    sandbox?: ShellSandboxInfo;
    readOutput(): ShellProcessRead;
    observed: ShellObservedStreams;
    kill(): boolean;
}
```

成员检索：`done`、`exitCode`、`kill`、`observed`、`readOutput`、`sandbox`、`signal`、`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellProcessRead 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellProcessRead`。`ShellProcessRead` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ShellProcessRead {
    delta: string;
    lossy: boolean;
    stdoutSpillPath?: string;
    stderrSpillPath?: string;
}
```

成员检索：`delta`、`lossy`、`stderrSpillPath`、`stdoutSpillPath`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellProcessStatus 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellProcessStatus`。`ShellProcessStatus` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ShellProcessStatus = 'running' | 'completed' | 'killed';
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellRunResult 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellRunResult`。`ShellRunResult` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ShellRunResult {
    exitCode: number | null;
    signal: NodeJS.Signals | null;
    timedOut: boolean;
    aborted: boolean;
    timeoutMs: number;
    stdout: CollectedOutput;
    stderr: CollectedOutput;
    sandbox?: ShellSandboxInfo;
}
```

成员检索：`aborted`、`exitCode`、`sandbox`、`signal`、`stderr`、`stdout`、`timedOut`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellSandboxInfo 契约

从 `@deepseek-ai/dsh-shell` 导入 `ShellSandboxInfo`。`ShellSandboxInfo` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ShellSandboxInfo {
    mode: SandboxMode;
    denied: boolean;
    enforcement?: SandboxEnforcement;
    runnerFailed?: boolean;
}
```

成员检索：`denied`、`enforcement`、`mode`、`runnerFailed`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## parseExitStatus 契约

从 `@deepseek-ai/dsh-shell` 导入 `parseExitStatus`。`parseExitStatus` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseExitStatus(text: string): ParsedExitStatus;
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。
