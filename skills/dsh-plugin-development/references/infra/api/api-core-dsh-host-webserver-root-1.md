# @deepseek-ai/dsh-host-webserver .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-webserver 选型与组合](api-core-dsh-host-webserver-root-overview.md)。

浏览器经由 `dsh-host-webserver` 通过 HTTP 访问 web GUI：一个 `node:http` 服务器——当 `tls` 指定证书与私钥时改用 `node:https`——其他插件在其中注册具名路由、upgrade 路由、index 启动输入与一个回退 handler。它不了解任何 harness 概念，也不提供任何文件服务——`/api` 桥接、插件 bundle、HMR（热模块替换）事件流与 SPA dist 都属于注册它们的插件。路由匹配顺序固定不变：先在整张表中匹配精确 route，再匹配最长前缀，最后交给回退 handler。它只服务浏览器；Electron 通过 `file://` 加载 dist，并经 IPC 桥接承载 fetch。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-host-webserver`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    host: string;
    port: number;
    tls?: TlsConfig;
    compression?: 'none' | 'gzip';
    compressionLevel?: number;
    compressionThresholdBytes?: number;
}
```

成员检索：`compression`、`compressionLevel`、`compressionThresholdBytes`、`host`、`port`、`tls`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## IndexInjection 公开契约

导入入口：`@deepseek-ai/dsh-host-webserver`；公开符号：`IndexInjection`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type IndexInjection = {
    kind: 'global';
    name: string;
    value: unknown;
} | {
    kind: 'script';
    placement: IndexInjectionPlacement;
    text: string;
} | {
    kind: 'script-src';
    placement: IndexInjectionPlacement;
    src: string;
} | {
    kind: 'script-preload';
    src: string;
} | {
    kind: 'style';
    text: string;
} | {
    kind: 'html';
    placement: IndexInjectionPlacement;
    html: string;
};
```

成员检索：`kind`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## IndexInjectionPlacement 公开契约

导入入口：`@deepseek-ai/dsh-host-webserver`；公开符号：`IndexInjectionPlacement`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type IndexInjectionPlacement = 'head' | 'body';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## TlsConfig 公开契约

导入入口：`@deepseek-ai/dsh-host-webserver`；公开符号：`TlsConfig`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface TlsConfig {
    certFile: string;
    keyFile: string;
}
```

成员检索：`certFile`、`keyFile`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## WebRoute 公开契约

导入入口：`@deepseek-ai/dsh-host-webserver`；公开符号：`WebRoute`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WebRoute {
    kind: WebRouteKind;
    path: string;
    handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
}
```

成员检索：`handler`、`kind`、`path`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## WebRouteKind 公开契约

导入入口：`@deepseek-ai/dsh-host-webserver`；公开符号：`WebRouteKind`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type WebRouteKind = 'exact' | 'prefix';
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## WebServer 公开契约

导入入口：`@deepseek-ai/dsh-host-webserver`；公开符号：`WebServer`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class WebServer extends Service {
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    get port(): number | undefined;
    get host(): Config['host'];
    get protocol(): 'http:' | 'https:';
    getOrigin(): string;
    register(route: WebRoute): () => void;
    registerUpgrade(route: WebUpgradeRoute): () => void;
    registerFallback(handler: WebRoute['handler']): () => void;
    tapIndex(transform: (html: string) => string): () => void;
    [Service.init](): Promise<void>;
    applyIndexTaps(html: string): string;
    collectIndexInjections(): IndexInjection[];
    renderIndex(html: string): string;
}
```

成员检索：`applyIndexTaps`、`collectIndexInjections`、`getOrigin`、`host`、`port`、`protocol`、`register`、`registerFallback`、`registerUpgrade`、`renderIndex`、`tapIndex`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## WebUpgradeRoute 公开契约

导入入口：`@deepseek-ai/dsh-host-webserver`；公开符号：`WebUpgradeRoute`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WebUpgradeRoute {
    path: string;
    handler: (req: IncomingMessage, socket: Duplex, head: Buffer) => void | Promise<void>;
}
```

成员检索：`handler`、`path`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
