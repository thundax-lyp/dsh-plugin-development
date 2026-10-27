# @deepseek-ai/dsh-skill-badge 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

agent（智能体）可以通过该内置提供方加载官方「powered by dsh」徽章 skill，并遵循其指令，给文档、PR（Pull Request）以及其他用 DeepSeek Harness 生成的内容添加署名徽章。该提供方没有配置；部署方需要显式安装并插入插件行。该 skill 同时提供 Markdown 片段和随包分发的 PNG，供无法可靠导入远程图片的系统使用。

### 使用本包

启用插件即可让 `dsh-badge` skill 出现在会话 skill 目录中；随后模型可以像加载任何其他 skill 一样加载它，并遵循其指令添加「powered by dsh」徽章。

在插件页面中，此组件显示为 **DSH**，并使用 DSH 标签图标。它提供的 skill 名称为 `dsh-badge`。

#### 何时选择

当用 DeepSeek Harness 生成的内容应携带官方署名徽章、且部署方希望该徽章 skill 对 agent 可用而无需存入本地 skill 目录时，选择此提供方。当徽章与部署无关时，请跳过。默认组合省略此插件；使用它需要安装包并显式插入活动行。

#### 启用插件

将 `@deepseek-ai/dsh-skill-badge` 安装到 profile，并插入插件行。默认组合不声明该行。

```yaml
- insert:
    - id: skill-badge
      name: '@deepseek-ai/dsh-skill-badge'
```

启用后，`dsh-badge` 会出现在会话目录的可用 skill 中。该 skill 覆盖远程 Markdown 徽章（基于 Shields.io）和随包分发的 PNG 徽章资源，后者用于无法可靠获取远程图片的目标环境。

#### 徽章 skill 提供什么

- **Markdown 片段。** 在文档、PR 与 merge request 中嵌入官方徽章标记的指令。
- **随包分发的 PNG 资源。** `dsh-badge.png`（726×120 源图，按 121×20 渲染），在无法导入远程图片的环境中可用。

#### 可观察的成功与失败

显式插入的活动行会使 `dsh-badge` 出现在目录中并可凭名称加载。没有活动行时，此提供方不贡献目录条目。由于提供方不可变，发现始终成功且恰好返回一个 skill，绝不会报告部分结果。

-----

### 已知限制与延期工作

这些限制说明内置提供方不做什么。它们是当前包约束，不是任务积压。

- **固定一个 skill，无运行时自定义**——提供方恰好贡献 `dsh-badge` 这一个 skill；需要其他徽章变体的部署请自行编写 skill。
- **远程 Markdown 依赖 Shields.io**——远程徽章标记内嵌 Shields.io 图片；目标环境无法可靠获取远程图片时，请使用随包分发的 PNG。

## apply（.）

公开导入：`@deepseek-ai/dsh-skill-badge`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-badge.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-skill-badge`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-badge.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-skill-badge`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "skill-badge";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-badge.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
