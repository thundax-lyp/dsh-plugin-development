# Client 独立审核

基线：`dsh-v0.2.1-rc.3` / `1f81c047fc48fa190a683e469daa699857e9afe8`。只读正式产物与精确 checkout；没有依赖创建报告证明正确性。审核方法和根 AGENTS 已读。报告、扫描器与状态账本是审核证据，不是生成产物修改。

## 独立任务发现与结果

先检查以下产物外来源，再映射分发文件，不把 55 个 HOW-TO 反推为任务全集：

| 任务与起点 | 独立来源 | 公开入口与完成判据 | 产物映射与结果 |
| --- | --- | --- | --- |
| 在独立插件中显示受控对话框，关闭后回焦点，卸载清理 | `packages/client/ui-primitives/src/index.ts`、`src/Modal.tsx`、`tests/modal-layer.client.spec.tsx` | root `Modal`，受控 `open/onClose`、带头部的 `closeLabel` 或 headless 联合分支；焦点/Escape/portal 卸载 | primitives HOW-TO → Modal API → overlay 完整包；静态路径完整，Modal 对照源码准确；本轮 upstream 测试通过，完整示例未在真浏览器运行 |
| 外部包提供 Host 空入口及 lazy factory，经 Profile 装载浏览器半部 | `docs/cookbook/adding-a-settings-card.md` §5、`packages/client/web/README.md`、`packages/client/modules/src/client/manifest.ts` | `dsh.client`、裸包名 Loader 行、`./client` export、`__ModuleLoader__.load`；可见贡献及停用回收 | modules HOW-TO → overlay 包；明确未发布 preset 与单入口限制，没有把普通 ESM 当 bundle；本轮仅契约检查，未重跑完整 Profile 安装 |
| 下游插件等待 slot、父退出回收、重新声明后重装 | `packages/client/ui-renderer/src/client/registry.ts`、`packages/client/ui-slots/src/index.ts` | `ctx.slots.inject/register`、同步 disposer、caller fiber；父声明消失与自身卸载均清理 | renderer/slots HOW-TO 有正确时序，但主 API reference 的 register 类型失真，见 C1；完整自定义 Factory 类型体系仅部分审核 |
| 两个视图共享资源流，无 holder 后取消并丢弃快照 | `packages/client/resources/src/client/resources.ts`、`contract.ts`、`tests/resources.client.spec.ts` | `Resources`、`ResourceProvider`、`UseResource`；首次 holder 打开，最后 holder 中止，失败帧保留旧值 | resources HOW-TO/示例的流结束、失败、取消与实现一致；契约成员表有索引类型失真，见 C1；upstream 测试通过 |
| 提供可打开/关闭的右侧栏页，避免 kind/id 混用与 Session 串写 | `packages/client/ui-sidebar-right/src/client/tab-registry.ts`、同版 subsystem | `SidebarRightTabDefinition`、`sidebar.right.pane.tab`；两步注册、以 definition.id 为 key | 示例与 HOW-TO 的关键选型与已读 source 一致；尚未逐项核实 tab-domain、所有导航 revision 分支与真页面，相关文件部分审核 |
| 自定义设置页，暂存后 CAS 保存，编辑期间 remote revision 变化时不覆盖别人或丢草稿 | `docs/cookbook/adding-a-settings-card.md`、`packages/client/ui-settings/src/client/config-form{,-types}.ts`、`packages/client/ui-primitives/src/settings-form/form-model.ts`、`ui-settings-web-search/src/client/web-search-card-controller.ts` | `ctx.configForms`、`SettingsFormModel<T>`、Plugins page slots；旧 revision 拒绝、保留草稿、显式协调 | 只有“查询”HOW-TO，无完整设置页集成与 draft 基线步骤；构造器和语义又缺失，见 C2。upstream 行为通过不补足产物路径 |

现有外部消费项目、用户故障记录、完整桌面/Worker caller 未查。上述是独立发现的有限任务候选，不是插件作者任务全集。两种起点均识别；产物在外部 Client factory 构建上公开了限制，没有要求消费者导入未发布的仓库 preset。

