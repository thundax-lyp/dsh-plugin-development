# dsh-plugin-development 独立审核

审核对象为本次正式目录，版本 `0.2.1-rc.3`，对应 `dsh-v0.2.1-rc.3` / `1f81c047fc48fa190a683e469daa699857e9afe8`。遵循显式调用的 review-dsh-skill；默认只读。没有用创建账本、文件数量或创建阶段的通过记录证明本次结论。

结论：发现 3 项 P1 和 2 项 P2，不宜将当前产物视为“覆盖完整、API 全部准确、Agent 效果已验证”。版本边界、主要控件查询和部分完整示例可用，但类型提取、现有 Profile 组合和几个核心集成任务有实质缺口。本次完成的是有明确范围的独立审核；长尾语义审核尚未完成。

## 任务结果及证据

先查产物之外的同版本教程、公开声明、真实调用方与默认配置，再映射产物。Infra 发现 7 项、Client 6 项、Host 8 项候选；有交叉，不能将三组数量相加当覆盖率分母。完整目标、起点、公开入口、完成/失败判据与映射见 [Infra](infra-report.json)、[Client](client-findings.md)、[Host](host-findings.md)。

| 独立任务 | 起点与完成判据 | 本轮结果 |
| --- | --- | --- |
| 注册 Service / 模型工具 | 独立消费包或 checkout；依赖、构建、Loader 装载、调用与撤回 | HOW-TO 可发现且基本完整；本轮 Host 示例编译通过，未重新完整装载全部例子 |
| 对话框、slot、共享资源、侧栏 | 独立 Client 包或 checkout；正确公开入口、声明等待、交互及卸载 | Modal 路径可发现，控件契约和资源核心时序有源码证据；部分核心 API 类型错误，见 F1；真实浏览器未运行 |
| 自建 Host/Client Remote | checkout 生成新契约并装配到 Client，首次调用/拒绝/取消/卸载 | 已提示独立目录生成器限制，但完整 Host 例缺关键生成配置与 Client 文件，见 F3；本轮未证明新契约可跑通 |
| 默认 Profile 中调用 Shell / Goal / spawn | 在现有 web/base 中添加消费者，保持服务唯一 | HOW-TO 可能再次插入已有服务；实际注册探针拒绝重复 shell/goals，见 F2 |
| 安全自定义设置页 | Host schema/namespace + Client 草稿；旧 revision 保存拒绝且保留输入 | 原语存在，上游测试通过；产物未形成完整设置页路径，见 F4 |
| 本地 LLM / runtime Skill / workflow / MCP | 两种起点；发现、调用、终态、取消及释放 | 完整例可找到；抽查基本契约，87 项相关上游源测试通过；未运行真实模型、完整 MCP 重连或全部 Profile 组合 |
| Worker 插件部署与 VFS 打包 | checkout 或公开 npm 库；镜像、roster、Worker、页面连接与释放 | 库 API 与 HOW-TO 的 Host bundle 流程不匹配，见 F5；浏览器未运行 |
| 现有会话 ID 插件的发布前评审 | 实际消费项目隔离副本；准确定位 API 与生命周期问题 | 两个真实 Agent 均定位相同四类问题；独立探针复现其中两个异步窗口；见下一节 |

检索来源包括目标 checkout 的 `docs/cordis-tutorial/`、工具与 LLM 官方教程、`docs/cookbook/adding-a-settings-card.md`、`packages/bundle/base/cordis.patch.yml`、`packages/api/remotes/src/client/index.ts`、settings/form-model、slot/renderer/resources 的公开声明、实现及测试、Goal/Skill/workflow/MCP 源码与 README，以及真实消费项目 dsh-web 的 session-id 包。未检索全部用户故障记录、全部消费项目、所有实验平台或所有产品页面；不声称候选穷尽。

### 真实 Agent 对照

从本机已有的 dsh-web 固定 checkout `dbf0248fd8b2a77a3aeb44ae9688d936ba143303` 取 `packages/dsh-session-id@0.4.11`，保留原始根、packages 和包级 AGENTS。两个隔离副本具有相同源文件、本地 rc.3 SDK 构建产物、Cordis 4.0.5、模型配置、工具和只读权限；唯一实验变量是是否安装生成 Skill。没有修改原消费项目。需求为发布前评审 sidebar slot、会话列表、弹窗/剪贴板及复制/卸载竞态，不是合成问候工具任务。

| 条件 | 触发和读取 | 任务结果 | 命令数 / 约耗时 |
| --- | --- | --- | --- |
| 使用 Skill | 自主读取 SKILL.md、primitives HOW-TO、Modal 和 clipboard API，再查实际 SDK | 找到并发复制、卸载后晚到 timer、自制弹窗键盘/焦点、pending 列表误报空态四类问题 | 15 / 101 秒 |
| 不使用 Skill | 未读取生成 Skill；从项目、已安装 SDK 的导出/声明/实现取证 | 找到相同四类问题；还完成了源码面单独 tsc | 18 / 129 秒 |

