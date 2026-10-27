# 反馈记录与命令入口

## 对象关系

反馈服务保存用户对消息的明确输入，命令插件提供调用入口，Remote 与 Client 消费是独立组合。记录不能当成模型工具执行授权，UI 展示应读取持久或服务返回结果，不另外造第二份事实。

## 选型与使用

只更新成功返回后的反馈视图；失败保留原输入供重试，重复请求按接口实际幂等边界判断。

- [@deepseek-ai/dsh-command-feedback.](api-runtime-dsh-command-feedback.md)：模块和公开对象。
- [@deepseek-ai/dsh-message-feedback.](api-runtime-dsh-message-feedback.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-feedback.md)说明配置、调用和清理顺序。
