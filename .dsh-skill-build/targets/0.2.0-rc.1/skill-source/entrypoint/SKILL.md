---
name: dsh-plugin-development
description: 为 dsh-v0.2.0-rc.1 编写、装载和验证 DSH Host、Client、Remote 插件与 bundle 的离线开发参考。
---

# DSH Plugin Development

本 Skill 锁定 `dsh-v0.2.0-rc.1`、commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。只对这个精确版本使用列出的类型、包导出和装载路径；其他版本重新从源码核查。输入是开发者的插件任务，输出应包含入口、完整装载路径、资源所有权和可观察验证。

先按 [任务路由](references/plugin-development-routing.md)选择最小参考集。需要按符号或包名寻找权威章节时查 [关键词索引](references/keyword-index.md)，概念边界见 [术语](references/terminology.md)。

Host 插件遵守 Cordis fiber 的所有权：注入服务后使用它，在卸载或取消时清理自己的异步资源。Profile 的 bundle、patch 和运行中的 fiber 是不同层；配置 dump 不能证明服务已经激活。需要模型可见结果时，工具只返回一份规范 JSON 值，呈现从该值纯投影；跨重启事实须由所属 Session 或持久状态接口保存。Client 与 Remote 入口要分别核查相应侧的类型、装载和行为，不能从 Host 示例推断。

本次素材的源码归属和验证边界见 [source-map](maintenance/source-map.md)。没有实际运行的生命周期或用户可见路径应明确写作未验证。
