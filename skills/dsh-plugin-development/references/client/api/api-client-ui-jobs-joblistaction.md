# ui-jobs：joblistaction 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 ui-jobs 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## JobListActionProps client

入口 `@deepseek-ai/dsh-client-ui-jobs/client`，公开符号 `JobListActionProps`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type JobListActionProps = PropsRuntime<'conversation.session.header.actions'> & PropsLocale<typeof NS> & InjectFace<JobListInjected>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-jobs.md#接入-ui-jobs) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface JobListInjected {
  hooks: {

    jobs: {
      getSnapshot(): JobsSnapshot
      subscribe(listener: () => void): () => void
    }
  }

  watchRows: (sessionId: SessionId) => () => void

  observe: (sessionId: SessionId | undefined, id: JobView['id']) => () => void

  killJob: (sessionId: SessionId, jobId: string) => Promise<boolean>
}
```

## JobListInjected client

入口 `@deepseek-ai/dsh-client-ui-jobs/client`，公开符号 `JobListInjected`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface JobListInjected {
    hooks: {
        jobs: {
            getSnapshot(): JobsSnapshot;
            subscribe(listener: () => void): () => void;
        };
    };
    watchRows: (sessionId: SessionId) => () => void;
    observe: (sessionId: SessionId | undefined, id: JobView['id']) => () => void;
    killJob: (sessionId: SessionId, jobId: string) => Promise<boolean>;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `hooks` | `hooks: { jobs: { getSnapshot(): JobsSnapshot; subscribe(listener: () => void): () => void; }; };` |
| `watchRows` | `watchRows: (sessionId: SessionId) => () => void;` |
| `observe` | `observe: (sessionId: SessionId \| undefined, id: JobView['id']) => () => void;` |
| `killJob` | `killJob: (sessionId: SessionId, jobId: string) => Promise<boolean>;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-jobs.md#接入-ui-jobs) 在真实装载路径检验成功、失败与卸载。