两边最初均因副本缺少 `@testing-library/react` 无法执行现有 Vitest 断言，正确将其归为环境限制。控制运行结束后，主审在另外的隔离验证副本接上已有缓存依赖：原有 15 项测试通过；加入 deferred Promise 的两项审计探针后 17 项通过，实际观察到“卸载后仍新建 1 个 timer”和“两个未决复制成功后留下 2 个 timer”。这是对消费插件问题的独立验证，不是 Skill 导致这些 bug 的证据，也不是真实浏览器验证。

另一个限制是：两边均建议改用 Modal，却没有明确协调包级 AGENTS 的“只允许 writeClipboard 为 DSH value import”规则。实际实施前需要说明并解决该项目规则与选型的冲突；不能把两个 Agent 的建议直接当合规补丁，也不能把这条项目约束误写为 DSH API 限制。

额外三个自然措辞案例均真实运行：正向对话框查询加载正确入口并给出受控 Modal、Escape/焦点指导；无关 HTTP 请求未读取 DSH reference；rc.0 项目读取入口后停止套用 rc.3 签名。结果支持这些具体案例的触发与版本边界，不证明通用触发率。

[Agent 观察记录](agent-observations.json)保留具体读取轨迹、命令数、CLI token 用量和近似耗时；[竞态观察](race-probe-observation.json)记录断言。原始命令日志仅在临时隔离目录，文本答案在同目录 `*-answer.txt`。未做 reference 正文消融；单次只读任务的结果相同，时间差和缓存波动不支持“Skill 已普遍提高正确率/速度”的结论，也不能外推实现任务的效果。

## 审核路径与文件计数

每个 reference 恰好分配一次，合计 1,205。已审要求完成读取时机、决策价值、同版准确性、可用性、维护成本，以及适用的跨文件状态时序检查；并不表示所有运行分支都测试。部分审核保留未完成维度，不计为已审。

| 路径 | 分配 | 已审 | 部分审核 | 未审 | 具体文件与未核查项 |
| --- | --- | --- | --- | --- | --- |
| Infra | 473 | 11 | 462 | 0 | [逐文件记录](infra-report.json)；部分项主要完成公开导出与路由核查，未逐项审参数/时序/所有集成 |
| Client | 446 | 13 | 433 | 0 | [逐文件记录](client-status.json)；部分项完成全文异常/来源/路由扫描，未完成人工逐对象五维裁决 |
| Host | 285 | 12 | 174 | 99 | [逐文件记录](host-status.json)；部分项含公开导出检查；99 份只登记，未深读正文 |
| 导航 | 1 | 0 | 1 | 0 | [object-index 状态](navigation-status.json)；5,272 行目标可达，未逐项证明对象契约准确及别名权威唯一性 |
| 合计 | 1,205 | 36 | 1,070 | 99 | [所有具体路径及状态](file-review-status.md) |

“入口与治理”另计三份，不混入上述分母：根 `AGENTS.md`、分发 `SKILL.md`、`agents/openai.yaml` 均完成审核。根 AGENTS 的源/产物归属、代码优先、离线版本、验证报告与授权边界一致；没有发现需修改它的确定冲突。它不随产物安装，不能充当消费项目指导。分发 frontmatter/界面描述与控件、插件开发范围一致；版本不符边界真实生效。主要缺陷归属生成素材和创建验证，而非修改根 AGENTS 解除规则。入口的 Remote/Worker 任务状态需随 F3/F5 修正，避免在正文深处才暴露步骤缺口。分发 maintenance 说明另作辅助核对，source-map 路径通过不算 reference 语义已审。

### 本轮实际检查

- `node scripts/validate_skill.mjs --skill skills/dsh-plugin-development --dsh <精确checkout>`：通过，1,208 Markdown、15,945 本地链接/锚点、14 JSON fence、1,646 源路径。
- `node scripts/check_examples.cjs --dsh <精确checkout> --skill skills/dsh-plugin-development`：通过，Host 10、Client 3，0 ignored / diagnostics。第一次错误参数顺序仅打印 usage，调整后真实编译通过。
- Infra 的 2,399 项公开符号导入、Host 的 1,227 次/107 模块导入与精确声明导出匹配；它们只证明符号资格，不验证签名内容。证据及脚本见本目录 `*-export-*`。
- Client 4 文件 79 测试、Host 4 文件 87 测试，由各独立审核组运行，具体命令与观察见分组报告；不是全部 DSH runtime 测试。
- 主审重新执行本目录 `infra-shell-duplicate.mjs` 和 `host-duplicate-goal.mjs`，均 exit 0，并观察到预期注册拒绝。Goal 的 projection registry 为 stub；两项均不是完整默认 Profile 启动。
- 正式目录 1,209 文件逐字节等于生成目录；精确 checkout tracked clean；`git diff --check` 通过。未暂存、提交或发布；审核仅新增证据报告与探针。

