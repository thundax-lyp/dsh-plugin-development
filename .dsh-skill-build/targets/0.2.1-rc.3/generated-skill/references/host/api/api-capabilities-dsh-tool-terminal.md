# @deepseek-ai/dsh-tool-terminal 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

当 agent 需要跨调用保留终端状态或提供交互式输入时，使用 `dsh-tool-terminal`。它可以打开、发送、读取、传递信号、关闭和列出终端会话，同时防止一个 agent 操作其他 agent 的会话。发送可以等待有界的前台输出，也可以返回供后续收集或中断的后台任务 job id。`maxResultBytes` 限制每个结果的大小，而结果会保留在会话历史中直到压缩（compaction）。指引会让模型对有界工作优先使用单次工具。

### 使用本包

`terminal_open` 默认使用 Session 的当前工作目录，并以该目录解析相对 `cwd` 覆盖值。Session 切换目录后，已打开的终端仍保留各自的目录。

当组合挂载了终端后端、且模型应当能跨调用使用终端状态时启用这些工具——使用调试器单步调试、在 REPL 中探索，或中断前台命令后回到 shell。指引章节会引导模型对有界操作使用单次 bash、read、write 与 edit 工具。

#### 六个工具

| 工具 | 作用 | 结果 |
|---|---|---|
| `terminal_open` | 按后端类型创建限定所有者范围的会话 | 会话 id、名称、类型、pid、状态与有界启动输出 |
| `terminal_send` | 写入文本，可选地提交 Enter，并等待就绪——或启动后台任务 | 有界输出加等待与会话状态，或一个 job id |
| `terminal_read` | 不发送输入，读取一页有界保留输出 | 带行分页元数据的文本 |
| `terminal_signal` | 向前台进程组投递一个允许的信号 | `delivered` 加目标进程组 id |
| `terminal_close` | 关闭会话并等待其进程树结束 | 已关闭或正在关闭的结果 |
| `terminal_list` | 列出调用方的活跃会话 | 限定所有者范围的会话摘要 |

#### 组合方式

```yaml
- name: '@deepseek-ai/dsh-terminal'
- name: '@deepseek-ai/dsh-terminal-bash'
- name: '@deepseek-ai/dsh-tool-terminal'
```

工具需要 `ctx.terminals`——必须挂载一个后端——以及用于指引章节的系统提示词服务。后台发送还额外要求任务服务及其面向模型的控制器（`@deepseek-ai/dsh-tool-jobs`）。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `enableRunInBackground` | `true` | 公开并接受 `run_in_background`；设为 `false` 时移除 schema 字段并拒绝该参数 |
| `maxResultBytes` | `262144` | 每个完整终端结果的 UTF-8 上限（最小值 `64`）；在等待、会话、分页、截断与任务状态元数据全部加入后计算 |

#### 后台发送

`terminal_send(run_in_background: true)` 立即返回 job id，而不是等待。任务用 `job_output` 收集——它会等待并读取增量输出——用 `job_kill` 停止，后者向前台进程组投递真正的 `SIGINT`。缺少任务接口面时，后台模式会在写入输入之前失败。

#### 可观察结果与失败

前台发送返回终端的新输出以及 `wait: <原因>` 与会话状态；`session_exit` 表示顶层 shell 已退出，而 `inferred_idle` 或 `timeout` 绝不证明前台命令已退出。用未注册的后端类型打开会话会失败。大于 `maxResultBytes` 的结果会在 UTF-8 边界处截断并附标记。

-----

### 已知限制与延期工作

这些限制说明缺失的面向模型接口面。它们是当前包约束，不是任务积压。

- **没有 TUI 或按键序列接口面**——具名按键序列、全屏 TUI 交互、BEL、调整大小与自动启动均未出现在任何 schema 中。
- **后台模式要求任务接口面**——`run_in_background` 同时需要 `@deepseek-ai/dsh-jobs` 及其面向模型的控制器（`@deepseek-ai/dsh-tool-jobs`）；缺少时会拒绝该参数。

## Config（.）

公开导入：`@deepseek-ai/dsh-tool-terminal`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    enableRunInBackground?: boolean;
    maxResultBytes?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-terminal.md)。

## DEFAULT_MAX_RESULT_BYTES（.）

公开导入：`@deepseek-ai/dsh-tool-terminal`；公开符号：`DEFAULT_MAX_RESULT_BYTES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_MAX_RESULT_BYTES: number;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-terminal.md)。

## MIN_MAX_RESULT_BYTES（.）

公开导入：`@deepseek-ai/dsh-tool-terminal`；公开符号：`MIN_MAX_RESULT_BYTES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const MIN_MAX_RESULT_BYTES = 64;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-terminal.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-tool-terminal`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config?: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-terminal.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-tool-terminal`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-terminal.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-tool-terminal`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-terminal";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-tool-terminal.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
