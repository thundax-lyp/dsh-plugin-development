# @deepseek-ai/dsh-spill：大结果落盘与可检索定位符

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在大结果落盘与可检索定位符任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[大结果落盘与可检索定位符](api-runtime-spill-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-spill.md)。

## SaveTextSpill 契约

从 `@deepseek-ai/dsh-spill` 导入 `SaveTextSpill`。`SaveTextSpill` 是大结果落盘与可检索定位符的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SaveTextSpill {
    owner: SpillOwner;
    source: SpillSource;
    suggestedName: string;
    content: string;
}
```

成员检索：`content`、`owner`、`source`、`suggestedName`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SpillLocator 契约

从 `@deepseek-ai/dsh-spill` 导入 `SpillLocator`。`SpillLocator` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function SpillLocator(locator: string): SpillLocator;

export type SpillLocator = Branded<'SpillLocator'>;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SpillOwner 契约

从 `@deepseek-ai/dsh-spill` 导入 `SpillOwner`。`SpillOwner` 是大结果落盘与可检索定位符的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SpillOwner {
    sessionId: SessionId;
}
```

成员检索：`sessionId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SpillRef 契约

从 `@deepseek-ai/dsh-spill` 导入 `SpillRef`。`SpillRef` 是大结果落盘与可检索定位符的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SpillRef {
    locator: SpillLocator;
    bytes: number;
    retrievalHint: string;
}
```

成员检索：`bytes`、`locator`、`retrievalHint`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SpillSource 契约

从 `@deepseek-ai/dsh-spill` 导入 `SpillSource`。kind=tool 带 toolName/callId/label，kind=session-reference 带源 sessionId/label；它不是读取权限凭证。

```text
export type SpillSource = {
    kind: 'tool';
    toolName: string;
    callId: ToolCallId;
    label: string;
} | {
    kind: 'session-reference';
    sessionId: SessionId;
    label: string;
};
```

成员检索：`kind`、`label`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SpillStore 契约

从 `@deepseek-ai/dsh-spill` 导入 `SpillStore`。抽象 ctx.spillStore，只提供 saveText；后端保存全文并返回 locator/bytes/retrievalHint，消费者决定预览与降级。

```text
export declare abstract class SpillStore extends Service {
    constructor(ctx: Context);
    abstract saveText(input: SaveTextSpill): Promise<SpillRef>;
}
```

成员检索：`saveText`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。