## 按优先级排列的发现

没有确认 P0。下列五项均为静态可证或附有实际探针的发现，不把潜在问题当已复现用户事故。主审复查了三个 P1 的正式原文与精确源码；重复注册另亲自运行。

### [P1] F1 公开类型抽取失真，离线 API 页给出错误契约

插件作者依赖 API 页注册 slot、Store、Resource 或配置 provider，预期保留可调用签名与类型分支，实际主权威页存在以下反例：

- `references/client/api/api-client-ui-renderer-registry.md:37` 将 `SlotRegistry.register` 写作 `SlotCore`，同版 `packages/client/ui-renderer/lib/types/client/registry.d.ts:85` 是 `SlotCore['register']`。
- `api-client-ui-slots-index.md:3823` 的 callable 签名以 `SlotComponent...` 截断；资源页成员表还丢失 `ResourceProtocolMap[P]` 的索引，与同页代码块矛盾。
- 11 份 Client 页出现 83 个裸 `any` 正文；已核实 `DefineStore`、`BoundActions`、`languageForPath` 等真实声明并非 any。83 是异常扫描数，其余不能在逐项核实前全部断言同一错误。
- 13 处 Host 契约把 schema/接口/投影对象错误写成只读文本 `string`；例如 `api-capabilities-dsh-llm-deepseek-api-key.md:53` 的 Config，实际 `llm-deepseek-api-key/lib/types/config.d.ts:8-12` 有 interface 及同名 schema 双重导出。

原因分类：正文错误；公开符号存在性与 example 编译均未覆盖这些 `text` 契约。当前不能声称某个真实 Agent 已因此失败，但离线消费者缺少可靠事实，影响重要插件开发任务。

具体改进：修改当前 target 的 `skill-source/api-guardrails/` 对应 Client 和 capabilities 源页；抽取别名时追到真实 declaration，保留 indexed access、完整 callable、泛型/构造器、继承及 type/value 双重语义，不按长度替换为 string。重复 alias 用相对链接指向单一完整权威；Store 保留 Store API、组件保留原组件 API，而不是另造 any。创建验证增加这些真实反例的语义回归，不机械禁止上游合法 any。

验收：逐一对照精确公开声明，独立消费者注册自有 slot/ResourceProtocolMap 并编译；断言 `Config` 的 schema/接口与基字段可用、register 为 callable、资源 `[P]` 保留、声明不截断。然后重冻、构建、独立验证和整目录替换。[Client 细节](client-findings.md)、[Host 13 处定位](host-findings.md)。

### [P1] F2 现有默认 Profile 的接入步骤重复装载基础服务

任务是给默认 web/base 增加消费者，HOW-TO 却让人向 bundle insert 已有服务。`how-to-runtime-shell.md:13` 指示装载 subprocess-local 与 bash-local，base patch:234-252 已有 subprocess 和 bash-sandbox；后者也是 shell provider。Goal 和 spawn HOW-TO 同样让默认 web 再 insert 对应包，而 base:323-324、362-363 已拥有它们。

同版 Cordis `reflect.ts:287-291` 拒绝同 scope 重复服务；主审实际观察到 `service "shell" has been registered` 和 `service "goals" has been registered`。证据证明注册冲突加默认配置事实，没有冒充完整 Profile boot。

具体改进：在当前 `skill-source/how-to/runtime-shell.md`、`capabilities-dsh-goal.md`、`capabilities-dsh-subagent-spawn-in-process.md` 及同类路径先识别空组合/默认/已有 Profile；默认路径复用服务、只追加贡献插件，配置变化通过已有 entry id 更新；完整服务栈只给空组合。替换 provider 须先撤回原 owner，API 配置片段写清不能直接叠加；检查创建模板的组合裁决。

验收：对真实 base 应用任务 patch，断言目标服务/provider 唯一，实际 Loader 启动、消费者可调用；空组合另跑完整栈，卸载只撤回新增贡献。已有 FS/storage/Web 的修正不能证明其他路径已正确。[Infra 证据](infra-findings.md)、[Host 证据](host-findings.md)。

### [P1] F3 自建 Remote 的完整例缺生成配置和 Client contribution 装配

