# Skill Source 契约

`skill-source/` 是新 Skill 的唯一构建输入。它不得复制或引用现有 `skills/dsh-plugin-development/**`，也不得把旧 Skill 的文件名或主题当作必须保留的范围。

下方版本字段只是单次创建的格式示例；创建流程应填入当次解析的精确版本、tag 和 commit，本仓库不预设这些值。

除 manifest 和正文外，素材必须包含：

- `coverage.json`：目标 tag 能力候选的完整处置；
- `api-surface.json`：代码导出、对象和成员的逐项裁决；
- `claims.json`：进入正式文档的事实裁决。

写正文前按[入口范围与定位流程](entrypoint-scope.md)从包导出和公开声明生成对象、成员候选并完成 `api-surface.json` 裁决，再查 DSH 文档补语义，随后完成归类和插件任务路径反查。`task-candidates.json` 中的操作标题逐项映射到 `coverage.taskDiscoveries`；任务的 `apiObjects` 指向已纳入对象，多对象任务的 `compositionSteps` 记录协作顺序。API reference 与 how-to 使用[reference 模板](reference-template.md)；模板结构不会替代入口语义审查。`coverage.json` 的 `pluginTask` 必须描述可观察的插件结果，相关 `ownerSections` 必须包含完成该任务的契约或步骤，不能仅重复包职责。多个候选共享一个任务时核查合成后的路径，而不是逐包写相同的空泛任务。

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
