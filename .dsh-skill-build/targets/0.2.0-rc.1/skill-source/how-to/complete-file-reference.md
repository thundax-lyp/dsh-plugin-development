# 补全文件引用

相关公开契约：[API 参考](api-file-reference.md)。

## 任务

Host UI 输入 `@` 后，请求当前 live Agent 工作区的路径候选。Profile 已装载 `@deepseek-ai/dsh-agent` 与一个 `fileReferences` Provider（如 `@deepseek-ai/dsh-file-reference-local`）；消费包安装精确 `@deepseek-ai/dsh-file-reference@0.2.0-rc.1`。此函数应由已验证调用者能查看该 Agent 的 Host 路由调用。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { FileReferenceCandidate } from '@deepseek-ai/dsh-file-reference/types'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-file-reference'

export async function completeFileReference(
  ctx: Context, agentId: SessionId, query: string, signal: AbortSignal,
): Promise<FileReferenceCandidate[]> {
  signal.throwIfAborted()
  const agent = ctx.agents.get(agentId)
  if (agent === undefined) throw new Error('Agent is not live')
  return ctx.fileReferences.list(agent, query, signal)
}
```

调用该函数前，路由校验用户对 Agent/Session 的访问权限；连接关闭时取消 `signal`。返回值只供选择路径：将用户最终确认的文件 token 写入其正常消息，文件内容另由已授权 read 工具读取。函数不创建资源；Provider 自己的 Cordis fiber 持有缓存与清理。

## 验证

精确声明编译后，在真实 Agent + Local Provider Profile 的临时工作区创建文件与目录，查询、取消、运行文件工具后再查询，并在 Agent 卸载后确认无法继续补全。单独编译不证明这些行为。
