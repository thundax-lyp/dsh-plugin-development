# dsh-llm-deepseek-files-api 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 files-api 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-llm-deepseek.md)；本页逐项保留对象的参数、字段和判别分支。

## DeepSeekFileObject（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekFileObject {
    id: DeepSeekFileIdType;
    bytes: number;
    createdAt: number;
    filename: string;
    expiresAt?: number;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DeepSeekFileObject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`bytes`、`createdAt`、`expiresAt`、`filename`、`id`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DeepSeekFilePage（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface DeepSeekFilePage {
    data: DeepSeekFileObject[];
    firstId?: DeepSeekFileIdType;
    lastId?: DeepSeekFileIdType;
    hasMore: boolean;
}
```

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DeepSeekFilePage`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`data`、`firstId`、`hasMore`、`lastId`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## DeepSeekFilesClient（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`DeepSeekFilesClient`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class DeepSeekFilesClient {
    constructor(options: FilesApiOptions);
    upload(input: {
        data: Uint8Array;
        mediaType: ImageMediaType;
        filename: string;
        expiresAfterSeconds: number;
        signal?: AbortSignal;
    }): Promise<DeepSeekFileObject & {
        expiresAt: number;
    }>;
    list(options?: {
        after?: DeepSeekFileIdType;
        limit?: number;
        signal?: AbortSignal;
    }): Promise<DeepSeekFilePage>;
    retrieve(fileId: DeepSeekFileIdType, signal?: AbortSignal): Promise<DeepSeekFileObject>;
    delete(fileId: DeepSeekFileIdType, signal?: AbortSignal): Promise<void>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## MAX_FILE_EXPIRY_SECONDS（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`MAX_FILE_EXPIRY_SECONDS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const MAX_FILE_EXPIRY_SECONDS = 2592000;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## MAX_FILE_UPLOAD_BYTES（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`MAX_FILE_UPLOAD_BYTES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const MAX_FILE_UPLOAD_BYTES: number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## MAX_STORED_FILE_BYTES（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`MAX_STORED_FILE_BYTES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const MAX_STORED_FILE_BYTES: number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## MAX_STORED_FILE_COUNT（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`MAX_STORED_FILE_COUNT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const MAX_STORED_FILE_COUNT = 10000;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。

## MIN_FILE_EXPIRY_SECONDS（.）

公开导入：`@deepseek-ai/dsh-llm-deepseek`；公开符号：`MIN_FILE_EXPIRY_SECONDS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const MIN_FILE_EXPIRY_SECONDS = 3600;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-llm-deepseek.md)。
