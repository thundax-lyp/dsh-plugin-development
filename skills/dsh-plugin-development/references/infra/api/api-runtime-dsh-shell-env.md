# @deepseek-ai/dsh-shell-env：Shell 命令、期限与持久执行句柄

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Shell 命令、期限与持久执行句柄任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-shell.md)。

## BashEnvContributor 契约

从 `@deepseek-ai/dsh-shell-env` 导入 `BashEnvContributor`。`BashEnvContributor` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface BashEnvContributor {
    name: string;
    variables: Readonly<Record<DshEnvironmentKey, BashEnvVariable>>;
    resolve(execution: ToolExecution): Readonly<Partial<Record<DshEnvironmentKey, string>>>;
}
```

成员检索：`name`、`resolve`、`variables`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## BashEnvVariable 契约

从 `@deepseek-ai/dsh-shell-env` 导入 `BashEnvVariable`。`BashEnvVariable` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface BashEnvVariable {
    description: string;
}
```

成员检索：`description`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## BashEnvVariableInfo 契约

从 `@deepseek-ai/dsh-shell-env` 导入 `BashEnvVariableInfo`。`BashEnvVariableInfo` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface BashEnvVariableInfo extends BashEnvVariable {
    contributor: string;
    key: DshEnvironmentKey;
}
```

成员检索：`contributor`、`description`、`key`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## Config 契约

从 `@deepseek-ai/dsh-shell-env` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    dshHome?: string;
}

export declare const Config: z<Config>;
```

成员检索：`dshHome`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## ShellEnvRegistry 契约

从 `@deepseek-ai/dsh-shell-env` 导入 `ShellEnvRegistry`。`ShellEnvRegistry` 是Shell 命令、期限与持久执行句柄的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class ShellEnvRegistry extends Service {
    constructor(ctx: Context, config?: Config);
    register(contributor: BashEnvContributor): () => void;
    collect(execution: ToolExecution): DshEnvironment;
    list(): BashEnvVariableInfo[];
}
```

成员检索：`collect`、`list`、`register`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-shell-env` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config?: Config): void;
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-shell-env` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-shell-env` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "shell-env";
```

本对象的注册/资源责任由[Shell 命令、期限与持久执行句柄](api-runtime-shell-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-shell.md)核对成功、拒绝与卸载结果。
