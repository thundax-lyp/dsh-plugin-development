---
name: create-dsh-skill
description: 仅在用户显式调用 $create-dsh-skill 时，按最新已发布 RC 或用户指定的 @deepseek-ai/dsh-agent 精确版本创建本仓库 skills/dsh-plugin-development；普通 DSH 插件开发不使用。
---

# 创建 DSH Plugin Development Skill

用户显式调用 `$create-dsh-skill [version]`；省略参数时解析最新已发布的稳定 RC，传入参数时使用用户指定的精确已发布 `@deepseek-ai/dsh-agent` 版本号。本 Skill 负责创建本仓库的 `skills/dsh-plugin-development/` 产物，并维护创建所需的公开文档、验证设施和治理配置。先读仓库 [AGENTS.md](../../../AGENTS.md) 取得协作与交付规则；不要读取现有 `skills/dsh-plugin-development/**` 作为创建输入。不要把本维护 Skill 放入待分发的 Skill 目录，也不要在这里添加 DSH runtime 或示例产品。

**产物定位：教开发者制作 DSH Plugin，不编写 DSH 百科。** 生成的 Skill 要帮助读者选择插件扩展点，创建和挂载包，注册 Service、Provider、工具、Client UI 或 Remote，处理配置、权限、生命周期与持久状态，并验证真实组合。每个 reference 都应回答一个插件作者会遇到的实现或使用问题；只收录完成这些任务必需的 DSH 契约和内部机制。目标仓库的子系统、内置产品功能、历史和设计理由可以作为发现及裁决证据，但不能因为存在文档或公开包就整段转写为面向插件作者的说明。

