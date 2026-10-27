# @deepseek-ai/dsh-http-proxy：工具输出预算、取消期限与进程代理

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在工具输出预算、取消期限与进程代理任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-util.md)。

## ProxyRoute 契约

从 `@deepseek-ai/dsh-http-proxy` 导入 `ProxyRoute`。`ProxyRoute` 是工具输出预算、取消期限与进程代理的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ProxyRoute = {
    readonly proxied: true;
    readonly proxy: string;
    readonly dispatcher: Dispatcher;
} | {
    readonly proxied: false;
};
```

成员检索：`proxied`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## clearedProxyEnv 契约

从 `@deepseek-ai/dsh-http-proxy` 导入 `clearedProxyEnv`。`clearedProxyEnv` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function clearedProxyEnv(): Record<string, undefined>;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## installProxyFromEnvironment 契约

从 `@deepseek-ai/dsh-http-proxy` 导入 `installProxyFromEnvironment`。`installProxyFromEnvironment` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function installProxyFromEnvironment(env: EnvLookup, report: (message: string) => void): Promise<() => Promise<void>>;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## proxyEnvironmentForChild 契约

从 `@deepseek-ai/dsh-http-proxy` 导入 `proxyEnvironmentForChild`。`proxyEnvironmentForChild` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function proxyEnvironmentForChild(): Readonly<Record<string, string | undefined>>;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## proxyRouteFor 契约

从 `@deepseek-ai/dsh-http-proxy` 导入 `proxyRouteFor`。`proxyRouteFor` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function proxyRouteFor(url: URL): ProxyRoute;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。
