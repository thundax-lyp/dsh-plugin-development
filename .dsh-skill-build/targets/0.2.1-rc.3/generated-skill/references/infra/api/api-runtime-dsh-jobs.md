# @deepseek-ai/dsh-jobs：后台任务的所有权与输出

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在后台任务的所有权与输出任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[后台任务的所有权与输出](api-runtime-jobs-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-jobs.md)。

## JobAppendOptions 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobAppendOptions`。`JobAppendOptions` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobAppendOptions {
    channel?: JobChannel;
    gapBefore?: true;
}
```

成员检索：`channel`、`gapBefore`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobChannel 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobChannel`。`JobChannel` 是后台任务的所有权与输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type JobChannel = 'stdout' | 'stderr' | 'log';
```

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobChunk 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobChunk`。`JobChunk` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobChunk {
    readonly at: number;
    readonly text: string;
    readonly channel?: JobChannel;
    readonly gapBefore?: true;
}
```

成员检索：`at`、`channel`、`gapBefore`、`text`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobEvent 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobEvent`。按 type 判别：registered/progress/stopping/removed 携 job；settled 再携 cause 和 awaited；output 携 id、可选 owner、total，不推送内容。UI 自己维护 readAt 游标。

```text
export type JobEvent = {
    readonly type: 'registered' | 'progress' | 'stopping' | 'removed';
    readonly job: JobView;
} | {
    readonly type: 'settled';
    readonly job: JobView;
    readonly cause: JobSettleCause;
    readonly awaited: boolean;
} | {
    readonly type: 'output';
    readonly id: JobId;
    readonly owner?: SessionId;
    readonly total: number;
};
```

成员检索：`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobEventFilter 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobEventFilter`。{owner:SessionId} 包括指定 owner 和无主任务；{owners:'scope'} 限当前组合 owners；{owners:'all'} 是全部。不可把 all 用作面向任意用户的默认过滤。

```text
export type JobEventFilter = {
    readonly owner: SessionId;
} | {
    readonly owners: 'all' | 'scope';
};
```

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobEventListener 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobEventListener`。`JobEventListener` 是后台任务的所有权与输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type JobEventListener = (event: JobEvent) => void;
```

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobEvents 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobEvents`。`JobEvents` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobEvents {
    subscribe(filter: JobEventFilter, listener: JobEventListener): () => void;
}
```

成员检索：`subscribe`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobHandle 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobHandle`。`JobHandle` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobHandle {
    readonly id: JobId;
    append(text: string, options?: JobAppendOptions): void;
    updateProgress(line: string): void;
}
```

成员检索：`append`、`id`、`updateProgress`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobHooks 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobHooks`。cancel 同步、幂等且最终驱动 done 结算；done 应在资源释放后 resolve JobOutcome，不能拒绝。违反约定时 registry 只能记录失败，不证明资源已释放。

```text
export interface JobHooks {
    cancel(reason?: string): void;
    done: Promise<JobOutcome>;
}
```

成员检索：`cancel`、`done`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobId 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobId`。`JobId` 是后台任务的所有权与输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function JobId(id: string): JobId;

export type JobId = Branded<'JobId'>;
```

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobKind 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobKind`。`JobKind` 是后台任务的所有权与输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type JobKind = JobKindMap[keyof JobKindMap];
```

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobKindMap 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobKindMap`。`JobKindMap` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

声明来源包 `@deepseek-ai/dsh-jobs`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
export interface JobKindMap {
    bash: 'bash';
}
```

声明来源包 `@deepseek-ai/dsh-tool-terminal`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface JobKindMap {
    'pty-send': 'pty-send';
}
```

声明来源包 `@deepseek-ai/dsh-tool-workflow`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface JobKindMap {
    workflow: 'workflow';
}
```

声明来源包 `@deepseek-ai/dsh-tool-pwsh`，适用 Host 或该包声明的共享编译面；只有编译面导入相应声明时本段合并才生效，运行时还需启用对应 owner。不同运行侧的同名 service 字段不应放入一个编译程序。

```text
interface JobKindMap {
    pwsh: 'pwsh';
}
```

成员检索：`bash`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobOutcome 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobOutcome`。status 为 completed/killed/failed；detail 是原因，result 是值型结果，只在结算后的首次模型 read 交付。原始流另走输出环。

```text
export interface JobOutcome {
    status: 'completed' | 'killed' | 'failed';
    detail?: string;
    result?: string;
}
```

成员检索：`detail`、`result`、`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobOutputRead 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobOutputRead`。next 是累计 UTF-8 字节 offset，chunks 保持完整块边界；lossy=true 表示早期输出已丢失。它不消费模型游标。

```text
export interface JobOutputRead {
    chunks: readonly JobChunk[];
    next: number;
    lossy: boolean;
}
```

