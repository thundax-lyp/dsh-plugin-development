# Skill Source 契约

`skill-source/` 是新 Skill 的唯一构建输入。它不得复制或引用现有 `skills/dsh-plugin-development/**`，也不得把旧 Skill 的文件名或主题当作必须保留的范围。

下方版本字段只是单次创建的格式示例；创建流程应填入当次解析的精确版本、tag 和 commit，本仓库不预设这些值。

除 manifest 和正文外，素材必须包含：

- `coverage.json`：目标 tag 能力候选的完整处置；
- `api-surface.json`：代码导出、对象和成员的逐项裁决；
- `claims.json`：进入正式文档的事实裁决。

写正文前按[入口范围与定位流程](entrypoint-scope.md)从包导出和公开声明生成对象、成员候选并完成 `api-surface.json` 裁决，再查 DSH 文档补语义，随后完成归类和插件任务路径反查。`task-candidates.json` 中的操作标题逐项映射到 `coverage.taskDiscoveries`；任务的 `apiObjects` 指向已纳入对象，多对象任务的 `compositionSteps` 记录协作顺序。API reference 与 how-to 使用[reference 模板](reference-template.md)；模板结构不会替代入口语义审查。`coverage.json` 的 `pluginTask` 必须描述可观察的插件结果，相关 `ownerSections` 必须包含完成该任务的契约或步骤，不能仅重复包职责。多个候选共享一个任务时核查合成后的路径，而不是逐包写相同的空泛任务。

需要在 `SKILL.md` 首屏直达的高价值任务，可在对应 `coverage.taskPaths` 项添加 `entry: { "output": "references/how-to-*.md", "section": "标题原文", "anchor": "markdown-anchor" }`。`entry` 必须与该任务的一项 `destinations` 完全对应，目标必须是 HOW-TO，且 `SKILL.md` 必须直接包含该文档和 anchor 的链接。生成目录的 Markdown 校验继续确认 anchor 真正存在；冻结器检查任务与入口的关联。`entry` 只是路由元数据，不复制 API 契约或 HOW-TO 正文。未设 `entry` 的任务仍须从任务路由到达。

## 任务导航与场景验证

新准备的 schema v3 目标在 manifest 中设置 `"taskNavigation": "generated"`。此模式要求每条 `covered` 任务的 `destinations` 指向该任务独占、标题和正文非空的小节；不得让不同任务共用一个泛化小节。首屏任务还需提供至少一个非空 `userIntents` 和精确的 `entry`：其 `section` 与 `anchor` 必须标识同一个 HOW-TO 标题。维护者审阅小节的操作步骤、装载和完成判据；结构门禁只核验位置与内容非空。

在入口素材与 `indexes/routing.md` 对应的路由素材中，各放一对标记：

```text
<!-- BEGIN GENERATED TASK NAVIGATION -->
<!-- END GENERATED TASK NAVIGATION -->
```

每次修改 `coverage.taskPaths` 或相关标题后，于 `draft` 状态运行：

```text
node .agents/skills/create-dsh-skill/scripts/sync-task-navigation.mjs <target>
```

该命令生成 `SKILL.md` 的首屏任务表及路由文档的全部已覆盖任务表。冻结器会重新渲染并逐字比较生成区；手动改表或遗漏同步会失败。生成模式须有至少一个首屏任务。未启用该模式的旧冻结素材继续使用原链接契约。

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

`manifest.json` 使用以下形状：

```json
{
    "schemaVersion": 3,
    "version": "0.2.0-rc.2",
    "tag": "dsh-v0.2.0-rc.2",
    "commit": "<40-character-commit>",
    "remote": "https://github.com/deepseek-ai/deepseek-harness",
    "status": "draft",
    "topics": ["tools"],
    "files": [
        {
            "source": "api-guardrails/tools.md",
            "output": "references/api-tools.md",
            "kind": "api-guardrail"
        }
    ]
}
```

`source` 相对于 `skill-source/`，`output` 相对于待生成 Skill。每个输入和输出只能出现一次。支持的 `kind` 为 `entrypoint`、`metadata`、`api-guardrail`、`concept`、`how-to`、`index`、`maintenance` 和 `asset`。

新产物至少包含：

- `SKILL.md` 和 `agents/openai.yaml`；
- 任务路由、关键词索引和术语边界；
- 至少一个 API 围挡和一个端到端 HOW-TO；
- `maintenance/source-map.md` 与 `maintenance/skill-maintenance.md`。

## 冻结

素材编写完成后运行：

```text
node .agents/skills/create-dsh-skill/scripts/validate-skill-source.mjs <target> --freeze
```

冻结门禁验证 inventory、能力候选、coverage、claim、主题、文件归属、目标证据，以及纳入项到具体正文小节的映射，并为每个输入文件及三份候选底账和 `api-surface.json` 记录 SHA-256。新准备目标使用 schema v3：包代码导出、自动发现的符号与直接声明成员、操作标题候选均须逐项裁决；纳入的对象与成员须出现在权威 API reference 小节；多对象任务须有有序组合步骤并指向链接各 API reference 的 HOW-TO。`coverage.taskPaths` 仍须覆盖所有纳入或合并的能力候选并由任务路由到达非空小节。任一候选未处置、重复处置、任务路径缺失或未路由、纳入项无法路由到正式 topic/owner，或过多候选集中到同一小节时不得冻结。既有冻结的 schema v1/v2 素材可继续读取，但新目标不能用旧 schema 绕过门禁。冻结后的源文件变化会导致构建失败；需要修订时明确把状态改回 `draft`，完成裁决后重新冻结。

结构门禁通过后，维护者仍须逐条走查主要插件任务：入口与路由是否能到达 example 或 HOW-TO，代码及配置是否构成最小完整包，是否写明安装/装载、失败/取消/卸载及完成判据。缺少可公开验证的外部安装路径时，明确标注尚不能提供可直接运行的独立项目 example；不要以示例编译通过代替装载证明。人工检查的结果与尚未验证的路径写入交付报告。

再按[有限压缩与完整性](reference-template.md#有限压缩与完整性)审阅每个纳入和合并的入口：以公开 API 成员底账逐项核对正文归属或具体排除理由，正文是否保留完成任务所需的对象类型、属性和特有契约，跨入口合并是否有语义依据，example 是否因追求短篇幅被裁成片段。逐成员按[废弃筛选](reference-template.md#废弃筛选)核查标记范围；可用父类型与待废弃成员不能一起被误删或一起写入常规指导。再从正文反查每个 API 的公开声明来源。冻结器检查发现范围、裁决状态、链接和可识别的 `@deprecated` 标记，不衡量文档是否足够详细、不能发现所有“待废弃”措辞或证明业务步骤可运行；不能用它的 PASS 代替这项审稿。
