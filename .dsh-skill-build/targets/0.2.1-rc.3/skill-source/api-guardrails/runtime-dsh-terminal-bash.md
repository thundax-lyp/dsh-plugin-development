# @deepseek-ai/dsh-terminal-bash：持久终端后端与会话

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在持久终端后端与会话任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[持久终端后端与会话](api-runtime-terminal-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-terminal.md)。

## BashTerminalBackend 契约

从 `@deepseek-ai/dsh-terminal-bash` 导入 `BashTerminalBackend`。`BashTerminalBackend` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class BashTerminalBackend implements TerminalBackend {
    readonly type: string;
    constructor(ctx: Context, config: ResolvedConfig, spawnTerminal?: (spec: SubprocessTerminalSpawnSpec) => Promise<SubprocessTerminalHandle>, createSession?: (terminal: SubprocessTerminalHandle, config: ResolvedConfig) => LocalPtySession);
    spawn(spec: TerminalBackendSpawnSpec): Promise<LocalPtySession>;
}
```

成员检索：`spawn`、`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## Config 契约

从 `@deepseek-ai/dsh-terminal-bash` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    backendType?: string;
    shellDialect?: ShellDialect;
    shellPath?: string;
    shellArgs?: string[];
    rows?: number;
    cols?: number;
    scrollbackLines?: number;
    scrollbackMaxBytes?: number;
    maxReadBytes?: number;
    pollIntervalMs?: number;
    exactProbeAfterMs?: number;
    idleSilenceMs?: number;
    handoffGraceMs?: number;
    promptTailGraceMs?: number;
    timeoutMs?: number;
    disposeGraceMs?: number;
}

export declare const Config: z<Config>;
```

成员检索：`backendType`、`cols`、`disposeGraceMs`、`exactProbeAfterMs`、`handoffGraceMs`、`idleSilenceMs`、`maxReadBytes`、`pollIntervalMs`、`promptTailGraceMs`、`rows`、`scrollbackLines`、`scrollbackMaxBytes`、`shellArgs`、`shellDialect`、`shellPath`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## PWSH_PROMPT_SETUP 契约

从 `@deepseek-ai/dsh-terminal-bash` 导入 `PWSH_PROMPT_SETUP`。`PWSH_PROMPT_SETUP` 是持久终端后端与会话的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const PWSH_PROMPT_SETUP: string;
```

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## TerminalLocalConfig 契约

完整公开声明：

```text
export interface Config {
    backendType?: string;
    shellDialect?: ShellDialect;
    shellPath?: string;
    shellArgs?: string[];
    rows?: number;
    cols?: number;
    scrollbackLines?: number;
    scrollbackMaxBytes?: number;
    maxReadBytes?: number;
    pollIntervalMs?: number;
    exactProbeAfterMs?: number;
    idleSilenceMs?: number;
    handoffGraceMs?: number;
    promptTailGraceMs?: number;
    timeoutMs?: number;
    disposeGraceMs?: number;
}

export declare const Config: z<Config>;
```


从 `@deepseek-ai/dsh-terminal-bash` 导入 `TerminalLocalConfig`。`TerminalLocalConfig` 是持久终端后端与会话的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

成员检索：`backendType`、`cols`、`disposeGraceMs`、`exactProbeAfterMs`、`handoffGraceMs`、`idleSilenceMs`、`maxReadBytes`、`pollIntervalMs`、`promptTailGraceMs`、`rows`、`scrollbackLines`、`scrollbackMaxBytes`、`shellArgs`、`shellDialect`、`shellPath`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-terminal-bash` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): void;
```

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-terminal-bash` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-terminal-bash` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "terminal-bash";
```

本对象的注册/资源责任由[持久终端后端与会话](api-runtime-terminal-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-terminal.md)核对成功、拒绝与卸载结果。
