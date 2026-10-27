# 最小工具插件

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。复用 [Service 示例](example-core-service.md) 的目录和构建配置，将包名改为 `local-greet-tool`，peerDependencies 与 devDependencies 增加同版本 `@deepseek-ai/dsh-tools`。bundle 中的模块名同步改为 `local-greet-tool`。

## src/index.ts

```ts
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'local-greet-tool'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'local_greet',
    description: '返回指定姓名的问候语。',
    parameters: {
      name: { type: 'string', required: true, description: '被问候者的姓名' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args, exec) {
      exec.signal.throwIfAborted()
      return `你好，${args.name}`
    },
  }))
}
```

## 构建与装载

```sh
pnpm install
pnpm run build
dsh plugin --profile development add .
dsh --profile development
```

该 profile 必须已提供 `systemPrompt` 与 `tools`。使用 `tools/result` 观察器或运行工具的消费方核对 `local_greet({name:'DSH'})` 返回问候。对 name 缺失和非字符串输入断言校验失败，对预先中止的 signal 断言未成功执行。停用 bundle 后确认工具被撤销。此示例不请求模型；是否被某种模式暴露给模型由现有 profile 的 ToolRuntime 配置决定。
