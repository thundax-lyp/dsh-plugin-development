# 入口范围与定位流程

目标是找出插件开发者在目标 tag 中确实能用于制作、接入或验证插件的边界，再决定 reference 的拆分。`evidence/capability-candidates.json` 是防漏清单，不直接给出入口、公开性或写入最终 Skill 的结论。每个候选先问：插件作者需要调用、实现、注册、挂载或验证它吗？如果没有具体任务，它只留作证据或给出排除理由。

## 1. 定位入口

按以下顺序从目标 checkout 定位入口：

1. 枚举 `@deepseek-ai/dsh-*` 包的 package manifest、`exports`/`bin`、公开声明与 `src/index`。从实际可达的包导出解析对象，追踪 `export *`、子路径导出、类型重导出、声明合并及生成声明；不能只看入口文件的直接声明。
2. 检索代码对这些包的 import、调用和组合关系，再查 Cordis `Context` 增量、Service、event、注册函数、Provider 接口、配置类型、持久化格式和工具结果。
3. 分别调查 Host 插件、`dsh.client`/Client 模块、Typert Remote，以及 bundle、preset、Profile 的实际挂载入口。对每个入口核对实现、至少一个调用方或组合点、适用的 gate 与行为测试。

包前缀只是发现线索；导出符号不能单独证明插件可挂载，Profile patch 也不能证明默认启用。

`inventory-dsh-surface.mjs` 从代码导出生成 `evidence/api-entry-candidates.json`，`discover-public-api-members.mjs` 通过 TypeScript 符号解析子路径和重导出，生成 `evidence/api-symbol-candidates.json`；后者只自动列符号直接声明的成员。维护者在 `skill-source/api-surface.json` 逐项裁决包导出、对象和成员，记录源路径、签名、弃用范围、插件可用性、排除理由及唯一 reference owner。对插件任务访问的 Cordis 声明合并、事件、回调、嵌套结构与联合分支继续人工展开；自动列表不能代替这些语义检查。将不适用、私有、不可达或待废弃项留在底账并写明理由，不放进面向开发者的常规 API 正文。没有证据的格子写“未证实”，不猜测。

然后先读目标 tag 对应声明与实现旁的 JSDoc 和其他源码注释，再逐对象、逐成员检索所属包 README、`docs/`、`website/`、cookbook 和教程，补充用途、语义、默认值、约束、组合步骤与 example 线索；注释或文档提到但底账没有的 API 必须回查包导出和公开声明，再决定是否新增。以运行时代码、gate 和行为测试核对注释与文档未表达的行为，记录冲突和未验证边界。API 事实按代码、注释、文档的顺序裁决；后两者是说明和发现线索，不能覆盖代码。

### 交叉查找目标仓库的文档层

目标 tag 的 `docs/AGENTS.md` 描述了上游文档分工；这里按其职责检索，裁决时仍回到公开类型和运行时：

| 来源                                                                                                 | 提供的线索                        | 使用边界                                                              |
| ---------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------- |
| `docs/architecture.md`、`docs/subsystems/`、`docs/cordis-api/`                                       | 组合地图、子系统类型与 Cordis API | 生成段落须追溯其生成器和源码；不要只抄叙述                            |
| 各包 `README.md`、`README.zh.md`                                                                     | 包级配置、语义、限制与扩展点      | 核对 `exports`、实现和实际挂载                                        |
| `docs/cookbook/`、`docs/cordis-tutorial/`                                                            | 开发任务与步骤                    | 样例只作任务线索，API 需重新核实                                      |
| `docs/user/`、`website/`                                                                             | 用户可见功能及发布网站入口        | 产品界面存在不代表插件开发 API                                        |
| `docs/tool-catalog.md`、`config-catalog.md`、`persistence-catalog.md`、`module-graph.md`             | 生成的工具、配置、格式和模块清单  | 查生成器与目标源码；不要手改生成产物                                  |
| `.agents/notes/implemented/`、`docs/postmortem/`、`docs/persistence-changes/`、`docs/upgrade-guide/` | 设计取舍、事故与历史格式/迁移线索 | 不能代替当前版本的公开契约；archived/proposed/rejected 更不能当作现状 |
| `packages/**/tests/`、`scripts/`、`.github/workflows/`、`snapshots/`                                 | 行为测试、仓库门禁与复现材料      | 区分测试覆盖、规则和 fixture；快照不是默认组合                        |