**以可用性决定篇幅，不设 reference 字数、文件数或示例数上限。** `SKILL.md` 与路由保持索引职责；承担契约的 reference 和 HOW-TO 必须展开到读者无需猜测公开签名、装载路径、状态归属、失败与清理、验证判据就能完成任务。仅压缩重复叙述、与插件任务无关的产品内部细节和可由相对链接到达的同一事实；不得为了缩短产物把不同入口合成一段能力简介、把完整 example 改成伪代码，或把未写出的步骤推给读者自行查源码。具体保留准则见[reference 模板](references/reference-template.md#有限压缩与完整性)。

Skill 创建以目标 tag 为唯一事实输入。生成阶段将现有 `skills/dsh-plugin-development/**` 视为不存在：不读取、不比较、不修补，也不从旧 source-map、旧 Skill 或 DOCS diff 生成目标知识。新 Skill 在隔离目录完整生成并通过验证后才整体替换正式目录。交付前仍须审阅 Git diff；该检查只确认本次仓库改动范围，不是升级事实的来源。

## 一次性准备目标

在本仓库根目录只运行准备脚本；传入版本参数时原样转交，没有参数时省略末尾的 `[version]`：

```text
node .agents/skills/create-dsh-skill/scripts/prepare-dsh-skill-target.mjs [version]
```

准备脚本必须一次完成版本解析、完整仓库初始化或更新、tag 与 commit 校验、detached worktree、`docs/` 快照、provenance 写入和素材目录初始化。成功后读取它输出的目标路径继续工作，不手工重复这些步骤。

脚本内部调用 `resolve-dsh-agent-version.mjs`，后者必须通过 `npm view @deepseek-ai/dsh-agent versions --json` 拉取全部已发布版本。未传版本时只保留完整匹配 `X.Y.Z-rc.N` 的版本，再按 `major`、`minor`、`patch`、`rc` 数值顺序选择最新项；传入版本时不限制格式，只进行字符串精确匹配。不存在的版本报错并停止。不要用 `npm view ... version`、`latest` dist-tag、本地缓存清单或字符串排序替代。

脚本必须幂等：目标 tag、commit、remote、checkout 和 DOCS 快照一致时可安全重跑，并保留已有 `evidence/` 与 `skill-source/`；同一路径已有不一致内容、checkout 有修改或标识不能互相对应时失败，不静默覆盖、清理或猜测。

## 准备目标工作区

使用本仓库忽略的 `.dsh-skill-build/` 作为维护工作区，结构固定为：

```text
.dsh-skill-build/
├── repository/                        # 可复用的完整 deepseek-harness Git 仓库
└── targets/
    └── <version>/
        ├── checkout/                  # 精确目标 tag 的独立 worktree
        ├── upstream-docs/             # 目标 tag 的原始 docs/ 快照
        ├── provenance.json            # npm 版本、tag、commit 与 remote
        ├── evidence/                  # 从目标版本独立抽取的原始证据
        │   ├── public-api/
        │   ├── runtime/
        │   ├── exports/
        │   ├── gates/
        │   ├── tests/
        │   ├── api-entry-candidates.json
        │   ├── api-symbol-candidates.json
        │   ├── task-candidates.json
        │   └── documentation/
        ├── skill-source/              # 经裁决的唯一 Skill 构建素材
        │   ├── manifest.json
        │   ├── claims.json
        │   ├── coverage.json          # 目标版本能力候选的完整处置账本
        │   ├── api-surface.json       # 公开导出、对象与成员的逐项裁决
        │   ├── entrypoint/
        │   ├── metadata/
        │   ├── api-guardrails/
        │   ├── concepts/
        │   ├── how-to/
        │   ├── indexes/
        │   ├── maintenance/
        │   └── assets/
        └── generated-skill/           # 从冻结素材新建的完整待发布 Skill
```

以上结构由准备脚本创建。`.dsh-skill-build/repository/` 是从 `https://github.com/deepseek-ai/deepseek-harness.git` 获取的可复用完整仓库；每个版本只建立自己的精确 worktree 和素材目录。`upstream-docs/` 完整复制目标 checkout 的 `docs/` 并保留目录结构，它是原始文档证据，不是最终 Skill 素材。首次准备新版本时 `evidence/` 与 `skill-source/` 必须为空；重跑只验证并保留它们，脚本不得替维护者删除已开始的工作。

## 从目标版本重建证据

先生成目标版本的候选面和能力候选清单：

```text
node .agents/skills/create-dsh-skill/scripts/inventory-dsh-surface.mjs <target>
node .agents/skills/create-dsh-skill/scripts/discover-public-api-members.mjs <target>
node .agents/skills/create-dsh-skill/scripts/initialize-capability-coverage.mjs <target>
```

若公开成员发现器自身的规则在同一次创建中修正，先审查规则差异，再对同一精确目标显式运行 `discover-public-api-members.mjs <target> --refresh` 重算其生成候选，并将已有 `api-surface.json` 按新候选逐项协调；普通重跑仍拒绝静默改写已有证据。

**并行抽取，主 agent 定稿。** 候选清单生成后，主 agent 按目标版本的能力和任务候选划分互不重叠的主题，同时启动多个 subagent 分组调查与起草章节，而不是逐个等待。每组都使用同一精确 checkout，负责核查自己的公开导出、类型成员、运行时、门禁、行为测试和文档任务，并提交候选 ID 处置建议、证据路径、API 契约、完整示例与未覆盖项。给每组指定独占的 `evidence/` 和 `skill-source/` 文档路径；共享的 `coverage.json`、`api-surface.json`、`claims.json`、manifest 和路由由主 agent 汇总写入，避免并发覆盖。跨主题入口先记录交叉关系，不由两个小组各写一份权威事实。主 agent 收齐各组结果后逐项核对候选是否遗漏或重复，复查冲突和跨侧组合，统一术语、结构、链接与示例，亲自完成最终润色、冻结、构建和独立验证。subagent 的“已完成”只表示其分组草稿交付，不代表整项 Skill 已完成；若当前环境没有并行 subagent 能力，主 agent 按相同分组顺序完成，不因此停止创建。

独立遍历目标 tag 的包、公开声明、exports/bin、Service/Remote、默认 bundle/preset、manifest、配置与持久化格式、运行时实现、仓库 gate、行为测试以及完整 DOCS。脚本从目标版本的非私有 `@deepseek-ai/*` 包生成代码导出候选（包含 Cordis 基础包）、TypeScript 符号及直接声明成员候选，并生成能力候选和 README、DOCS、website 中的操作标题候选。`package.json`、CSS、YAML 和通配源码路径仍留在 inventory，不冒充 API 对象。候选只是防漏队列，不证明插件可用性；正文中的任务、Cordis 声明合并、嵌套或联合分支仍需人工补查。该候选集不比较其他版本，因此升级、降级和同版本重建使用同一流程。

**来源不止 `docs/` 和包名。** 先读目标 tag 的 `docs/AGENTS.md` 确认文档归属，再并行调查：`docs/architecture.md`、`docs/subsystems/`、`docs/cordis-api/` 的架构与类型线索；各包 README 的包级契约；`docs/cookbook/` 与 `docs/cordis-tutorial/` 的开发任务；`docs/user/` 与 `website/` 的用户可见路径；生成的工具、配置、持久化目录及其生成器；`.agents/notes/implemented/` 的设计理由；测试、脚本、CI、Profile 和快照的行为或组合证据。升级指南、历史格式、事故记录以及 proposed/archived/rejected notes 只用于发现边界或历史，不直接证明当前契约。Python SDK、native 与外部协议资料按任务边界追加。完整用途与限制见[入口范围与定位流程](references/entrypoint-scope.md)。

**先列公开 API 成员，再补文档语义，最后写 reference。** 按[入口范围与定位流程](references/entrypoint-scope.md)从目标版本包的实际代码导出与公开声明解析对象及其属性、方法、事件和回调，追踪子路径与重导出，在 `skill-source/api-surface.json` 逐项裁决导出、对象和成员。自动发现只列声明直接拥有的成员；Cordis 声明合并、嵌套和联合分支继续人工核查并补到相应对象的正文，不可用自动列表代替语义审查。再核查插件作者实际能调用、实现或挂载的路径：Cordis service/event、Host/Client/Remote 入口、代码中的 import/调用关系和真实 Profile 组合。以目标 tag 的源码注释、DOCS、包 README、教程和 cookbook 补充语义及用法；文档里出现的新 API 线索回查公开代码。逐一回溯实现、调用方、gate 与测试，记录公开性、所在侧、启用条件和稳定性；不要从 DOCS 标题、包名或旧 Skill 的 reference 名称直接推定能力边界。先把入口归入核心公开契约、可选或实验性公开契约、仅供取证的内部实现、示例/生成物，再确定每个能力的唯一 reference owner。

第二条命令只按目标路径生成 `decision: pending` 的审查队列，不做语义决定，也不覆盖已有工作。逐组核查并把队列拆分或合并为最终 `skill-source/coverage.json`。多个候选可以在语义核查后归并到一个能力主题，但每个候选必须恰好出现一次：

**候选生成不是交付节点。** 即使候选数量很大，也应按能力主题分批持续核查公开成员、运行时、文档任务和组合路径，逐批写入证据与 `skill-source/`；不得仅因工作量大或自动清单已生成就结束创建并把待裁决状态当作交付。只有出现具体、不可继续推进的阻塞，才记录已完成范围、阻塞证据及受影响的验证，并保留素材供恢复。

- `included`：作为独立能力纳入，列出 topic、正式 owner 和摘要；
- `merged`：由更高层能力覆盖，列出 topic、正式 owner、摘要和 `mergedInto`；
- `excluded`：与插件制作无关、私有、重复或不可供插件作者使用，写明适用于这组候选的具体理由；不能仅以实验目录为由排除可用的插件入口。

不得用“未发现”“范围外”等通用理由批量隐藏未调查候选。package、DOCS 或 manifest 出现只代表必须裁决；是否公开、稳定或默认挂载仍以类型、exports、运行时、gate 和测试为准。候选处置是覆盖充分性门禁，不是产品事实本身。

按能力主题把原始定位和观察结果写入 `evidence/`，不按旧 Skill 的目录或主题反向决定调查范围。旧 Skill、其他 tag 和版本 diff 既不提供事实，也不提供必保留主题；目标版本自己的候选全集决定覆盖范围。

API 事实按 **代码 → 注释 → 文档** 裁决。代码包括包导出、公开类型、运行时实现与可执行仓库门禁；行为测试用于核验具体行为及边界。JSDoc 和其他源码注释解释设计意图，所属包 README、DOCS 和其他叙述文档补充使用说明；注释或文档与代码冲突时保留代码结论并记录冲突，不从低优先级材料创造不存在的公开成员、默认值或行为。证据路径必须是目标 commit 跟踪的普通文件；路径、符号或测试存在只表示需要继续核查，不能单独证明公开可用性或运行时语义。

对每项能力核查公开导出、可用侧、对象类型与插件作者会使用的属性/方法/事件、输入输出、生命周期所有权、失败、取消、清理、权限或 manifest 条件、默认挂载状态以及稳定性。逐成员检查目标 tag 的 `@deprecated`、明确“待废弃”等标记：标记整项入口则排除整项，标记成员则仅排除该成员；记录精确来源与可用替代，不把待废弃 API 放进常规 reference、路由和 example。私有实现、实验入口、示例、翻译、快照和生成文件按实际归属记录，不得当作已发布默认 API。设计建议、可由原语组合出的方案和外部协议要求必须与 DSH 已实现事实分开。

按[证据模型](references/evidence-model.md)把覆盖裁决写入 `coverage.json`，把正式事实写入 `claims.json`。inventory 和候选清单负责防漏，不能代替语义核查。每个纳入或合并的入口须能在其 owner reference 中找到具体可用契约；大量候选指向同一概述页或只有 coverage 标记，不算内容已覆盖。

再独立盘点目标 tag 的包 README、DOCS、website 中的“如何……”及等价操作问题，结合 cookbook、教程、公开调用方和真实 Profile 组合，形成插件开发任务候选及来源。自动发现的标题逐项写入 `coverage.json.taskDiscoveries`，纳入者关联一条 `taskPaths`，排除者给具体理由；正文中漏检的任务人工补入 `taskPaths`。按可观察的业务结果裁决每条任务，把共同完成它的 API 对象、配置、跨侧装配、顺序和验证串成使用路径；API 事实仍遵守代码、注释、文档的优先级。新准备目标的 `taskPaths.apiObjects` 关联已纳入的 API 对象，多对象任务还写 `compositionSteps`，由 HOW-TO 给出端到端步骤并链接各自的 API reference；单对象任务可由完整 example 承接；纯配置路径要有配置、挂载和观察步骤。每条已覆盖路径要能从任务路由到达实现步骤、验证与完成判据。没有公开入口或目标版本尚不能完成的任务，以 `excluded` 任务和具体理由记录，不凭旧产物补齐。冻结器检查候选处置、对象映射、HOW-TO 链接和路由；步骤语义仍由维护者审阅。

从已覆盖任务中选出少量常见且能经目标版本公开入口完成的首屏任务。在其 `taskPaths` 项写 `userIntents` 和 `entry`，指向一个已列入 `destinations` 的 HOW-TO 文档、标题和 Markdown anchor。新准备目标在 manifest 设 `taskNavigation: "generated"`，于入口和任务路由各放一对生成区标记，运行 `sync-task-navigation.mjs <target>`；它从任务账本生成首屏直达链接和完整任务路由，不手抄导航表。每条已覆盖任务须有独占的非空目的小节；共用通用“完成判据”小节时先拆分具体任务正文。首屏选择及步骤语义仍由维护者裁决。既有未启用此模式的冻结素材保持原格式，不能把它们的静态链接检查称为自动生成或运行验证。字段和命令见 [Skill Source 契约](references/skill-source-contract.md#任务导航与场景验证)。

## 裁决 Skill 构建素材

把已核实的证据归一化到 `skill-source/`。这里是生成正式 Skill 的唯一知识输入；`upstream-docs/`、`evidence/`、旧 Skill 和旧 source-map 都不能绕过它直接生成正式内容。

按 [Skill Source 契约](references/skill-source-contract.md)编写 `manifest.json` 和全部新文档。每篇 API reference 和 how-to 按[reference 模板](references/reference-template.md)组织；模板是写作结构，不是可直接复制的产品事实。manifest 记录目标版本、tag、commit、remote、素材状态、覆盖主题以及每个输入到新 Skill 输出的映射。抽取与裁决期间状态为 `draft`；只有下列条件全部满足后才能改为 `frozen`：

- 每项产品事实都有目标代码 owner 和证据类别，冲突已有明确裁决；
- 目标版本的每个能力候选都在 `coverage.json` 中被恰好处置一次，纳入或合并项都能路由到正式 topic 与 owner；
- 公开导出、运行时语义、门禁与测试已核对，DOCS-only 声明未写成已实现行为；
- 不可用、私有、实验和不纳入内容已有理由；
- API 围挡覆盖可用范围、限制、生命周期与失败路径；
- 直接使用的公开对象类型已按插件任务展开属性、方法、事件及嵌套/联合分支的必要契约；待废弃入口或成员已按标记范围排除并在裁决账本留下证据；
- 公开 API 成员底账已与 reference 双向核对：每个可用且未废弃的对象或成员都有正文归属或具体不展开理由，每项正文 API 都有目标版本的公开声明来源；DOCS 中新增的 API 线索已经回查代码；
- 每个纳入的独立公开入口都有 `pluginTask` 和指向非空正文小节的 `ownerSections`；合并项写明有效主候选及具体关系，过多候选集中于一节时拆分；
- 每份 reference 都能说明插件作者何时使用该入口、如何接入真实组合、需遵守什么边界及怎样验证；纯内部架构或产品功能叙述不得充作覆盖；
- 合并的入口没有丢失各自的签名、启用条件、失败和验证语义；若共享正文需要反复写“按具体接口核查”才能使用，应拆分 reference 或专题小节，而不继续压缩；
- 需要读者编写插件代码的主要任务有目标 tag 可编译的完整最小 example；独立消费包的依赖、导出、构建与安装路径已核查，Host/Client/Remote 面分别处理；省略 example 的配置任务有可执行的配置和观察步骤；
- 关键词索引能把符号、术语、包名和能力词路由到唯一权威主题；
- how-to 能以已核实原语完成真实插件任务，列出组成文件、装载路径、失败/取消/卸载以及适用的恢复判据，并引用而不复制 API 契约；
- 涉及多个 API 对象的“如何……”任务已由 HOW-TO 说明组合顺序和业务结果，所用对象均链接到其权威 API reference；相关文档任务候选均有去向或排除理由；
- 新目标的 `taskPaths` 已逐项裁决，纳入或合并的能力候选均由已覆盖任务承接；主要插件任务已人工走通“入口 → 路由 → 契约/example → 验证”，无法完成或未验证的路径没有被写成已完成。

通过冻结命令完成结构与证据门禁，并给所有输入记录内容哈希：

```text
node .agents/skills/create-dsh-skill/scripts/validate-skill-source.mjs <target> --freeze
```

构建器只能从 `frozen` 的 `skill-source/` 生成正式 Skill。使用单一目录和状态字段，不并存容易漂移的 `draft/`、`final-docs/` 副本。

## 重建正式 Skill

从冻结素材在 `generated-skill/` 新建完整的 `dsh-plugin-development/`。构建过程不得读取正式目录；以下职责全部由新素材决定：

- `SKILL.md`：适用场景、本次创建所用的精确版本、任务路由、跨主题不变量和完成边界；
- `references/plugin-development-routing.md`：按开发任务路由到最小参考集；
- `references/` 中的 API reference：公开契约、可用性、限制及 API 围挡；
- `references/keyword-index.md`：关键词到唯一权威 reference 的索引，不复制契约正文；
- `references/` 中的 how-to：端到端任务、资源所有权、失败、取消、清理和验证，并链接相关 API 围挡；
- `references/terminology.md`：概念定义及易混淆边界；
- `maintenance/source-map.md`：正式 reference 事实到目标 tag 类型、导出、实现、门禁、测试和 DOCS 的证据映射；
- `maintenance/skill-maintenance.md`：重建、生成、验证和发布流程。

`source-map.md` 是本次新建内容的证据账本，不是下一次创建的生成输入。每项事实只有一个 reference 归属；路由、关键词索引、how-to 和 source-map 通过相对链接引用它。新目录完整通过验证后，以它整体替换 `skills/dsh-plugin-development/`；不得从旧目录挑选文件保留。项目 README 和 CI 始终说明创建流程，不固定某次产物的版本；生成产物自己的入口、元数据和 source-map 才记录本次精确版本，并保持离线边界。

按[输出契约](references/output-contract.md)构建并独立验证：

```text
node .agents/skills/create-dsh-skill/scripts/build-dsh-plugin-development-skill.mjs <target>
node .agents/skills/create-dsh-skill/scripts/verify-generated-skill.mjs <target>
```

再以生成目录为显式输入，对同一精确 checkout 检查源码映射并分别编译 Host/Client 示例；这两条命令不得回退读取正式 Skill：

```text
python3 scripts/validate_skill.py --skill <target>/generated-skill --dsh <target>/checkout
node scripts/check_examples.cjs --dsh <target>/checkout --skill <target>/generated-skill
```

构建器先在临时目录生成并验证完整产物，验证成功后才替换 `generated-skill/`；验证失败保留旧产物。生成目录的结构和示例验证通过后运行整目录替换，不做覆盖合并。替换脚本默认保护正式 Skill 中未保存的修改；若它正好是上一次替换的输出，可将上次返回的 `installedDigest` 作为 `--expected-formal-digest` 传入，摘要不一致时仍拒绝。新目录就位前的错误必须恢复旧目录；就位后的备份清理失败作为已完成替换的警告返回：

```text
node .agents/skills/create-dsh-skill/scripts/replace-generated-skill.mjs <target> [--expected-formal-digest <prior-installedDigest>]
```

## 验证与交付

在精确 DSH checkout 准备锁定依赖、Host/Client 与 generated Remote 声明。对 `generated-skill/` 先运行上述独立的结构、元数据、基线、Markdown 链接和锚点、JSON 代码块、离线边界与示例编译验证；不得借正式目录中的文件使检查通过。整体替换后，再在本维护仓库运行默认指向正式目录的 `verify:skill --dsh`、`verify:examples --dsh`、验证器回归、格式和 diff 检查。检查示例编译器是否仍兼容目标版本的上游 checker；若不兼容，修复维护工具或报告受阻，不以删除示例、忽略诊断或仅运行静态检查代替通过。TypeScript Host 与 Client 分开报告。

对产物声称可独立制作并挂载的代表性任务，在隔离消费项目验证包解析、构建输出、实际 Profile 装载、一次可观察行为及卸载；Client 与 Remote 任务还须到达对应侧的真实组合。选择任务以当次目标 tag 纳入的入口为准，不要求不存在的能力。没有条件运行的路径标为 `Not Covered`，说明其影响；示例编译和静态链接检查不能替代这项验证。可重复的关键任务再用真实 Agent 执行，检查是否正确触发 Skill、选中 reference、遵守版本边界并交付可验证结果；有无 Skill 的对照只用于评估指导效果，不作为产品事实来源。

启用生成导航的目标还须在 `evidence/task-scenarios.json` 为每个首屏任务配置可重复的 `.mjs` 场景，并在冻结后运行 `verify-task-scenarios.mjs <target>`。场景脚本应在目标 checkout 和临时 `DSH_HOME` 中实际执行它声明的装载、调用、清理等检查，再输出一份 JSON 结果；维护者审查脚本的执行与断言，不能把自报的布尔值当作独立证据。脚本和清单的哈希随冻结锁定，改动后须重新冻结。运行器未提供网络沙箱，场景必须只使用本地依赖或脚本化 provider，不能调用外部服务。

交付前审阅完整任务差异，说明目标版本和 commit、能力候选总数及 included/merged/excluded 数量、已覆盖的契约、实际运行的命令与结果、未覆盖的行为及影响。差异只用于确认本仓库交付范围，不得据此决定目标知识或能力清单。区分资料已更新、行为已实现和验证已完成；未运行的测试不能写成通过。
