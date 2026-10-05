---
name: create-dsh-skill
description: 仅在用户显式调用 $create-dsh-skill 时，按指定或自动解析的 @deepseek-ai/dsh-agent 版本全新创建本仓库 skills/dsh-plugin-development；普通 DSH 插件开发不使用。
---

# 创建 DSH Plugin Development Skill

用户显式调用 `$create-dsh-skill [version]`；可选参数是 `@deepseek-ai/dsh-agent` 的精确已发布版本号，例如 `0.2.0-rc.2`。本 Skill 只维护本仓库的 `skills/dsh-plugin-development/` 及创建所需的公开文档、验证设施和治理配置。先读仓库 [AGENTS.md](../../../AGENTS.md) 取得协作与交付规则；不要读取现有 `skills/dsh-plugin-development/**` 作为创建输入。不要把本维护 Skill 放入待分发的 Skill 目录，也不要在这里添加 DSH runtime 或示例产品。

Skill 创建以目标 tag 为唯一事实输入。生成阶段将现有 `skills/dsh-plugin-development/**` 视为不存在：不读取、不比较、不修补，也不从旧 source-map、旧 Skill 或 DOCS diff 生成目标知识。新 Skill 在隔离目录完整生成并通过验证后才整体替换正式目录。交付前仍须审阅 Git diff；该检查只确认本次仓库改动范围，不是升级事实的来源。

## 一次性准备目标

在本仓库根目录只运行准备脚本；传入版本参数时原样转交，没有参数时省略末尾的 `[version]`：

```text
node .agents/skills/create-dsh-skill/scripts/prepare-dsh-skill-target.mjs [version]
```

准备脚本必须一次完成版本解析、完整仓库初始化或更新、tag 与 commit 校验、detached worktree、`docs/` 快照、provenance 写入和素材目录初始化。成功后读取它输出的目标路径继续工作，不手工重复这些步骤。

脚本内部调用 `resolve-dsh-agent-version.mjs`，后者必须通过 `npm view @deepseek-ai/dsh-agent versions --json` 拉取全部已发布版本。传入版本时，不限制其格式，只进行字符串精确匹配；存在于返回列表才继续，不存在时提示错误并停止。未传版本时，只保留完整匹配 `X.Y.Z-rc.N` 的稳定版本，再按 `major`、`minor`、`patch`、`rc` 的数值顺序选择最新项。不要用 `npm view ... version`、`latest` dist-tag、本地缓存清单或字符串排序替代。

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
        │   └── documentation/
        ├── skill-source/              # 经裁决的唯一 Skill 构建素材
        │   ├── manifest.json
        │   ├── claims.json
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

先生成目标版本的候选面清单：

```text
node .agents/skills/create-dsh-skill/scripts/inventory-dsh-surface.mjs <target>
```

独立遍历目标 tag 的包、公开声明、exports/bin、Service/Remote、默认 bundle/preset、manifest、配置与持久化格式、运行时实现、仓库 gate、行为测试以及完整 DOCS。按能力主题把原始定位和观察结果写入 `evidence/`，不按旧 Skill 的目录或主题反向决定调查范围。

事实按以下顺序裁决：公开类型与运行时代码、可执行仓库门禁、行为测试、所属包 README、其他叙述文档。DOCS 只能提供线索和交叉核对；文档与代码冲突时保留代码结论并记录冲突。证据路径必须是目标 commit 跟踪的普通文件；路径、符号或测试存在只表示需要继续核查，不能单独证明公开可用性或运行时语义。

对每项能力核查公开导出、可用侧、输入输出、生命周期所有权、失败、取消、清理、权限或 manifest 条件、默认挂载状态以及稳定性。私有实现、实验入口、示例、翻译、快照和生成文件按实际归属记录，不得当作已发布默认 API。设计建议、可由原语组合出的方案和外部协议要求必须与 DSH 已实现事实分开。

按[证据模型](references/evidence-model.md)把每项裁决写入 `skill-source/claims.json`。inventory 只负责防漏，不能代替语义核查。

## 裁决 Skill 构建素材

把已核实的证据归一化到 `skill-source/`。这里是生成正式 Skill 的唯一知识输入；`upstream-docs/`、`evidence/`、旧 Skill 和旧 source-map 都不能绕过它直接生成正式内容。

