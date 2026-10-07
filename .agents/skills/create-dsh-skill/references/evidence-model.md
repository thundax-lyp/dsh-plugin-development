# 证据模型

目标版本的 checkout 是唯一产品事实源。API 事实在该 checkout 内按代码、注释、文档的顺序裁决：公开类型、包导出、运行时和门禁确定可用边界，行为测试核验行为；源码注释解释意图，README 与 DOCS 补充使用说明。`inventory-dsh-surface.mjs` 只枚举候选面，不能自动决定公开性、语义或推荐用法；维护者必须逐项核查，把覆盖处置写入 `skill-source/coverage.json`，把事实裁决写入 `skill-source/claims.json`。

## Inventory

`evidence/inventory.json` 固定记录目标版本身份及以下候选集合：

- package manifest、exports 与 bin；
- docs、README、测试和仓库 gate；
- profile、bundle、preset 与 Cordis manifest；
- 公开入口、声明与配置文件。

候选缺少语义上下文时继续读取所属实现、调用方和测试。清单中的路径存在不代表能力公开、默认启用或经过行为验证。

## 公开 API 与使用任务底账

新目标先生成 `evidence/api-entry-candidates.json`、`evidence/api-symbol-candidates.json` 和 `evidence/task-candidates.json`。第一份列代码子路径导出；第二份沿重导出列符号及其声明直接拥有的成员、签名和可识别的 `@deprecated`；第三份扫描 README、DOCS、website 的操作性 Markdown 标题并保留文件、行号和标题。`package.json`、样式、YAML 与通配源码路径留在 inventory，按各自用途调查。脚本无法从标题发现正文中的所有使用任务，也不能完整展开 Cordis 声明合并、嵌套/联合类型或插件可用性；这些仍须人工追查。

`skill-source/api-surface.json` 是裁决账本，使用目标版本身份和以下结构。每个导出候选恰好处置一次；纳入的导出下，每个自动发现的符号及直接声明成员也恰好处置一次，签名须与代码发现结果一致。可用于插件且未废弃的对象和成员映射到唯一 API reference；私有、无关、待废弃或不可用项写具体排除理由。若目标代码有不经普通导出呈现的 Cordis 声明合并，维护者可在所属导出下补入 `origin: "module-augmentation"` 的对象，并核查其目标版本源路径、API reference、claim 和 source-map；自动发现清单不能当作完整语义证明。

```json
{
    "schemaVersion": 1,
    "version": "<target-version>",
    "tag": "<target-tag>",
    "commit": "<target-commit>",
    "remote": "<target-remote>",
    "entries": [{ "candidate": "export:@deepseek-ai/dsh-example:.", "decision": "included" }],
    "objects": [
        {
            "id": "example-config",
            "entry": "export:@deepseek-ai/dsh-example:.",
            "symbol": "ExampleConfig",
            "signature": "ExampleConfig",
            "source": "packages/example/src/index.ts",
            "decision": "included",
            "owner": "references/api-example.md",
            "section": "配置对象",
            "members": [
                { "name": "enabled", "signature": "boolean", "decision": "included" }
            ]
        }
    ]
}
```

`coverage.taskDiscoveries` 对每个自动发现的任务标题写 `included` 与对应 `taskId`，或 `excluded` 与具体 `reason`；正文或代码额外发现的任务直接补入 `taskPaths`。已覆盖任务用 `apiObjects` 指向本账本纳入的对象；多对象任务用有序 `compositionSteps` 描述协作，并由 HOW-TO 承接，链接各对象的权威 API reference。纯配置任务可写 `configurationOnly: true` 和空 `apiObjects`，但仍须给出挂载与观察步骤。冻结器核对结构、去向和链接；对象适用性、步骤正确性及运行结果仍需人工及消费项目验证。

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

## Capability coverage

`evidence/capability-candidates.json` 由 inventory 从当前目标 tag 独立生成。候选来自公开 package manifest、组合 manifest，以及英文 subsystem/cookbook 文档入口；它们用于发现能力和开发任务，不直接证明公开语义。

