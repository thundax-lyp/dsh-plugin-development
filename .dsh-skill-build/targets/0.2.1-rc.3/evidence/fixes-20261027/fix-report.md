# 五项审核问题修复交付

基线：`dsh-v0.2.1-rc.3` / `1f81c047fc48fa190a683e469daa699857e9afe8`。本次不暂存、不提交。正式目录已由冻结素材整体替换，摘要为 `a7a871655ca60deb1c1c603528a5fa979be59a6cf0e7a3b36290fe5f46515582`。

## 修复结果

| 问题 | 创建素材修复 | 实际验证 |
| --- | --- | --- |
| P1 API 契约失真 | 692 份 API 素材恢复真实声明、索引访问、泛型、构造器、同名类型/值、继承和合并启用条件；保留真实合法 any | 重新解析精确 checkout 声明，核对 4,234 份声明、808 个成员声明、366 个成员名、58 个依赖成员；Host/Client 消费程序均零诊断 |
| P1 默认 Profile 重复基础服务 | 97 份 HOW-TO 增加已有 provider 复用、配置整体替换、显式迁移与撤销边界；Shell 使用 `result()` | 精确 base 的真实解析与 patch 唯一性检查；实际 Loader 装载依赖完备子集、调用本地 printf、卸载 consumer 后保留共享服务 |
| P1 Remote 示例缺少实际生成与两侧接入 | 2 包 10 文件，新增 Remote 合约、生成构建、条件导出、共享错误类型、Host scope 和 Client contribution 装配 | 真实生成新 localNotes 声明；两侧类型检查与构建；生产 ClientModuleSystem/Gateway 及 Host Loader 通过 11 项挂载、成功、输入/业务错误、取消、卸载检查 |
| P2 设置页缺少草稿与 revision 栅栏 | 新增完整设置页示例，首次编辑固定 baseline、冲突保留草稿、显式丢弃/重载、保存等待和 dispose；区分原子普通配置与非原子 secret | 示例两侧编译；生产 SettingsFormModel 通过 revision 冲突、保留草稿、重建 baseline、取消订阅、晚到保存结果 5 项检查 |
| P2 Worker 库任务误用 Host 安装流程 | Worker image/packer 改为独立库工作流；完整 boot image 与 tiny smoke 分开；明确 page bundler、Worker 所有权与重载边界 | 实际 packVfsImage、VFS 装载、模块解析和 overlay smoke；浏览器完整启动未运行 |

细节与定位见 [API 报告](api-report.md)、[Remote 报告](remote-report.md)、[设置与 Worker 报告](settings-worker-report.md)。这些子报告中的“主流程待完成”描述其交接时刻；本报告记录最终主流程结果。

## 创建流程与防回归

唯一知识输入为该版本 `skill-source/` 与精确 checkout，未以旧正式 Skill 补知识。重新发现、逐项裁决新增候选，重新同步素材、claims、coverage、api-surface 和 source-map，再冻结、构建与验证。新增 128 个生成 Remote 重导出别名均明确排除为既有权威的重复入口；4 个 ui-plan 内部合并成员因公开声明入口不传播而明确排除。

能力 464 项：included 341、merged 65、excluded 58；产物 1,211 文件（1,210 Markdown），1,205 claims、196 taskPaths。API 账本 6,773 对象，纳入 5,272、排除 1,501。计数是处置账本，不是全部运行时覆盖证明。

创建器优先发现 authored source，避免本地声明构建使候选输入漂移；类型打印取消截断。新增冻结的正文反例断言、多文件示例执行器及其输入哈希。API owner 检查保留 fenced 声明正文但不接受 fenced 假标题。示例执行器从显式被检查目录提取代码；不以素材回填缺失示例，不忽略未归属的 TypeScript 块。CI 保持 Governance、Skill Integrity 两个独立 job，不声称 CI 已运行完整 DSH checkout 验证。

## 实际通过的主流程检查

- `validate-skill-source.mjs <target> --freeze`：通过。
- `build-dsh-plugin-development-skill.mjs <target>`、`verify-generated-skill.mjs <target>`：通过。
- 显式生成目录 `validate_skill.mjs --skill <generated> --dsh <checkout>`：1,210 Markdown、16,429 本地链接/锚点、20 JSON fences、1,662 源码路径，通过。
- 显式生成目录 `check_examples.cjs --skill <generated> --dsh <checkout>`：通过普通 Host 10 块、Client 4 块；额外执行冻结 API 消费验证器、Remote 多文件（5 Host / 1 Client）、设置/Worker（1 Host / 1 Client）。Remote 5 个 Host 文件含 2 个实际执行的构建配置，不能全称 runtime 代码。
- `verify-task-scenarios.mjs <target>`：4 个任务、24 项断言通过（Service 6、Client primitives 7、已有 Profile Shell 6、设置模型 5）。
- `replace-generated-skill.mjs <target> --expected-formal-digest <prior>`：通过摘要保护后整体替换。
- 默认正式目录 `pnpm verify:skill --dsh <checkout>`、`pnpm verify:examples --dsh <checkout>`：通过；结构检查含仓库维护文档共 1,226 Markdown、16,498 链接/锚点、25 JSON fences，1,662 源码路径。示例结果与显式生成目录一致。
- `pnpm test:validation`：65 通过、0 失败；`pnpm format:check`、`pnpm format:ledgers`（20 个核心 JSON、2 个目标）、`git diff --check`：通过。
- 精确 checkout 工作区干净；本仓库无暂存文件。

执行中曾暴露 checker 自己的临时目录导致严格 checkout 检查失败，现改为先跑冻结验证器再创建临时目录；未降低 checkout 门禁。Shell 早期 probe 的 `result` 属性误用已改为真实方法；设置模型 probe 改为加载精确构建模块。报告仅以修复后的实际重跑为通过依据。

## Not Covered

未运行真实浏览器设置页交互、完整 Worker preview、真实网络 WebSocket、非 owner Remote peer、全部 contribution 失败回滚分支、完整用户默认 Profile 及平台沙箱强制路径。本地 in-process RPC、模型/库行为检查和 Loader 子集不代替这些验证。未端到端执行所有 5,272 个 API 对象。没有修改 DSH runtime；本次交付是创建素材/验证设施与生成 Skill 的修复。

设计与素材已更新；上述目标版本行为已在所列组合中观察；完整产物冻结、构建、替换和声明的检查已完成。真实 Agent 补充观察另记于本目录的 agent-evaluation.md。

提交前对新文件执行暂存差异检查，发现 238 份素材末尾空行（连同生成与正式副本共 714 处）。仅将当前目标这些 Markdown 的文件尾归一为一个换行，未重排正文或历史目标；素材回到 draft 后重新冻结、构建、独立验证并整体替换。签名与代码无语义变化，Agent 测试仍对应相同代码。最终摘要如上。
