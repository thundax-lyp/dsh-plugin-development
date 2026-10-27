# 随插件提供可发现并加载的 Skill操作指南

## 随插件提供可发现并加载的 Skill

目标结果：随插件提供可发现并加载的 Skill并观察结果及资源释放。

### 目标与前置

目标是随插件提供可被用户和模型分别发现、加载的 Skill；runtime 注册与文件系统发现是两条不同输入路径。

### 实现和使用步骤

1. 按[runtime Skill 完整包](../examples/example-runtime-skill.md)建立插件；声明 skills 注入，准备 kebab-case 名称、非空 description、正文、source 和独立的用户/模型 invocation policy。
2. 在插件 scope 调用 register。不要依靠同层重复注册覆盖旧正文；first-wins 的重复注册 disposer 不会移除赢家。动态内容应使用 provider 工厂并在变更后 invalidate。
3. 构建并安装 bundle，启动隔离 Web Profile。服务层检查 list/snapshot 和 get；scope 选择观看层，cwd 决定工作区发现，signal 取消该次操作。
4. 要让模型加载内容，组合 tool-skill 消费者；需要磁盘 Skill 时另选 skill-filesystem，并明确 roots、优先级和 watch。目录是 invocation-neutral 数据，消费边界按调用方式过滤。
5. 分别通过模型加载和用户 `/check-evidence` 观察正文；确认目录和加载结果进入该 consumer 的持久 Session。卸载贡献后重查赢家的 provider/source，避免把其他层同名 Skill 误认为残留。

### 失败、取消与完成判据

非法名称、空 description、provider 内容名称不匹配和被取消的 get 都不能作为成功加载。发现 complete=false 时保留上次良好目录并在后续边界重试；不要缓存不完整发现。纯常量 Skill 无独立异步资源，文件 provider 则要在 owner 结束时中止 watch/发现。

### 权威对象契约

- [api-capabilities-dsh-skill](../api/api-capabilities-dsh-skill.md)。
