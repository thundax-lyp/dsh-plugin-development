# @deepseek-ai/dsh-schedule：定时任务的声明与投递

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在定时任务的声明与投递任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[定时任务的声明与投递](api-runtime-schedule-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-schedule.md)。

## AfterScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `AfterScheduleRecord`。`AfterScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AfterScheduleRecord {
    readonly id: ScheduleId;
    readonly kind: 'after';
    readonly title: string;
    readonly prompt: string;
    readonly afterSeconds: number;
    readonly scheduledAt: string;
}
```

成员检索：`afterSeconds`、`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## AtInput 契约

从 `@deepseek-ai/dsh-schedule` 导入 `AtInput`。`AtInput` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type AtInput = string | LocalAtInput;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## AtScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `AtScheduleRecord`。`AtScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AtScheduleRecord {
    readonly id: ScheduleId;
    readonly kind: 'at';
    readonly title: string;
    readonly prompt: string;
    readonly scheduledAt: string;
}
```

成员检索：`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## Config 契约

从 `@deepseek-ai/dsh-schedule` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    deliveryHistoryDays?: number;
    deliveryHistoryRecords?: number;
}
```

成员检索：`deliveryHistoryDays`、`deliveryHistoryRecords`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## CronInput 契约

从 `@deepseek-ai/dsh-schedule` 导入 `CronInput`。`CronInput` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CronInput {
    readonly expression: string;
    readonly time_zone: string;
}
```

成员检索：`expression`、`time_zone`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## CronScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `CronScheduleRecord`。`CronScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CronScheduleRecord {
    readonly id: ScheduleId;
    readonly kind: 'cron';
    readonly title: string;
    readonly prompt: string;
    readonly expression: string;
    readonly timeZone: string;
    readonly scheduledAt: string;
}
```

成员检索：`expression`、`id`、`kind`、`prompt`、`scheduledAt`、`timeZone`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## DailyInput 契约

从 `@deepseek-ai/dsh-schedule` 导入 `DailyInput`。`DailyInput` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DailyInput {
    readonly time: string;
    readonly time_zone: string;
}
```

成员检索：`time`、`time_zone`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## DailyScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `DailyScheduleRecord`。`DailyScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DailyScheduleRecord {
    readonly id: ScheduleId;
    readonly kind: 'daily';
    readonly title: string;
    readonly prompt: string;
    readonly time: string;
    readonly timeZone: string;
    readonly scheduledAt: string;
}
```

成员检索：`id`、`kind`、`prompt`、`scheduledAt`、`time`、`timeZone`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## DeliveryRetentionBounds 契约

从 `@deepseek-ai/dsh-schedule` 导入 `DeliveryRetentionBounds`。`DeliveryRetentionBounds` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface DeliveryRetentionBounds {
    readonly days: number;
    readonly records: number;
}
```

成员检索：`days`、`records`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## EveryScheduleDispatchChange 契约