按 [Skill Source 契约](references/skill-source-contract.md)编写 `manifest.json` 和全部新文档。manifest 记录目标版本、tag、commit、remote、素材状态、覆盖主题以及每个输入到新 Skill 输出的映射。抽取与裁决期间状态为 `draft`；只有下列条件全部满足后才能改为 `frozen`：

- 每项产品事实都有目标代码 owner 和证据类别，冲突已有明确裁决；
- 公开导出、运行时语义、门禁与测试已核对，DOCS-only 声明未写成已实现行为；
- 不可用、私有、实验和不纳入内容已有理由；
- API 围挡覆盖可用范围、限制、生命周期与失败路径；
- 关键词索引能把符号、术语、包名和能力词路由到唯一权威主题；
- how-to 能以已核实原语完成真实插件任务，并引用而不复制 API 契约。

通过冻结命令完成结构与证据门禁，并给所有输入记录内容哈希：

```text
node .agents/skills/create-dsh-skill/scripts/validate-skill-source.mjs <target> --freeze
```

构建器只能从 `frozen` 的 `skill-source/` 生成正式 Skill。使用单一目录和状态字段，不并存容易漂移的 `draft/`、`final-docs/` 副本。

## 重建正式 Skill

从冻结素材在 `generated-skill/` 新建完整的 `dsh-plugin-development/`。构建过程不得读取正式目录；以下职责全部由新素材决定：

- `SKILL.md`：适用场景、固定基线、任务路由、跨主题不变量和完成边界；
- `references/plugin-development-routing.md`：按开发任务路由到最小参考集；
- `references/` 中的 API reference：公开契约、可用性、限制及 API 围挡；
- `references/keyword-index.md`：关键词到唯一权威 reference 的索引，不复制契约正文；
- `references/` 中的 how-to：端到端任务、资源所有权、失败、取消、清理和验证，并链接相关 API 围挡；
- `references/terminology.md`：概念定义及易混淆边界；
- `maintenance/source-map.md`：正式 reference 事实到目标 tag 类型、导出、实现、门禁、测试和 DOCS 的证据映射；
- `maintenance/skill-maintenance.md`：重建、生成、验证和发布流程。

`source-map.md` 是本次新建内容的证据账本，不是下一次创建的生成输入。每项事实只有一个 reference 归属；路由、关键词索引、how-to 和 source-map 通过相对链接引用它。新目录完整通过验证后，以它整体替换 `skills/dsh-plugin-development/`；不得从旧目录挑选文件保留。随后根据新产物的公开结构和基线更新元数据、中英文 README、CI 与维护命令，保持离线 Skill 边界。

按[输出契约](references/output-contract.md)构建并独立验证：

```text
node .agents/skills/create-dsh-skill/scripts/build-dsh-plugin-development-skill.mjs <target>
node .agents/skills/create-dsh-skill/scripts/verify-generated-skill.mjs <target>
```

构建器每次先清空纯产物目录 `generated-skill/`，再从冻结素材新建。验证通过后运行整目录替换；替换脚本先拒绝正式 Skill 中未保存的工作区修改，再移除整个旧目录并放入新目录，不做覆盖合并。新目录就位前的错误必须恢复旧目录；就位后的备份清理失败作为已完成替换的警告返回：

```text
node .agents/skills/create-dsh-skill/scripts/replace-generated-skill.mjs <target>
```

## 验证与交付

在精确 DSH checkout 准备锁定依赖、Host/Client 与 generated Remote 声明。对 `generated-skill/` 先运行独立的结构、元数据、基线、Markdown 链接和锚点、JSON 代码块、离线边界与示例编译验证；不得借正式目录中的文件使检查通过。整体替换后，再在本维护仓库运行 `verify:skill --dsh`、`verify:examples --dsh`、验证器回归、格式和 diff 检查。检查示例编译器是否仍兼容目标版本的上游 checker；若不兼容，修复维护工具或报告受阻，不以删除示例、忽略诊断或仅运行静态检查代替通过。TypeScript Host 与 Client 分开报告。

交付前审阅完整任务差异，说明目标版本和 commit、已覆盖的契约、实际运行的命令与结果、未覆盖的行为及影响。区分资料已更新、行为已实现和验证已完成；未运行的测试不能写成通过。
