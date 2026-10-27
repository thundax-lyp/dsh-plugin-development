# @deepseek-ai/dsh-sandbox-local：沙箱能力、执行策略与升级审批

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在沙箱能力、执行策略与升级审批任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-sandbox.md)。

## Config 契约

从 `@deepseek-ai/dsh-sandbox-local` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    runnerCommand?: string[];
    runnerFailureSignatures?: string[];
    probeTimeoutMs?: number;
}
```

成员检索：`probeTimeoutMs`、`runnerCommand`、`runnerFailureSignatures`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## LocalSandboxProvider 契约

从 `@deepseek-ai/dsh-sandbox-local` 导入 `LocalSandboxProvider`。`LocalSandboxProvider` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LocalSandboxProvider extends SandboxProvider {
    static Config: z<Config>;
    internals: SandboxInternals;
    constructor(ctx: Context, config: Config);
    confine(argv: readonly string[], policy: SandboxPolicy, signal?: AbortSignal): Promise<ConfinedArgv>;
}
```

成员检索：`confine`、`internals`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxInternals 契约

从 `@deepseek-ai/dsh-sandbox-local` 导入 `SandboxInternals`。`SandboxInternals` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SandboxInternals {
    platform?: string;
    chain?: readonly SelectedRunner['runner'][];
    probeBwrap?: () => boolean;
    probeLandlock?: (launcher: string) => SandboxEnforcement | 'unusable';
    probeSeatbelt?: (seatbeltExec: string) => boolean;
    landlockLauncher?: string;
    seatbeltExec?: string;
    windowsAclRunnerArgs?: string[];
    windowsAclRunnerEntry?: string;
    probeWindowsAcl?: () => boolean;
    rmTempDir?: (path: string) => void;
}
```

成员检索：`chain`、`landlockLauncher`、`platform`、`probeBwrap`、`probeLandlock`、`probeSeatbelt`、`probeWindowsAcl`、`rmTempDir`、`seatbeltExec`、`windowsAclRunnerArgs`、`windowsAclRunnerEntry`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。
