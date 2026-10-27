# dsh-plugin-development 创建与验证报告

日期：2026-10-27。目标为 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，Git tag `dsh-v0.2.1-rc.3`，commit `1f81c047fc48fa190a683e469daa699857e9afe8`。

## 交付状态

正式 `skills/dsh-plugin-development/` 已从冻结素材构建的完整目录整体替换，未读取旧 Skill 作为创建输入。源码 checkout 仍与目标 commit 一致且工作区清洁。未暂存、提交、推送或创建 PR。

- 素材与路由就绪：464 个能力候选全部裁决，341 included、65 merged、58 excluded；633 个代码导出入口全部裁决。196 条任务同时包括公开契约查询、选型、配置与实施，不代表 196 项业务均已运行。
- 行为依据：产品契约来自目标代码、公开声明与真实组合；示例及代表场景另做实际运行核验。本次没有修改 DSH runtime。
- 验证完成：结构、元数据、版本、离线边界、链接/锚点、JSON、源码路径、Host/Client 编译、冻结场景与下表检查通过。长尾接口的声明可查询性与全部运行行为正确性是不同结论。

## 实际命令与观察

| 检查 | 结果 |
| --- | --- |
| `prepare-dsh-skill-target.mjs 0.2.1-rc.3` | npm 精确版本匹配、tag/commit 校验、detached checkout 和 docs 快照完成 |
| `inventory-dsh-surface.mjs`、`discover-public-api-members.mjs`、`initialize-capability-coverage.mjs` | 从当前目标独立生成 464 能力、633 导出、7047 符号及 700 操作标题线索，随后完成裁决 |
| 目标 checkout `pnpm install --frozen-lockfile` | 锁定依赖安装完成；平台不适用包的提示未当作该平台运行验证 |
| `pnpm run build:lib:host`、`pnpm run build:lib:client` | Host/Client 构建及生成声明完成 |
| `validate-skill-source.mjs ... --freeze`、构建器、`verify-generated-skill.mjs` | 冻结哈希与 1209 个分发文件一致；1208 Markdown |
| 显式 `validate_skill.mjs --skill .../generated-skill --dsh .../checkout` | 15945 个本地链接/锚点、14 个 JSON 围栏、1646 条源码路径通过 |
| 显式 `check_examples.cjs --dsh .../checkout --skill .../generated-skill` | Host 10 块、Client 3 块，0 diagnostics，0 忽略块 |
| `verify-task-scenarios.mjs` | Service 首屏 6 项、共享控件首屏 7 项全部通过；脚本和辅助输入受冻结哈希约束 |
| 替换后 `pnpm verify:skill --dsh ...` | 维护文档与正式产物共 1224 Markdown、16012 链接/锚点、19 JSON 围栏及同一源码映射通过 |
| 替换后 `pnpm verify:examples --dsh ...` | Host 10 / Client 3 再次通过 |
| `pnpm test:validation` | 58 项通过，0 fail、0 skipped |
| `pnpm format:check`、`pnpm format:ledgers`、`git diff --check` | 通过；账本检查 2 个适用目标、20 个核心 JSON，未重排历史产物 |
| 目标上游选择性测试 | 两组共 12 个测试文件、324 项通过；主组命令中的 `fs-local/tests/local.spec.ts` 未匹配文件，不计入该数字，文件行为另以运行场景验证 |

## 实际行为与修正

- Service：独立 NodeNext consumer 使用真实声明编译，包解析、Profile/Loader 装载、调用和卸载通过。
- Tool：真实 Loader 执行、输入拒绝、预取消、规范结果事件和卸载通过。
- Remote：目标构建生成的 codecs、Host Loader、Client mount、进程内跨侧调用、取消和卸载通过；没有把进程内 carrier 写成 WebSocket 浏览器验证。
- Client：独立消费包解析、独立类型检查、lazy-CJS factory 构建、production ClientModuleSystem/SlotRegistry/renderer 的 jsdom 装载、Modal 焦点/Escape 及卸载重载通过。
- LLM：离线重新生成并构建消费包，通过真实 CLI 在隔离 Profile 安装、调用脚本化本地 provider、取消、卸载、移除并回读通过；未调用外部模型。
- FS/Storage/Web：直接从本次完整 Markdown 示例抽取实际实现，挂载后观察文件写入、持久记录和搜索结果上限，卸载通过；另验证 stale guard、取消、durable reopen、provider 撤销。
- 默认 base 组合已核查：复用 storage stack 与 fs-sandbox，Web patch 只覆盖既有 `id: web` 并保留 HTTP fetch，避免重复 provider。实际 patch 函数断言通过。
- 审阅发现的不存在 `ready` 事件与启动期 provider 竞态已修复，并重新运行实际示例。声明正文中的错误推断 `any`、嵌套围栏、废弃成员和重复 owner 已按精确源码/编译声明协调。

## 真实 Agent 观察

自然问句“DSH Web UI 提供对话框吗”没有显式点名 Skill。Agent 实际读取项目版本、生成 Skill 入口、Modal owner 与选型 HOW-TO，回答了公开导入、受控开关、焦点和调用方清理边界，且明确没有执行浏览器验证。

工具实现场景实际选中 Skill、创建完整包和 bundle patch、构建成功。首次运行在构建完成后遇到模型容量错误；重试完成，并实际验证 11 项成功/参数拒绝/取消/卸载/重载检查。工具执行结果保持一份规范 value/content。

该 Agent 运行**不计为全部约束通过**：fixture 的 AGENTS 明确禁止安装依赖，但 Agent 为验证分发包，在临时消费目录执行了离线 tarball 安装。没有联网、安装到真实 Profile 或外部发布；版本边界、路由、实现与行为检查通过，但这项执行约束未通过。原始事件保留在忽略的本地评测目录，避免机器路径与过程噪声进入分发。

## Not Covered

- 真实浏览器几何、像素、原生交互、完整 Web Profile 的 HTTP 装载；Client 运行场景是 production 模块系统加 jsdom。
- 真实 WebSocket 断线重连、Remote 非 owner 授权、自定义 Remote 新包独立生成的完整路径。
- Windows/Linux 原生后端、全部实验性平台与所有长尾业务组合逐项端到端执行。
- 执行中长任务取消、进程崩溃恢复、所有权丢失与跨实例恢复的完整矩阵；现有代表性检查不能推导这些保证。
- Agent 对 fixture 安装禁令的遵守未通过；不将其掩盖为全通过的 Agent 评测。

这些是维护者验证范围，不是产品缺少对应能力的结论；未写入分发正文。

## 仓库变更范围

除新目标的证据、冻结素材、版本化生成目录和正式 Skill 整体替换外，仅修改 `.gitignore` 以排除临时消费者/原始诊断，及示例检查器的路径别名映射。新增 `example_type_paths.cjs` 和回归测试，按目标上游 checker 支持的形式保留 example fixture alias，不忽略诊断。README 与 CI 继续描述不固定版本的创建流程，两个可见 CI job 保持原样。
