# 插件遥测通道与有界关闭

## 对象关系

OTel 只提供独立 reporter 工厂，挂载不创建队列、身份或网络连接。createEventReporter 为每个消费者建立独立计数批处理通道；createSessionLogReporter 建立按请求字节上限约束的 Session 日志通道。消费者在报告前负责授权与脱敏，并在所属 fiber 卸载时停止接收、排空并等待 shutdown。通道不共享队列或消费者身份。

## 选型与使用

SessionLog 的 maxRequestBytes 是正安全整数且不能超过 4000000，batch size 不可大于 queue size。SessionLogReporter.stopPending 停止待投递内容，shutdown 等待当前资源释放；外层截止与失败处理由 consumer 拥有，不能把排队成功当成服务器已收到。

- [@deepseek-ai/dsh-otel.](api-runtime-dsh-otel.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-telemetry.md)说明配置、调用和清理顺序。
