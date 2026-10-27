# @deepseek-ai/dsh-api-remotes .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-remotes 选型与组合](api-core-dsh-api-remotes-root-overview.md)。

为本应用选定的 Host Remote 能力提供双侧 BFF。Host 入口拥有转发事件名单并向 API Gateway 注册应用事件 source；Client 入口以运行时值形式导入生成的 `/remote` 产物，通过 `ctx.remote.$mount()` 挂载每项贡献，并重新导出对应的声明合并。Client 业务包依赖该外观，而不依赖 Gateway 实现或单独的 Remote 运行时入口。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## API_REMOTE_FORWARDED_EVENTS 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes`；公开符号：`API_REMOTE_FORWARDED_EVENTS`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const API_REMOTE_FORWARDED_EVENTS: readonly [
    {
        readonly event: "agent-preset/selected";
        readonly mode: "emit";
    },
    {
        readonly event: "approval/request";
        readonly mode: "waterfall";
    },
    {
        readonly event: "api-session/activity";
        readonly mode: "emit";
        readonly resources: {
            readonly session: (sessionId: SessionId) => SessionId;
        };
    },
    {
        readonly event: "api-session/added";
        readonly mode: "emit";
        readonly resources: {
            readonly session: (summary: import("@deepseek-ai/dsh-api-session-controller/types").SessionSummary) => SessionId;
        };
    },
    {
        readonly event: "api-session/error";
        readonly mode: "emit";
        readonly resources: {
            readonly session: (sessionId: SessionId) => SessionId;
        };
    },
    {
        readonly event: "api-session/removed";
        readonly mode: "emit";
        readonly resources: {
            readonly session: (sessionId: SessionId) => SessionId;
        };
    },
    {
        readonly event: "api-session/status";
        readonly mode: "emit";
        readonly resources: {
            readonly session: (sessionId: SessionId) => SessionId;
        };
    },
    {
        readonly event: "commands/change";
        readonly mode: "emit";
    },
    {
        readonly event: "deepseek-account/session-expired";
        readonly mode: "emit";
    },
    {
        readonly event: "deepseek-account/model-sign-in-required";
        readonly mode: "emit";
    },
    {
        readonly event: "credentials/record-updated";
        readonly mode: "emit";
    },
    {
        readonly event: "credentials/reference-updated";
        readonly mode: "emit";
    },
    {
        readonly event: "goal/activation-changed";
        readonly mode: "emit";
    },
    {
        readonly event: "cordis/request-run";
        readonly mode: "emit";
    },
    {
        readonly event: "cordis/request-run-resolved";
        readonly mode: "emit";
    },
    {
        readonly event: "cordis/dynamic-package";
        readonly mode: "emit";
    },
    {
        readonly event: "cordis/dynamic-retract";
        readonly mode: "emit";
    },
    {
        readonly event: "cordis/inspect-query";
        readonly mode: "emit";
    },
    {
        readonly event: "cordis/inspect-query-resolved";
        readonly mode: "emit";
    },
    {
        readonly event: "llm/adapters-updated";
        readonly mode: "emit";
    },
    {
        readonly event: "permission-presets/catalog-changed";
        readonly mode: "emit";
    },
    {
        readonly event: "plugin-manager/changed";
        readonly mode: "emit";
    },
    {
        readonly event: "plugin-manager/install-log";
        readonly mode: "emit";
    },
    {
        readonly event: "plugin-manager/install-state";
        readonly mode: "emit";
    },
    {
        readonly event: "plugin-market/changed";
        readonly mode: "emit";
    },
    {
        readonly event: "settings/document-updated";
        readonly mode: "emit";
    },
    {
        readonly event: "schedule/changed";
        readonly mode: "emit";
    },
    {
        readonly event: "user-questions/request";
        readonly mode: "waterfall";
    }
];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## ApiRemoteForwardedEvent 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes`；公开符号：`ApiRemoteForwardedEvent`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type ApiRemoteForwardedEvent = typeof API_REMOTE_FORWARDED_EVENTS[number]['event'];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-api-remotes`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
