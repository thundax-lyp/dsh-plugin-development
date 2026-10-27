# @deepseek-ai/dsh-ssh./protocol：远程执行世界与配套后端

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在远程执行世界与配套后端任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[远程执行世界与配套后端](api-runtime-ssh-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-ssh.md)。

## RemoteOperationError 契约

从 `@deepseek-ai/dsh-ssh/protocol` 导入 `RemoteOperationError`。`RemoteOperationError` 是远程执行世界与配套后端的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class RemoteOperationError extends Error {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## SSH_MAX_PROCESS_HANDLES 契约

从 `@deepseek-ai/dsh-ssh/protocol` 导入 `SSH_MAX_PROCESS_HANDLES`。`SSH_MAX_PROCESS_HANDLES` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SSH_MAX_PROCESS_HANDLES = 128;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## SSH_MAX_TEXT_STREAMS 契约

从 `@deepseek-ai/dsh-ssh/protocol` 导入 `SSH_MAX_TEXT_STREAMS`。`SSH_MAX_TEXT_STREAMS` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SSH_MAX_TEXT_STREAMS = 128;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## SSH_PROTOCOL_VERSION 契约

从 `@deepseek-ai/dsh-ssh/protocol` 导入 `SSH_PROTOCOL_VERSION`。`SSH_PROTOCOL_VERSION` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SSH_PROTOCOL_VERSION = 2;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## SshRpcPeer 契约

从 `@deepseek-ai/dsh-ssh/protocol` 导入 `SshRpcPeer`。`SshRpcPeer` 是远程执行世界与配套后端的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SshRpcPeer extends EventEmitter {
    constructor(input: Readable, output: Writable, maxFrameBytes: number, maxPending: number, handler?: RequestHandler | undefined);
    request<T>(method: string, params: unknown, schema: z.ZodType<T>, signal?: AbortSignal): Promise<T>;
    close(error?: Error): void;
}
```

成员检索：`close`、`request`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。
