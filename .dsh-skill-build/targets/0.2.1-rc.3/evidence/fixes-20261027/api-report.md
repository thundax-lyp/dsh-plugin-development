# F1 类型契约修复与验证

目标为 `dsh-v0.2.1-rc.3`，仅从该 checkout 的公开导出、源码和已构建声明取证。没有读取正式 Skill 或 generated-skill 作为修复输入，没有修改共享账本或维护脚本。

## 修复范围

- 全部 1,602 个已纳入 Client 对象从其实际入口经 TypeScript export/alias 解析到完整声明，替换旧的推断字符串；类保留泛型、继承、公开构造器与完整可调用成员，去掉非公开与废弃成员。成员表来自同一声明的语法节点，保留索引访问、判别分支和可选性。
- 原 11 页 83 个独立裸 `any` 全部逐符号解析：70 个重复重导出链接既有权威对象；其余 13 个恢复具体公开声明。不是将 `any` 机械替换成 `unknown`。原先含 any 的 195 个对象小节均记入来源核查；其中 3 个 Store 源类型确有显式 `any`，保留原契约（ActionsDecl、StoreDecl、StoreFactory）。
- 修正 Host 13 处“只读文本常量”占位。12 处实际是配置类型/schema、schema字段对象或投影对象；其中 Config/CuaConfig 保留 interface 与同名运行时 schema 双重导出及继承字段。另 1 处 cua-macos 的 GUIDANCE 经核实确为字符串常量，恢复其真实声明；不把它列为 schema 错误。
- 共变更 342 份 API 源文档；没有增加输出映射。SettingsFormModel 页另纠正“纯 React 展示控件”的套话，说明构造订阅、首次编辑 baseline、revision 围栏、拒绝保留草稿、显式协调、保存异常状态、secret 写入部分成功及 dispose 的实际边界。

修复器为 `api-declarations.mjs`，全部旧声明、新声明与实际来源见 `api-declaration-observations.json`。该脚本首次执行修改素材并保留原问题快照；快照存在后的重跑只调用独立检查，避免覆盖后续人工语义。它不替代公共创建流程的冻结与构建。

## 已运行检查

`node .dsh-skill-build/targets/0.2.1-rc.3/evidence/fixes-20261027/api-verify.mjs`：通过。该检查支持 `--skill <Skill 根>`，指定时仅从 manifest 对应输出路径读取正文，不借用素材正文作为兜底。

- 1,615 份具体对象声明或别名路径逐项核对当前素材、恢复记录和重新独立解析的真实声明文件，断言未发生截断、83 个旧裸 any 已恢复、70 个别名指向权威文档。10 个跨包声明合并对象明确列出声明所属包、导入和运行时启用边界；对应额外 tracked source 证据列在 api-merged-evidence.json。
- 显式语义回归：`SlotRegistry.register` 为 `SlotCore['register']`；ResourceProvider 保留 `ResourceProtocolMap[P]`，failure 保留 `RemoteFailure | undefined`；SettingsFormModel 保留泛型与 constructor；Host Config 同时有 interface/schema，基字段未丢失。
- 隔离消费者文件分 Host/Client 两个 TypeScript program：Client 声明并注册自有 slot、自有 ResourceProtocolMap/provider、构造 SettingsFormModel、BoundActions、languageForPath；Host 同时使用 Config 类型和值并读取继承字段。通过 checkout 的已构建公开声明路径检查，两个 program 均 0 诊断；这不是新的 npm 安装或独立发布路径测试。

在精确 checkout 运行：

```text
pnpm exec vitest run packages/client/ui-slots/tests/core.client.spec.ts packages/client/resources/tests/resources.client.spec.ts packages/client/ui-primitives/tests/settings-form-model.client.spec.ts
```

3 文件、73 项通过。断言涵盖 slot 声明撤回/恢复、资源最后 holder 清理/取消，以及 settings revision/草稿规则。测试的是目标版本实现，不冒充所有恢复文档的全部运行组合或真实浏览器验证。

## 主流程仍需完成

主 Agent 统一协调 api-surface/source-map/claims，并执行重新冻结、构建、独立结构/源码映射/Host与Client示例验证、代表组合/Agent 任务与整目录替换。建议将本次反例加入创建验证规则：沿公开重导出找到真实声明，不以 source-checker 错误推断 any 或截断 signature 发布；保留 indexed access、泛型、构造器和同名 type/value 双空间，并允许有精确来源的合法 any。

## 同源缺陷扩展收口

主流程要求进一步检查 Core/Infra 与其余 Host/Runtime 后，追加运行 `api-expand.mjs`：全部余下 3,652 个纳入对象均经公开入口解析成功，无未解项；其中 2,614 处需要补充或恢复声明。增加 Host 品牌 ID 的 5 个类型／构造函数双空间修复后，最终记录为 4,234 份声明、81 个别名权威链接；全 API 中旧的独立裸 any 共 242 处已纳入恢复记录。原 83 个 Client 裸 any 仍是该总数的子集，不能相加。

对新发现的 370 个成员名，`api-member-owners.mjs` 沿真实已构建声明检查继承、类型组合和联合分支，并补充父权威链接或精确成员声明索引。366 个名字公开可达，共对应 808 个实际声明或分支；4 个 `plan/*` 名字只在 ui-plan 内部实现文件合并，公开编译声明入口不传播它们，已交由主 Agent 在共享账本中写明具体排除理由。没有将候选中的 any 或截断字符串直接贴回文档。

最终受影响 API 源文件共 692 份（含新成员归属索引）。31 组扩展后的跨包／跨侧声明合并按来源包分段，明确只有导入相应声明才生效；不同运行侧的同名 Service 字段不能无条件放入同一编译程序。初始 10 组 Client 合并也已写明启用条件。没有重新引入 Session.eventAt/ownEvents/snapshotEvents、TimerService.setInterval/setTimeout 等废弃成员。

最终 `api-verify.mjs` 的 source 执行通过：4,234 份正文与真实 d.ts 声明一致；366 个新增成员名在正文有索引、808 个成员声明重新对照实际 d.ts；Host／Client 两个隔离消费者类型检查均 0 诊断。指定 `--skill` 时相同检查只从该产物的 output 映射读取 API 正文，且会核对别名目的页内容，不借 source 正文补齐缺失。

`api-evidence-owners.json` 按 692 个 owner 列出可映射的 tracked source，供主流程同步 claims/source-map；26 个生成 Remote 声明必须以目标版本的 tracked Remote 定义和生成器作为源证据，不能伪装成 tracked 源文件。唯一额外的外部声明归属来自 lockfile 锁定的 `@octokit/webhooks@14.2.0`，用于解释 GitHub delivery 的公开组合字段；其性质不同于 DSH 自有源码保证。

这些结果修复和验证的是公开声明准确性，不证明 5,272 个纳入对象的全部运行时行为已端到端验证。真实 Agent、完整新 Remote、设置页冲突和默认 Profile 组合由主流程另行执行并报告。
