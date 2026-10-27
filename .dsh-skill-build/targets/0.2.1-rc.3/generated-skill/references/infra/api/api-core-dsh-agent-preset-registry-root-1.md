# @deepseek-ai/dsh-agent-preset-registry .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-agent-preset-registry 选型与组合](api-core-dsh-agent-preset-registry-root-overview.md)。

通过声明式 preset 选择 Agent 的工具、提示词和技能。同一进程可以运行多种组合。配置失败会显示在列表中；现有 Agent 保留已经使用的组合。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## AgentPreset 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`AgentPreset`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentPreset {
    readonly id: string;
    readonly name?: string;
    readonly description?: string;
    readonly order?: number;
    readonly broken?: string;
}
```

成员检索：`broken`、`description`、`id`、`name`、`order`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## AgentPresetInspection 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`AgentPresetInspection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface AgentPresetInspection {
    readonly id: string;
    readonly modules: readonly {
        readonly moduleName: string;
        readonly baseUrl?: string;
        readonly useHostBase: boolean;
    }[];
    readonly leakedServices: readonly string[];
}
```

成员检索：`id`、`leakedServices`、`modules`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## AgentPresetRegistry 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`AgentPresetRegistry`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class AgentPresetRegistry extends TypertRemoteService {
    config: Config;
    static inject: string[];
    static Config: z<Schemastery.ObjectS<NoInfer<{
        default: z<string, string, "defined">;
        selectedDefault: z<string, string, "volatile">;
    }>>, Schemastery.ObjectT<NoInfer<{
        default: z<string, string, "defined">;
        selectedDefault: z<string, string, "volatile">;
    }>>, "plain">;
    constructor(ctx: Context, config: Config);
    get defaultId(): string;
    register(definition: PresetDefinition): Promise<() => Promise<void>>;
    inspectCompositions(ctx?: Context): AgentPresetInspection[];
    list(): Promise<AgentPreset[]>;
    remoteExportList(): Promise<AgentPresetRoster>;
    resolve(id?: string): Promise<AgentPreset>;
    readDocument(agentPreset: string): Promise<AgentPresetDocument>;
    mount(ctx: Context, id?: string): Promise<AgentPreset>;
    composeFrom(ctx: Context, parent: Context): string | undefined;
    composedPreset(ctx: Context): string | undefined;
    serviceFor<K extends string & keyof Context>(agent: {
        ctx: Context;
    }, name: K): Context[K] | undefined;
    recompose(ctx: Context, id: string): Promise<AgentPreset>;
    select(agent: Agent, agentPreset: string): Promise<string>;
    acquireScope(id?: string): Promise<{
        key: ScopeKey;
    } & AsyncDisposable>;
    compositionInventory(): Promise<AgentPresetComposition[]>;
}
```

成员检索：`acquireScope`、`composeFrom`、`composedPreset`、`compositionInventory`、`config`、`defaultId`、`inspectCompositions`、`list`、`mount`、`readDocument`、`recompose`、`register`、`remoteExportList`、`resolve`、`select`、`serviceFor`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    default: string;
    selectedDefault: Volatile<string | undefined>;
}
```

成员检索：`default`、`selectedDefault`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## PresetDefinition 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`PresetDefinition`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PresetDefinition {
    readonly id: string;
    readonly name?: string;
    readonly description?: string;
    readonly order?: number;
    readonly plugins: readonly (Omit<EntryOptions, 'id' | 'disabled'> & {
        id?: string;
        disabled?: EntryOptions['disabled'] | JsExpr;
    })[];
}
```

成员检索：`description`、`id`、`name`、`order`、`plugins`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## PresetMount 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`PresetMount`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface PresetMount {
    readonly presetId: string;
    readonly fiber: Fiber;
    readonly tree: EntryTree;
    readonly key: ScopeKey | undefined;
}
```

成员检索：`fiber`、`key`、`presetId`、`tree`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## RowAudit 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`RowAudit`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RowAudit {
    readonly failed: string[];
    readonly pending: string[];
}
```

成员检索：`failed`、`pending`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。

## agentPresetProjectionDefinition 公开契约

导入入口：`@deepseek-ai/dsh-agent-preset-registry`；公开符号：`agentPresetProjectionDefinition`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const agentPresetProjectionDefinition: {
    key: "agentPreset";
    stateSchema: z.ZodUnion<readonly [
        z.ZodString,
        z.ZodNull
    ]>;
    init: (header: import("@deepseek-ai/dsh-session").SessionHeader) => string | null;
    apply: (state: string | null, event: import("@deepseek-ai/dsh-session").SessionEvent) => string | null;
    wire: {
        viewSchema: z.ZodUnion<readonly [
            z.ZodString,
            z.ZodNull
        ]>;
        view: (state: string | null) => string | null;
    };
    stateVersion: number;
};
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#声明-agent-preset-并保留运行代际)。