## 实际运行

在精确 checkout 运行：

`pnpm exec vitest run packages/client/ui-primitives/tests/settings-form-model.client.spec.ts packages/client/ui-primitives/tests/modal-layer.client.spec.tsx packages/client/ui-settings/tests/config-form.client.spec.ts packages/client/resources/tests/resources.client.spec.ts`

观察结果：4 个文件、79 个测试通过，退出 0，Vitest 4.1.11，4.48 秒。测试涉及 settings draft/revision、Modal 层与资源引用等目标实现行为；不能据此称 446 个 reference 的插件集成全部运行通过。本子组没有调用真实 Agent，也没有把之前创建阶段的 Agent 结果作为本轮对照。真实 Agent 对照由主审单列。

## 文件审核口径

分配 446：388 API、55 HOW-TO、3 示例。13 已审、433 部分审核、0 未审。全部路径及逐文件 task、route、startpoint、execution、status、evidence、findings、unverified 见 `client-status.json`。所有文件都经过完整文本的路由/来源路径/类型异常扫描，故其余列部分审核；这不是全部语义审核。13 已审指五维人工静态检查及适用的核心时序核对完成，不表示每份文件均做浏览器运行。

未审维度明确记录在 433 条部分审核项中：未逐对象比较全部同版类型/运行语义，未核实其全部任务与生命周期路径，尚未对读取时机和维护价值作完成人工裁决。扫描器 `scan-client.py` 与结果 `client-anomalies.json` 可复现异常定位。

## [P1] C1：核心 Client 契约被错误 any、索引丢失和截断签名污染

**任务和影响。** 插件作者查询自定义 slot、Store、Resource 等公开 API 的精确类型，预期离线 API 页可用于选型与实现；主页面自称保留输入/输出/联合分支，但给出的类型并不等于该版本契约。属于静态可证的 API 错误；本组没有声称已观察到某个 Agent 因它运行失败。

**定位与精确证据。**

- `references/client/api/api-client-ui-renderer-registry.md:37` 写 `register: SlotCore`；精确 checkout 的 `packages/client/ui-renderer/lib/types/client/registry.d.ts:85` 是 `readonly register: SlotCore['register']`，它是可调用的注册方法类型，不是 SlotCore 实例。
- `references/client/api/api-client-ui-slots-index.md:3823` 的 `SlotCore.register` 在 `SlotComponent...` 结束，实际 callable 参数/返回和完整约束消失；不能借该段恢复签名。
- `references/client/api/api-client-resources-contract.md` 中 ResourceProvider.open 代码块保留 `RemoteResult<ResourceProtocolMap[P]>`，紧接的“公开类型”表却写 `RemoteResult<ResourceProtocolMap>`；同页 ResourceSnapshot.failure 表写 any，代码块是 `RemoteFailure | undefined`。同页两种权威呈现互相矛盾。
- 扫描发现 11 份文件共 83 个独立裸 `any` 正文。已独立核实的反例包括 `api-client-ui-primitives-index.md` 的 `languageForPath`（真正签名 `languageForPath(path: string): string | undefined`，见 `packages/util/code-language/src/index.ts:212`），以及 `api-client-ui-slots-store.md` 的 `DefineStore`、`BoundActions`（真正泛型在 `packages/client/store/src/contract.ts:127,143`）。部分对象有别处完整契约，但 alias 页没有指向该权威段，反而另称精确形状是 any。其余裸 any 逐一语义归因尚待完成，不能仅凭扫描断言每个都是同一错误。

**原因与具体修改。** 创建素材 `skill-source/api-guardrails/client-ui-renderer-registry.md`、`client-ui-slots-index.md`、`client-resources-contract.md`、11 个 alias 所属源页需修正；在该版本 `evidence/client/extract.mjs` / `generate.py` 所代表的抽取流程里，不把候选账本中可能未解析、截断的 checker 字符串直接当分发契约。解析 re-export 到真实 declaration；类保留泛型、构造与完整 callable/索引访问。重复 re-export 可以链接单一权威段，不能伪造 any。成员表从同一真实声明生成，确保与代码块一致。正式修复遵守重新冻结、构建、独立验证及整体替换。

