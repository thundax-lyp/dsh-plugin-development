# 大结果落盘与可检索定位符

## 对象关系

SpillStore 只有 saveText，保存完整 UTF-8 文本并返回 locator、准确 bytes 与 retrievalHint，不提供检索、搜索或删除 API。owner.sessionId 是写入命名空间，source 是描述，不授予 locator 读取权限。suggestedName 是被净化的单段提示。fork 继承日志中的定位符不复制旧文件，新 spill 归 child session。spill-policy 决定替换超长工具结果，失败时保留原 inline 内容，backend 自身必须 reject 真正存储失败。

## 选型与使用

locator 为不透明值，不解析成固定本地路径。保存失败由调用方选择保持原结果或失败，不能报告保存成功；过期与回收由后端负责。

- [@deepseek-ai/dsh-spill-local.](api-runtime-dsh-spill-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-spill-policy.](api-runtime-dsh-spill-policy.md)：模块和公开对象。
- [@deepseek-ai/dsh-spill-policy./notice](api-runtime-dsh-spill-policy--notice.md)：子路径对象。
- [@deepseek-ai/dsh-spill.](api-runtime-dsh-spill.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-spill.md)说明配置、调用和清理顺序。
