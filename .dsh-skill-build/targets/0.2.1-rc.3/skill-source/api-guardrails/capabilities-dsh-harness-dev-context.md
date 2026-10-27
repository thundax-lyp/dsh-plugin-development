# @deepseek-ai/dsh-harness-dev-context 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

`dsh-harness-dev-context` 告诉运行在 DeepSeek Harness Web GUI 背后的 agent：harness 实现 checkout 在哪里、GUI 与「this page」是什么关系，以及哪个 URL 提供该 GUI。系统提示词只包含不含值的说明；当前 checkout 路径与 GUI URL 以运行时上下文送达，因此从别的 checkout、端口或安装位置启动进程，绝不会改写会话已记录的系统提示词。提示词仍嵌有早期版本这些值的会话会原样保留那段文本。

### 使用本包

随附的 Web bundle 以 `harness-dev-context` 行挂载此插件。不希望 agent 得知 harness checkout 或 GUI URL 时，在 profile patch 中禁用该行。插件不接受配置，只在每个注入服务都存在时激活：`systemPrompt`、`sessionProjections`，以及 Web 运行时的 `webApp` 服务，因此 `--help` 与非 Web 组合永远不会挂载它。

#### 模型得到什么

两个系统提示词段落说明 checkout 与工作目录不同、「this page」指此 GUI，并给出 GUI 的更新约定。两行运行时上下文给出当前值：本包上方四层目录处的安装根，以及 `webApp.getAdvertisedUrl()` 给出的 Web GUI 公告 URL，与 `DSH_WEB_URL` 和启动 URL 相同。运行时上下文遵循共享的快照规则：值不变不追加内容，值变化时在本步输入之前追加一份快照，而不是改写更早的消息。

#### 早期版本的会话

早期版本把两个值都嵌在系统提示词里。会话最新的非空系统提示词仍含那两段原文时，两个段落会原样重复它们（包括旧值），因此升级以及之后更换端口或 checkout 都不会改变该会话提示词的任何字节；运行时上下文行仍给出当前值。只是看起来像早期段落的文本会得到当前说明。

-----

### 已知限制与延期工作

这些限制说明稳定性保证覆盖哪些内容。它们是当前包约束。

- **只覆盖两段**——版本之间变化的其他系统提示词文本，在不支持 in-history 提示词更新的路由上仍会改写第一条 system 消息。
- **早期值保留**——早期格式会话在整个生命周期内都在系统提示词里保留旧 checkout 路径与 URL；只有之后的运行时上下文行是当前值。
- **混用版本**——不含本包的版本会改写以本包启动的会话的第一条 system 消息，因此共用同一 `DSH_HOME` 的每个 checkout 都需要先包含本包，才能交替运行。
- **可选值**——两行运行时上下文是可选的，因此设置 `includeRuntimeContext: false` 但未设置 `complete: true` 的自定义 persona 会保留指向其请求从不携带之值的段落。随附的 `minimal` persona 两者都设置。
- **没有段落的会话**——在 `surfaceContext: false` 隐藏两段时创建的会话，日志中两段都没有，因此恢复后的第一个请求会加入新段落，并在不支持 in-history 提示词更新的路由上改写第一条 system 消息。
- **只认一版早期措辞**——投影按本包之前紧邻的版本渲染的段落识别；保存更早措辞的会话会得到当前说明。

## apply（.）

公开导入：`@deepseek-ai/dsh-harness-dev-context`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-harness-dev-context.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-harness-dev-context`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-harness-dev-context.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-harness-dev-context`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "harness-dev-context";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-harness-dev-context.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
