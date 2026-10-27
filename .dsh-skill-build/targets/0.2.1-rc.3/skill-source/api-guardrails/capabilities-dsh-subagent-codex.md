# @deepseek-ai/dsh-subagent-codex 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

当委派工作需要在父会话工作区中的真实无人值守 Codex 会话内运行时，把 `@deepseek-ai/dsh-subagent-codex` 安装进 Profile。每次委派都会为一个自包含文本任务使用全新且隔离的 Codex 线程，并且只返回所选答案或安全失败诊断。原生 Codex 配置和身份验证继续作为权威来源，而 `permissionMode` 选择非交互式审批和沙箱行为。Bundle 提供兼容的原生 Codex 载荷，并以全局工具形式添加委派工具。

### 使用本包

当任务需要在父工作区中运行全新的原生 Codex 会话时，在 Web 或 Desktop 插件页启用 **Codex 子智能体**。

#### 安装 Bundle

官方条目可离线显示。启用时，普通 bundle 安装器会安装当前 DSH 安装对应的目标并选择其配置层。此层注册提供方，并为所有智能体添加全局工具 `subagent_codex`；实际委派前不会启动原生进程。安装器提示需要重启时，请重启应用。

关闭只会取消选择配置层，保留已安装的包。移除是独立的包操作。启用或关闭会在运行中的 Host 注册或移除该全局工具，正在运行的智能体会在下一次请求时看到变化。

此层只插入 Host 条目，因此任何配置（包括随附的 headless、SDK 和 ACP）都可以选择它。原有仅提供方用法请遵循升级指南。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `providerName` | `codex` | `ctx.subagents` 上的非空注册名称；每个已挂载实例都需要唯一值 |
| `model` | Codex 原生设置 | 为本提供方实例的每个线程固定的可选非空模型名称；省略时不发送 app-server 覆盖 |
| `env` | `{}` | 叠加在已清理凭据的父环境之上的显式子进程环境 |
| `permissionMode` | `never` | 为本提供方实例的每个线程固定的原生非交互审批与沙箱模式 |
| `disposeGraceMs` | `3000` | 共享 managed-range owner 各终止层级之间的宽限 |

| `permissionMode` 值 | `thread/start` 字段 | 原生行为 |
|---|---|---|
| `never` | `approvalPolicy: never`；省略 sandbox | 永不请求审批；在原生 sandbox 下发生的执行失败会返回给模型 |
| `approve-for-me` | `approvalPolicy: on-request`、`approvalsReviewer: auto_review`、`sandbox: workspace-write` | 由 Codex 自动评审权限请求，不等待人工 |
| `dangerously-bypass-approvals-and-sandbox` | `approvalPolicy: never`、`sandbox: danger-full-access` | 跳过审批与 sandbox；必须显式选择该值 |

#### 暴露工具

Bundle 将 `tool-subagent-codex` 作为 Host 条目插入，因此 `subagent_codex` 是所有预设（包括 minimal）都可见的全局工具。后续用户补丁可以按 id 配置或禁用该行。预设自行注册的同名工具会为其智能体遮蔽该全局工具。若要不选择 bundle 层而挂载提供方和工具，在 `cordis.patch.yml` 中插入相同的条目：

```yaml
- insert:
    - id: subagent-codex
      name: '@deepseek-ai/dsh-subagent-codex'
    - id: tool-subagent-codex
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: codex
        toolName: subagent_codex
        maxDepth: provider-managed
```

工具接受任务后返回 child id；任务完成后向父 agent 发送结果通知。外部 activation 只执行一次，不支持追加输入或恢复对话。

#### 你会得到什么

完成通知包含所选的 Codex 答案，或停止原因与可选的安全诊断。父会话还独立保存外部任务的身份和完整终态结果；无需创建本地子 Session。产品推理、工具活动、原始 stderr 与工作区差异不会进入父会话。

#### 失败与恢复

省略 optional dependencies、当前平台不受支持或所选载荷缺失的安装会让提供方保持休眠，并在第一次委派时于 `initialize` 阶段以安全 `unknown` 类别和任何已观测进程结果失败；不存在宿主 CLI 回退。原始 wrapper 文本只保留在 Host stderr。被取消的运行以 `aborted` 结算。

-----

### 已知限制与延期工作

这些限制说明本提供方何时不合适，或何时需要特别的运维注意。它们是当前包约束，不是通用 Codex 对比或任务积压。

- **每次运行均新建一个进程、一个线程和一个轮次**——不支持续接、恢复、池化、进度流或产品会话持久化。
- **静态选择实例**——Profile 配置项固定提供方名称、可选模型与工具绑定；调用无法动态选择或修改提供方与模型，而且每个公开工具都需要唯一的 `toolName`。
- **身份验证与账户状态仍由原生机制管理**——Bundle 会提供 CLI，但不会创建账户、登录、信任项目或改写 Codex 设置；配置与身份验证失败会公开其生命周期阶段与安全的 `unknown` 回退，而不会增加单独的公开分类体系。
- **委派时必须存在原生平台载荷**——省略 optional dependencies 的安装、不受支持的平台以及缺失或损坏的载荷都会在第一次运行时失败；不会回退到宿主 CLI。
- **兼容性由开发证据锁定**——若要从已验证的 0.153.4 协议基线升级，必须重新生成上游 schema 证据，并重新运行握手、答案选择、审批、取消、无密钥真实产品以及带密钥的 DeepSeek 随机数测试。
- **没有人工审批路径**——已知的无人值守审批请求会被拒绝，未知服务器请求会以默认拒绝方式使运行失败；三种 Profile 模式都不会创建 DSH 交互通道或逐次调用 allow 策略。
- **assistant 载荷仅包含所选回答文本**——失败运行还可公开独立的安全诊断；推理、中间消息、工具通信、用量、stderr 与工作区差异不会进入父 Session。任务身份与终态结果保存在父日志中。
- **没有可选的共享能力**——对于本提供方，共享服务会拒绝 `agentPreset`、`agentOptions`、输出 schema 和 harness 深度强制约束。
- **没有按实际经过时间触发的超时或副作用回滚**——长时间运行的工作由调用方取消，且取消前已更改的文件或外部系统不会恢复原状。

## Config（.）

公开导入：`@deepseek-ai/dsh-subagent-codex`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    providerName?: string;
    model?: string;
    env?: Record<string, string>;
    permissionMode?: CodexPermissionMode;
    disposeGraceMs?: number;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-codex.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-subagent-codex`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-codex.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-subagent-codex`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-codex.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-subagent-codex`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "subagent-codex";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-subagent-codex.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
