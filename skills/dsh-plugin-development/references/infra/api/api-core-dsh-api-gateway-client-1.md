# @deepseek-ai/dsh-api-gateway ./client：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/dsh-api-gateway 选型与组合](api-core-dsh-api-gateway-client-overview.md)。

为 Host 与 Client 两侧的 Cordis 环境提供 Typert RPC endpoint。Host 入口提供 `ctx.typertGateway`，`@deepseek-ai/dsh-api-gateway/client` 则提供 `ctx.remote`；两者使用同一份生成的 `InvocationDescriptor` 约定，并将业务选择交给 API Remotes。Connection 承载一元调用的请求关联、信任和响应 envelope，Gateway 则拥有多路复用的 Remote 流，每条流都在同一条逻辑流上携带从 Client 到 Host 的上行（uplink）。

## 接入与所有权

本子路径是 Client 入口，必须在 Client 编译面消费；Host 服务由 profile 中对应提供方装配。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## ClientRemote 公开契约

浏览器远端调用装配，声明由生成贡献扩展；$mount登记贡献并返回可等待disposer，owner卸载撤销namespace。$host仅plain facts，home首个ready frame前undefined；$on只允许assembly选择的转发事件。方法用RemoteResult分支，载体失败/取消归error而非任意reject，装配缺陷仍可throw。

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`ClientRemote`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface ClientRemote extends TypertClientRemote {
    $stream<Item>(options: RemoteStreamOptions<Item>): RemoteStream<Item>;
    readonly $host: RemoteHostFacts;
}
```

成员检索：`$host`、`$stream`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteHostFacts 公开契约

home是Host home，可在首个ready frame前undefined；isLoopback固定描述页面与Host关系。getter保持未变化facts的identity稳定；重连后刷新业务视图通过connection/reset或领域事件，不为这些plain字段虚构generation订阅API。

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteHostFacts`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteHostFacts {
    readonly home: string | undefined;
    readonly isLoopback: boolean;
}
```

成员检索：`home`、`isLoopback`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteJournalChange 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteJournalChange`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteJournalChange<Page, Entry, Notification = never> = {
    readonly type: 'replace';
    readonly page: Page;
    readonly entries: readonly Entry[];
    readonly hasMore: boolean;
} | {
    readonly type: 'prepend';
    readonly page: Page;
    readonly entries: readonly Entry[];
    readonly hasMore: boolean;
} | {
    readonly type: 'append';
    readonly entry: Entry;
} | ([
    Notification
] extends [
    never
] ? never : {
    readonly type: 'notification';
    readonly notification: Notification;
});
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteJournalFrame 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteJournalFrame`。

目标版本编译声明（省略源码注释与实现体）：

```text
export type RemoteJournalFrame<Entry, Cursor, Page, Notification = never> = {
    readonly type: 'opened';
    readonly cursor: Cursor;
    readonly page: Page;
} | {
    readonly type: 'entry';
    readonly entry: Entry;
} | ([
    Notification
] extends [
    never
] ? never : {
    readonly type: 'notification';
    readonly notification: Notification;
});
```

成员检索：`type`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteJournalStream 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteJournalStream`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare abstract class RemoteJournalStream<Page, Entry, Cursor, PageRequest = void, Notification = never> {
    get signal(): AbortSignal;
    open(request: PageRequest): Promise<void>;
    prepend(request: PageRequest): Promise<void>;
    restart(): void;
    dispose(): Promise<void>;
}
```

成员检索：`dispose`、`open`、`prepend`、`restart`、`signal`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteJournalStreamOptions 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteJournalStreamOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteJournalStreamOptions<Page, Entry, Cursor, Notification = never> {
    readonly name: string;
    readonly emptyCursor: Cursor;
    readonly entries: (page: Page) => readonly Entry[];
    readonly hasMore: (page: Page) => boolean;
    readonly first: (entry: Entry) => Cursor;
    readonly last: (entry: Entry) => Cursor;
    readonly compare: (left: Cursor, right: Cursor) => number;
    readonly follows: (left: Cursor, right: Cursor) => boolean;
    readonly publish: (change: RemoteJournalChange<Page, Entry, Notification>) => void;
    readonly carrierFailed?: (error: RemoteStreamCarrierError) => void;
    readonly failed: (error: unknown) => void;
}
```

成员检索：`carrierFailed`、`compare`、`emptyCursor`、`entries`、`failed`、`first`、`follows`、`hasMore`、`last`、`name`、`publish`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteSnapshotStream 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteSnapshotStream`。

目标版本编译声明（省略源码注释与实现体）：

```text
export declare class RemoteSnapshotStream<Snapshot, Delta> {
    constructor(stream: RemoteStream<Snapshot | Delta>, options: RemoteSnapshotStreamOptions<Snapshot, Delta>);
    start(): void;
    restart(): void;
    dispose(): Promise<void>;
}
```

成员检索：`dispose`、`restart`、`start`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。

## RemoteSnapshotStreamOptions 公开契约

导入入口：`@deepseek-ai/dsh-api-gateway/client`；公开符号：`RemoteSnapshotStreamOptions`。

目标版本编译声明（省略源码注释与实现体）：

```text
export interface RemoteSnapshotStreamOptions<Snapshot, Delta> {
    readonly name: string;
    readonly isSnapshot: (value: Snapshot | Delta) => value is Snapshot;
    readonly replace: (snapshot: Snapshot) => void;
    readonly update: (delta: Delta) => void;
    readonly failed: (error: unknown) => void;
}
```

成员检索：`failed`、`isSnapshot`、`name`、`replace`、`update`。完整类型、可选性及只读约束由上方准确声明维护。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-advanced.md#在-client-消费已有-remote-并处理失败)。