`skill-source/coverage.json` 把所有候选归入能力主题。先按[入口范围](entrypoint-scope.md)核对公开入口及可用性，再指定 owner。一个 disposition 可以显式列出多个候选，但每个候选 id 必须恰好出现一次：

```json
{
    "schemaVersion": 3,
    "dispositions": [
        {
            "id": "model-tools",
            "decision": "included",
            "candidates": ["package:@deepseek-ai/dsh-tools"],
            "topics": ["tools"],
            "owners": ["references/api-tools.md"],
            "summary": "模型工具注册、执行和展示契约。",
            "pluginTask": "为插件注册模型工具并验证执行结果",
            "ownerSections": { "references/api-tools.md": "工具注册与执行" }
        },
        {
            "id": "agent-team-optional",
            "decision": "included",
            "candidates": ["subsystem:agent-team"],
            "topics": ["agent-teams"],
            "owners": ["references/api-agent-teams.md"],
            "summary": "公开但实验性的可选入口；文档标明所需组合和限制。",
            "pluginTask": "在插件中接入可选的 Agent Teams 服务",
            "ownerSections": { "references/api-agent-teams.md": "实验服务接入" }
        }
    ],
    "taskPaths": [
        {
            "id": "register-model-tool",
            "outcome": "插件工具能在目标 Profile 中被 Agent 调用并留下可回放结果",
            "decision": "covered",
            "candidates": ["package:@deepseek-ai/dsh-tools"],
            "apiObjects": ["example-config"],
            "destinations": [
                {
                    "output": "references/how-to-register-tool.md",
                    "section": "实现与装载步骤"
                }
            ]
        },
        {
            "id": "connect-agent-team",
            "outcome": "插件在显式实验组合中创建并清理 Agent Team",
            "decision": "covered",
            "candidates": ["subsystem:agent-team"],
            "apiObjects": ["agent-team-service"],
            "destinations": [
                {
                    "output": "references/api-agent-teams.md",
                    "section": "实验服务接入"
                }
            ]
        }
    ],
    "taskDiscoveries": [
        { "candidate": "task:docs/cookbook/register-tool.md:1", "decision": "included", "taskId": "register-model-tool" }
    ]
}
```

`included` 和 `merged` 必须路由到 manifest topic 与正式输出。冻结前还需写出插件作者的 `pluginTask`，并以 `ownerSections` 把每个 owner 映射到正文中确实存在且非空的二级或更深标题。每个正文小节最多承接 12 个候选；超出时按开发任务拆分。`merged` 还要写 `mergedInto` 和 `relationship`，其中前者必须是被 `included` 的候选，后者说明本候选与主入口的具体关系。`excluded` 必须给出语义核查后的具体理由。候选覆盖与 claim 各司其职：coverage 证明没有静默漏项，claim 证明正式文档中的事实有足够证据；小节映射仍不能代替人工检查契约正文是否充分。

新目标的 `taskPaths` 是独立的开发任务裁决，不把每个 package 的 `pluginTask` 当成已完成任务。维护者独立盘点目标 tag 的 README、DOCS、website 中的“如何……”及等价操作问题，结合 cookbook、教程、调用方和真实组合抽取插件任务；一条任务可关联多个候选，同一候选也可参与多个任务。`covered` 写可观察的 `outcome`、候选、`apiObjects` 和至少一个 `destinations`；目标页的二级或更深标题须非空，任务路由须链接该页。多对象组合任务以 HOW-TO 承接完整步骤并链接权威 API reference；单对象任务可由带完整 example 的 API reference 承接。无法通过目标版本公开路径完成的任务用 `decision: excluded`、候选和具体 `reason` 记录。冻结器要求所有纳入或合并的能力候选至少进入一条已覆盖任务路径，但不能自动判定任务步骤是否完整或业务结果是否成立；具体步骤、example 与运行结果仍需人工及消费项目验证。

既有冻结的 schema v1/v2 素材仍可读取；新准备目标使用 schema v3，不能以旧 schema 新建目标来绕过 API 成员与任务覆盖门禁。
