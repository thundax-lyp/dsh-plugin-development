# @deepseek-ai/dsh-api-remotes ./client：公开对象 12

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-client-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## SessionReferenceMentionCandidate 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`SessionReferenceMentionCandidate`。

公开声明签名：

```text
export interface SessionReferenceMentionCandidate extends SessionReferenceCandidate {
    mention: string;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `createdAt` | `createdAt: number;` | [SessionReferenceCandidate 权威声明](../../host/api/api-capabilities-dsh-session-reference.md#sessionreferencecandidate) |
| `cwd` | `cwd?: string;` | [SessionReferenceCandidate 权威声明](../../host/api/api-capabilities-dsh-session-reference.md#sessionreferencecandidate) |
| `displayTitle` | `displayTitle?: string;` | [SessionReferenceCandidate 权威声明](../../host/api/api-capabilities-dsh-session-reference.md#sessionreferencecandidate) |
| `label` | `label: string;` | [SessionReferenceCandidate 权威声明](../../host/api/api-capabilities-dsh-session-reference.md#sessionreferencecandidate) |
| `sameWorkspace` | `sameWorkspace: boolean;` | [SessionReferenceCandidate 权威声明](../../host/api/api-capabilities-dsh-session-reference.md#sessionreferencecandidate) |
| `sessionId` | `sessionId: SessionId;` | [SessionReferenceCandidate 权威声明](../../host/api/api-capabilities-dsh-session-reference.md#sessionreferencecandidate) |

## SettingsDescribeValue 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`SettingsDescribeValue`。

公开声明签名：

```text
export interface SettingsDescribeValue {
    writable: boolean;
    hasDocument: boolean;
    namespaces: SettingsNamespaceView[];
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SettingsNamespaceView 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`SettingsNamespaceView`。

公开声明签名：

```text
export interface SettingsNamespaceView {
    autoGenerate: boolean;
    ns: string;
    schema: JsonValue;
    value: JsonValue;
    base?: JsonValue;
    user?: JsonValue;
    applies: 'live';
    secrets: SettingsSecretView[];
    revision: number;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SettingsPathOpView 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`SettingsPathOpView`。

公开声明签名：

```text
export type SettingsPathOpView = {
    op: 'set';
    path: string[];
    value: JsonValue;
} | {
    op: 'unset';
    path: string[];
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SettingsSecretView 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`SettingsSecretView`。

公开声明签名：

```text
export interface SettingsSecretView {
    path: string[];
    set: boolean;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## StreamChunk 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`StreamChunk`。

公开声明签名：

```text
export type StreamChunk = {
    type: 'block-start';
    index: number;
    blockType: ContentBlockType;
} | {
    type: 'text-delta';
    index: number;
    text: string;
} | {
    type: 'reasoning-delta';
    index: number;
    text: string;
} | {
    type: 'tool-call-delta';
    index: number;
    id: ToolCallId;
    name?: string;
    argumentsDelta: string;
} | {
    type: 'block-end';
    index: number;
    block: ContentBlock;
} | {
    type: 'usage';
    usage: TokenUsage;
} | {
    type: 'finish';
    reason: FinishReason;
    replayState?: ReplayEnvelope;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): Promise<() => Promise<void>>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes/client`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
