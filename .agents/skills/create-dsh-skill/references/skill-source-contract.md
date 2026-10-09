# Skill Source 契约

`skill-source/` 是新 Skill 的唯一构建输入。它不得复制或引用现有 `skills/dsh-plugin-development/**`，也不得把旧 Skill 的文件名或主题当作必须保留的范围。

下方 manifest 版本字段只是单次创建的格式示例；创建工作区应填入当次解析的精确 npm 版本、tag 和 commit，本仓库不预设这些值。新准备目标的 provenance 带 `creationContract: "entrypoint"`，初始 manifest 带 `taskNavigation: "entrypoint"`；冻结器用 provenance 标记拒绝删除或改写该模式。旧目标没有此标记时维持既有读取规则，不在重跑准备脚本时改写。manifest、provenance、coverage 等维护账本不属于分发 Skill；映射到产物的正文、元数据和附件用 npm 包版本说明兼容范围，不写目标 commit。source-map 仍列出相对于目标源码的证据路径；验证器从外部 checkout 的 tag 核实这些路径。

除 manifest 和正文外，素材必须包含：

- `coverage.json`：目标 tag 能力候选的完整处置；
- `api-surface.json`：代码导出、对象和成员的逐项裁决；
- `claims.json`：进入正式文档的事实裁决。

写正文前按[入口范围与定位流程](entrypoint-scope.md)从包导出和公开声明生成对象、成员候选并完成 `api-surface.json` 裁决，再查 DSH 文档补语义，随后完成归类和插件任务路径反查。`task-candidates.json` 中的操作标题逐项映射到 `coverage.taskDiscoveries`；任务的 `apiObjects` 指向已纳入对象，多对象任务的 `compositionSteps` 记录协作顺序。API 主题页、子主题页与 how-to 使用[reference 模板](reference-template.md)；模板结构不会替代入口语义审查。`coverage.json` 的 `pluginTask` 必须描述可观察的插件结果，相关 `ownerSections` 必须包含完成该任务的契约或步骤，不能仅重复包职责。多个候选共享一个任务时核查合成后的路径，而不是逐包写相同的空泛任务。

需要在 `SKILL.md` 首屏直达的高价值任务，可在对应 `coverage.taskPaths` 项添加 `entry: { "output": "references/how-to-*.md", "section": "标题原文", "anchor": "markdown-anchor" }`。`entry` 必须与该任务的一项 `destinations` 完全对应，目标必须是 HOW-TO，且 `SKILL.md` 必须直接包含该文档和 anchor 的链接。生成目录的 Markdown 校验继续确认 anchor 真正存在；冻结器检查任务与入口的关联。`entry` 只是路由元数据，不复制 API 契约或 HOW-TO 正文。未设 `entry` 的任务仍须从 `SKILL.md` 的完整任务表到达。

## 任务导航与场景验证

新准备的 schema v3 目标在 manifest 中设置 `"taskNavigation": "entrypoint"`。既有 `"generated"` 目标维持旧版双文件导航以便读取冻结素材。此模式要求每条 `covered` 任务的 `destinations` 指向 HOW-TO 中该任务独占、标题和正文非空的小节；不得让不同任务共用一个泛化小节。单对象任务也须如此；任务小节链接其 `apiObjects` 中每个对象的权威 API reference。HOW-TO 可按不重叠的任务边界拆成多篇，没有文件数上限；若 API 页已有完整用法，任务小节可链接而不重复，但须保留任务目标、缺失步骤和完成判据。首屏任务还需提供至少一个非空 `userIntents` 和精确的 `entry`：其 `section` 与 `anchor` 必须标识同一个 HOW-TO 标题。维护者审阅小节的操作步骤、装载和完成判据；结构门禁只核验位置、内容非空及对象链接。

