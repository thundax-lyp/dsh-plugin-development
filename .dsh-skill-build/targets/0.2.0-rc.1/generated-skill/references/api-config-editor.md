# Profile ConfigEditor 的受信任 Host 写入

## 任务范围

目标 `dsh-v0.2.0-rc.1` 的 `@deepseek-ai/dsh-config-editor` 根入口公开 `ConfigEditor` service；base Profile 在 Loader 与 `profileContext` 后装载它。受信任的 Host 管理插件可对**自己拥有的 Profile entry**做完整原始 Config 编辑，例如改变一个需经 Loader 校验并热更新的部署限额。完整例子见 [编辑自有插件 Config](how-to-edit-owned-plugin-config.md)。普通设置卡片的 JSON、revision、volatile 路径和 secret redaction 应使用 [Settings](api-settings.md)；Client 不能直接使用本 Host service。

## 对象类型与成员

| 对象           | 成员和语义                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ConfigEditor` | `static inject = ['loader','profileContext']`；`documentPath` 给当前 Profile patch 文件；`entries()` 仅列 Loader 中唯一、可寻址的 profile entry；`configuration()` 返回每条活动 entry 的 `inherited` 与 `override` 脱离引用副本；`edit(entry, change)` 从本次原始 config 与继承层计算**完整 next config**，校验、写入并等待 Loader reconcile。 |
| `default`      | 根入口默认导出 `ConfigEditor` 类；使用同一个 service 契约。                                                                                                                                                                                                                                                                                    |

`change(current,inherited)` 是同步函数，必须返回完整 `Record<string,unknown>`；要保留其他字段，应基于 `current` 展开后只替换自有字段。若 next 与 inherited 深相等，服务移除多余 override，而不是留下空 patch。`entry` 必须从这次 `entries()` 取得，不可伪造、跨 reload 缓存或借它修改他人配置。`configuration()` 用于审阅来源，不是写入入口。

## 写入、失败与恢复

`edit` 在 Profile 安装目录的 `package.json` 上取文件锁；写前重读 patch 和 Loader entry，检测 entry 已替换/停用，运行目标插件的 `internal/config` 与 `resolveConfig` 验证。它保留 YAML 文档结构，按 entry id 只改自己的 patch 行，校验结果未被 home/命令行 overlay 覆盖，再用 mode `0600` 原子写入。写后按目标 entry id 调用 Loader reconcile；失败时回写旧文档并再次 reconcile。安装 HMR 时整个操作通过 `hmr.runExclusive` 串行化。锁、验证、写入或回滚失败须向调用者传播；不要先向用户报告“已保存”。

此 service 不提供 Settings 的 `expectedRevision`、JSON 路径限制和秘密遮蔽。调用者自己限定可改的 entry/字段和输入权限；不能将 `documentPath` 或完整 raw config 直接发到浏览器。`edit` 成功只说明 Profile patch 与 Loader 已协调，不证明插件的新配置改变了业务结果；要读下一次 `Volatile.get()` 或触发真实操作核对。卸载本管理插件无需自行关闭 ConfigEditor；它由 Profile 拥有。

## 源码与验证

实现 `packages/boot/config-editor/src/index.ts`；消费封装 `packages/settings/settings/src/index.ts:304-398`；失败与继承测试 `packages/settings/settings/tests/{editor-failures,configuration,configuration-inheritance}.spec.ts`。隔离发布包编译和真实 Profile 写入检查见 `evidence/runtime/config-editor-review.md`。
