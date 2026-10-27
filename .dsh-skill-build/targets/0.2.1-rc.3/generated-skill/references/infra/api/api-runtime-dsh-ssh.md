# @deepseek-ai/dsh-ssh：远程执行世界与配套后端

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在远程执行世界与配套后端任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[远程执行世界与配套后端](api-runtime-ssh-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-ssh.md)。

## Config 契约

从 `@deepseek-ai/dsh-ssh` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    host: string;
    launch: HelperLaunch;
    helper: string;
    helperHash: string;
    workspace: string;
    requestTimeoutMs?: number;
    maxFrameBytes?: number;
    maxPending?: number;
    leaseMs?: number;
}
```

成员检索：`helper`、`helperHash`、`host`、`launch`、`leaseMs`、`maxFrameBytes`、`maxPending`、`requestTimeoutMs`、`workspace`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## HelperLaunch 契约

从 `@deepseek-ai/dsh-ssh` 导入 `HelperLaunch`。`HelperLaunch` 是远程执行世界与配套后端的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type HelperLaunch = {
    kind: 'node-script';
    node: string;
    bootstrapPath?: string;
    bootstrapHash?: string;
} | {
    kind: 'executable';
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## SshConnection 契约

从 `@deepseek-ai/dsh-ssh` 导入 `SshConnection`。`SshConnection` 是远程执行世界与配套后端的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SshConnection extends Service {
    static Config: schema<Config>;
    readonly ready: Promise<Hello>;
    constructor(ctx: Context, config: Config);
    [Service.init](): Promise<void>;
    get ptcLaunch(): {
        kind: 'embedded';
        executable: string;
    } | {
        kind: 'node-script';
        executable: string;
        bootstrapPath: string;
    };
    request<T>(method: string, params: unknown, result: z.ZodType<T>, signal?: AbortSignal, wait?: boolean): Promise<T>;
    connectStream(endpoint: SshStreamEndpoint, signal?: AbortSignal): Promise<Socket>;
    dispose(): Promise<void>;
}
```

成员检索：`connectStream`、`dispose`、`ptcLaunch`、`ready`、`request`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。
