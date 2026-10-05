# 证据模型

目标版本的 checkout 是唯一产品事实源。`inventory-dsh-surface.mjs` 只枚举候选面，不能自动决定公开性、语义或推荐用法；维护者必须逐项核查并把裁决写入 `skill-source/claims.json`。

## Inventory

`evidence/inventory.json` 固定记录目标版本身份及以下候选集合：

- package manifest、exports 与 bin；
- docs、README、测试和仓库 gate；
- profile、bundle、preset 与 Cordis manifest；
- 公开入口、声明与配置文件。

候选缺少语义上下文时继续读取所属实现、调用方和测试。清单中的路径存在不代表能力公开、默认启用或经过行为验证。

## Claim

`skill-source/claims.json` 是数组，每项使用以下结构：

```json
{
    "id": "tool-result-contract",
    "kind": "implemented-behavior",
    "topic": "tools",
    "decision": "accepted",
    "owner": "references/api-tools.md",
    "summary": "工具返回一份规范 JSON 结果。",
    "evidence": [
        {
            "category": "public-api",
            "path": "packages/example/src/index.ts"
        },
        {
            "category": "runtime",
            "path": "packages/example/src/runtime.ts"
        }
    ]
}
```

`kind` 只能是：

- `implemented-behavior`：目标版本已实现的公开行为；
- `repository-rule`：目标仓库可执行门禁或强制约定；
- `derived-guidance`：由已核实原语推导的开发建议；
- `external-protocol`：DSH 需要适配但不拥有的外部协议；
- `excluded`：私有、实验、无关或明确不纳入的候选。

前四类使用 `decision: accepted` 并指向唯一正式输出文件。`excluded` 使用 `decision: excluded` 和非空 `reason`。不能保留未裁决项后冻结素材。

`evidence.category` 必须是 `public-api`、`runtime`、`exports`、`gates`、`tests` 或 `documentation`，路径相对于精确 checkout，并且必须是目标 commit 跟踪的普通文件；未跟踪、忽略、目录或符号链接不能作为证据。`implemented-behavior` 不能只有文档证据；`repository-rule` 必须包含 gate 证据。
