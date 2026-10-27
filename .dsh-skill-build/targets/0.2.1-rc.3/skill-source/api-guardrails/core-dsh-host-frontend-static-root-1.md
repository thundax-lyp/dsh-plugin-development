# @deepseek-ai/dsh-host-frontend-static .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-host-frontend-static 选型与组合](api-core-dsh-host-frontend-static-root-overview.md)。

从配置的发布目录向浏览器提供已构建的 Web 壳。根路径与配置的 index 路径渲染包含启动信息的 index；已有资产直接提供，而缺失或非文件路径返回 404、路径遍历返回 403、不支持的方法返回 405。访问 index 需要有效的进程 token 或浏览器 cookie，但静态资产仍可公开访问。同一时间只能有一个实例处理未匹配的路由；第二个实例启动失败，卸载活动实例后，未匹配的请求返回 404。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## Config 公开契约

导入入口：`@deepseek-ai/dsh-host-frontend-static`；公开符号：`Config`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface Config {
    distIndex: string;
}

export declare const Config: z<Config>;
```

成员检索：`distIndex`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## apply 公开契约

导入入口：`@deepseek-ai/dsh-host-frontend-static`；公开符号：`apply`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function apply(ctx: Context, config: Config): void;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## inject 公开契约

导入入口：`@deepseek-ai/dsh-host-frontend-static`；公开符号：`inject`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const inject: string[];
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## name 公开契约

导入入口：`@deepseek-ai/dsh-host-frontend-static`；公开符号：`name`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare const name = "frontend-static";
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。

## serveStatic 公开契约

导入入口：`@deepseek-ai/dsh-host-frontend-static`；公开符号：`serveStatic`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare function serveStatic(pathname: string, res: ServerResponse, distRoot: string, distIndex: string, authorizeIndex: () => boolean, renderIndex: () => Promise<string>): Promise<void>;
```

这是独立值、函数或类型别名；没有本声明直接拥有的成员。调用函数时保留其泛型约束、参数顺序与返回值，不把类型名当成 Cordis 服务键。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力)。
