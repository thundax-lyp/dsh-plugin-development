# @deepseek-ai/dsh-pwsh-sandbox：Shell 命令、期限与持久执行句柄

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Shell 命令、期限与持久执行句柄任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-shell.md)。

## Config 契约

从 `@deepseek-ai/dsh-pwsh-sandbox` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export type Config = LocalConfig;
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## SandboxPwshExecutor 契约

从 `@deepseek-ai/dsh-pwsh-sandbox` 导入 `SandboxPwshExecutor`。`SandboxPwshExecutor` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SandboxPwshExecutor extends PwshLocalExecutor {
    static inject: string[];
    constructor(ctx: Context, config: Config);
    get sandboxMode(): SandboxMode;
    resolve(request: ShellExecRequest): ShellExecSpec;
    execute(spec: ShellExecSpec): Promise<ShellExecution>;
}
```

成员检索：`execute`、`resolve`、`sandboxMode`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。
