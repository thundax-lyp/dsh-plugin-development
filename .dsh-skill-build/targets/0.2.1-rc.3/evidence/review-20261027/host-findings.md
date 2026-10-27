# Host 独立审核回报

版本：`dsh-v0.2.1-rc.3`，commit `1f81c047fc48fa190a683e469daa699857e9afe8`。本组没有创建本组产物；未使用创建报告作为通过证据。

## 任务结果与证据

从精确 checkout 的公开导出、官方 `docs/user/develop/practice/llm-adapter.zh.md`、`packages/{skill,workflow,subagent,goal,mcp}/...` 服务定义及对应 README、`packages/bundle/base/cordis.patch.yml` 和 `apps/web/src/preview.ts` 发现以下任务，再映射分发文件：

| 独立任务 | 起点与完成判据 | 分发路径及观察 |
|---|---|---|
| 为现有 DSH 接入新 LLM 路由 | checkout/独立包；目录、规范流终态、取消、卸载 | LLM HOWTO→完整本地 adapter；结构完整。API页部分错误类型见 HOST-F1；未运行真实网络模型 |
| 随插件发布可发现 Skill | 两种起点；目录、加载内容、policy、卸载 | runtime-skill 示例→SkillRegistry；完整静态路径，服务源测试通过；未实际UI调用 |
| 斜杠命令协调两个子任务 | 两种起点；命令发现、父子归属、结果、取消、清理 | workflow-command 示例具备完整包与run.result/stopReason/finally.dispose；未使用付费模型实际执行 |
| 本地 MCP 工具集成 | 两种起点；发现、加法结果、规范错误、断连恢复、卸载进程 | MCP HOWTO→本地MCP示例；stdio SDK契约相符，协议源测试通过；完整Profile/重连未实跑 |
| 启动全新本地子级并继续/取消 | 两种起点；父子归属、权限捕获、取消/结果、清理 | subagent HOWTO/API描述发布前signal、发布后dispose，spawn/fork决策可发现；默认组合重复安装陷阱见 HOST-F2 |
| 持久Goal并拒绝陈旧revision | 两种起点；create/edit/restart/disarm、冲突拒绝 | goal HOWTO/API可找到状态模型；默认组合重复服务实证见 HOST-F2 |
| 浏览器Worker部署现有插件树 | checkout或独立部署库；镜像打包、Worker启动、页面连接、释放 | 库API存在但HOWTO错套Profile流程，HOST-F3；未运行浏览器 |
| 用公开库打包VFS镜像 | checkout CLI或独立npm库；可挂载tar、模块闭包 | API承认CLI须完整checkout，HOWTO未区分两种起点，HOST-F3 |

没有读取外部真实消费项目或在线需求记录，以上候选不代表全部插件任务。其余产物声称任务多数尚未做完整语义检查。

实际运行：

- `node .../review-20261027/host-export-check.cjs`：以同版本源码 TypeScript 导出与 manifest公开 `types` 解析交叉核查分发页声称的 **1,227次符号导入、107个模块**，0缺失。此检查不验证签名、可用环境或运行行为，不是全目录已审。
- checkout 中运行 `pnpm exec vitest run packages/goal/goal/tests/goal.spec.ts packages/skill/skill/tests/skill.spec.ts packages/workflow/workflow/tests/workflow.spec.ts packages/mcp/mcp-client/tests/protocol.spec.ts`：4文件87项通过。它验证源契约与对应分支，不证明分发示例真实Profile端到端运行。
- `node .../review-20261027/host-duplicate-goal.mjs`：真实编译GoalService在同一scope重复注册抛出预期错误，projection registry为stub；正确释放root fiber。第一次临时尝试误用`ctx.dispose()`导致exit1，随后改用正确`ctx.fiber.dispose()`重跑exit0；不以第一次整体失败声称完整通过。

## 分配与审核状态

285份：已审12、部分审核174、未审99。精确逐文件清单为 `host-status.json`。部分审核包含人工抽样/仅公开导出比对，绝不视为完整五维完成；未审文件只登记标题/路由，未深读正文。已审是静态五维及适用时序审核完成，不等于运行其全部项目任务。没有做本组reference消融，也没有独立Agent对照；真实Agent效果由主Agent另行报告。

## [P1] HOST-F2 默认 Profile 接入步骤重复插入已有服务

任务与起点：在默认web Profile上开发调用Goal的独立插件，或启用spawn后端。期望复用既有基础服务，仅追加贡献插件；配置变化更新已有entry。HOWTO `how-to-capabilities-dsh-goal.md:16-17`、`how-to-capabilities-dsh-subagent-spawn-in-process.md:16-17` 却明确要求把目标包配置插入bundle，然后从默认web Profile安装。API Goal:21-24又给出dsh-goal可执行行，spawn API:24-29给出完整三行服务/provider/tool组合，没有先判断现有组合。

