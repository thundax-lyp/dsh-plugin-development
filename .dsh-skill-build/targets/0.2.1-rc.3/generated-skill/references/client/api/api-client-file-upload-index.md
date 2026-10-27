# file-upload：index 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

文件上传以 receipt/binding 交给提交路径；浏览器进度不等于 Session 已采纳附件。上传失败或取消不应保留可提交的伪 receipt；临时资源归上传服务与调用信号所有，业务持久事实须经 Host 的提交链建立。

## AgentResolver root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `AgentResolver`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type AgentResolver = (sessionId: SessionId) => Promise<Agent>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## FileUploads root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `FileUploads`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class FileUploads extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    registerAgentResolver(resolve: AgentResolver): () => void;
    upload(agent: Agent, request: EncodedFileUploadRequest, signal: AbortSignal): Promise<FileUploadValue>;
    uploadStream(request: {
        readonly sessionId: SessionId;
        readonly data: AsyncIterable<Uint8Array>;
        readonly signal?: AbortSignal;
        readonly name?: string;
    }): Promise<FileUploadValue>;
    resolve(agent: Agent, receiptId: FileUploadReceiptId): FileAttachmentRef | undefined;
    bindPrompt(agent: Agent, receiptIds: readonly FileUploadReceiptId[], requestId: string): PromptFileBinding;
    retirePrompt(agent: Agent, requestId: string): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `inject` | `static inject: string[];` |
| `constructor` | `constructor(ctx: Context);` |
| `registerAgentResolver` | `registerAgentResolver(resolve: AgentResolver): () => void;` |
| `upload` | `upload(agent: Agent, request: EncodedFileUploadRequest, signal: AbortSignal): Promise<FileUploadValue>;` |
| `uploadStream` | `uploadStream(request: { readonly sessionId: SessionId; readonly data: AsyncIterable<Uint8Array>; readonly signal?: AbortSignal; readonly name?: string; }): Promise<FileUploadValue>;` |
| `resolve` | `resolve(agent: Agent, receiptId: FileUploadReceiptId): FileAttachmentRef \| undefined;` |
| `bindPrompt` | `bindPrompt(agent: Agent, receiptIds: readonly FileUploadReceiptId[], requestId: string): PromptFileBinding;` |
| `retirePrompt` | `retirePrompt(agent: Agent, requestId: string): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type AgentResolver = (sessionId: SessionId) => Promise<Agent>

export interface PromptFileBinding extends Disposable {

  commit(): void
}
```

## PromptFileBinding root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `PromptFileBinding`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface PromptFileBinding extends Disposable {
    commit(): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `commit` | `commit(): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## default root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `default`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare class FileUploads extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    registerAgentResolver(resolve: AgentResolver): () => void;
    upload(agent: Agent, request: EncodedFileUploadRequest, signal: AbortSignal): Promise<FileUploadValue>;
    uploadStream(request: {
        readonly sessionId: SessionId;
        readonly data: AsyncIterable<Uint8Array>;
        readonly signal?: AbortSignal;
        readonly name?: string;
    }): Promise<FileUploadValue>;
    resolve(agent: Agent, receiptId: FileUploadReceiptId): FileAttachmentRef | undefined;
    bindPrompt(agent: Agent, receiptIds: readonly FileUploadReceiptId[], requestId: string): PromptFileBinding;
    retirePrompt(agent: Agent, requestId: string): void;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `inject` | `static inject: string[];` |
| `constructor` | `constructor(ctx: Context);` |
| `registerAgentResolver` | `registerAgentResolver(resolve: AgentResolver): () => void;` |
| `upload` | `upload(agent: Agent, request: EncodedFileUploadRequest, signal: AbortSignal): Promise<FileUploadValue>;` |
| `uploadStream` | `uploadStream(request: { readonly sessionId: SessionId; readonly data: AsyncIterable<Uint8Array>; readonly signal?: AbortSignal; readonly name?: string; }): Promise<FileUploadValue>;` |
| `resolve` | `resolve(agent: Agent, receiptId: FileUploadReceiptId): FileAttachmentRef \| undefined;` |
| `bindPrompt` | `bindPrompt(agent: Agent, receiptIds: readonly FileUploadReceiptId[], requestId: string): PromptFileBinding;` |
| `retirePrompt` | `retirePrompt(agent: Agent, requestId: string): void;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type AgentResolver = (sessionId: SessionId) => Promise<Agent>

export interface PromptFileBinding extends Disposable {

  commit(): void
}
```