根 README、`docs/development.md`、`docs/capability-seams.md` 和 `packages/README.md` 可帮助建立全局地图；语言配对的 `.zh.md` 与 `.i18n.yaml` 说明翻译关系，不构成独立的新契约来源。Python SDK、native 和外部协议资料只在任务涉及其边界时追加调查。

## 2. 归类入口

### 插件产品形态盘点

在 API 对象和任务裁决之间，另做一次面向使用者的形态盘点。产品形态按插件交付的能力与可观察入口划分，不按 npm 包数、function/object/class 模块写法或 Host/Client/Remote 运行侧计数。对目标 tag 中每个有公开装载路径的形态，记录：它解决什么问题，能力由谁调用，结果呈现在 Agent 消息、Web 界面、其他插件服务、外部请求或配置状态的何处，开发者如何装载与验证，最终用户如何发现与使用。一个插件可以同时承载多种形态；共同的服务定义、provider 和 consumer 可按实际交付边界合并或分别说明，不能强行一包一类。

从模型工具、Service/Provider、Agent 行为扩展、Client UI、Host 与 Client 间的 Remote、Web route/webhook、配置组合包等线索开始查，不把这份线索表当作目标版本固定支持清单。每类都核查公开包导出或配置入口、真实调用方与 Profile 组合、启用条件、面向用户的呈现证据和至少一条可完成的任务路径；没有直接界面的形态应明确写“无独立 UI”，并说明通过什么消费者或行为观察，而不是硬造展示页面。Remote 若只是跨端传输，应作为组合方式说明，不因存在类型就宣称它能单独成为用户可见插件。核查未通过者留在裁决账本并说明原因。盘点结果写入产物 `SKILL.md` 的“插件形态”总览，详细契约归 API 子主题，制作和使用步骤归 HOW-TO。

| 类别                 | 归类准则                                                             | 文档处理                                                                |
| -------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 核心公开契约         | 包公开导出并有插件作者可用的调用、实现或挂载路径；目标组合支持该路径 | 分配唯一 API reference owner，说明入口、语义与限制                      |
| 可选或实验性公开契约 | 有公开导出和真实使用路径，但需额外包、Profile、flag 或实验组合       | 保留独立或明确的可选 reference 段落，标出状态、依赖与不可默认承诺的边界 |
| 实现与基础设施       | 运行时代码、内部辅助包或测试支持，只帮助解释公开入口                 | 放入证据映射；只有开发任务确需直接使用且有公开契约时才提升为 API        |
| 示例、快照与生成物   | fixture、DOCS 样例、测试快照或由生成器拥有的产物                     | 只作定位或验证材料；不宣称是已发布默认组件                              |

一个能力可能横跨多个包，但应按插件作者实际要用的契约拆分 reference。新目标先写解释对象关系和使用路径的 API 主题页，再把相关对象的具体契约分入子主题页；对象 owner 只指向子主题中的独占小节。Agent、Subagent、Workflow 与实验性 Agent Teams 的生命周期和入口不同；只有开发者要实现 Provider、调用 Service、注册工具或接入组合时才解释相关机制，不能因其属于 DSH 子系统就写成独立的产品介绍。跨主题关系由路由和相对链接表达，事实正文只在一个 owner 中维护。

