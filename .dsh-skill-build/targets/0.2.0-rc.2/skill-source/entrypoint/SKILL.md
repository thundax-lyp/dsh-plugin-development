---
name: dsh-plugin-development
description: 为 DeepSeek Harness 0.2.0-rc.2 制作、装载并验证 Cordis 包和插件；从插件开发任务直达操作步骤。
---

# DSH Plugin Development

本 Skill 只适用于 `dsh-v0.2.0-rc.2`（commit `639ed015397290b3745d163aafe02ffee4aa3f84`）。先确认项目所用 DSH 版本；版本不符时停止套用这里的签名和装载步骤，查找匹配版本的 Skill 或为该版本重新创建。不要把其他 DSH 版本、产品内部包或旧 Skill 的同名接口混入。

## 从任务开始

| 用户要做什么                  | 先读                                                                |
| ----------------------------- | ------------------------------------------------------------------- |
| 添加供 Agent 调用的 Host Tool | [注册 Host Tool](references/how-to-host-core.md#register-host-tool) |
| 其他插件开发或排障任务        | [开发任务路由](references/plugin-development-routing.md)            |

先读任务步骤，遇到具体类型、门禁或生命周期问题时，再打开该步骤链接的 API reference。只加载当前任务需要的参考内容。

## 跨主题不变量

- 所有注册、watcher、stream、进程、job 与 child 都必须有明确 owner、取消和卸载路径。
- 模型可见事实写入 Session；缓存、React state 和通知不是持久事实。
- 工具只有一份规范 JSON 结果；模型渲染和 UI presentation 保持纯函数。
- Host、Client 与 Remote 分侧编译；声明编译不证明 Profile、浏览器或运行时行为。

## 完成边界

只有包解析、构建、Profile 装载、一次可观察行为、失败或取消以及卸载清理都实际验证后，才能报告任务完成。无法运行的 Client、Remote、native、网络或外部进程 lane 必须标为 Not Covered。