成员检索：`chunks`、`lossy`、`next`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobOutputSource 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobOutputSource`。`JobOutputSource` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobOutputSource {
    channel?: JobChannel;
    read(fromByte: number): JobSourceRead;
}
```

成员检索：`channel`、`read`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobRead 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobRead`。`JobRead` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobRead {
    chunks: readonly JobChunk[];
    lossy: boolean;
    result?: string;
    job: JobView;
}
```

成员检索：`chunks`、`job`、`lossy`、`result`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobRegisteredData 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobRegisteredData`。`JobRegisteredData` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobRegisteredData {
    readonly jobId: JobId;
    readonly owner: SessionId;
    readonly kind: string;
    readonly label: string;
    readonly startedAt: number;
    readonly toolCall?: JobToolCall;
}
```

成员检索：`jobId`、`kind`、`label`、`owner`、`startedAt`、`toolCall`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobRegistry 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobRegistry`。默认导出为契约 Service，执行由 jobs-local 提供。start/get/list/read/readAt/wait/kill/remove 的 caller 是 SessionId，owner 存在时进行归属检查；订阅通过 events.subscribe。

```text
export declare abstract class JobRegistry extends Service {
    constructor(ctx: Context);
    abstract readonly events: JobEvents;
    abstract start(spec: JobSpec): JobId;
    abstract list(caller?: SessionId): JobView[];
    abstract get(id: JobId, caller?: SessionId): JobView;
    abstract read(id: JobId, caller?: SessionId): JobRead;
    abstract readAt(id: JobId, from: number, caller?: SessionId): JobOutputRead;
    abstract kill(id: JobId, caller?: SessionId, reason?: string): 'requested' | 'already-finished';
    abstract wait(id: JobId, timeoutMs: number, caller?: SessionId, signal?: AbortSignal): Promise<JobView>;
    abstract remove(id: JobId, caller?: SessionId): void;
    abstract attachController(name: string): () => void;
}
```

成员检索：`attachController`、`events`、`get`、`kill`、`list`、`read`、`readAt`、`remove`、`start`、`wait`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobSettleCause 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobSettleCause`。`JobSettleCause` 是后台任务的所有权与输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type JobSettleCause = 'producer' | 'kill' | 'teardown';
```

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobSettledData 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobSettledData`。`JobSettledData` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobSettledData extends JobRegisteredData {
    readonly finishedAt: number;
    readonly status: JobOutcome['status'];
    readonly cause: JobSettleCause;
    readonly producerReported: boolean;
    readonly detail?: string;
}
```

成员检索：`cause`、`detail`、`finishedAt`、`jobId`、`kind`、`label`、`owner`、`producerReported`、`startedAt`、`status`、`toolCall`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobSourceRead 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobSourceRead`。`JobSourceRead` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobSourceRead {
    text: string;
    nextOffset: number;
    lossy: boolean;
    spillPath?: string;
}
```

成员检索：`lossy`、`nextOffset`、`spillPath`、`text`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobSpec 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobSpec`。kind 由 JobKindMap 声明扩展，label 是单行说明；owner 可省略，省略会得到任何 caller 可见的无主任务。run 同步返回 JobHooks，启动抛错前必须自清理部分资源。

```text
export interface JobSpec {
    kind: JobKind;
    label: string;
    owner?: SessionId;
    toolCall?: JobToolCall;
    outputLimitBytes?: number;
    output?: readonly JobOutputSource[];
    run(job: JobHandle): JobHooks;
}
```

成员检索：`kind`、`label`、`output`、`outputLimitBytes`、`owner`、`run`、`toolCall`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobStatus 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobStatus`。`JobStatus` 是后台任务的所有权与输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type JobStatus = 'running' | 'stopping' | 'completed' | 'killed' | 'failed';
```

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobToolCall 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobToolCall`。`JobToolCall` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobToolCall {
    readonly callId: SessionEventMap['tool/call']['callId'];
    readonly rootCallId: SessionEventMap['tool/call']['callId'];
}
```

成员检索：`callId`、`rootCallId`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## JobView 契约

从 `@deepseek-ai/dsh-jobs` 导入 `JobView`。`JobView` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface JobView {
    readonly id: JobId;
    readonly kind: string;
    readonly label: string;
    readonly owner?: SessionId;
    readonly outputLimitBytes?: number;
    readonly status: JobStatus;
    readonly progress?: string;
    readonly detail?: string;
    readonly startedAt: number;
    readonly finishedAt?: number;
    readonly output: {
        readonly total: number;
        readonly earliest: number;
        readonly spillPaths?: readonly string[];
    };
}
```

成员检索：`detail`、`finishedAt`、`id`、`kind`、`label`、`output`、`outputLimitBytes`、`owner`、`progress`、`startedAt`、`status`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。
