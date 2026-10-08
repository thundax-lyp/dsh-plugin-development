---
name: dsh-plugin-development
description: 为 DeepSeek Harness 0.2.0-rc.2 开发、接入、排障或评审 Cordis 包和插件；从插件任务直达操作步骤与公开契约。
---

# DSH 插件开发

本 Skill 只适用于 `@deepseek-ai/dsh-agent@0.2.0-rc.2`。先确认项目所用 DSH 版本；版本不符时停止套用这里的签名和装载步骤，查找匹配版本的 Skill 或为该版本重新创建。不要把其他 DSH 版本、产品内部包或旧 Skill 的同名接口混入。

## 从任务开始

<!-- BEGIN GENERATED TASK NAVIGATION -->
<!-- prettier-ignore -->
| 用户任务 | 先读 |
| --- | --- |
| 添加供 Agent 调用的 Host Tool | [register-host-tool](references/how-to-host-core.md#register-host-tool) |

<!-- END GENERATED TASK NAVIGATION -->

其他插件开发、排障或评审任务见[开发任务路由](references/plugin-development-routing.md)。进入 Client/Remote 或 provider 步骤前，先在路由中核对项目是目标源码 checkout 还是独立消费项目，以及该起点的公开构建前置。

先读任务步骤，遇到具体类型、门禁或生命周期问题时，再打开该步骤链接的 API reference。只加载当前任务需要的参考内容。

## 跨主题不变量

- 所有注册、watcher、stream、进程、job 与 child 都必须有明确 owner、取消和卸载路径。
- 模型可见事实写入 Session；缓存、React state 和通知不是持久事实。
- 工具只有一份规范 JSON 结果；模型渲染和 UI presentation 保持纯函数。
- Host、Client 与 Remote 分侧编译；声明编译不证明 Profile、浏览器或运行时行为。

## 完成边界

实现与接入任务只有在适用的包解析、构建、Profile 装载、可观察行为、失败或取消和卸载清理实际验证后，才能报告功能完成；Client、Remote、native、网络或外部进程还应在对应运行环境验证。排错任务可在根因有充分证据时报告定位完成，同时明确修复与回归验证状态。只读评审可依据已核查的目标版本契约交付有边界的结论，并列出未运行的行为验证；不得把静态证据称为功能实现或运行通过。
