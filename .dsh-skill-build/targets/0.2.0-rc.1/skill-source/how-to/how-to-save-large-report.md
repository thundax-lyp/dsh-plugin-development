# 保存插件大文本

## 目标与边界

目标 `dsh-v0.2.0-rc.1`。此例从已有可信工具执行持有的 Session 与 tool call 身份保存完整报告，返回 backend 定位符；调用方仍需把一份规范 JSON 工具结果（含 locator/retrievalHint 或 inline 退回）写入 Session 日志。不要自行构造不存在的 Session ID，也不要把 source 字段当权限凭据。Host Profile 先装载一个 `SpillStore` backend；本地安装可用 `@deepseek-ai/dsh-spill-local`。这个 helper 不替代自动 `spill-policy`。

创建以下文件。`package.json`：

```json
{
  "name": "dsh-spill-consumer",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-spill": "0.2.0-rc.1",
    "@deepseek-ai/dsh-spill-local": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.9.0"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext",
    "outDir": "lib", "rootDir": "src", "strict": true,
    "skipLibCheck": true, "types": ["node"]
  },
  "include": ["src/**/*.ts"]
}
```

`src/save-report.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import { ToolCallId } from '@deepseek-ai/dsh-llm'
import type { SessionId } from '@deepseek-ai/dsh-session'
import type { SpillRef } from '@deepseek-ai/dsh-spill'

/** Host helper for a caller that already owns the Session and tool call. */
export async function saveLargeReport(
  ctx: Context,
  sessionId: SessionId,
  callId: string,
  content: string,
): Promise<SpillRef> {
  if (content.length === 0) throw new Error('report must not be empty')
  return ctx.spillStore.saveText({
    owner: { sessionId },
    source: { kind: 'tool', toolName: 'my_report', callId: ToolCallId(callId), label: 'result' },
    suggestedName: 'my_report.txt',
    content,
  })
}
```

在 Host 中先装载 `LocalSpillStore` 或其他满足相同契约的 backend，再从持有真实 Session 和模型 tool call ID 的入口调用 `saveLargeReport(ctx,session.id,String(callId),content)`。保存失败会 reject；工具的失败/inline fallback 由调用者统一处理，不要给模型两个相互矛盾的结果。运行 `npm install --ignore-scripts`、`npm run build` 验证声明；本地 backend 的实际写入和权限验收见本任务 evidence。契约见[Spill 存储](api-spill.md)。
