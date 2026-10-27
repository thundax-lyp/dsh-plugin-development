# @deepseek-ai/cordis-plugin-loader .：公开对象 2

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis-plugin-loader 选型与组合](api-core-cordis-plugin-loader-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Loader 公开契约

导入入口：`@deepseek-ai/cordis-plugin-loader`；公开符号：`Loader`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare namespace Loader {
    interface Config {
        baseUrl?: string;
    }
    interface Intercept {
        await?: boolean;
    }
}

export declare class Loader extends EntryTree {
    config: Loader.Config;
    [Service.config]: Loader.Intercept;
    envData: any;
    name: string;
    internal: ModuleLoader | undefined;
    builtins: Dict<any>;
    constructor(ctx: Context, config?: Loader.Config);
    write(): void;
    [Service.check](): boolean;
    showLog(entry: Entry, type: string): void;
    locate(fiber?: Fiber): string | undefined;
    exit(): void;
    unwrapExports(exports: any): any;
}
```

成员检索：`builtins`、`config`、`envData`、`exit`、`internal`、`locate`、`name`、`showLog`、`unwrapExports`、`write`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
