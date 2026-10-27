# @deepseek-ai/dsh-skill-badge 使用路径

## 提供徽章生成 Skill

### 目标与前置

agent（智能体）可以通过该内置提供方加载官方「powered by dsh」徽章 skill，并遵循其指令，给文档、PR（Pull Request）以及其他用 DeepSeek Harness 生成的内容添加署名徽章。该提供方没有配置；部署方需要显式安装并插入插件行。该 skill 同时提供 Markdown 片段和随包分发的 PNG，供无法可靠导入远程图片的系统使用。

使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，安装同一版本的公开包；本任务的 API 契约由[包专题](../api/api-capabilities-dsh-skill-badge.md)维护。

### 操作与装载

1. 在消费项目用 `pnpm add @deepseek-ai/dsh-skill-badge@0.2.1-rc.3` 固定依赖；不要把源码 monorepo 的 `workspace:` 依赖直接复制给消费项目。
2. 按下列公开使用步骤选择配置、注入依赖与运行侧；服务声明与具体提供方分别挂载，不把纯类型子路径当成可执行插件。
3. 交付代码扩展时，把本包作为插件的 peer/dev 依赖，在插件入口用 `inject` 声明所需服务。bundle 的 `package.json` 声明 `dsh.bundle.patch`，patch 用 `- insert:` 加入插件行。从包的父目录运行 `dsh plugin --profile demo add ./你的插件包`，再运行 `dsh --profile demo`；已安装普通依赖没有 bundle patch 时不会自动激活。注册在贡献插件 scope 内完成，返回的清理函数归此 scope 所有。

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
