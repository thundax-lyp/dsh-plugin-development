<div align="center">

<h1>🧩 DSH Plugin Development</h1>

**在正确的扩展点构建 DeepSeek Harness 插件。**

生命周期所有权 · 持久上下文 · Provider · 模型工具 · Client UI · 验证

[English](README.md) · **简体中文**

[![GitHub stars](https://img.shields.io/github/stars/thundax-lyp/dsh-plugin-development?style=for-the-badge&color=yellow&label=Stars)](https://github.com/thundax-lyp/dsh-plugin-development/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/thundax-lyp/dsh-plugin-development?style=for-the-badge&color=blue&label=Forks)](https://github.com/thundax-lyp/dsh-plugin-development/network/members)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)
[![DSH: v0.1.2-rc.1](https://img.shields.io/badge/DSH-v0.1.2--rc.1-4D6BFE?style=for-the-badge)](#兼容性)
[![Agent Skill](https://img.shields.io/badge/Agent-Skill-8257D0?style=for-the-badge)](.agents/skills/dsh-plugin-development/SKILL.md)
[![Offline](https://img.shields.io/badge/References-Offline-2EA44F?style=for-the-badge)](.agents/skills/dsh-plugin-development/references/)

</div>

---

面向 AI 编程 Agent 的 DeepSeek Harness（DSH）插件开发 Skill。

它不是一个可直接运行的 DSH 插件，也不包含 DSH 本体；它是一套绑定特定 DSH
版本的离线开发指南，帮助 Agent 识别正确的扩展点、遵守 Cordis 生命周期与持久
上下文约束，并为实际变更选择合适的验证证据。

> 当前唯一支持的基线：`dsh-v0.1.2-rc.1`

<a id="兼容性"></a>

## 🔌 兼容性

| 范围             | 状态                                   |
| ---------------- | -------------------------------------- |
| DeepSeek Harness | 仅支持 `dsh-v0.1.2-rc.1`               |
| 分发形式         | 普通工作区 Agent Skill                 |
| 运行时代码       | 不包含 DSH runtime                     |
| 网络访问         | 不需要；reference 全部离线             |
| 项目文档         | 中英文概览；Skill 和参考文档以中文为主 |

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

参考库按任务组织已实现的能力、开发契约和已知限制。下表是入口，不是阅读顺序，也不表示所有能力都默认启用。

| 领域          | 内容                                                                                | 参考入口                                                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 工具与模型    | 工具 schema、规范 JSON 结果、Native/PTC、LLM Adapter、模型路由与图像请求            | [tools](.agents/skills/dsh-plugin-development/references/tools.md) · [llm-model-routing](.agents/skills/dsh-plugin-development/references/llm-model-routing.md)                                               |
| Agent 与协作  | Agent 生命周期、输入控制、Subagent、Workflow、Ralph；Agent Teams 单列为实验能力     | [agent-subagent-workflow](.agents/skills/dsh-plugin-development/references/agent-subagent-workflow.md) · [builtin-tool-contracts](.agents/skills/dsh-plugin-development/references/builtin-tool-contracts.md) |
| 上下文与恢复  | Session 日志、Prompt、Preset、Persona、Skills、Compaction、TokenMeter 与 checkpoint | [session-durable-context](.agents/skills/dsh-plugin-development/references/session-durable-context.md) · [context-recovery](.agents/skills/dsh-plugin-development/references/context-recovery.md)             |
| 状态与调度    | Storage domain、Projection/cache、查询与导出、Plan、Goal、Todo、Schedule            | [storage-projections](.agents/skills/dsh-plugin-development/references/storage-projections.md) · [planning-scheduling](.agents/skills/dsh-plugin-development/references/planning-scheduling.md)               |
| 文件与执行    | 文件观察与写入策略、图片附件、Spill、进程、Terminal、Jobs、E2B                      | [filesystem-policy](.agents/skills/dsh-plugin-development/references/filesystem-policy.md) · [runtime-resources](.agents/skills/dsh-plugin-development/references/runtime-resources.md)                       |
| 外部能力      | Web search/fetch、LSP、MCP，以及各 Provider 的协议与执行边界                        | [web-capabilities](.agents/skills/dsh-plugin-development/references/web-capabilities.md) · [runtime-resources](.agents/skills/dsh-plugin-development/references/runtime-resources.md)                         |
| 交互与授权    | Human command、业务提问、动作审批、Credential records、登录 flow、Hooks             | [human-interaction](.agents/skills/dsh-plugin-development/references/human-interaction.md) · [credentials-authorization](.agents/skills/dsh-plugin-development/references/credentials-authorization.md)       |
| Client 与协议 | UI slots、Conversation Nodes、Session/Workspace API、Typert、SDK/ACP、Webhook       | [client-ui](.agents/skills/dsh-plugin-development/references/client-ui.md) · [sdk-acp-integration](.agents/skills/dsh-plugin-development/references/sdk-acp-integration.md)                                   |
| 装配与扩展    | Profile、bundle、Settings、scoped registry、动态 Cordis 与 Host 支持                | [composition-config-credentials](.agents/skills/dsh-plugin-development/references/composition-config-credentials.md) · [dynamic-cordis](.agents/skills/dsh-plugin-development/references/dynamic-cordis.md)   |
| 开发与交付    | 包边界、生命周期、代码示例、组合测试、文档和发布验证                                | [package-authoring](.agents/skills/dsh-plugin-development/references/package-authoring.md) · [testing-docs-maintenance](.agents/skills/dsh-plugin-development/references/testing-docs-maintenance.md)         |

从[开发路由](.agents/skills/dsh-plugin-development/references/plugin-development-routing.md)选择主契约，再按实际影响补读。实验包、外部协议未实现部分及平台限制在各专题中分别标明。

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

当前工作区元数据允许匹配任务时隐式调用，也可以显式使用 `$dsh-plugin-development`。

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

开发前区分 DSH monorepo 与独立插件项目：仓库内的 `workspace:^` 和 vendor 编译路径不能直接复制到独立项目。外部插件通过 Profile 的加载边界、模板适用范围和未验证部分见[包开发](.agents/skills/dsh-plugin-development/references/package-authoring.md#先区分开发环境)。

## 🔄 Agent 的工作流程

使用本 Skill 时，Agent 应按以下顺序工作：

1. 确认目标代码基于 `dsh-v0.1.2-rc.1`。
2. 阅读目标仓库及目标包的贡献说明和相邻实现。
3. 根据可观察结果，从路由表选择一条或多条主路径。
4. 叠加持久化、配置、凭证、并发资源或交付物等横切路径。
5. 按命中 reference 的范围与导航读取相关完整契约，包括失败、取消、权限、持久化和清理规则；按需补读其他专题，再根据目标仓库源码、类型和测试实施变更。
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
├── README.md / README_zh-CN.md
├── AGENTS.md
├── package.json
├── scripts/
│   ├── validate_skill.py
│   ├── test_validate_skill.py
│   └── check_examples.cjs
└── .agents/skills/dsh-plugin-development/
    ├── SKILL.md
    ├── agents/openai.yaml
    └── references/
        ├── plugin-development-routing.md
        ├── source-map.md
        ├── testing-docs-maintenance.md
        └── ...
```

Skill 目录是可复制的离线资料；根目录的 scripts 是维护工具，不是 DSH runtime。普通开发从路由按需阅读；只有维护或升级基线时才按专题使用 source-map。

## ⚠️ 版本与边界

本 Skill 的资料固定到 `dsh-v0.1.2-rc.1`，不跟随 moving branch。目标仓库版本不匹配
时，不应直接套用这里的代码骨架或 API 假设，而应先重新核对对应版本的公开类型、
运行时代码和测试。

此外，本项目：

- 不提供运行时隔离或自动安全审计；
- 不替代目标仓库自己的 `AGENTS.md`、贡献规则和测试 gate；
- 不代表 reference 中的所有建议都已成为 DSH 默认产品能力；
- 不会授权 Agent 执行外部调用、修改凭证、push 或 release。

## 🛠️ 维护与验证

先读[维护流程](.agents/skills/dsh-plugin-development/references/testing-docs-maintenance.md)，再通过[source-map](.agents/skills/dsh-plugin-development/references/source-map.md)定位精确 tag 的代码证据。升级时先核对旧映射对应的类型、实现、测试与门禁，再比较新旧 DOCS 并回查新代码，最后合并结果、删除过期内容并同步路由。

在本维护仓库安装依赖并执行结构检查：

```sh
pnpm install --frozen-lockfile
pnpm verify:skill
pnpm test:validation
```

源码和示例检查需要另行准备精确的 `dsh-v0.1.2-rc.1` checkout，安装其锁定依赖，并运行维护流程要求的 Host/Client 构建。将下方路径替换为该 checkout：

```sh
pnpm verify:skill --dsh /path/to/dsh-checkout
pnpm verify:examples --dsh /path/to/dsh-checkout
```

| 检查                    | 覆盖与限制                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `verify:skill`          | 本地 Markdown 文件与锚点、JSON 代码块、离线边界和行尾空白；不带 `--dsh` 时明确跳过源码路径验证 |
| `verify:skill --dsh`    | 另核查固定 tag/commit 与 source-map 路径                                                       |
| `test:validation`       | 检查器的成功与失败场景，不是 DSH 产品测试                                                      |
| `verify:examples --dsh` | 校验基线与 tracked 源码状态，分开编译 Host/Client；使用临时副本并清理，不修改上游 tracked 文件 |

CI 保留独立的 `Governance` 与 `Skill Integrity` 检查。CI 不包含独立 DSH checkout，因此源码路径与示例编译需要单独执行；静态验证也不替代真实模型、云端、GUI 或跨平台集成测试。

这些命令属于维护仓库，不随单独复制的 Skill 目录分发。缺少依赖或构建声明时，报告未验证或失败，不视为通过。

## 📄 License

本项目使用 [Apache License 2.0](LICENSE)。
