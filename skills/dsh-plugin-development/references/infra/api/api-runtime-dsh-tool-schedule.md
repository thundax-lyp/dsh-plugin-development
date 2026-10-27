# @deepseek-ai/dsh-tool-schedule：定时任务的声明与投递

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在定时任务的声明与投递任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[定时任务的声明与投递](api-runtime-schedule-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-schedule.md)。

## apply 契约

从 `@deepseek-ai/dsh-tool-schedule` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context): void;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-tool-schedule` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-tool-schedule` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "tool-schedule";
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。