从 `@deepseek-ai/dsh-schedule` 导入 `EveryScheduleDispatchChange`。`EveryScheduleDispatchChange` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface EveryScheduleDispatchChange {
    readonly version: 1;
    readonly operation: 'dispatch';
    readonly id: ScheduleId;
    readonly acceptedAt: string;
}
```

成员检索：`acceptedAt`、`id`、`operation`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## EveryScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `EveryScheduleRecord`。`EveryScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface EveryScheduleRecord {
    readonly id: ScheduleId;
    readonly kind: 'every';
    readonly title: string;
    readonly prompt: string;
    readonly everySeconds: number;
    readonly scheduledAt: string;
}
```

成员检索：`everySeconds`、`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## FrequencyTooHighError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `FrequencyTooHighError`。`FrequencyTooHighError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface FrequencyTooHighError {
    readonly code: 'frequency_too_high';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## InternalScheduleError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `InternalScheduleError`。`InternalScheduleError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface InternalScheduleError {
    readonly code: 'internal_error';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## InvalidPromptError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `InvalidPromptError`。`InvalidPromptError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface InvalidPromptError {
    readonly code: 'invalid_prompt';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## InvalidRuleError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `InvalidRuleError`。`InvalidRuleError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface InvalidRuleError {
    readonly code: 'invalid_rule';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## InvalidSelectorError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `InvalidSelectorError`。`InvalidSelectorError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface InvalidSelectorError {
    readonly code: 'invalid_selector';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## InvalidTimeZoneError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `InvalidTimeZoneError`。`InvalidTimeZoneError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface InvalidTimeZoneError {
    readonly code: 'invalid_time_zone';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## LegacyAfterScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `LegacyAfterScheduleRecord`。`LegacyAfterScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LegacyAfterScheduleRecord extends Omit<AfterScheduleRecord, 'title'> {
    readonly title?: string;
}
```

成员检索：`afterSeconds`、`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## LegacyAtScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `LegacyAtScheduleRecord`。`LegacyAtScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LegacyAtScheduleRecord extends Omit<AtScheduleRecord, 'title'> {
    readonly title?: string;
}
```

成员检索：`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## LegacyEveryScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `LegacyEveryScheduleRecord`。`LegacyEveryScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LegacyEveryScheduleRecord extends Omit<EveryScheduleRecord, 'title'> {
    readonly title?: string;
}
```

成员检索：`everySeconds`、`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## LegacyScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `LegacyScheduleRecord`。`LegacyScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type LegacyScheduleRecord = LegacyAfterScheduleRecord | LegacyAtScheduleRecord | LegacyEveryScheduleRecord;
```

成员检索：`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## LocalAtInput 契约