不要以“内置 Web 功能”“只是 UI 组件”或“已有 Client 总览”为由直接排除公开包。先核查其导出、包 README 的插件使用路径、样式或构建前置及实际调用方；可供插件作者复用的共享组件、主题 token、slot 和渲染契约按各自任务裁决。具体产品页面可作为调用证据而不自动成为通用 API。被纳入的入口即使同属 Web Client，也须保留各自必需的开发步骤；参见[有限压缩与完整性](reference-template.md#有限压缩与完整性)。

### 共享 UI 组件裁决

目标 tag 若公开 `@deepseek-ai/dsh-client-ui-primitives`，把“现成控件是否存在、该选哪一个、如何在插件 Client 中使用”作为独立开发任务。这也包括未说明开发意图的提问，例如“DSH Web UI 提供对话框吗”；产物能力描述须让 Agent 能从此类提问进入 Skill。候选清单为此生成 `shared-ui-component-selection` 任务候选；把它映射到 `coverage.taskPaths` 中 `kind: "shared-ui-component-selection"` 的已覆盖 Client HOW-TO 任务，任务的 `apiObjects` 至少包含一个该包已纳入的公开控件。HOW-TO 链接控件契约；产物 `SKILL.md` 的关键词索引按目标版本实际控件收录“Web UI 组件／共享控件”及“对话框／弹窗／Modal”等用途词，直达契约或明确的导出边界。slot 说明装载和呈现位置，主题说明样式来源，都不能代替控件选型。

逐行审阅目标版本 README 的组件目录并与包入口、声明和调用方核对。对 `Pill`/`Tag`、分段选择、提示、菜单等实际存在的不同用途分别裁决；不因同属 React 或同包就把一个控件算作另一个的替代。纳入的控件按选型差异和必要 props 给出契约，排除的控件逐项说明公开性、可用侧或插件使用路径的具体限制，不能批量写“由同入口已纳入对象承担”。不要求收录包内所有图标、类型或内部组件；用户想要的控件若未公开导出，在选型步骤中明确不存在公开入口，再给出可用的原生语义或本地组件方案。

## 3. 反查插件任务路径

独立盘点目标 tag 的包 README、`docs/`、`website/` 中标题或正文提出的“如何……”“怎样……”及等价操作问题，尤其是 cookbook、教程和 WebUI 开发说明。`inventory-dsh-surface.mjs` 自动收集操作性标题及公开共享 UI 包的选型任务候选到 `evidence/task-candidates.json`；正文中的其他任务、公开调用方、组合测试和 Profile 装载路径仍需人工补查。每个候选在 `coverage.taskDiscoveries` 中映射到任务路径或写具体排除理由，去重时保留不同前置或结果。用户功能说明可作业务目标线索，但只有插件作者可通过公开入口实现的路径才能成为插件 HOW-TO；代码和注释仍优先于文档裁决 API 事实。

对每个相关任务先写可观察的业务结果，再列出共同完成结果的 API 对象与成员、配置/manifest、Host/Client/Remote 侧、调用和装载顺序、资源 owner、失败/取消/卸载与适用的验证证据。把对象组合与公开调用方、运行时代码和测试逐项核对；文档给出的步骤若在目标版本不成立，记录限制或排除理由，不照抄。将裁决写入 `coverage.json` 的 `taskPaths`，并反查各能力的 `pluginTask`；一条任务可串起多个对象和候选，一个对象也可参加多条任务。不要把“使用某包”或“接入可选能力”当成足够具体的任务描述。

逐条检查读者能否从 Skill 入口任务表找到完整步骤、最小 example、失败/取消/卸载边界和成功判据。单对象、多对象及纯配置任务都由 HOW-TO 拥有操作路径；涉及 API 对象时，在任务小节链接每个对象的权威 API reference。按互不重叠的任务结果、前置、运行侧和失败恢复路径拆分 HOW-TO，不因单对象就压缩文件数量。较长的完整代码放到 `references/<side>/examples/example-*.md`，在 HOW-TO 对应步骤处链接；HOW-TO 保留关键选择、短片段和完成判据，example 保留完整文件、构建、装载与验证。API reference 拥有对象自身契约及理解契约所需的最小片段；已有完整用法时，HOW-TO 可链接该段而不重抄，但仍须补足任务操作和判据。没有目标版本公开路径或组合证据的任务明确记录限制，不借用旧 Skill、其他 tag 或内部样例填空。

候选全集保证能力不被静默遗漏，任务路径反查保证纳入的能力对插件作者可操作。新目标的冻结器检查 `taskPaths` 是否覆盖纳入能力、目标小节是否存在且从路由可达，但不能判断例子是否完整、可安装或真的达到读者目标；维护者须按[reference 模板](reference-template.md#example-编写契约)逐条核对。

## 4. 落入 reference

先确定唯一 owner 和读者任务，再按[reference 模板](reference-template.md)写契约。每个纳入入口至少写清调用面、可用条件、对象类型及必要成员、输入输出、生命周期、失败/取消/清理、持久性和验证边界；不适用的项说明原因。待废弃标记按[筛选规则](reference-template.md#废弃筛选)核查，不能把废弃成员混进有效对象表。`coverage.json` 指向该 owner，`claims.json` 支撑正文事实，`maintenance/source-map.md` 给出精确版本证据。产物 `SKILL.md` 的入口任务表与对象名称、`references/object-index.md` 的对象契约表及入口关键词索引仅指路，不复制契约。写完反查成员底账：每个可供插件任务使用且未废弃的对象与成员都有可定位的正文或具体不展开理由；每个排除项有证据与理由；每项正文 API 都能回溯到目标版本的公开声明。合并入口逐项核对，不能只剩一行概述。此反查是逐成员的人工审稿，现有冻结器只验证候选与小节映射，不能把其 PASS 当作成员完整性证明。
