# 从插件记录用户反馈

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。本例把用户提交的 Session 级 remark 写入当前 live Session；具体契约及消息级 CAS 路径见 [用户反馈](api-user-feedback.md)。只有用户提交动作调用此方法，不能把模型输出自动当成用户反馈。

`package.json`：

```json
{
  "name": "example-session-feedback",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-command-feedback": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-command-feedback": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session": "0.2.0-rc.1",
    "typescript": "6.0.3"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "outDir": "lib",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-session-feedback
      name: example-session-feedback
```

`src/index.ts`：

```ts
import { Context, Service } from '@deepseek-ai/cordis'
import { recordFeedback } from '@deepseek-ai/dsh-command-feedback'
import type { FeedbackCategory } from '@deepseek-ai/dsh-command-feedback'
import type { Session } from '@deepseek-ai/dsh-session'

declare module '@deepseek-ai/cordis' {
  interface Context { submittedFeedback: SubmittedFeedback }
}

export class SubmittedFeedback extends Service {
  constructor(ctx: Context) { super(ctx, 'submittedFeedback') }

  record(session: Session, text: string, category?: FeedbackCategory): void {
    recordFeedback(session, { text, ...(category === undefined ? {} : { category }) })
  }
}

export const name = 'example-session-feedback'
export function apply(ctx: Context): void { ctx.plugin(SubmittedFeedback) }
```

在现有 Host action/Route 已确认用户身份及该 Session 所有权后调用 `ctx.submittedFeedback.record(session, text, category)`。这只追加 `feedback/record` 到 Session，刷盘跟随 Session 自身调度；要给用户持久化保证需使用所属的 flush/persistence 路径并验证。若使用内置 `sessionFeedback.record` Remote，它只查找 live Session 并返回 `session-not-found` 或“已追加”结果。消息级评分应使用 `messageFeedback.list/put/delete` 的 version 条件，不把本例的 Session 级事件混用为 message 评级。

隔离消费包 `evidence/tests/attachment-feedback-consumer/` 对发布类型编译并验证 `recordFeedback` 的 log-only 内容；记录见 `evidence/runtime/attachment-feedback-review.md`。真实 UI 提交、权限鉴别、Session 刷盘和 message-feedback 冷 CAS 未由该 smoke 执行。
