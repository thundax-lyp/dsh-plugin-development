# @deepseek-ai/dsh-web-app ./startup：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-web-app 选型与组合](api-core-dsh-web-app-startup-overview.md)。

运行 `dsh --profile web`，获得浏览器内的聊天、模型与设置管理以及会话历史，并与其他 dsh 表层共用同一套模型访问、工具与安全默认值。启动时会打印带 token 的 URL，通常还会在默认浏览器中打开；SSH 会话和 `--no-open` 需要手动打开。你可以更改端口、允许额外 authority、绑定一个具体的本机 IP，并用自己提供的证书直接提供 HTTPS；通配地址会被拒绝。跨机访问使用剥离前缀代理后公告的 HTTP(S) URL、监听器 TLS，或非 loopback 绑定上的明文 HTTP。一次性的命令行任务应使用 headless 配置。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## WEB_STARTUP_SERVICE 公开契约

导入入口：`@deepseek-ai/dsh-web-app/startup`；公开符号：`WEB_STARTUP_SERVICE`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const WEB_STARTUP_SERVICE = "webStartup";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## WebStartupValues 公开契约

导入入口：`@deepseek-ai/dsh-web-app/startup`；公开符号：`WebStartupValues`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface WebStartupValues {
    openBrowser: boolean;
    host?: string;
    port?: number;
    publicUrl?: string;
    trustedHosts: string[];
    tls?: TlsConfig;
}
```

成员检索：`host`、`openBrowser`、`port`、`publicUrl`、`tls`、`trustedHosts`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-web-app/startup`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-web-app/startup`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-web-app/startup`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "web-startup";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
