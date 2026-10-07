# 给工具添加执行策略

## 目标与前置

此 `dsh-v0.2.0-rc.1` Host 插件对一个已注册的 `echo` 工具检查输入长度：pre Hook 要求长文本审批，同步 guard 拒绝禁用模式，result Hook 仅观察最终结果。策略与审批契约见 [工具执行策略 Hook](api-tool-policy-hooks.md)，工具定义与规范结果见[模型工具](api-tools.md)。部署必须另行装载 `ToolRuntime` 和 `ApprovalService`，并配置拥有 Agent 的回答者；否则 `ask` 封闭为拒绝。

## 实现步骤

`package.json`：

```json
{
  "name": "example-tool-policy",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1",
    "@deepseek-ai/dsh-user-approval": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1",
    "@deepseek-ai/dsh-user-approval": "0.2.0-rc.1",
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
    - id: example-tool-policy
      name: example-tool-policy
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-user-approval'

export const name = 'example-tool-policy'
export const inject = ['tools']

export function apply(ctx: Context): void {
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (exec.name !== 'echo') return next()
    exec.signal.throwIfAborted()
    const args = exec.arguments as { text?: unknown }
    if (typeof args.text === 'string' && args.text.length > 100) {
      return { kind: 'ask', reason: 'Long echo text requires one-time approval' }
    }
    return next()
  })

  ctx.tools.guard(exec => {
    if (exec.name !== 'echo') return undefined
    const args = exec.arguments as { disabled?: unknown }
    return args.disabled === true ? 'Echo is disabled for this call' : undefined
  })

  ctx.on('tools/result', (exec, result) => {
    if (exec.name !== 'echo') return
    // Record only operational metrics here; result is frozen and already final.
    void result.isError
  })
}
```

本例的 `as` 只用于已注册工具参数的只读策略检查；工具本身仍须验证参数 Schema。`ctx.on` 与 `guard` 注册属于插件 fiber，卸载会停止新请求的策略；正在等待的异步门禁仍须响应 `exec.signal`。`ask` 的 Agent、open turn、回答者、审批审计由 ApprovalService 处理；插件不得自行把 `ask` 解释为许可。若策略必须无条件拒绝，guard 的单调拒绝比 waterfall 中等待上游 `next()` 更适合。审批只放行这一调用，工具副作用与失败由工具和 Session 管道记录。

## 验证与边界

在发布 rc.1 声明上运行 `npm install && npm run build && npm pack --dry-run --json`。本次隔离消费包已观察到短调用、guard 拒绝、`ask` 在缺 Agent 时封闭拒绝，以及卸载后策略消失。真实 Profile、Agent open turn、Client 回答者和 Session 审批审计/恢复尚未验证。
