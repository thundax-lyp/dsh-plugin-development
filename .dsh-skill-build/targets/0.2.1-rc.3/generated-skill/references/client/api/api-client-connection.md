# connection：插件接入

## 对象关系

Host connection 负责请求 admission、Peer 身份和 transport 交互，浏览器通过 installConnection 安装连接循环并交给指定 hooks/sinks。RPC 失败是结构化通道，连接代际隔离旧响应；断线与恢复需通过状态 source 观察，不从 WebSocket 打开推定 Remote 或 Session 已恢复。

## 选型与使用

- [api-path 对象契约](api-client-connection-api-path.md)。
- [connect-protocol 对象契约](api-client-connection-connect-protocol.md)。
- [connection 对象契约](api-client-connection-connection.md)。
- [index 对象契约](api-client-connection-index.md)。
- [peer 对象契约](api-client-connection-peer.md)。
- [recovery-config 对象契约](api-client-connection-recovery-config.md)。
- [rpc 对象契约](api-client-connection-rpc.md)。
- [rpc-host 对象契约](api-client-connection-rpc-host.md)。
- [rpc-schema 对象契约](api-client-connection-rpc-schema.md)。
- [socket 对象契约](api-client-connection-socket.md)。

完整操作见 [接入 connection](../how-to/how-to-client-connection.md#接入-connection)。
