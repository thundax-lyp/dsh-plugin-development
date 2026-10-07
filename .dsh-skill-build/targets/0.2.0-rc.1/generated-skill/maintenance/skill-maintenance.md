# Skill 重建与验证

此产物锁定 `dsh-v0.2.0-rc.1`、commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。维护时从目标版本公开包导出、类型、运行时、测试与文档重新裁决，不从本产物反推下一个版本的事实。事实证据归属见 [source-map](source-map.md)。

创建方在隔离目录维护 `skill-source/`、覆盖账本、API 成员账本和 claims。全部候选处置、主要任务路径和 example 的类型与实际组合检查完成后，才冻结素材；构建器只复制冻结素材并生成哈希对应的离线 Skill。验证依次覆盖结构、frontmatter、链接、JSON、目标源码映射、Host/Client 声明编译，以及被产物声称可执行的独立消费路径。只有所有必需门禁通过后才整体替换正式目录。

公开文档不把未运行的 Profile、Agent、Session、Client 或 Remote 行为写成已验证；每次重建报告精确版本、commit、覆盖候选处置、实际运行的命令与结果，以及 `Not Covered` 的影响。示例包、diagnostic observer 和本地安装目录属于创建证据，不随 Skill 分发。
