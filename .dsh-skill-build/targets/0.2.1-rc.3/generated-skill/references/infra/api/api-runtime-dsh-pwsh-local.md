# @deepseek-ai/dsh-pwsh-local：Shell 命令、期限与持久执行句柄

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Shell 命令、期限与持久执行句柄任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-shell.md)。

## Config 契约

从 `@deepseek-ai/dsh-pwsh-local` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    cwd: Volatile<string | undefined>;
    timeoutMs: Volatile<number>;
    maxTimeoutMs: Volatile<number>;
    maxOutputBytes: Volatile<number>;
    maxSpillBytes: Volatile<number>;
    graceMs: Volatile<number>;
    pwshPath: Volatile<string | undefined>;
}
```

成员检索：`cwd`、`graceMs`、`maxOutputBytes`、`maxSpillBytes`、`maxTimeoutMs`、`pwshPath`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ENCODING_PREAMBLE 契约

从 `@deepseek-ai/dsh-pwsh-local` 导入 `ENCODING_PREAMBLE`。`ENCODING_PREAMBLE` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const ENCODING_PREAMBLE = "[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false); $OutputEncoding = [System.Text.UTF8Encoding]::new($false); ";
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ENV_OVERRIDES 契约

从 `@deepseek-ai/dsh-pwsh-local` 导入 `ENV_OVERRIDES`。`ENV_OVERRIDES` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const ENV_OVERRIDES: {
    readonly NO_COLOR: "1";
    readonly PAGER: "cat";
    readonly GIT_PAGER: "cat";
};
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## PwshLocalExecutor 契约

从 `@deepseek-ai/dsh-pwsh-local` 导入 `PwshLocalExecutor`。`PwshLocalExecutor` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class PwshLocalExecutor extends ShellExecutor {
    readonly config: Config;
    static inject: string[];
    static Config: z<Schemastery.ObjectS<NoInfer<{
        cwd: z<string, string, "volatile">;
        timeoutMs: z<number, number, "volatile-defined">;
        maxTimeoutMs: z<number, number, "volatile-defined">;
        maxOutputBytes: z<number, number, "volatile-defined">;
        maxSpillBytes: z<number, number, "volatile-defined">;
        graceMs: z<number, number, "volatile-defined">;
        pwshPath: z<string, string, "volatile">;
    }>>, Schemastery.ObjectT<NoInfer<{
        cwd: z<string, string, "volatile">;
        timeoutMs: z<number, number, "volatile-defined">;
        maxTimeoutMs: z<number, number, "volatile-defined">;
        maxOutputBytes: z<number, number, "volatile-defined">;
        maxSpillBytes: z<number, number, "volatile-defined">;
        graceMs: z<number, number, "volatile-defined">;
        pwshPath: z<string, string, "volatile">;
    }>>, "plain">;
    get pwshPath(): string;
    constructor(ctx: Context, config: Config);
    resolve(request: ShellExecRequest): ShellExecSpec;
    execute(spec: ShellExecSpec): Promise<ShellExecution>;
}
```

成员检索：`config`、`execute`、`pwshPath`、`resolve`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## assertServiceablePwshConfig 契约

从 `@deepseek-ai/dsh-pwsh-local` 导入 `assertServiceablePwshConfig`。`assertServiceablePwshConfig` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function assertServiceablePwshConfig(config: Config): void;
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## candidatePwshPaths 契约

从 `@deepseek-ai/dsh-pwsh-local` 导入 `candidatePwshPaths`。`candidatePwshPaths` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function candidatePwshPaths(env?: NodeJS.ProcessEnv): string[];
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## resolvePwshPath 契约

从 `@deepseek-ai/dsh-pwsh-local` 导入 `resolvePwshPath`。`resolvePwshPath` 是Shell 命令、期限与持久执行句柄的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolvePwshPath(configured?: string, env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform): string;
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。
