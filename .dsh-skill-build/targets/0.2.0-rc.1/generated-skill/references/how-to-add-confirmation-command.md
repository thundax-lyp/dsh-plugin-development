# 注册需要用户确认的命令

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。本例注册 `/confirm-note <text>`：先从真实人类回答者请求确认，再将用户提交的文字作为 Session 级反馈写入规范日志。命令调用直接返回 UI，不进入模型。命令和问答契约见 [人类命令与用户问题](api-human-commands-questions.md)，反馈事件见 [用户反馈](api-user-feedback.md)。

`package.json`：

```json
{
  "name": "example-confirm-note",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-commands": "0.2.0-rc.1",
    "@deepseek-ai/dsh-user-questions": "0.2.0-rc.1",
    "@deepseek-ai/dsh-command-feedback": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-commands": "0.2.0-rc.1",
    "@deepseek-ai/dsh-user-questions": "0.2.0-rc.1",
    "@deepseek-ai/dsh-command-feedback": "0.2.0-rc.1",
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
    - id: example-confirm-note
      name: example-confirm-note
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import { CommandDefinitionId } from '@deepseek-ai/dsh-commands'
import { recordFeedback } from '@deepseek-ai/dsh-command-feedback'
import type {} from '@deepseek-ai/dsh-user-questions'

export const name = 'example-confirm-note'
export const inject = ['commands', 'userQuestions']

export function apply(ctx: Context): void {
  ctx.commands.register({
    definitionId: CommandDefinitionId('example/confirm-note'),
    name: 'confirm-note',
    description: 'Ask before recording a session feedback note',
    input: { hint: '<text>' },
    recordInput: false,
    async handler({ agent, rawInput, signal }) {
      const note = rawInput.trim()
      if (!note) return { kind: 'error', text: 'A note is required.' }
      const answer = await ctx.userQuestions.ask({
        agent, signal,
        questions: [{
          id: 'record-note',
          question: 'Record this feedback note?',
          detail: note,
          options: [{ label: 'Record' }, { label: 'Cancel' }],
        }],
      })
      const selected = answer.answers.find(item => item.id === 'record-note')?.selected
      if (selected?.length !== 1 || selected[0] !== 'Record') {
        return { kind: 'error', text: 'Feedback note was not recorded.' }
      }
      signal.throwIfAborted()
      recordFeedback(agent.session, { text: note, category: 'product-interaction' })
      return { kind: 'success', text: 'Feedback note recorded.' }
    },
  })
}
```

Profile 先装载 `commands`、`userQuestions`、`agents` 和属于当前 Client/人类通道的 answerer，再装载本插件。Client 或其他交互层调用 `ctx.commands.execute(agent,'/confirm-note text',[],signal)`；命令 runtime 记录 `command/run` 和 `command/done`，本例用 `recordInput:false` 让已确认的 note 只由 `feedback/record` 承载，避免重复日志 payload。答案不是许可提升：未确认、无回答者、非 root/stale Agent 或取消时不追加反馈。实际接入 UI 时需鉴别 Session 归属并提供真实用户答案；不要在生产代码中硬编码选项回答。卸载插件撤销命令，正在等待的交互仍应由 signal/answerer 自己收敛。

隔离消费包 `evidence/tests/human-commands-questions-consumer/` 用发布 rc.1 声明编译，在 Cordis Host 级以进程内 answerer 双身验证确认、拒绝、日志与卸载；真实浏览器 UI 未运行，见 `evidence/runtime/human-commands-questions-review.md`。
