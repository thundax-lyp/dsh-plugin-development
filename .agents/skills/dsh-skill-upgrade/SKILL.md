---
name: dsh-skill-upgrade
description: 仅在用户显式调用 $dsh-skill-upgrade 时，升级本仓库 skills/dsh-plugin-development 的固定 DSH 基线；普通 DSH 插件开发不使用。
---

# 升级 DSH Plugin Development Skill

用户直接调用 `$dsh-skill-upgrade`，不传版本或路径参数。本 Skill 只维护本仓库的 `skills/dsh-plugin-development/` 及升级所需的公开文档、验证设施和治理配置。先读仓库 [AGENTS.md](../../../AGENTS.md) 与 [Skill 维护流程](../../../skills/dsh-plugin-development/maintenance/skill-maintenance.md)；具体专题从 [source-map](../../../skills/dsh-plugin-development/maintenance/source-map.md) 定位。不要把本维护 Skill 放入待分发的 Skill 目录，也不要在这里添加 DSH runtime 或示例产品。

## 确定升级边界

1. 检查两个仓库的 `git status`、当前 tag 和 commit，区分已有改动。目标 checkout 优先采用对话中已明确的路径，否则使用本仓库同级的 `../deepseek-harness`。仅当目标 HEAD 精确指向一个 `dsh-v*` tag 时，使用该 tag 与 commit；路径不存在、HEAD 未命中 tag 或命中多个 tag 时说明阻碍，不根据 moving branch 或最新 tag 猜测目标。
2. 从旧 source-map 读取旧 tag 与 commit，核对它们指向同一版本。记录旧、新两版的 tag 与 commit，在独立的精确版本 checkout 核查源码和 DOCS；不要混合两个版本的事实。保留用户已有修改，不切换或清理其工作区。分支、暂存、提交、推送、PR、发布和合并各按用户的对应授权执行。
3. 以公开类型和运行时代码为先，其次是可执行门禁、行为测试、所属包 README、其他叙述文档。路径或符号存在只说明需要继续核查，不证明语义或行为不变。

## 建立覆盖清单

- 从旧 source-map 的每条路径出发，标记保留且语义未变、行为变化、迁移、删除及待核实；检查类型、实现、manifest/exports、门禁和测试。对失效路径找到新的 owner 或明确能力退出，不能直接删去证据。
- 独立比较两版 package/exports/bin、Service/Remote、默认 bundle/preset、配置与持久化格式、仓库 gate 和完整 DOCS。目标版本中未发生 diff 的文档也要核对，避免沿用旧参考库的遗漏。翻译、快照、实验包和生成文件按其实际归属判断，不计作已发布默认能力。
- 将源码清单与文档清单合并去重。每项写下目标代码 owner、受影响的 reference，以及“已有覆盖、需补充、需替换或不纳入”的理由。明确不可用 API、实验限制及不纳入项；发生冲突时记录裁决依据。清单用于防漏，不能凭路径或符号覆盖率宣称契约审计完成；设计建议和外部协议要求不能写成 DSH 已实现事实。

## 更新与验证

升级必须刷新整个参考库的证据，不能只替换版本字符串。先更新 source-map 中的固定 tag、commit 和专题证据，再更新新增、删除或重命名扩展点涉及的 reference、示例和 assets；随后同步路由、`SKILL.md`、元数据、中英文 README、CI 与维护命令中的基线规则。每项事实只放在所属 reference，其他位置链接引用；保持离线 Skill 边界。源文件和生成器产物按所属生成流程更新。

按 [维护流程](../../../skills/dsh-plugin-development/maintenance/skill-maintenance.md#skill-发布维护)执行完整发布验证：在精确 DSH checkout 准备锁定依赖、Host/Client 与 generated Remote 声明；在本维护仓库运行 `verify:skill --dsh`、`verify:examples --dsh`、验证器回归、格式、Markdown 链接和锚点、JSON 代码块、离线边界及 diff 检查。检查示例编译器是否仍兼容目标版本的上游 checker；若不兼容，修复维护工具或报告受阻，不以删除示例、忽略诊断或仅运行静态检查代替通过。TypeScript Host 与 Client 分开报告。

交付前审阅完整任务差异，说明目标版本和 commit、已覆盖的契约、实际运行的命令与结果、未覆盖的行为及影响。区分资料已更新、行为已实现和验证已完成；未运行的测试不能写成通过。
