# @deepseek-ai/dsh-session-title-llm：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## ResolvedSessionTitleLlmConfig 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `ResolvedSessionTitleLlmConfig`。`ResolvedSessionTitleLlmConfig` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ResolvedSessionTitleLlmConfig extends SessionTitleLlmConfig {
}
```

成员检索：`maxInputBytes`、`maxOutputTokens`、`model`、`provider`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SESSION_TITLE_TIMEOUT_CODE 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `SESSION_TITLE_TIMEOUT_CODE`。`SESSION_TITLE_TIMEOUT_CODE` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SESSION_TITLE_TIMEOUT_CODE = "SESSION_TITLE_TIMEOUT";
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleLlmConfig 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `SessionTitleLlmConfig`。`SessionTitleLlmConfig` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleLlmConfig {
    readonly maxInputBytes: number;
    readonly maxOutputTokens: number;
    readonly timeoutMs: number;
    readonly provider?: string;
    readonly model?: string;
}
```

成员检索：`maxInputBytes`、`maxOutputTokens`、`model`、`provider`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleLlmConfigFields 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `SessionTitleLlmConfigFields`。`SessionTitleLlmConfigFields` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SessionTitleLlmConfigFields: {
    maxInputBytes: z<number, number, "defined">;
    maxOutputTokens: z<number, number, "defined">;
    timeoutMs: z<number, number, "defined">;
    provider: z<string, string, "plain">;
    model: z<string, string, "plain">;
};
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleLlmConfigSchema 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `SessionTitleLlmConfigSchema`。`SessionTitleLlmConfigSchema` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SessionTitleLlmConfigSchema: z<SessionTitleLlmConfig>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleLlmFinish 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `SessionTitleLlmFinish`。`SessionTitleLlmFinish` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SessionTitleLlmFinish = Extract<FinishReason, {
    kind: 'stop' | 'tool-calls' | 'max-tokens';
}>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleLlmPreparedRequest 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `SessionTitleLlmPreparedRequest`。`SessionTitleLlmPreparedRequest` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleLlmPreparedRequest {
    readonly system: string;
    readonly input: string;
    readonly messageSeqs: readonly SessionSeq[];
    readonly selectReasoningEffort: (model: Readonly<LlmResolvedModelInfo>) => ReasoningEffortId | undefined;
}
```

成员检索：`input`、`messageSeqs`、`selectReasoningEffort`、`system`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleLlmRequestEventData 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `SessionTitleLlmRequestEventData`。`SessionTitleLlmRequestEventData` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleLlmRequestEventData {
    readonly titleProvider: SessionTitleProviderId;
    readonly messageSeqs: SessionSeq[];
    readonly route: SessionTitleModelIdentity;
    readonly system: string;
    readonly messages: Message[];
    readonly maxTokens: number;
    readonly reasoningEffort?: ReasoningEffortId;
}
```

成员检索：`maxTokens`、`messageSeqs`、`messages`、`reasoningEffort`、`route`、`system`、`titleProvider`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## SessionTitleLlmResponse 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `SessionTitleLlmResponse`。`SessionTitleLlmResponse` 是Session 耐久句柄、格式与只读投影的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SessionTitleLlmResponse {
    readonly blocks: readonly ContentBlock[];
    readonly finish: SessionTitleLlmFinish;
    readonly model: SessionTitleModelIdentity;
}
```

成员检索：`blocks`、`finish`、`model`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## executeSessionTitleLlm 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `executeSessionTitleLlm`。`executeSessionTitleLlm` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function executeSessionTitleLlm(ctx: Context, config: ResolvedSessionTitleLlmConfig, request: SessionTitleProviderRequest, titleProvider: SessionTitleProviderId, prepared: SessionTitleLlmPreparedRequest): Promise<SessionTitleLlmResponse>;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## resolveSessionTitleLlmConfig 契约

从 `@deepseek-ai/dsh-session-title-llm` 导入 `resolveSessionTitleLlmConfig`。`resolveSessionTitleLlmConfig` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveSessionTitleLlmConfig(config: SessionTitleLlmConfig): ResolvedSessionTitleLlmConfig;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
