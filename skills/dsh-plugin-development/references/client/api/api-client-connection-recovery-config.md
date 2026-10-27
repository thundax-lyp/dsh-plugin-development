# connection：recovery-config 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

Host connection 负责请求 admission、Peer 身份和 transport 交互，浏览器通过 installConnection 安装连接循环并交给指定 hooks/sinks。RPC 失败是结构化通道，连接代际隔离旧响应；断线与恢复需通过状态 source 观察，不从 WebSocket 打开推定 Remote 或 Session 已恢复。

## ConnectionRecoveryConfig client

入口 `@deepseek-ai/dsh-client-connection/client`，公开符号 `ConnectionRecoveryConfig`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ConnectionRecoveryConfig {
    backoffBaseMs?: number;
    backoffFactor?: number;
    backoffMaxMs?: number;
    generationReadyWarnMs?: number;
    generationReadyTimeoutMs?: number;
}
```

| 成员 | 公开声明 |
| --- | --- |
| `backoffBaseMs` | `backoffBaseMs?: number;` |
| `backoffFactor` | `backoffFactor?: number;` |
| `backoffMaxMs` | `backoffMaxMs?: number;` |
| `generationReadyWarnMs` | `generationReadyWarnMs?: number;` |
| `generationReadyTimeoutMs` | `generationReadyTimeoutMs?: number;` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-connection.md#接入-connection) 在真实装载路径检验成功、失败与卸载。