入口 `SKILL.md` 依次包含 `## 适用范围`、`## 插件形态`、`## 开发任务`、`## 关键对象索引`、`## 术语与边界`、`## 关键词索引`、`## 跨主题不变量`、`## 完成边界`。适用范围写精确 npm 版本和停止套用的条件；“插件形态”按目标 tag 的公开组合列出实际成立的产品形态数量、用途、呈现或发现位置、装载与使用方法，并链接各自的 HOW-TO，遵守[形态总览模板](reference-template.md#插件形态总览)。术语解释插件作者会混淆的概念及边界，关键词索引将符号、包名和能力词链接到对应权威 reference；不变量与完成边界写读者可执行的规则。任务表与对象表分别放在同名小节中的生成区：

```text
<!-- BEGIN GENERATED TASK NAVIGATION -->
<!-- END GENERATED TASK NAVIGATION -->

<!-- BEGIN GENERATED OBJECT INDEX -->
<!-- END GENERATED OBJECT INDEX -->
```

每次修改 `coverage.taskPaths` 或相关标题后，于 `draft` 状态运行：

```text
node .agents/skills/create-dsh-skill/scripts/sync-task-navigation.mjs <target>
```

该命令在 `SKILL.md` 生成全部已覆盖任务表及全部纳入 API 对象索引。任务表从 `coverage.taskPaths` 生成，对象表从 `api-surface.json` 生成，每个对象链接到唯一权威 API 子主题小节。冻结器重新渲染并逐字比较两个生成区；手动改表或遗漏同步会失败。新模式不分发 `references/plugin-development-routing.md`、`references/keyword-index.md`、`references/terminology.md` 或其他独立索引文件，且须有至少一个首屏任务。旧 `generated` 模式与未启用生成模式的冻结素材继续使用原链接契约。

`evidence/task-scenarios.json` 为每个首屏任务至少指定一个可运行场景。脚本是维护证据，须审查其是否真正执行包解析、构建、Profile 装载、可观察调用、卸载等所声明的检查；场景输出中的 `true` 不自动证明脚本执行了这些行为。清单示例：

```json
{
    "schemaVersion": 1,
    "scenarios": [
        {
            "taskId": "register-tool",
            "script": "scenarios/register-tool.mjs",
            "checks": ["profile-load", "tool-call", "unload"],
            "timeoutMs": 120000
        }
    ]
}
```

`script` 必须是 `evidence/` 内的普通 `.mjs` 文件，`timeoutMs` 可省略（默认 120 秒，最大 300 秒）。冻结会锁定清单及脚本哈希。冻结后运行：

```text
node .agents/skills/create-dsh-skill/scripts/verify-task-scenarios.mjs <target>
```

运行器以目标 checkout 为工作目录，为每个场景提供独立临时 `DSH_HOME`、`DSH_TARGET_CHECKOUT` 和 `DSH_TASK_VERIFICATION_OFFLINE=1`，并清除常见令牌环境变量。每个脚本向 stdout 输出一份 JSON：`{"taskId":"register-tool","checks":{"profile-load":true,"tool-call":true,"unload":true}}`。所有声明检查都必须为 `true`；失败、超时或哈希漂移均阻断此验证。运行器本身不建立网络沙箱；脚本只能使用本地依赖或脚本化 provider，不能联系外部服务。记录真实执行的断言、未覆盖侧和结果，不能将其等同于真实 Agent 的使用效果。

## Manifest

下例只展示 `manifest.json` 的字段和文件映射方式。版本、tag、commit、主题和文件名均须由本次目标与裁决确定；示例本身不是可冻结的完整素材：

```json
{
    "schemaVersion": 3,
    "taskNavigation": "entrypoint",
    "version": "0.2.0-rc.2",
    "tag": "dsh-v0.2.0-rc.2",
    "commit": "<40-character-commit>",
    "remote": "https://github.com/deepseek-ai/deepseek-harness",
    "status": "draft",
    "topics": ["tools"],
    "files": [
        {
            "source": "entrypoint/SKILL.md",
            "output": "SKILL.md",
            "kind": "entrypoint"
        },
        {
            "source": "metadata/openai.yaml",
            "output": "agents/openai.yaml",
            "kind": "metadata"
        },
        {
            "source": "api-guardrails/tools-overview.md",
            "output": "references/api-tools-overview.md",
            "kind": "api-guardrail",
            "role": "topic",
            "topic": "tools"
        },
        {
            "source": "api-guardrails/tools-runtime.md",
            "output": "references/api-tools-runtime.md",
            "kind": "api-guardrail",
            "role": "subject",
            "topic": "tools",
            "subject": "runtime"
        },
        {
            "source": "how-to/register-tool.md",
            "output": "references/how-to-register-tool.md",
            "kind": "how-to"
        },
        {
            "source": "examples/example-register-tool.md",
            "output": "references/example-register-tool.md",
            "kind": "example"
        },
        {
            "source": "maintenance/source-map.md",
            "output": "maintenance/source-map.md",
            "kind": "maintenance"
        },
        {
            "source": "maintenance/skill-maintenance.md",
            "output": "maintenance/skill-maintenance.md",
            "kind": "maintenance"
        }
    ]
}
```

`source` 相对于 `skill-source/`，`output` 相对于待生成 Skill。每个输入和输出只能出现一次。支持的 `kind` 为 `entrypoint`、`metadata`、`api-guardrail`、`concept`、`how-to`、`example`、`index`、`maintenance` 和 `asset`。新目标的完整代码示例使用 `kind: "example"`，输出到 `references/example-*.md`，由相应 HOW-TO 的具体任务小节以相对链接导航；冻结器检查位置、代码块和可达性。详情见[Example 编写契约](reference-template.md#example-编写契约)。

新目标的每个 API 主题有一份主题页和至少一份子主题页。manifest 的 API 文件分别标 `role: "topic"` 或 `role: "subject"`，都标所属 `topic`，子主题还标同主题内唯一的 `subject`。主题页要有非空的“对象关系”和“选型与使用”小节，并链接本主题所有子主题；每份子主题至少拥有一个纳入对象，对象在独占且包含公开符号名的小节中写具体契约。`api-surface.json` 的 `owner` 只能指向子主题页；对象索引由这些 owner 生成，具体任务的使用路径由 HOW-TO 承接。文件名由该次主题裁决确定，不固定沿用旧产物。冻结器检查元数据、链接、owner、小节独占和成员出现；关系、用法及示例的语义仍须人工核查。既有冻结素材维持原格式。

新产物至少包含：

- `SKILL.md` 和 `agents/openai.yaml`；
- `SKILL.md` 内的完整任务表、对象索引、术语与边界、关键词索引；
- 至少一个 API 围挡和一个端到端 HOW-TO；
- 需要独立放置完整代码时，HOW-TO 链接 `references/example-*.md`，示例文件保留完整代码、构建、装载与验证步骤；
- `maintenance/source-map.md` 与 `maintenance/skill-maintenance.md`。

## 冻结

素材编写完成后运行：

```text
node .agents/skills/create-dsh-skill/scripts/validate-skill-source.mjs <target> --freeze
```

冻结门禁验证 inventory、能力候选、coverage、claim、主题、文件归属、目标证据，以及纳入项到正文小节的映射，并为每个输入文件、三份候选底账和 `api-surface.json` 记录 SHA-256。新准备目标使用 schema v3，冻结前检查：

1. 逐项裁决包代码导出、自动发现的符号及其直接声明成员、操作标题候选；每个候选恰好处置一次。
2. 将纳入对象及成员写入权威 API 子主题的小节，并将纳入或合并的能力候选关联到 `coverage.taskPaths`。
3. 让每条已覆盖任务指向独占、非空的 HOW-TO 小节；小节链接所用对象的权威 API reference。多对象任务另有有序组合步骤。
4. 将独立 example 输出到 `references/` 第一层，包含代码块，并从至少一个具体任务小节链接。
5. 确认 `SKILL.md` 任务表可到达每条已覆盖任务；纳入项都有正式 topic 和唯一 owner，多个候选集中到同一小节时有经过核实的合并依据。

任一条件不满足均不得冻结。既有冻结的 schema v1/v2 素材可继续读取；新目标不能用旧 schema 绕过门禁。冻结后源文件变化会使构建失败。需要修订时，先将状态改回 `draft`，完成裁决后重新冻结。

结构门禁通过后，维护者仍须逐条走查主要插件任务：入口任务能否到达 HOW-TO，并在需要代码时从对应步骤到达 example；对象索引能否到达权威 API 契约；代码及配置是否构成最小完整包，是否写明安装/装载、失败/取消/卸载及完成判据。缺少可公开验证的外部安装路径时，明确标注尚不能提供可直接运行的独立项目 example；不要以示例编译通过代替装载证明。人工检查的结果与尚未验证的路径写入交付报告。

再按[有限压缩与完整性](reference-template.md#有限压缩与完整性)审阅每个纳入和合并的入口：以公开 API 成员底账逐项核对正文归属或具体排除理由，正文是否保留完成任务所需的对象类型、属性和特有契约，跨入口合并是否有语义依据，example 是否因追求短篇幅被裁成片段。逐成员按[废弃筛选](reference-template.md#废弃筛选)核查标记范围；可用父类型与待废弃成员不能一起被误删或一起写入常规指导。再从正文反查每个 API 的公开声明来源。冻结器检查发现范围、裁决状态、链接和可识别的 `@deprecated` 标记，不衡量文档是否足够详细、不能发现所有“待废弃”措辞或证明业务步骤可运行；不能用它的 PASS 代替这项审稿。
