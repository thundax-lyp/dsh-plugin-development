# @deepseek-ai/dsh-api-workspace-controller .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-workspace-controller 选型与组合](api-core-dsh-api-workspace-controller-root-overview.md)。

`@deepseek-ai/dsh-api-workspace-controller` 拥有 Host 的 `ctx.workspaceController` 服务和生成的 Client `ctx.remote.workspace` namespace。它的 Remote 方法负责创建、重命名、移除和重排 Workspace，在 Workspace 内重排 Session，归档与取消归档 Session，以及跟随完整的 Workspace 投影。当 Client 必须修改或跟随 Workspace 导航时，请通过 API 网关使用它。本包同时拥有 `ctx.directoryPickerController` 与生成的 `ctx.remote.directoryPicker` namespace，因为它承载的选目录 seam 是抽象的，自身从不作为 Loader entry。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    documentsDirectory?: string;
    documentsLookupTimeoutMs?: number;
}
```

成员检索：`documentsDirectory`、`documentsLookupTimeoutMs`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DirectoryEntry 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`DirectoryEntry`。

公开声明签名：

```text
export interface DirectoryEntry {
    name: string;
    path: string;
    hidden: boolean;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DirectoryListing 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`DirectoryListing`。

公开声明签名：

```text
export interface DirectoryListing {
    path: string;
    home: string;
    crumbs: DirectoryEntry[];
    entries: DirectoryEntry[];
    truncated: boolean;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## DirectoryPickerController 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`DirectoryPickerController`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class DirectoryPickerController extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    pick(signal: AbortSignal): Promise<string | null>;
    list(path: string | undefined, signal: AbortSignal): Promise<DirectoryListing>;
    createDirectory(path: string, name: string): Promise<string>;
}
```

成员检索：`createDirectory`、`list`、`pick`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionActivity 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`SessionActivity`。

公开声明签名：

```text
export interface SessionActivity {
    readonly kind: SessionActivityKind;
    readonly items?: readonly SessionActivityItem[];
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionActivityItem 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`SessionActivityItem`。

公开声明签名：

```text
export interface SessionActivityItem {
    readonly id: string;
    readonly label?: string;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionActivityKind 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`SessionActivityKind`。

公开声明签名：

```text
export type SessionActivityKind = keyof SessionActivityKindMap;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## SessionActivityKindMap 公开契约

导入入口：`@deepseek-ai/dsh-api-workspace-controller`；公开符号：`SessionActivityKindMap`。

公开声明签名：

声明来源包 `@deepseek-ai/dsh-workspace`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface SessionActivityKindMap {
}
```

声明来源包 `@deepseek-ai/dsh-agent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionActivityKindMap {
    turn: true;
}
```

声明来源包 `@deepseek-ai/dsh-subagent`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionActivityKindMap {
    subagent: true;
}
```

声明来源包 `@deepseek-ai/dsh-schedule`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionActivityKindMap {
    schedule: true;
}
```

声明来源包 `@deepseek-ai/dsh-jobs`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface SessionActivityKindMap {
    job: true;
}
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