精确源码：base patch:323-324已配置`id:goal`/dsh-goal；:362-363已配置spawn。`vendor/cordis/src/reflect.ts:287-291`拒绝同scope重复服务；真实GoalService `packages/goal/goal/src/index.ts:250-251` 注册`goals`。脚本复现错误`service "goals" has been registered at <root>`。这是关键装载步骤错误，源于通用HOWTO把“向空组合安装能力”与“在默认组合中贡献插件”混成同一流程。

改进：修改本次 `skill-source/how-to/capabilities-dsh-goal.md`、`capabilities-dsh-subagent-spawn-in-process.md` 及同模板受影响任务，先识别默认/已有Profile；列实际entry id，默认路径只复用/覆盖，完整最小服务栈仅给空组合。API的独立配置片段标明不能叠加到已有服务上。相同根因与其他组shell/provider发现合并。

验证：对实际base patch应用任务patch后断言目标服务/provider唯一，真实Loader启动且既有服务无重复注册；在独立空组合另跑完整栈路径。逐任务同时验证卸载只撤回新增贡献。

## [P2] HOST-F1 长类型被错误替换成文本常量

任务：从离线API页编写模型provider配置、CUA协议/后端和Session投影。分发API共有13处把非字符串接口、schema或投影对象写成`string（由包提供的只读文本常量；消费方引用导出，不复制其正文）`。

具体位置：`api-capabilities-dsh-llm-deepseek-api-key.md:53`、`dsh-llm-deepseek-account.md:59`、`dsh-llm-deepseek-config.md:9,94`、`dsh-llm-pi-ai.md:137`、`dsh-cua.md:87`、`dsh-cua-protocol.md:99,129`、`dsh-experimental-cua-macos.md:112`、`dsh-plan-mode.md:157`、`dsh-token-meter.md:230,240,250`（文件均在references/host/api/）。

强证据：精确 `llm-deepseek-api-key/lib/types/config.d.ts:8-12` 是`interface Config extends ProtocolConfig, ModelListingConfig`与同名`const Config:z<...>`；`packages/experimental/cua/src/protocol.ts:36`的Request是`z.discriminatedUnion`；`packages/plan/plan-mode/src/index.ts:136`是投影定义对象。Config单页还只列直接成员，错误string加上缺失继承关系会使Agent误选类型或漏掉配置。

改进：修改本次`skill-source/api-guardrails/`中对应文件，从精确声明保留type/value双重语义、继承关系、公共签名；允许压缩泛型展开，但不能按长度把schema/对象降为string。真实长文本常量才可省略正文。将此类类型事实与Client组丢失indexed access问题合并，并在创建验证规则加入“签名不能凭长度替换语义”的负向回归。

验证：用确切类型查询/类型赋值断言检查Config为interface/schema且可读取基接口字段、Request拥有parse/safeParse、投影对象含key/init/apply；重新生成后检查上述13处；主Agent可用实际配置问题复测Agent选择。

## [P2] HOST-F3 Worker库与打包器任务被路由到Profile插件流程

任务：以公开包构建Worker部署或打包镜像。`how-to-capabilities-dsh-experimental-webworker-runtime.md:16-19`及`...webworker-packer.md:16-19`沿用“贡献插件inject→bundle install→dsh启动→卸载bundle”流程，没有给出库所需的image/roster/Worker/page连接步骤。API runtime:13已明确安装库不会增加Profile层，packer:13说库接受参数，:44的限制说明CLI必须完整构建checkout。源公开用法与`apps/web/src/preview.ts:7-14`说明实际路径是加载Worker、选择image/overlay后connectWorkerHost；不是追加一个Host插件便得到浏览器部署。

这是静态可证的任务流程错误，未执行浏览器；Agent能在API深处找到部分事实，但HOWTO未明确两种起点、不提供最小可执行装配，首屏任务却承诺“运行并释放”。不要求目标版本提供不存在的构建器。

改进：修改本次`skill-source/how-to/capabilities-dsh-experimental-webworker-runtime.md`和`...webworker-packer.md`，把源码checkout路径与独立npm库路径分开：前者给仓库构建/CLI及静态托管前置；后者用公开packVfsImage参数与Worker/页面连接构成最小项目，或明确标为仅契约/部署者自备镜像受阻。入口提前展示该状态。对象契约保留API页，删去这些任务无关的bundle占位步骤。

验证：在隔离消费项目按HOWTO生成镜像并以浏览器实际启动；如暂不能提供完整运行路径，则以Agent任务证明其在实现前能准确报告所缺roster/构建/部署输入，而不是创建不会启动Worker的Host插件。

## 未测试与限制

未跑真实模型/网络、外部ACP/CLI后端、全量平台实验包、浏览器Worker、完整MCP断连重连、长期任务崩溃恢复及全部权限时序。未逐个核查所有174份部分审核文件的完整签名/生命周期，也未深读99份未审文件；因此不能给出“Host覆盖完整/API全部准确”的结论。现有源测试通过及公开导出存在，只能支持其各自检查范围。
