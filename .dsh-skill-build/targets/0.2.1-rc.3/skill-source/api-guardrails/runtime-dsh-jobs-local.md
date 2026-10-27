# @deepseek-ai/dsh-jobs-local：后台任务的所有权与输出

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在后台任务的所有权与输出任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[后台任务的所有权与输出](api-runtime-jobs-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-jobs.md)。

## Config 契约

从 `@deepseek-ai/dsh-jobs-local` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    maxConcurrentJobsPerOwner?: number;
    retainBytes?: number;
    settledRetainBytes?: number;
    pumpPollMs?: number;
}
```

成员检索：`maxConcurrentJobsPerOwner`、`pumpPollMs`、`retainBytes`、`settledRetainBytes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## LocalJobRegistry 契约

从 `@deepseek-ai/dsh-jobs-local` 导入 `LocalJobRegistry`。`LocalJobRegistry` 是后台任务的所有权与输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LocalJobRegistry extends JobRegistry {
    static Config: z<Config>;
    constructor(ctx: Context, config: Config);
    get events(): JobEvents;
    start(spec: JobSpec): JobId;
    list(caller?: SessionId): JobView[];
    get(id: JobId, caller?: SessionId): JobView;
    read(id: JobId, caller?: SessionId): JobRead;
    readAt(id: JobId, from: number, caller?: SessionId): JobOutputRead;
    kill(id: JobId, caller?: SessionId, reason?: string): 'requested' | 'already-finished';
    wait(id: JobId, timeoutMs: number, caller?: SessionId, signal?: AbortSignal): Promise<JobView>;
    remove(id: JobId, caller?: SessionId): void;
    attachController(name: string): () => void;
}
```

成员检索：`attachController`、`events`、`get`、`kill`、`list`、`read`、`readAt`、`remove`、`start`、`wait`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。

## TASK_WAIT_TIMEOUT 契约

从 `@deepseek-ai/dsh-jobs-local` 导入 `TASK_WAIT_TIMEOUT`。`TASK_WAIT_TIMEOUT` 是后台任务的所有权与输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const TASK_WAIT_TIMEOUT = "TASK_WAIT_TIMEOUT";
```

本对象的注册/资源责任由[后台任务的所有权与输出](api-runtime-jobs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-jobs.md)核对成功、拒绝与卸载结果。
