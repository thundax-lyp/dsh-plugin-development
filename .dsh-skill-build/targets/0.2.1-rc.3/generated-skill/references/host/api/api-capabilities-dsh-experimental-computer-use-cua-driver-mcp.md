# @deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

让模型通过已安装的 Cua Driver 操作本地桌面。将本包与 computer-use 服务一同挂载，即可通过 MCP 提供驱动自身的工具描述、参数和结果。安装和桌面权限由 Cua Driver 负责，默认不启用任何驱动。提供者在连接和工具完成关闭前持续占用计算机使用能力；并发 Session 由调用方自行协调。

### 使用本包

当 Cua Driver 已在运行 DSH 的同一台机器上安装并配置好时，选择此提供者。平台设置以上游安装和权限指南为准。

#### 最小配置

将以下条目加入已提供 tools 和 system-prompt 服务的组合。截图还需要附件存储，以及声明支持图像输入的模型路由。

```yaml
- name: '@deepseek-ai/dsh-computer-use'
- name: '@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp'
  config:
    command: cua-driver
    args: [mcp]
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `command` | `cua-driver` | 已安装的可执行程序路径或 PATH 命令 |
| `args` | `[mcp]` | 不经过 shell、直接传入的参数 |
| `toolCallTimeoutMs` | MCP 客户端默认值 | 单次调用的超时覆盖值，单位为毫秒 |
| `reconnect` | MCP 客户端策略 | 可选的重连覆盖配置 |

#### 激活与所有权

提供者在连接前以 `cua-driver-mcp` 注册。第二个计算机使用提供者会激活失败，包括本包的另一个实例。初始化或首次工具发现失败会使本条目激活失败，并在清理后释放注册。之后连接断开时，MCP 客户端重连或耗尽尝试次数均保留注册；卸载条目才会释放注册。

模型看到的工具使用固定的 `mcp__cua-driver-mcp__` 命名空间。工具名称、描述、输入模式、规范结果和图像准入遵循现有 MCP 桥接器。本包不额外提供 DSH 操作目录或提供者选择工具。

-----

### 已知限制与延后工作

此提供者依赖已安装的驱动及 MCP 桥接器支持的能力。

- 桌面访问需要完成上游安装并取得平台权限；插件激活本身不能证明每个桌面操作都已获准。
- 多个 Session 共享一个桌面。一次运行一个计算机使用工作流，或在外部协调；注册不会串行化 Session 的操作。
- 驱动升级可能改变发现的目录。本提供者不支持运行时驱动切换、专用桌面权限界面或 DSH 操作抽象。
- 启动时限及富结果限制遵循 MCP 客户端的限制。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    command: string;
    args: string[];
    toolCallTimeoutMs?: number;
    reconnect: McpClient.ReconnectConfig;
}

export declare const Config: z<Partial<Config>, Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-mcp.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): Promise<void>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-mcp.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-mcp.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "experimental-computer-use-cua-driver-mcp";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-mcp.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
