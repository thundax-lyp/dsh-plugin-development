# 有界输出保留与省略说明

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-output-retention` 根入口是**纯库**，没有 `ctx`、Cordis service、插件装载、事件或跨调用状态。工具作者在自己的一次输出积累中直接创建 `ItemRetainer` 或 `TextRetainer`，再把规范 JSON 结果交给工具层，由 Session 日志记录模型可见事实。完整可编译例子见[生成有界工具输出](how-to-bound-tool-output.md)。

## 对象类型与成员

| 对象                                                            | 成员与语义                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ItemRetainer<T>`                                               | `new ({kind:'head',maxItems})` 保留前 N 个逻辑单位；`push(item)` 返回 `PushDecision.kept/truncated`，`finish()` 给 `RetainedItems<T>` 的 `items/seen/kept/truncated/omitted`。                                                                                 |
| `TextRetainer`                                                  | `new ({kind:'head',maxBytes}\|{kind:'tail',maxBytes}\|{kind:'headTail',headBytes,tailBytes})`；`push(Uint8Array\|string)` 以 UTF-8 字节积累；`finish()` 返回 `RetainedText.text/truncated/omittedBytes`，裁切处不引入新的替换字符，省略数包含 UTF-8 边界修剪。 |
| `Omitted` / `PushDecision`                                      | `Omitted` 判别为 `none`、`exact(count)`、`unknown`；retainer 自身给精确数或 none，unknown 留给外部无计数来源。`PushDecision` 是本次 push 的 kept 与累计 truncated。                                                                                            |
| `RetentionNotice` / `describeOmitted` / `formatRetentionNotice` | notice 记录 scope、strategy、unit、limit、kept、omitted；`describeOmitted` 生成不虚报精度的省略句；`formatRetentionNotice(notice,recovery)` 在其后拼工具自有的恢复指导。                                                                                       |
| `truncateWithoutSplittingSurrogatePair`                         | 按 UTF-16 code unit 截短，避免在截断边界引入孤立 high surrogate；不修复输入原有的不合法 surrogate。                                                                                                                                                            |

## 生命周期、失败与边界

预算必须是非负整数，否则构造时抛错。每个 retainer 只属于一次工具调用，不跨请求缓存，也不持有异步资源或 disposer。`truncated` 只表示**预算舍弃了已观察内容**；上游读取失败、权限拒绝、跳过二进制文件、未遍历完的搜索范围，应另写工具领域字段，不能混成预算省略。`seen` 只数送入 retainer 的单位，不代表上游总体。HeadTail/tail 要读完输入才能知道最终 suffix；调用者负责流取消、文件关闭、错误分类、spill 文件和行号。工具返回唯一规范 JSON；footer 是 JSON 中的模型可见字符串，UI 渲染不再自行决定事实。

## 验证

精确源码 `packages/util/output-retention/src/index.ts`，目标包测试 `packages/util/output-retention/tests`。隔离 `evidence/tests/output-retention-consumer/` 用 npm rc.1、TypeScript 6.0.3 编译并 smoke 验证多字节 headTail、精确 omittedBytes、item head 与 footer；参见 `evidence/runtime/output-retention-review.md`。未验证真实工具、Session 记录、上游错误或长期流内存。
