# 九个 Host/构建/服务包的待裁决 API

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。机器矩阵见 [host-service-api-decisions.json](host-service-api-decisions.json)，由 [脚本](generate-host-service-matrix.py) 从 `skill-source/api-surface.json` 当前 `pending` entry/object/member 重建；JSON 的 `inputSha256` 固定本次读到的账本快照。每行有原始 ID、精确源码路径与签名、`include`/`merge`/`exclude`、owner/section 和原因。没有修改共享账本。

此次快照共 1,017 行：16 entry、274 object、727 member；85 `include`、474 `merge`、458 `exclude`。`dsh-attachment` 在并行集成期间由 1/37/107 个 pending entry/object/member 降为 0/0/17，因此矩阵只保留脚本运行时尚 pending 的 17 个成员，未复写已裁决对象。并行账本还可能继续变化；复核时以 JSON 的 `inputSha256` 与即时重建结果为准。

| 包 | entry | object | member | 插件作者边界 |
| --- | ---: | ---: | ---: | --- |
| `dsh-typert-generator` | 2 | 70 | 342 | `./tsdown` 的 `typertPlugin`/`TypertPluginOptions` 属包构建；反射模型、类型图、emitter 中间结构不作业务 SPI。 |
| `dsh-app-boot` | 2 | 79 | 107 | Profile/Loader 配置数据合并到组合专题；启动、patch 调和、环境读写与 CLI 文件修改排除。 |
| `dsh-agent` | 2 | 38 | 110 | 创建/恢复选项、未发布 setup 和 `AgentHandle` 所有权纳入；factory 设置与 registry 发布由 loop owner 负责。 |
| `dsh-storage-domain` | 1 | 25 | 38 | domain spec、表和事件/错误归现有领域存储；schema 验证、持久提交、关闭顺序仍由 domain owner 持有。 |
| `dsh-session-persistence` | 0 | 28 | 29 | handle 选项、revision、拒绝类型归持久日志；materialize/格式校验 helper 是后端实现。 |
| `dsh-subprocess` | 1 | 23 | 46 | spawn/collect/terminal 类型归受管进程；`./control` 的继承 FD/环境握手排除。 |
| `dsh-attachment` | 0 | 0 | 17 | 剩余入站值与文件/图片限额成员归附件存储契约；耐久 ref 才能写入 Session。 |
| `dsh-agent-preset-registry` | 5 | 11 | 38 | display/invariant/type-only 再导出归 preset 目录与 Profile 组合，不另建注册任务。 |
| `dsh-experimental-agent-team` | 3 | 0 | 0 | 待裁决导出子路径归实验 Team 的 Profile/生成 Remote 组合，Host service 成员已有专题。 |

新增 author-facing 正文在 [Remote 构建生成器](../../skill-source/api-guardrails/remote-api.md#构建时生成器入口)、[Agent 创建与恢复](../../skill-source/api-guardrails/workflow-agent-loop.md#agent-loop-的公开组合边界)、[领域存储](../../skill-source/api-guardrails/storage-domain.md#对象类型与成员) 和 [附件存储](../../skill-source/api-guardrails/attachment-store.md#公开成员)。特别说明：`typertPlugin` 只在构建期发射声明，外部包仍需目标应用选择 Client 贡献；`AgentSetup.commit()` 在发布前同步执行，失败回滚；附件 `SaveFileStreamAttachment.data` 必须由 provider 背压消费。

核查：生成脚本成功；所有矩阵源文件在精确 checkout 存在，非排除项 owner 和 section 存在，ID 唯一，`include` 对象及成员均能在指定 section 定位。此轮未新增 TypeScript consumer 编译或真实 Profile、Remote、持久化和进程运行验证，不能把源码/声明裁决当成运行通过。
