# 图片与文件附件的持久引用

## 对象关系

先保存并验证附件，后把耐久引用写入所属 Session event。saveImages 先全批验证再写入，存储失败不返回部分 refs，但已发布内容地址对象可能留下不可达数据。imageLimits 约束图像数量、总字节与类型，图像需完整解码验证；文件 verbatim 保存与图片 normalization 不同。文件流必须背压，不能整文件收集。readImage/readFileStream 核对 durable ref 与内容一致性；readImageRequest 是确定性的请求派生版本，其 identity 覆盖变换输入。imageHostPath/fileHostPath 允许 undefined，不可假设所有后端都提供 Host 文件。

## 选型与使用

不支持的文件或投影操作默认拒绝 ATTACHMENT_FILES_UNSUPPORTED/ATTACHMENT_PROJECTION_UNSUPPORTED。取消 signal 原因保留；完整性错误应中止消费，不要用损坏附件继续请求。

- [@deepseek-ai/dsh-attachment-local.](api-runtime-dsh-attachment-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-attachment.](api-runtime-dsh-attachment.md)：模块和公开对象。
- [@deepseek-ai/dsh-office-to-pdf.](api-runtime-dsh-office-to-pdf.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-attachment.md)说明配置、调用和清理顺序。
