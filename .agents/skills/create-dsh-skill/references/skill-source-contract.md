# Skill Source 契约

`skill-source/` 是新 Skill 的唯一构建输入。它不得复制或引用现有 `skills/dsh-plugin-development/**`，也不得把旧 Skill 的文件名或主题当作必须保留的范围。

## Manifest

`manifest.json` 使用以下形状：

```json
{
    "schemaVersion": 1,
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

冻结门禁验证 inventory、claim、主题、文件归属和目标证据，并为每个输入文件记录 SHA-256。冻结后的源文件变化会导致构建失败；需要修订时明确把状态改回 `draft`，完成裁决后重新冻结。
