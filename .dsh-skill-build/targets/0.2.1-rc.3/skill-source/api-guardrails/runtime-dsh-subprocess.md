# @deepseek-ai/dsh-subprocess：受管理子进程与原始输出

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在受管理子进程与原始输出任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[受管理子进程与原始输出](api-runtime-subprocess-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-subprocess.md)。

## CollectedOutput 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `CollectedOutput`。`CollectedOutput` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CollectedOutput {
    text: string;
    truncated: boolean;
    spillPath?: string;
}
```

成员检索：`spillPath`、`text`、`truncated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## DSH_ENV_PREFIX 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `DSH_ENV_PREFIX`。`DSH_ENV_PREFIX` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DSH_ENV_PREFIX: "DSH_";
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## DshEnvironment 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `DshEnvironment`。`DshEnvironment` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type DshEnvironment = Readonly<Record<DshEnvironmentKey, string>>;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## DshEnvironmentKey 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `DshEnvironmentKey`。`DshEnvironmentKey` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type DshEnvironmentKey = `${typeof DSH_ENV_PREFIX}${string}`;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SENSITIVE_ENV_PATTERN 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SENSITIVE_ENV_PATTERN`。`SENSITIVE_ENV_PATTERN` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SENSITIVE_ENV_PATTERN: RegExp;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessCollect 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessCollect`。`SubprocessCollect` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessCollect {
    maxBytes: number;
    spill?: {
        maxBytes: number;
    };
}
```

成员检索：`maxBytes`、`spill`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessCollectedOutputs 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessCollectedOutputs`。`SubprocessCollectedOutputs` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessCollectedOutputs {
    readonly stdout?: SubprocessOutputReader;
    readonly stderr?: SubprocessOutputReader;
}
```

成员检索：`stderr`、`stdout`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessExecutableNotFoundError 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessExecutableNotFoundError`。`SubprocessExecutableNotFoundError` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare class SubprocessExecutableNotFoundError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessHandle 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessHandle`。`SubprocessHandle` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessHandle {
    readonly stdin: Writable | undefined;
    readonly stdout: Readable | undefined;
    readonly stderr: Readable | undefined;
    readonly control: Duplex | undefined;
    readonly collected: SubprocessCollectedOutputs;
    readonly done: Promise<SubprocessOutcome>;
    terminate(): void;
    waitForExit(signal?: AbortSignal): Promise<boolean>;
}
```

成员检索：`collected`、`control`、`done`、`stderr`、`stdin`、`stdout`、`terminate`、`waitForExit`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessOutcome 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessOutcome`。`SubprocessOutcome` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessOutcome {
    exitCode: number | null;
    signal: NodeJS.Signals | null;
}
```

成员检索：`exitCode`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessOutputMode 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessOutputMode`。`SubprocessOutputMode` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SubprocessOutputMode = 'pipe' | 'inherit' | SubprocessCollect;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessOutputRead 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessOutputRead`。`SubprocessOutputRead` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessOutputRead {
    text: string;
    nextOffset: number;
    lossy: boolean;
    spillPath?: string;
}
```

成员检索：`lossy`、`nextOffset`、`spillPath`、`text`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessOutputReader 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessOutputReader`。`SubprocessOutputReader` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessOutputReader {
    readFrom(fromByte: number): SubprocessOutputRead;
}
```

成员检索：`readFrom`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessRuntime 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessRuntime`。ctx.subprocess 定义执行世界原语，调用者提供完整 spawn spec；handle 发布后取消要等待 waitForExit/终止结算，不能仅发 signal 就释放资源。

```text
export declare abstract class SubprocessRuntime extends Service {
    constructor(ctx: Context);
    abstract resolveExecutable(command: string, env?: Readonly<Record<string, string>>, signal?: AbortSignal): Promise<string>;
    abstract terminalEnvironment(signal?: AbortSignal): Promise<SubprocessTerminalEnvironment>;
    abstract spawn(spec: SubprocessSpawnSpec): SubprocessHandle;
    abstract spawnTerminal(spec: SubprocessTerminalSpawnSpec): Promise<SubprocessTerminalHandle>;
}
```

成员检索：`resolveExecutable`、`spawn`、`spawnTerminal`、`terminalEnvironment`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessSpawnSpec 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessSpawnSpec`。`SubprocessSpawnSpec` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessSpawnSpec {
    argv: readonly string[];
    cwd: string;
    stdio: SubprocessStdio;
    graceMs: number;
    signal?: AbortSignal | undefined;
    env?: NodeJS.ProcessEnv | undefined;
}
```

成员检索：`argv`、`cwd`、`env`、`graceMs`、`signal`、`stdio`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessStdinMode 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessStdinMode`。`SubprocessStdinMode` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SubprocessStdinMode = 'ignore' | 'pipe' | {
    readonly data: string;
};
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessStdio 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessStdio`。`SubprocessStdio` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessStdio {
    stdin: SubprocessStdinMode;
    stdout: SubprocessOutputMode;
    stderr: SubprocessOutputMode;
    control?: 'pipe';
}
```

成员检索：`control`、`stderr`、`stdin`、`stdout`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessTerminalActivity 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessTerminalActivity`。`SubprocessTerminalActivity` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessTerminalActivity {
    state: 'idle' | 'busy' | 'unknown';
    revision: number;
}
```

成员检索：`revision`、`state`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessTerminalEnvironment 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessTerminalEnvironment`。`SubprocessTerminalEnvironment` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessTerminalEnvironment {
    platform: 'posix' | 'windows';
    defaultShell?: string;
}
```

成员检索：`defaultShell`、`platform`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessTerminalForeground 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessTerminalForeground`。`SubprocessTerminalForeground` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessTerminalForeground {
    processGroupId: number;
    inputWaiting: boolean;
}
```

成员检索：`inputWaiting`、`processGroupId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessTerminalHandle 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessTerminalHandle`。`SubprocessTerminalHandle` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessTerminalHandle {
    readonly pid: number;
    readonly output: Readable;
    readonly done: Promise<SubprocessOutcome>;
    write(data: string): Promise<void>;
    resize(cols: number, rows: number): Promise<void>;
    inspectForeground(): Promise<SubprocessTerminalForeground | undefined>;
    inspectActivity(): Promise<SubprocessTerminalActivity>;
    signalForeground(signal: SubprocessTerminalSignal): Promise<number>;
    terminate(): Promise<void>;
}
```

成员检索：`done`、`inspectActivity`、`inspectForeground`、`output`、`pid`、`resize`、`signalForeground`、`terminate`、`write`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessTerminalSignal 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessTerminalSignal`。`SubprocessTerminalSignal` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SubprocessTerminalSignal = 'SIGINT' | 'SIGTERM' | 'SIGKILL' | 'SIGTSTP' | 'SIGHUP';
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SubprocessTerminalSpawnSpec 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `SubprocessTerminalSpawnSpec`。`SubprocessTerminalSpawnSpec` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubprocessTerminalSpawnSpec {
    argv: readonly string[];
    cwd: string;
    env?: Record<string, string> | undefined;
    rows: number;
    cols: number;
    terminalType: string;
    shellActivity?: boolean | undefined;
    graceMs: number;
    signal?: AbortSignal | undefined;
}
```

成员检索：`argv`、`cols`、`cwd`、`env`、`graceMs`、`rows`、`shellActivity`、`signal`、`terminalType`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## scrubbedParentEnv 契约

从 `@deepseek-ai/dsh-subprocess` 导入 `scrubbedParentEnv`。`scrubbedParentEnv` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function scrubbedParentEnv(): Record<string, string>;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。
