# file-upload：types 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

文件上传以 receipt/binding 交给提交路径；浏览器进度不等于 Session 已采纳附件。上传失败或取消不应保留可提交的伪 receipt；临时资源归上传服务与调用信号所有，业务持久事实须经 Host 的提交链建立。

## FileUploadReceiptId client

入口 `@deepseek-ai/dsh-client-file-upload/client`，公开符号 `FileUploadReceiptId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FileUploadReceiptId = Branded<'file-upload-receipt-id'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## FileUploadValue client

入口 `@deepseek-ai/dsh-client-file-upload/client`，公开符号 `FileUploadValue`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FileUploadValue {
    readonly receiptId: FileUploadReceiptId;
    readonly file: FileAttachmentRef;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `receiptId` | `readonly receiptId: FileUploadReceiptId;` |
| `file` | `readonly file: FileAttachmentRef;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type FileUploadReceiptId = Branded<'file-upload-receipt-id'>
```

## ClientFileUploadHooks types

入口 `@deepseek-ai/dsh-client-file-upload/types`，公开符号 `ClientFileUploadHooks`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientFileUploadHooks {
    readonly fetch: FileUploadFetch;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `fetch` | `readonly fetch: FileUploadFetch;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type FileUploadFetch = (input: string | URL, init: RequestInit) => Promise<Response>
```

## EncodedFileUploadRequest types

入口 `@deepseek-ai/dsh-client-file-upload/types`，公开符号 `EncodedFileUploadRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface EncodedFileUploadRequest {
    readonly data: string;
    readonly name?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `data` | `readonly data: string;` |
| `name` | `readonly name?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## FileUploadFetch types

入口 `@deepseek-ai/dsh-client-file-upload/types`，公开符号 `FileUploadFetch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FileUploadFetch = (input: string | URL, init: RequestInit) => Promise<Response>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## FileUploadReceiptId types

入口 `@deepseek-ai/dsh-client-file-upload/types`，公开符号 `FileUploadReceiptId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FileUploadReceiptId = Branded<'file-upload-receipt-id'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## FileUploadValue types

入口 `@deepseek-ai/dsh-client-file-upload/types`，公开符号 `FileUploadValue`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FileUploadValue {
    readonly receiptId: FileUploadReceiptId;
    readonly file: FileAttachmentRef;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `receiptId` | `readonly receiptId: FileUploadReceiptId;` |
| `file` | `readonly file: FileAttachmentRef;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type FileUploadReceiptId = Branded<'file-upload-receipt-id'>
```

## ClientFileUploadHooks root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `ClientFileUploadHooks`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ClientFileUploadHooks {
    readonly fetch: FileUploadFetch;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `fetch` | `readonly fetch: FileUploadFetch;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type FileUploadFetch = (input: string | URL, init: RequestInit) => Promise<Response>
```

## EncodedFileUploadRequest root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `EncodedFileUploadRequest`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface EncodedFileUploadRequest {
    readonly data: string;
    readonly name?: string;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `data` | `readonly data: string;` |
| `name` | `readonly name?: string;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## FileUploadFetch root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `FileUploadFetch`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FileUploadFetch = (input: string | URL, init: RequestInit) => Promise<Response>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## FileUploadReceiptId root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `FileUploadReceiptId`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type FileUploadReceiptId = Branded<'file-upload-receipt-id'>;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。

## FileUploadValue root

入口 `@deepseek-ai/dsh-client-file-upload`，公开符号 `FileUploadValue`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface FileUploadValue {
    readonly receiptId: FileUploadReceiptId;
    readonly file: FileAttachmentRef;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `receiptId` | `readonly receiptId: FileUploadReceiptId;` |
| `file` | `readonly file: FileAttachmentRef;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-file-upload.md#接入-file-upload) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export type FileUploadReceiptId = Branded<'file-upload-receipt-id'>
```