`how-to-core-remote.md:17-19` 路由到“完整 Host 例”；`example-core-remote.md:102,110` 只说 Client 必须挂载/启用 assembly。例中没有 `tsdown.config.ts` 或等效新包生成配置、Client 入口与公开导出、实际 `$mount` 调用、失败回滚及卸载文件。全产物没有能补齐 localNotes 装配的实际代码，因此读者仍须猜测关键步骤。

精确调用方 `packages/api/remotes/src/client/index.ts:1-40,185-207` 会值导入生成 contribution、重导出类型、逐项 await `$mount`，失败时逆序回滚，返回逆序 disposer；相应 manifest 还包含 Client 导出与注入配置。公开生成器受源码 workspace 布局约束是真限制，产物对此提示正确；缺口是在其声称支持的源码起点也未给完整可执行链。

具体改进：补当前 `skill-source/examples/core-remote.md` 的完整新包生成与 Client assembly，必要时拆为互链例；补 manifest/模块 files、Host/Client 编译面、公开依赖和 Profile 组合。首屏与 HOW-TO 提前标清“源码 workspace 自建 / 消费已发布 Remote / 独立目录生成受限”。不要求目标版本支持不存在的外部生成器。

验收：用隔离精确 workspace 新增 localNotes，实际生成该新契约（不能借内置 Settings 契约代替），构建并通过两侧 Loader 调用，验证参数拒绝、signal、失败 details、挂载失败回滚与卸载。[详细证据](infra-findings.md)。

### [P2] F4 自定义设置页缺草稿 revision 和安全保存的集成路径

官方 cookbook、公开 `configForms` 与 `SettingsFormModel<T>` 支持插件设置页，但产物将相关 HOW-TO 收缩成查询/选型，未连接 Host volatile schema、namespace、页面 slot、configForms 与 staged model。`api-client-ui-primitives-form-model.md:108` 又丢失泛型与 `constructor(scope,specs,secrets?)`。

真实 `settings-form/form-model.ts:210` 及 stage/save 实现在首次编辑捕获 baseline，保存携带该 revision，拒绝保留草稿。保存时简单取最新 revision 会改变并发语义。Infra 只有“保留 revision，冲突后协调”的原则，未补齐 Client 编辑期间版本变化的路径；79 项上游测试不等于产物已教会组合。

具体改进：当前 `skill-source/how-to/client-ui-settings.md` 或新增唯一设置页 HOW-TO，给出可编译最小包，区分自身 Config 页与 companion namespace 页；说明 scope/slot owner、构造、首次编辑 baseline、显式 save、冲突保留文本与用户协调、dispose。API 源页恢复构造与泛型，跨组规则用相对链接保留唯一权威。

验收：从已知初始项目构建/装载，编辑于 revision N，远端推进 N+1 后保存必须拒绝并保留草稿；确认后再提交；另测 validator 拒绝与停用退订。[详细证据](client-findings.md)。

### [P2] F5 Worker 库任务被套入 Host 插件安装流程

两个 `how-to-capabilities-dsh-experimental-webworker-{runtime,packer}.md:16-19` 将库任务统一写成贡献插件/bundle add/dsh 启动，却未给 image、roster、Worker 与页面连接步骤。对应 API 正文已经说明库不会增加 Profile 层、CLI 须完整构建 checkout；`apps/web/src/preview.ts` 的真实路径也不是只增加 Host 插件。

具体改进：修改两份当前 `skill-source/how-to/` 素材，分别说明 checkout 构建/CLI/托管和公开 npm 库参数/Worker 连接的起点。提供最小公开装配；暂时做不到的路径明确为仅契约或受阻，并在入口显示。保留 API 的对象事实，删除与该任务无关的 bundle 占位步骤。

验收：隔离项目按指南打包镜像、浏览器实际启动与关闭；若只保留契约查询，真实 Agent 在投入实现前应能指出缺失的镜像/roster/部署条件。[详细证据](host-findings.md)。

## 未测试与未运行检查

未完成 1,070 份部分审核文件的全部语义与五维裁决，99 份 Host 未深读；不能出具全目录完整覆盖/API 无误结论。未跑所有 196 个产物声称任务、全部 npm 安装/发布路径、完整新自建 Remote、真实 Web Profile/浏览器几何与系统剪贴板、非 owner 授权/跨 Session 矩阵、全量重连/崩溃恢复/Windows/Linux/实验后端、外部模型与服务。未做 reference 消融，故重复样板或长索引只作为待验证维护成本，不据篇幅要求删除。

没有为纯审核重跑全仓 Prettier、全部创建流程回归、全 runtime suite 或发布门禁；本轮未修改创建素材、生成物或维护代码，已有通过记录不冒充本轮结果。审核证据已对账，后续实施必须遵守冻结、重建、独立验证及整体替换，不直接修正式目录。本次未获提交/推送/PR/发布授权，也未执行这些操作。
