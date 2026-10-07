# 插件开发术语与边界

目标版本：`dsh-v0.2.0-rc.1`。

| 术语          | 本 Skill 中的含义                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Host 插件     | 由 Cordis Loader 导入的函数、类或 `{ apply }` 对象；在 fiber scope 中注入服务、注册 effect 和清理资源。 |
| Fiber         | 一次插件应用的运行实例。`ctx.plugin()` 返回可等待的 fiber；已返回不等于已激活。                         |
| Service       | 通过 `ctx.provide` 或 `Service` 构造器提供、按 isolation label 解析的 Context 属性。                    |
| Bundle        | 声明 `dsh.bundle.patch` 的可安装包，贡献有序的 Cordis patch 层；单独的 bundle 不是 Profile。            |
| Profile       | 命名运行组合，拥有自己的依赖、`dsh.profile.bundles` 和用户 patch；启动后才可能产生运行中的 fiber。      |
| Entry / patch | Entry 是最终 Loader 树中的插件行；patch 按顺序插入或覆盖行字段。配置 dump 展示合成结果，不运行插件。    |
| 规范工具结果  | `execute` 返回并符合 `output.schema` 的单份值；模型文本和 UI 卡是基于它的投影，不是另一份事实源。       |
