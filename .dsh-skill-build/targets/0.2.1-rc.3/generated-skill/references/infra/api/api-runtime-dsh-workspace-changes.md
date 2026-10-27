# @deepseek-ai/dsh-workspace-changes：交付物与工作区变更呈现

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在交付物与工作区变更呈现任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-deliverables.md)。

## Config 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    timeoutMs: number;
    outputMaxBytes: number;
    maxFiles: number;
    maxFileBytes: number;
    diffTimeoutMs: number;
}

export declare const Config: z<Config>;
```

成员检索：`diffTimeoutMs`、`maxFileBytes`、`maxFiles`、`outputMaxBytes`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。

## WorkspaceChangedFile 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `WorkspaceChangedFile`。`WorkspaceChangedFile` 是交付物与工作区变更呈现的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WorkspaceChangedFile {
    path: string;
    display: string;
    added: number;
    deleted: number;
    binary?: true;
    oversized?: true;
}
```

成员检索：`added`、`binary`、`deleted`、`display`、`oversized`、`path`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。

## WorkspaceChanges 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `WorkspaceChanges`。`WorkspaceChanges` 是交付物与工作区变更呈现的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WorkspaceChanges {
    summary(sessionId: SessionId, seq: number): WorkspaceChangesSummary | undefined;
    diff(sessionId: SessionId, seq: number, index: number, signal: AbortSignal): Promise<WorkspaceFileDiff | undefined>;
}
```

成员检索：`diff`、`summary`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。

## WorkspaceChangesSummary 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `WorkspaceChangesSummary`。`WorkspaceChangesSummary` 是交付物与工作区变更呈现的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WorkspaceChangesSummary {
    turn: number;
    cwd: string;
    files: WorkspaceChangedFile[];
    total: number;
    added: number;
    deleted: number;
    snapshot?: {
        before: string;
        after: string;
    };
}
```

成员检索：`added`、`cwd`、`deleted`、`files`、`snapshot`、`total`、`turn`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。

## WorkspaceDiffHunk 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `WorkspaceDiffHunk`。`WorkspaceDiffHunk` 是交付物与工作区变更呈现的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface WorkspaceDiffHunk {
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    lines: string[];
}
```

成员检索：`lines`、`newLines`、`newStart`、`oldLines`、`oldStart`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。

## WorkspaceFileDiff 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `WorkspaceFileDiff`。`WorkspaceFileDiff` 是交付物与工作区变更呈现的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type WorkspaceFileDiff = {
    kind: 'text';
    path: string;
    display: string;
    before: boolean;
    after: boolean;
    hunks: WorkspaceDiffHunk[];
    coarse: boolean;
} | {
    kind: 'binary';
    path: string;
    display: string;
} | {
    kind: 'oversized';
    path: string;
    display: string;
};
```

成员检索：`display`、`kind`、`path`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): void;
```

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-workspace-changes` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "workspace-changes";
```

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。