**验证建议。** 用本轮具体符号作回归：SlotRegistry.register 保留 `SlotCore['register']` 或完整等价 callable；资源 open 的 `[P]` 与 failure 联合类型保持；languageForPath/DefineStore 正文不能是裸 any；API 签名输出不得因 TypeScript 默认字符串截断而以 `...` 终止。然后在独立消费者声明自有 slot 和 ResourceProtocolMap，通过该方法注册并编译，运行父声明退出/重装与资源最后 holder 清理。机械禁止所有 any 会误伤真实 API any，应比对真实来源。

## [P2] C2：自定义设置页任务被收缩成查询，缺少草稿 revision 与构造路径

**任务和影响。** 同版官方 cookbook 和公开调用方明确支持插件作者提供 live configuration form；任务是做出可暂存且安全保存的设置页。`how-to-client-ui-settings.md:9` 和 `how-to-client-ui-settings-plugins.md:9` 只承诺“公开契约选择”，后续第 4 步统一导向 slot/factory/sidebar；没有把 Host volatile schema、对应 namespace、页面 slot、configForms、staged model 与保存/拒绝/卸载连成这项任务。跨组 Host state HOW-TO 提供 settings 冲突原则，但 Client 入口没有把它接上。

**精确语义。** `SettingsFormModel<T>` 的真实 `constructor(scope: SettingsFormScope<T>, specs: SettingsFieldSpec[], secrets?: SettingsSecretSpec[])` 在 `packages/client/ui-primitives/src/settings-form/form-model.ts:210` 和生成 d.ts:163；分发 `api-client-ui-primitives-form-model.md:108` 仅列实例方法，连泛型 T 和 constructor 都没有。真实 `stage` 在第一次编辑时捕获 `baseline = scope.getSnapshot()`，`save` 传 `baseline.revision`，拒绝后保留 drafts；直接读取保存瞬间 revision 再 mutate 会悄悄改变并发语义。分发页没有说明这个必需决策，所有适用页面只给类型和泛化清理话术。本轮 79 tests 证实上游已有对应正确原语，不代表产物已教会如何组合。

**具体修改。** 在 `skill-source/how-to/client-ui-settings.md` 或新建唯一自定义设置页 HOW-TO（并从现有入口及时链接）补全公开可执行路径，区分插件自身 volatile Config page 与对另一个已服务 namespace 的 companion page。复用跨组 Host state 的权威规则链接；页面侧说明 whileServed/slot owner、configForms.get、SettingsFormModel 构造、首次 draft baseline、显式 save、revision 冲突保留输入与用户协调、dispose；增加最小可编译外部 Client 包例。`skill-source/api-guardrails/client-ui-primitives-form-model.md` 恢复泛型和构造器，并在唯一语义权威处描述并发边界；不要将所有产品内置卡片复制为例子。

**验证建议。** 从原始空消费者项目完成构建/装载，编辑时保存 revision N，远端推进到 N+1，再保存必须被拒绝并保留文本；用户重读/确认后才能提交。还要测 Host validator 拒绝不变更持久/活值，停用时订阅清理及无晚到 UI 写入。分别记录 npm 独立包和源码内起点的运行状态。

## 未覆盖与冗余结论边界

没有真实 Web 浏览器 Profile、原生焦点/几何、sidebar docking/跨 Session 全矩阵、断线重连、资源 provider 跨进程权限、全部 388 API 语义、长尾产品页面运行；没有 reference 正文消融。重复生命周期样板和 alias 目录可能增加阅读成本，但未作消融，不提出“删除一定无损”的确定结论。C1 中 alias 改链接的保留权威位置应分别为真实 Store API、原始组件 API 与完整 Slot/renderer 契约；离线分发不以在线文档代替。
