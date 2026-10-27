# @deepseek-ai/cordis-plugin-hmr .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/cordis-plugin-hmr 选型与组合](api-core-cordis-plugin-hmr-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## default 公开契约

导入入口：`@deepseek-ai/cordis-plugin-hmr`；公开符号：`default`。

公开声明签名：

```text
declare class Hmr extends Service {
    config: Hmr.Config;
    baseDir: string;
    constructor(ctx: Context, config: Hmr.Config);
    [Service.init](): AsyncGenerator<() => Promise<void>, void, unknown>;
    getOuterStack: () => string[];
    getLinked(url: string): Promise<string[]>;
}

declare namespace Hmr {
    interface Config extends ChokidarOptions {
        base?: string;
        root: string[];
        debounce: number;
        ignored: string[];
    }
    const Config: z<Config>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
