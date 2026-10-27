# @deepseek-ai/dsh-schedule./client：定时任务的声明与投递

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在定时任务的声明与投递任务中直接使用的对象。本子路径仅在 Client 编译面导入。

装配与公共失败边界见[定时任务的声明与投递](api-runtime-schedule-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-schedule.md)。

## ScheduleId 契约

从 `@deepseek-ai/dsh-schedule/client` 导入 `ScheduleId`。`ScheduleId` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleId = Branded<'ScheduleId'>;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。
