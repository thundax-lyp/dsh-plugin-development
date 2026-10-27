# @deepseek-ai/dsh-session-title./client：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。本子路径仅在 Client 编译面导入。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## SessionTitleProviderId 契约

从 `@deepseek-ai/dsh-session-title/client` 导入 `SessionTitleProviderId`。`SessionTitleProviderId` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionTitleProviderId = Branded<'SessionTitleProviderId'>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## TitleInputState 契约

从 `@deepseek-ai/dsh-session-title/client` 导入 `TitleInputState`。`TitleInputState` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface TitleInputState {
    readonly first: SessionTitleUserMessage | null;
    readonly count: number;
    readonly lastSeq: OptionalSessionSeq;
}
```

成员检索：`count`、`first`、`lastSeq`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
