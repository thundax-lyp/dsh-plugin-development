# @deepseek-ai/dsh-experimental-tool-worktree 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

从 GUI 插件管理器添加 Git 工作树，让模型通过一次调用创建并进入新的 Git 工作树。此可选 bundle 随 Harness 安装，在选中之前保持关闭。原生工具调用与 PTC 程序获得相同的带类型结果，创建操作沿用现有文件策略。

### 使用本包

在 GUI 中打开**插件 → 官方 → Git 工作树**并启用开关。此 bundle 一起加载工作树运行时与本工具；所有随附 profile 默认关闭它。关闭后会移除 `create_worktree`，已有检出目录与分支会保留。内置 `working_directory` 工具仍然可用。

在显式组合中，将此函数插件挂载到工作树运行时和工具注册表之后。

```yaml
- name: '@deepseek-ai/dsh-experimental-worktree'
- name: '@deepseek-ai/dsh-experimental-tool-worktree'
```

-----

### 已知限制与待办工作

- **必须有调用 Agent**——工具改变 Session 目录，没有 Agent 的调用会被拒绝。
- **仅负责创建**——检查、合并、移除检出目录或删除分支不属于此工具；运行时限制同样适用。

## apply（.）

公开导入：`@deepseek-ai/dsh-experimental-tool-worktree`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-tool-worktree.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-experimental-tool-worktree`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-tool-worktree.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-experimental-tool-worktree`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "tool-worktree";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-tool-worktree.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
