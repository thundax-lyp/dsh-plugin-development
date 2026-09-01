<div align="center">

<h1>🧩 DSH Plugin Development</h1>

**在正确的扩展点构建 DeepSeek Harness 插件。**

生命周期所有权 · 持久上下文 · Provider · 模型工具 · Client UI · 验证

[English](README.md) · **简体中文**

[![GitHub stars](https://img.shields.io/github/stars/thundax-lyp/dsh-plugin-development?style=for-the-badge&color=yellow&label=Stars)](https://github.com/thundax-lyp/dsh-plugin-development/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/thundax-lyp/dsh-plugin-development?style=for-the-badge&color=blue&label=Forks)](https://github.com/thundax-lyp/dsh-plugin-development/network/members)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![DSH: v0.1.1-rc.2](https://img.shields.io/badge/DSH-v0.1.1--rc.2-4D6BFE?style=for-the-badge)](#兼容性)
[![Agent Skill](https://img.shields.io/badge/Agent-Skill-8257D0?style=for-the-badge)](.agents/skills/dsh-plugin-development/SKILL.md)
[![Offline](https://img.shields.io/badge/References-Offline-2EA44F?style=for-the-badge)](.agents/skills/dsh-plugin-development/references/)

</div>

---

面向 AI 编程 Agent 的 DeepSeek Harness（DSH）插件开发 Skill。

它不是一个可直接运行的 DSH 插件，也不包含 DSH 本体；它是一套绑定特定 DSH
版本的离线开发指南，帮助 Agent 识别正确的扩展点、遵守 Cordis 生命周期与持久
上下文约束，并为实际变更选择合适的验证证据。

> 当前唯一支持的基线：`dsh-v0.1.1-rc.2`

## 🔌 兼容性

| 范围             | 状态                       |
| ---------------- | -------------------------- |
| DeepSeek Harness | 仅支持 `dsh-v0.1.1-rc.2`   |
| 分发形式         | 普通工作区 Agent Skill     |
| 运行时代码       | 无                         |
| 网络访问         | 不需要；reference 全部离线 |
| 项目文档         | 英文和简体中文             |

## 🎯 解决什么问题

开发 DSH 扩展不只是增加一个函数。一个产品可用的插件通常还需要处理生命周期、
Session 日志、持久状态、配置、凭证、UI 组合、取消与清理，以及真实 Loader 路径
上的验证。

本 Skill 为 Agent 提供一套任务路由和实现约束，使其能够：

- 根据用户要求选择合适的 DSH plugin、service 或 event 扩展点；
- 避免在已有扩展点时直接修改 agent loop；
- 正确处理 Cordis effect、注册清理和异步资源所有权；
- 保证模型可见输入能够从 Session log 重建；
- 在需要独立演进时拆分 Service Definition、Provider 与 Consumer；
- 区分 Session event、Session projection 与插件自有持久状态；
- 为模型工具、Provider、Client UI 和远程 API 选择对应的组合测试；
- 同步公共 API 文档、包 README、快照和必要的设计记录。

## 🧭 覆盖范围

Skill 内置的离线 reference 覆盖以下开发路径：

| 领域       | 能力                                                            |
| ---------- | --------------------------------------------------------------- |
| 模型能力   | Tool、render intent、system prompt、runtime context、Skill 贡献 |
| Provider   | Service/Provider/Consumer 接缝、LLM Adapter、第三方协议         |
| Agent      | Agent 生命周期、输入控制、Subagent、TeamTask、Workflow          |
| 人机交互   | Human command、普通用户提问、一次动作审批                       |
| Client     | UI slot、component/store/action/locale、Conversation Node       |
| 远程访问   | Typert Remote API、Gateway carrier、rc.2 Webhook 接收器         |
| 状态与存储 | Session event、projection、Storage domain、插件持久状态         |
| 组合与配置 | Profile、bundle、boot、Config、Settings、Credential             |
| 工程交付   | 新包、生命周期测试、组合快照、文档、生成物和发布检查            |

完整任务索引见
[`plugin-development-routing.md`](.agents/skills/dsh-plugin-development/references/plugin-development-routing.md)。

## 🚀 使用方式

### 1. 将 Skill 放入工作区

仓库已经采用工作区 Skill 目录结构：

```text
.agents/
└── skills/
    └── dsh-plugin-development/
```

可以直接克隆本仓库，或者将
`.agents/skills/dsh-plugin-development` 复制到目标工作区对应的 Skill 目录。

### 2. 在 DSH 开发任务中调用

示例提示词：

```text
使用 $dsh-plugin-development，为 DSH 增加一个只读的项目搜索工具。
```

```text
使用 $dsh-plugin-development，实现一个新的 LLM Provider Adapter，并补齐组合测试。
```

```text
使用 $dsh-plugin-development，为现有插件增加可持久化设置和 Browser 设置卡片。
```

Skill 适用于实现或修改 DSH 扩展，不适用于普通 DSH 使用指导，也不用于与代码变更
无关的纯文档编辑。

## 🔄 Agent 的工作流程

使用本 Skill 时，Agent 应按以下顺序工作：

1. 确认目标代码基于 `dsh-v0.1.1-rc.2`。
2. 阅读目标仓库及目标包的贡献说明和相邻实现。
3. 根据可观察结果，从路由表选择一条或多条主路径。
4. 叠加持久化、配置、凭证、并发资源或交付物等横切路径。
5. 完整读取命中的 reference，再根据目标仓库的源码、类型和测试实施变更。
6. 按实际变更面执行最小但充分的验证。
7. 只报告真正运行并观察到结果的命令。

事实冲突时，优先级为：

```text
公开类型与运行时代码
  > 执行中的 repository gate
  > 行为测试
  > 所属包 README
  > 其他叙述文档
```

## 🧱 关键实现原则

- 存在正式扩展点时，通过 plugin、service 或 event 扩展，不修改 agent loop。
- 每项注册、并发任务、subprocess、socket 和 teardown 都必须有生命周期所有者。
- 模型可见事实必须存在可持久化证据，并能从 Session log 重建。
- 模型工具只定义一个规范 JSON 结果，展示层仅根据参数和该结果进行纯渲染。
- 部署差异进入经过验证的配置、profile 或 patch，不隐藏在运行时默认值中。
- 产品可见 wiring 必须覆盖真实 Loader/应用组合；局部 `ctx.plugin(...)` 测试不等价。
- 生成的 catalog 只用于发现事实；应修改事实源并运行 generator，而不是手工编辑生成区。

## 🗂️ 目录结构

```text
.
├── README.md
├── README_zh-CN.md
├── AGENTS.md
├── LICENSE
└── .agents/skills/dsh-plugin-development/
    ├── SKILL.md                  # Skill 入口、触发范围和全局规则
    ├── agents/openai.yaml        # 展示名称与默认提示词
    └── references/
        ├── plugin-development-routing.md
        ├── cordis-lifecycle.md
        ├── tools.md
        ├── capability-seams-providers.md
        ├── llm-provider-adapters.md
        ├── agent-subagent-workflow.md
        ├── session-durable-context.md
        ├── storage-projections.md
        ├── client-ui.md
        ├── client-conversation-nodes.md
        ├── typert-remote-api.md
        └── ...
```

`SKILL.md` 保持精简，只定义入口和不变量。详细知识按主题拆分到 `references/`，Agent
只加载当前任务命中的资料，避免把整套文档无差别加入上下文。

## ⚠️ 版本与边界

本 Skill 的资料固定到 `dsh-v0.1.1-rc.2`，不跟随 moving branch。目标仓库版本不匹配
时，不应直接套用这里的代码骨架或 API 假设，而应先重新核对对应版本的公开类型、
运行时代码和测试。

此外，本项目：

- 不提供运行时隔离或自动安全审计；
- 不替代目标仓库自己的 `AGENTS.md`、贡献规则和测试 gate；
- 不代表 reference 中的所有建议都已成为 DSH 默认产品能力；
- 不会授权 Agent 执行外部调用、修改凭证、push 或 release。

## 🛠️ 维护

维护或升级 Skill 基线时，应先阅读
[`source-map.md`](.agents/skills/dsh-plugin-development/references/source-map.md) 和
[`testing-docs-maintenance.md`](.agents/skills/dsh-plugin-development/references/testing-docs-maintenance.md)。

更新要求包括：

- 在精确的目标 tag 上重新核对所有真相源路径；
- 重新对齐公开类型、运行时代码、测试和可执行 gate；
- 编译检查 TypeScript code fence，并解析 JSON code fence；
- 验证所有本地 Markdown 链接和 heading anchor；
- 保持 Skill 完全离线，不在 Skill 目录中引入 HTTP(S) URL；
- 不把新版本才存在的 API 静默写入旧版本基线。

## 📄 License

本项目使用 [Apache License 2.0](LICENSE)。
