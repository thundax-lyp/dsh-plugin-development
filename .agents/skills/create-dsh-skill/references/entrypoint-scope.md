# 入口范围与定位流程

目标是找出插件开发者在目标 tag 中确实能用于制作、接入或验证插件的边界，再决定 reference 的拆分。`evidence/capability-candidates.json` 是防漏清单，不直接给出入口、公开性或写入最终 Skill 的结论。每个候选先问：插件作者需要调用、实现、注册、挂载或验证它吗？如果没有具体任务，它只留作证据或给出排除理由。

## 1. 定位入口

先枚举目标 checkout 中 `@deepseek-ai/dsh-*` 包的 package manifest、`exports`/`bin`、公开声明与 `src/index`，从实际可达的包导出解析公开对象；追踪 `export *`、子路径导出、类型重导出、声明合并及生成声明，不能只看入口文件的直接声明。再检索代码里对这些包的 import、调用和组合关系。包前缀是文档入口的发现线索，不是公开可用或默认挂载的证明。随后查找 Cordis `Context` 增量、Service、event、注册函数、Provider 接口、配置类型、持久化格式和工具结果；分别调查 Host 插件、`dsh.client`/Client 模块、Typert Remote，以及 bundle、preset、Profile 的真实挂载入口。对每个入口回溯实现、至少一个调用方或组合点、适用的 gate 与行为测试。导出一个符号并不等于可挂载插件，存在 Profile patch 也不等于默认启用。

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

| 类别                 | 归类准则                                                             | 文档处理                                                                |
| -------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 核心公开契约         | 包公开导出并有插件作者可用的调用、实现或挂载路径；目标组合支持该路径 | 分配唯一 API reference owner，说明入口、语义与限制                      |
| 可选或实验性公开契约 | 有公开导出和真实使用路径，但需额外包、Profile、flag 或实验组合       | 保留独立或明确的可选 reference 段落，标出状态、依赖与不可默认承诺的边界 |
| 实现与基础设施       | 运行时代码、内部辅助包或测试支持，只帮助解释公开入口                 | 放入证据映射；只有开发任务确需直接使用且有公开契约时才提升为 API        |
| 示例、快照与生成物   | fixture、DOCS 样例、测试快照或由生成器拥有的产物                     | 只作定位或验证材料；不宣称是已发布默认组件                              |

一个能力可能横跨多个包，但应按插件作者实际要用的契约拆分 reference。Agent、Subagent、Workflow 与实验性 Agent Teams 的生命周期和入口不同；只有开发者要实现 Provider、调用 Service、注册工具或接入组合时才解释相关机制，不能因其属于 DSH 子系统就写成独立的产品介绍。跨主题关系由路由和相对链接表达，事实正文只在一个 owner 中维护。

不要以“内置 Web 功能”“只是 UI 组件”或“已有 Client 总览”为由直接排除公开包。先核查其导出、包 README 的插件使用路径、样式或构建前置及实际调用方；可供插件作者复用的共享组件、主题 token、slot 和渲染契约按各自任务裁决。具体产品页面可作为调用证据而不自动成为通用 API。被纳入的入口即使同属 Web Client，也须保留各自必需的开发步骤；参见[有限压缩与完整性](reference-template.md#有限压缩与完整性)。

## 3. 反查插件任务路径

独立盘点目标 tag 的包 README、`docs/`、`website/` 中标题或正文提出的“如何……”“怎样……”及等价操作问题，尤其是 cookbook、教程和 WebUI 开发说明。`inventory-dsh-surface.mjs` 自动收集操作性标题及来源到 `evidence/task-candidates.json`；正文中的任务、公开调用方、组合测试和 Profile 装载路径仍需人工补查。每个标题候选在 `coverage.taskDiscoveries` 中映射到任务路径或写具体排除理由，去重时保留不同前置或结果。用户功能说明可作业务目标线索，但只有插件作者可通过公开入口实现的路径才能成为插件 HOW-TO；代码和注释仍优先于文档裁决 API 事实。

对每个相关任务先写可观察的业务结果，再列出共同完成结果的 API 对象与成员、配置/manifest、Host/Client/Remote 侧、调用和装载顺序、资源 owner、失败/取消/卸载与适用的验证证据。把对象组合与公开调用方、运行时代码和测试逐项核对；文档给出的步骤若在目标版本不成立，记录限制或排除理由，不照抄。将裁决写入 `coverage.json` 的 `taskPaths`，并反查各能力的 `pluginTask`；一条任务可串起多个对象和候选，一个对象也可参加多条任务。不要把“使用某包”或“接入可选能力”当成足够具体的任务描述。

逐条检查读者能否从 Skill 入口经任务路由找到完整步骤、最小 example、失败/取消/卸载边界和成功判据。凡需组合多个 API 对象、配置或 Host/Client/Remote 侧才能形成业务能力的任务，都由 HOW-TO 拥有完整操作路径，并链接各对象的权威 API reference；单一入口的独立实现可在 API reference 中给完整 example；纯配置任务给出配置、挂载及观察步骤。API reference 只拥有对象自身的契约，不用若干单对象段落代替组合过程。没有目标版本公开路径或组合证据的任务明确记录限制，不借用旧 Skill、其他 tag 或内部样例填空。

候选全集保证能力不被静默遗漏，任务路径反查保证纳入的能力对插件作者可操作。新目标的冻结器检查 `taskPaths` 是否覆盖纳入能力、目标小节是否存在且从路由可达，但不能判断例子是否完整、可安装或真的达到读者目标；维护者须按[reference 模板](reference-template.md#example-编写契约)逐条核对。

## 4. 落入 reference

先确定唯一 owner 和读者任务，再按[reference 模板](reference-template.md)写契约。每个纳入入口至少写清调用面、可用条件、对象类型及必要成员、输入输出、生命周期、失败/取消/清理、持久性和验证边界；不适用的项说明原因。待废弃标记按[筛选规则](reference-template.md#废弃筛选)核查，不能把废弃成员混进有效对象表。`coverage.json` 指向该 owner，`claims.json` 支撑正文事实，`maintenance/source-map.md` 给出精确版本证据。路由和关键词索引仅指路，不复制契约。写完反查成员底账：每个可供插件任务使用且未废弃的对象与成员都有可定位的正文或具体不展开理由；每个排除项有证据与理由；每项正文 API 都能回溯到目标版本的公开声明。合并入口逐项核对，不能只剩一行概述。此反查是逐成员的人工审稿，现有冻结器只验证候选与小节映射，不能把其 PASS 当作成员完整性证明。
