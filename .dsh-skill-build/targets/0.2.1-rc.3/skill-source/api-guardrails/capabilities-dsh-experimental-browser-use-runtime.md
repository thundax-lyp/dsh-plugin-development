# @deepseek-ai/dsh-experimental-browser-use-runtime 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

浏览器提供方使用此库，在一个 Session 的多个轮次之间复用浏览器，并在该 Session 的运行时释放时关闭其资源。一个 Session 的操作按顺序运行，隔离的 Session 则可以独立推进。附加模式将一个外部浏览器保留给单个 Session。此库还连接提供方拥有的 MCP 服务器，并在 Session 首次模型请求前发现其工具。

### 使用本包

此公共实验性库是浏览器提供方的依赖。它没有插件入口或挂载配置。浏览器操作服务保持独立于此库。

原生提供方从包根入口构造 `SessionResources`，提供资源获取与清理回调。调用向 `run()` 传递确切的实时 Agent；失效的所有者与独占附加的第二个所有者在获取资源前失败。取消资源获取等待不会终止初始化，同一 Session 的其他调用方仍可继续等待；释放 Session 会中止并等待该初始化结束。提供方将注册保留到 `dispose()` 完成。

MCP 提供方使用 `@deepseek-ai/dsh-experimental-browser-use-runtime/mcp` 中的 `mountSessionMcp`，提供固定服务器名称、可执行文件、参数与所有权策略。挂载上下文必须提供 `workingDirectory`。获取连接时通过工作目录服务验证或恢复当前目录，并将其设为 MCP 服务器进程的初始目录。Session 后续选择其他目录时，保留的服务器继续使用该目录。辅助库在每个后续 Agent 的 `agent/created` 事件中等待一次有作用域的客户端启动与发现尝试。Agent 创建或恢复在发现完成后结束，随后才运行排队输入；成功的客户端跨轮次归该 Session 所有。

附加连接被占用时，本次激活永久跳过启动，但其他工作继续运行。连接释放不会触发被跳过激活的重试；新创建或恢复的 Agent 可以获取连接。启动失败或取消会拒绝 Agent 创建或恢复，并触发包含客户端清理的创建回滚。重连已禁用。加载或重新加载提供方只作用于后续的 Agent 激活。

调用方在等待 Agent 创建或恢复完成后，即可检查提示词组装和作用域工具定义。

指向此服务器的浏览器工具调用与资源请求使用同一队列，且要求调用 Session 自己拥有连接。其他 MCP 服务器仍可使用。没有所有权时会省略继承的服务器指导；共享服务器名称目录保留常规作用域行为。

-----

### 已知限制与延期工作

提供方仍负责自己提供的浏览器操作。

- **MCP 激活** — 提供方不接管已有的活动 Agent；被占用的附加连接不会在本次激活中重试。
- **附加范围** — 独占所有权作用于一个资源管理器，不约束独立提供方、进程或外部浏览器客户端。
- **取消** — abort 信号与连接关闭无法撤销已交付的浏览器操作。同时忽略两者的上游操作可能延迟清理。
- **恢复** — 关闭失败会保留所有权；此管理器不重试释放，也不从 Session 日志恢复浏览器状态。
- **共享宿主运行时** — profile 会把本包与 dsh 安装并排安装，因此 `@deepseek-ai/dsh-scope` 与 `@deepseek-ai/dsh-mcp-client` 保持为 peer 依赖。写成 `dependencies` 会再装一份 `dsh-scope`，它的作用域标记宿主注册表读不到：每个 Agent 的 MCP 工具都会注册到全局工具层，第二个 Agent 的创建随之失败。

## OwnedSessionResource（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface OwnedSessionResource<T> {
    value: T;
    close: () => Promise<void>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime`；公开符号：`OwnedSessionResource`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`close`、`value`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## SessionResourceOptions（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionResourceOptions<T> {
    label: string;
    exclusive: boolean;
    open: (agent: Agent, signal: AbortSignal) => Promise<OwnedSessionResource<T>>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime`；公开符号：`SessionResourceOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`exclusive`、`label`、`open`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## SessionResources（.）

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime`；公开符号：`SessionResources`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class SessionResources<T> {
    constructor(ctx: Context, options: SessionResourceOptions<T>);
    available(agent: Agent): boolean;
    get(agent: Agent, signal?: AbortSignal): Promise<T>;
    run<R>(agent: Agent, signal: AbortSignal, operation: (resource: T, signal: AbortSignal) => Promise<R>): Promise<R>;
    dispose(): Promise<void>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## BrowserMcpAttachConfig（./mcp）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface BrowserMcpAttachConfig {
    mode: 'attach';
    endpoint: string;
    toolCallTimeoutMs?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime/mcp`；公开符号：`BrowserMcpAttachConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`endpoint`、`mode`、`toolCallTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## BrowserMcpConfig（./mcp）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type BrowserMcpConfig = BrowserMcpLaunchConfig | BrowserMcpAttachConfig;

export declare const BrowserMcpConfig: Schema<BrowserMcpAttachConfig | (Omit<BrowserMcpLaunchConfig, 'headless'> & {
    headless?: boolean;
}), BrowserMcpConfig>;
```

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime/mcp`；公开符号：`BrowserMcpConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

成员检索：`mode`、`toolCallTimeoutMs`。各成员精确类型及可选性由上面的分支声明定义。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## BrowserMcpLaunchConfig（./mcp）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface BrowserMcpLaunchConfig {
    mode: 'launch';
    headless: boolean;
    executablePath?: string;
    toolCallTimeoutMs?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime/mcp`；公开符号：`BrowserMcpLaunchConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`executablePath`、`headless`、`mode`、`toolCallTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## SessionMcpOptions（./mcp）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface SessionMcpOptions {
    name: string;
    exclusive: boolean;
    command: string;
    args: string[];
    env?: Record<string, string>;
    toolCallTimeoutMs?: number;
}
```

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime/mcp`；公开符号：`SessionMcpOptions`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`args`、`command`、`env`、`exclusive`、`name`、`toolCallTimeoutMs`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## mountSessionMcp（./mcp）

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime/mcp`；公开符号：`mountSessionMcp`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function mountSessionMcp(ctx: Context, options: SessionMcpOptions): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## validateBrowserMcpConfig（./mcp）

公开导入：`@deepseek-ai/dsh-experimental-browser-use-runtime/mcp`；公开符号：`validateBrowserMcpConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function validateBrowserMcpConfig(config: BrowserMcpConfig): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-browser-use-runtime.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
