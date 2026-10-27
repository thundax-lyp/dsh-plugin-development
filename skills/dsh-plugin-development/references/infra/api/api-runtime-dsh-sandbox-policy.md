# @deepseek-ai/dsh-sandbox-policy：沙箱能力、执行策略与升级审批

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在沙箱能力、执行策略与升级审批任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-sandbox.md)。

## Config 契约

从 `@deepseek-ai/dsh-sandbox-policy` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    mode?: SandboxMode;
    workspaceRoot?: string;
}
```

成员检索：`mode`、`workspaceRoot`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SANDBOX_MODES 契约

从 `@deepseek-ai/dsh-sandbox-policy` 导入 `SANDBOX_MODES`。`SANDBOX_MODES` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SANDBOX_MODES: readonly SandboxMode[];
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxPolicyRequest 契约

从 `@deepseek-ai/dsh-sandbox-policy` 导入 `SandboxPolicyRequest`。`SandboxPolicyRequest` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SandboxPolicyRequest {
    session?: Session;
    mode?: SandboxMode;
}
```

成员检索：`mode`、`session`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxPolicyService 契约

从 `@deepseek-ai/dsh-sandbox-policy` 导入 `SandboxPolicyService`。`SandboxPolicyService` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SandboxPolicyService extends Service {
    static Config: z<Config>;
    static inject: string[];
    readonly defaultMode: SandboxMode;
    readonly workspaceRoot: string;
    constructor(ctx: Context, config: Config);
    resolve(request?: SandboxPolicyRequest): SandboxExecutionPolicy;
    overrideOf(session: Session): SandboxMode | undefined;
}
```

成员检索：`defaultMode`、`overrideOf`、`resolve`、`workspaceRoot`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## setSandboxMode 契约

从 `@deepseek-ai/dsh-sandbox-policy` 导入 `setSandboxMode`。`setSandboxMode` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function setSandboxMode(session: Session, mode: SandboxMode): void;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。