从 `@deepseek-ai/dsh-schedule` 导入 `LocalAtInput`。`LocalAtInput` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LocalAtInput {
    readonly date: string;
    readonly time: string;
    readonly time_zone: string;
}
```

成员检索：`date`、`time`、`time_zone`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## MAX_TITLE_LENGTH 契约

从 `@deepseek-ai/dsh-schedule` 导入 `MAX_TITLE_LENGTH`。`MAX_TITLE_LENGTH` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const MAX_TITLE_LENGTH = 120;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## MIN_EVERY_INTERVAL_SECONDS 契约

从 `@deepseek-ai/dsh-schedule` 导入 `MIN_EVERY_INTERVAL_SECONDS`。`MIN_EVERY_INTERVAL_SECONDS` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const MIN_EVERY_INTERVAL_SECONDS = 60;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## NotFutureError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `NotFutureError`。`NotFutureError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface NotFutureError {
    readonly code: 'not_future';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## OneShotScheduleDispatchChange 契约

从 `@deepseek-ai/dsh-schedule` 导入 `OneShotScheduleDispatchChange`。`OneShotScheduleDispatchChange` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface OneShotScheduleDispatchChange {
    readonly version: 1;
    readonly operation: 'dispatch';
    readonly id: ScheduleId;
}
```

成员检索：`id`、`operation`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## OneShotScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `OneShotScheduleRecord`。`OneShotScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type OneShotScheduleRecord = AfterScheduleRecord | AtScheduleRecord;
```

成员检索：`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## REQUIRED_TITLE_MESSAGE 契约

从 `@deepseek-ai/dsh-schedule` 导入 `REQUIRED_TITLE_MESSAGE`。`REQUIRED_TITLE_MESSAGE` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const REQUIRED_TITLE_MESSAGE = "title is required and must be non-empty after trimming.";
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## RecurringOccurrence 契约

从 `@deepseek-ai/dsh-schedule` 导入 `RecurringOccurrence`。`RecurringOccurrence` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface RecurringOccurrence {
    readonly occurrenceAt: string;
    readonly nextScheduledAt?: string;
}
```

成员检索：`nextScheduledAt`、`occurrenceAt`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## RecurringScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `RecurringScheduleRecord`。`RecurringScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type RecurringScheduleRecord = EveryScheduleRecord | DailyScheduleRecord | WeeklyScheduleRecord | CronScheduleRecord;
```

成员检索：`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## SCHEDULE_CHANGE_VERSION 契约

从 `@deepseek-ai/dsh-schedule` 导入 `SCHEDULE_CHANGE_VERSION`。`SCHEDULE_CHANGE_VERSION` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SCHEDULE_CHANGE_VERSION: 1;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleCatalogEntry 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleCatalogEntry`。`ScheduleCatalogEntry` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleCatalogEntry = ScheduleRecord & {
    readonly sessionId: SessionId;
    readonly status: 'active' | 'inactive';
    readonly lastDelivery?: ScheduleDeliveryReceipt;
};
```

成员检索：`id`、`kind`、`lastDelivery`、`prompt`、`scheduledAt`、`sessionId`、`status`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleChange 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleChange`。`ScheduleChange` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleChange = ScheduleCreateChange | ScheduleDeleteChange | ScheduleDispatchChange;
```

成员检索：`operation`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleCreateChange 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleCreateChange`。`ScheduleCreateChange` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleCreateChange {
    readonly version: 1;
    readonly operation: 'create';
    readonly schedule: LegacyScheduleRecord;
}
```

成员检索：`operation`、`schedule`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleCreateRequest 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleCreateRequest`。`ScheduleCreateRequest` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleCreateRequest {
    prompt: string;
    title: string;
    after_seconds?: number;
    at?: AtInput;
    every_seconds?: number;
    daily?: DailyInput;
    weekly?: WeeklyInput;
    cron?: CronInput;
}
```

成员检索：`after_seconds`、`at`、`cron`、`daily`、`every_seconds`、`prompt`、`title`、`weekly`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleCreateValue 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleCreateValue`。`ScheduleCreateValue` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleCreateValue = ScheduleView | ScheduleToolError;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeleteChange 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeleteChange`。`ScheduleDeleteChange` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleDeleteChange {
    readonly version: 1;
    readonly operation: 'delete';
    readonly id: ScheduleId;
}
```

成员检索：`id`、`operation`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeleteRequest 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeleteRequest`。`ScheduleDeleteRequest` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleDeleteRequest extends ScheduleListRequest {
    id: ScheduleId;
}
```

成员检索：`id`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeleteResult 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeleteResult`。`ScheduleDeleteResult` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleDeleteResult = {
    readonly id: ScheduleId;
    readonly deleted: true;
} | {
    readonly id: ScheduleId;
    readonly deleted: false;
    readonly code: 'schedule_not_found';
};
```

成员检索：`deleted`、`id`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeleteValue 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeleteValue`。`ScheduleDeleteValue` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleDeleteValue = ScheduleDeleteResult | ScheduleToolError;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeliveryHistoryRequest 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeliveryHistoryRequest`。`ScheduleDeliveryHistoryRequest` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleDeliveryHistoryRequest extends ScheduleDeleteRequest {
    limit: number;
    before?: MessageId;
}
```

成员检索：`before`、`id`、`limit`、`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeliveryHistoryResult 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeliveryHistoryResult`。`ScheduleDeliveryHistoryResult` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleDeliveryHistoryResult = {
    readonly id: ScheduleId;
    readonly records: ScheduleDeliveryRecord[];
    readonly earlierRecordsUnavailable: boolean;
    readonly earlierRecordsPruned: boolean;
    readonly retention: DeliveryRetentionBounds;
    readonly nextBefore?: MessageId;
} | {
    readonly id: ScheduleId;
    readonly code: 'schedule_not_found' | 'delivery_cursor_not_found';
};
```

成员检索：`id`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeliveryMode 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeliveryMode`。`ScheduleDeliveryMode` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleDeliveryMode = 'host';
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeliveryReceipt 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeliveryReceipt`。`ScheduleDeliveryReceipt` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleDeliveryReceipt {
    readonly scheduledAt: string;
    readonly deliveredAt: string;
    readonly messageId: MessageId;
}
```

成员检索：`deliveredAt`、`messageId`、`scheduledAt`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDeliveryRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDeliveryRecord`。`ScheduleDeliveryRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleDeliveryRecord extends ScheduleDeliveryReceipt {
    readonly prompt?: string;
}
```

成员检索：`deliveredAt`、`messageId`、`prompt`、`scheduledAt`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleDispatchChange 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleDispatchChange`。`ScheduleDispatchChange` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleDispatchChange = OneShotScheduleDispatchChange | EveryScheduleDispatchChange;
```

成员检索：`id`、`operation`、`version`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleId 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleId`。`ScheduleId` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function ScheduleId(value: string): ScheduleIdType;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleInputError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleInputError`。`ScheduleInputError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class ScheduleInputError extends Error {
    readonly code: 'invalid_prompt' | 'invalid_selector' | 'invalid_rule' | 'invalid_time_zone' | 'not_future' | 'time_out_of_range' | 'frequency_too_high' | 'subagent_session';
    constructor(code: 'invalid_prompt' | 'invalid_selector' | 'invalid_rule' | 'invalid_time_zone' | 'not_future' | 'time_out_of_range' | 'frequency_too_high' | 'subagent_session', message: string, options?: ErrorOptions);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleListRequest 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleListRequest`。`ScheduleListRequest` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleListRequest {
    sessionId: SessionId;
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleListValue 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleListValue`。`ScheduleListValue` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleListValue = ScheduleView[] | ScheduleToolError;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleLogError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleLogError`。`ScheduleLogError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class ScheduleLogError extends Error {
    readonly code: "corrupt_schedule_log";
    constructor(message: string);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleRecord`。`ScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleRecord = OneShotScheduleRecord | RecurringScheduleRecord;
```

成员检索：`id`、`kind`、`prompt`、`scheduledAt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleService 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleService`。`ScheduleService` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class ScheduleService extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    [Service.init](): Promise<void>;
    create(sessionId: SessionId, request: ScheduleCreateRequest, signal?: AbortSignal): Promise<ScheduleRecord>;
    list(request: ScheduleListRequest): Promise<ScheduleRecord[]>;
    catalog(): Promise<ScheduleCatalogEntry[]>;
    history(request: ScheduleDeliveryHistoryRequest): Promise<ScheduleDeliveryHistoryResult>;
    delete(request: ScheduleDeleteRequest, signal?: AbortSignal): Promise<ScheduleDeleteResult>;
    update(request: ScheduleUpdateRequest, signal?: AbortSignal): Promise<ScheduleUpdateResult>;
}
```

成员检索：`catalog`、`create`、`delete`、`history`、`list`、`update`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleState 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleState`。`ScheduleState` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleState = 'scheduled' | 'overdue';
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleTask 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleTask`。`ScheduleTask` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleTask = z.infer<typeof scheduleTaskSchema>;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `deliveryHistory` | `deliveryHistory: z.ZodOptional<z.ZodObject<{ records: z.ZodArray<z.ZodObject<{ scheduledAt: z.ZodISODateTime; deliveredAt: z.ZodISODateTime; messageId: z.ZodPipe<z.ZodString, z.ZodTransform<MessageId, string>>; prompt: z.ZodOptional<z.ZodString>; }, z.core.$strict>>; earlierRecordsUnavailable: z.ZodBoolean; earlierRecordsPruned: z.ZodOptional<z.ZodBoolean>; }, z.core.$strict>>;` | 来自上述类型组合的公开分支 |
| `lastDelivery` | `lastDelivery: z.ZodOptional<z.ZodObject<{ scheduledAt: z.ZodISODateTime; deliveredAt: z.ZodISODateTime; messageId: z.ZodPipe<z.ZodString, z.ZodTransform<MessageId, string>>; }, z.core.$strict>>;` | 来自上述类型组合的公开分支 |
| `record` | `record: z.ZodPipe<z.ZodUnknown, z.ZodTransform<import("./types.ts").AfterScheduleRecord \| import("./types.ts").AtScheduleRecord \| import("./types.ts").EveryScheduleRecord \| import("./types.ts").DailyScheduleRecord \| import("./types.ts").WeeklyScheduleRecord \| import("./types.ts").CronScheduleRecord, unknown>>;` | 来自上述类型组合的公开分支 |
| `sessionId` | `sessionId: z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>;` | 来自上述类型组合的公开分支 |
| `status` | `status: z.ZodDefault<z.ZodEnum<{ active: "active"; inactive: "inactive"; }>>;` | 来自上述类型组合的公开分支 |

## ScheduleTimingChange 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleTimingChange`。`ScheduleTimingChange` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleTimingChange = {
    readonly kind: 'at';
    readonly at: AtInput;
} | {
    readonly kind: 'every';
    readonly every_seconds: number;
} | {
    readonly kind: 'daily';
    readonly daily: DailyInput;
} | {
    readonly kind: 'weekly';
    readonly weekly: WeeklyInput;
} | {
    readonly kind: 'cron';
    readonly cron: CronInput;
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleToolError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleToolError`。`ScheduleToolError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleToolError = InvalidPromptError | InvalidSelectorError | InvalidRuleError | InvalidTimeZoneError | NotFutureError | TimeOutOfRangeError | FrequencyTooHighError | SubagentSessionError | InternalScheduleError;
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleUpdateContent 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleUpdateContent`。`ScheduleUpdateContent` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleUpdateContent {
    readonly title?: string;
    readonly prompt?: string;
}
```

成员检索：`prompt`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleUpdateMiss 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleUpdateMiss`。`ScheduleUpdateMiss` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleUpdateMiss {
    readonly id: ScheduleId;
    readonly updated: false;
    readonly code: 'schedule_not_found' | 'schedule_ended' | 'schedule_conflict';
}
```

成员检索：`code`、`id`、`updated`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleUpdateRequest 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleUpdateRequest`。`ScheduleUpdateRequest` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ScheduleUpdateRequest extends ScheduleDeleteRequest, ScheduleUpdateContent {
    readonly expected: ScheduleRecord;
    readonly change?: ScheduleTimingChange;
}
```

成员检索：`change`、`expected`、`id`、`prompt`、`sessionId`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleUpdateResult 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleUpdateResult`。`ScheduleUpdateResult` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleUpdateResult = {
    readonly id: ScheduleId;
    readonly updated: boolean;
    readonly record: ScheduleRecord;
} | ScheduleUpdateMiss | ScheduleToolError;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleUpdateValue 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleUpdateValue`。`ScheduleUpdateValue` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleUpdateValue = ScheduleView | ScheduleUpdateMiss | ScheduleToolError;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## ScheduleView 契约

从 `@deepseek-ai/dsh-schedule` 导入 `ScheduleView`。`ScheduleView` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type ScheduleView = ScheduleRecord & {
    readonly state: ScheduleState;
    readonly deliveryMode: ScheduleDeliveryMode;
};
```

成员检索：`deliveryMode`、`id`、`kind`、`prompt`、`scheduledAt`、`state`、`title`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## SubagentSessionError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `SubagentSessionError`。`SubagentSessionError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SubagentSessionError {
    readonly code: 'subagent_session';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## TimeOutOfRangeError 契约

从 `@deepseek-ai/dsh-schedule` 导入 `TimeOutOfRangeError`。`TimeOutOfRangeError` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TimeOutOfRangeError {
    readonly code: 'time_out_of_range';
    readonly message: string;
}
```

成员检索：`code`、`message`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## WeeklyInput 契约

从 `@deepseek-ai/dsh-schedule` 导入 `WeeklyInput`。`WeeklyInput` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WeeklyInput {
    readonly time: string;
    readonly time_zone: string;
    readonly weekdays: number[];
}
```

成员检索：`time`、`time_zone`、`weekdays`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## WeeklyScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `WeeklyScheduleRecord`。`WeeklyScheduleRecord` 是定时任务的声明与投递的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WeeklyScheduleRecord {
    readonly id: ScheduleId;
    readonly kind: 'weekly';
    readonly title: string;
    readonly prompt: string;
    readonly time: string;
    readonly timeZone: string;
    readonly weekdays: number[];
    readonly scheduledAt: string;
}
```

成员检索：`id`、`kind`、`prompt`、`scheduledAt`、`time`、`timeZone`、`title`、`weekdays`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## canonicalizeCronExpression 契约

从 `@deepseek-ai/dsh-schedule` 导入 `canonicalizeCronExpression`。`canonicalizeCronExpression` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function canonicalizeCronExpression(expression: string): string;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## createAfterScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `createAfterScheduleRecord`。`createAfterScheduleRecord` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createAfterScheduleRecord(id: ScheduleIdType, prompt: string, afterSeconds: number, now: number, title: string): AfterScheduleRecord;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## createAtScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `createAtScheduleRecord`。`createAtScheduleRecord` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createAtScheduleRecord(id: ScheduleIdType, prompt: string, at: AtInput, now: number, title: string): AtScheduleRecord;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## createCronScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `createCronScheduleRecord`。`createCronScheduleRecord` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createCronScheduleRecord(id: ScheduleIdType, prompt: string, cron: CronInput, now: number, title: string): CronScheduleRecord;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## createDailyScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `createDailyScheduleRecord`。`createDailyScheduleRecord` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createDailyScheduleRecord(id: ScheduleIdType, prompt: string, daily: DailyInput, now: number, title: string): DailyScheduleRecord;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## createEveryScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `createEveryScheduleRecord`。`createEveryScheduleRecord` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createEveryScheduleRecord(id: ScheduleIdType, prompt: string, everySeconds: number, now: number, title: string): EveryScheduleRecord;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## createWeeklyScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `createWeeklyScheduleRecord`。`createWeeklyScheduleRecord` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createWeeklyScheduleRecord(id: ScheduleIdType, prompt: string, weekly: WeeklyInput, now: number, title: string): WeeklyScheduleRecord;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## decodeScheduleChange 契约

从 `@deepseek-ai/dsh-schedule` 导入 `decodeScheduleChange`。`decodeScheduleChange` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function decodeScheduleChange(value: unknown): ScheduleChange;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## decodeScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `decodeScheduleRecord`。`decodeScheduleRecord` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function decodeScheduleRecord(value: unknown): ScheduleRecord;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## foldScheduleEvents 契约

从 `@deepseek-ai/dsh-schedule` 导入 `foldScheduleEvents`。`foldScheduleEvents` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function foldScheduleEvents(events: readonly SessionEvent[], inheritedEventCount?: SessionLogOffsetType): FoldedSchedules;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## isRecurringScheduleRecord 契约

从 `@deepseek-ai/dsh-schedule` 导入 `isRecurringScheduleRecord`。`isRecurringScheduleRecord` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isRecurringScheduleRecord(record: ScheduleRecord): record is RecurringScheduleRecord;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## normalizeWeekdays 契约

从 `@deepseek-ai/dsh-schedule` 导入 `normalizeWeekdays`。`normalizeWeekdays` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function normalizeWeekdays(weekdays: unknown): number[];
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## parseCronInput 契约

从 `@deepseek-ai/dsh-schedule` 导入 `parseCronInput`。`parseCronInput` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseCronInput(cron: CronInput): {
    readonly expression: string;
    readonly timeZone: string;
};
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## parseWeeklyInput 契约

从 `@deepseek-ai/dsh-schedule` 导入 `parseWeeklyInput`。`parseWeeklyInput` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseWeeklyInput(weekly: WeeklyInput): {
    readonly time: string;
    readonly timeZone: string;
    readonly weekdays: number[];
};
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## renderRecurringReminderBatchFraming 契约

从 `@deepseek-ai/dsh-schedule` 导入 `renderRecurringReminderBatchFraming`。`renderRecurringReminderBatchFraming` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function renderRecurringReminderBatchFraming(reminders: readonly {
    readonly record: RecurringScheduleRecord;
    readonly occurrenceAt: string;
}[]): string;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## renderReminderFraming 契约

从 `@deepseek-ai/dsh-schedule` 导入 `renderReminderFraming`。`renderReminderFraming` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function renderReminderFraming(record: OneShotScheduleRecord): string;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## resolveCronOccurrence 契约

从 `@deepseek-ai/dsh-schedule` 导入 `resolveCronOccurrence`。`resolveCronOccurrence` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveCronOccurrence(record: CronScheduleRecord, acceptedAt: number): RecurringOccurrence;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## resolveDailyOccurrence 契约

从 `@deepseek-ai/dsh-schedule` 导入 `resolveDailyOccurrence`。`resolveDailyOccurrence` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveDailyOccurrence(record: DailyScheduleRecord, acceptedAt: number): RecurringOccurrence;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## resolveEveryOccurrence 契约

从 `@deepseek-ai/dsh-schedule` 导入 `resolveEveryOccurrence`。`resolveEveryOccurrence` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveEveryOccurrence(record: EveryOccurrenceInput, acceptedAt: number): RecurringOccurrence;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## resolveRecurringOccurrence 契约

从 `@deepseek-ai/dsh-schedule` 导入 `resolveRecurringOccurrence`。`resolveRecurringOccurrence` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveRecurringOccurrence(record: RecurringScheduleRecord, acceptedAt: number): RecurringOccurrence;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## resolveWeeklyOccurrence 契约

从 `@deepseek-ai/dsh-schedule` 导入 `resolveWeeklyOccurrence`。`resolveWeeklyOccurrence` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveWeeklyOccurrence(record: WeeklyScheduleRecord, acceptedAt: number): RecurringOccurrence;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## scheduleDomain 契约

从 `@deepseek-ai/dsh-schedule` 导入 `scheduleDomain`。`scheduleDomain` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const scheduleDomain: {
    name: string;
    version: number;
    tables: {
        tasks: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<ScheduleId, {
            sessionId: SessionId;
            record: import("./types.ts").AfterScheduleRecord | import("./types.ts").AtScheduleRecord | import("./types.ts").EveryScheduleRecord | import("./types.ts").DailyScheduleRecord | import("./types.ts").WeeklyScheduleRecord | import("./types.ts").CronScheduleRecord;
            status: "active" | "inactive";
            lastDelivery?: {
                scheduledAt: string;
                deliveredAt: string;
                messageId: MessageId;
            } | undefined;
            deliveryHistory?: {
                records: {
                    scheduledAt: string;
                    deliveredAt: string;
                    messageId: MessageId;
                    prompt?: string | undefined;
                }[];
                earlierRecordsUnavailable: boolean;
                earlierRecordsPruned?: boolean | undefined;
            } | undefined;
        }>;
    };
};
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## scheduleTitle 契约

从 `@deepseek-ai/dsh-schedule` 导入 `scheduleTitle`。`scheduleTitle` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function scheduleTitle(title: string): string;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## scheduleView 契约

从 `@deepseek-ai/dsh-schedule` 导入 `scheduleView`。`scheduleView` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function scheduleView(record: ScheduleRecord, now: number): ScheduleView;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。

## weeklyTime 契约

从 `@deepseek-ai/dsh-schedule` 导入 `weeklyTime`。`weeklyTime` 是定时任务的声明与投递的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function weeklyTime(value: string): Temporal.PlainTime;
```

本对象的注册/资源责任由[定时任务的声明与投递](api-runtime-schedule-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-schedule.md)核对成功、拒绝与卸载结果。
