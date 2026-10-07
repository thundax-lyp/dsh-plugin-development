# 为工具生成有界输出与省略 footer

## 目标与边界

目标精确 `dsh-v0.2.0-rc.1`。本例把一段进程 stdout 限成固定的首尾字节，并把省略事实写在同一份规范工具 JSON 中；另把搜索匹配限制为前两项。`@deepseek-ai/dsh-output-retention` 是纯库，不装载 Cordis plugin，也不隐式写 Session。源码见目标 `packages/util/output-retention/src/index.ts`；公开成员详见[有界输出保留](api-output-retention.md)。

一次调用创建一次 retainer，送入全部已经观察到的 chunk，`finish()` 只调用一次并将结果随工具 JSON 返回。上游失败、退出码、权限错误、spill 文件位置由工具自己填入结果的其他字段；`truncated` 仅是预算省略，不能拿它代表上游不完整。真实工具调用的唯一 JSON 结果应由 Session 记录；UI 只按结果渲染。取消时停止读取上游并关闭它拥有的句柄；本例 `Iterable` 不拥有异步资源。

`TextRetainer` 按 UTF-8 字节而非字符计量，真实省略数字还包含 cut 处被修剪的半个 codepoint；`formatRetentionNotice` 只生成中性的省略句，恢复指导由工具自己提供。`ItemRetainer` 只有 head 策略；`seen` 数已观察到的单位。

## 独立最小包

`package.json`：

```json
{
  "name": "dsh-output-retention-consumer-rc1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": [
    "lib"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "smoke": "node smoke.mjs"
  },
  "dependencies": {
    "@deepseek-ai/dsh-output-retention": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
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
    "rootDir": "src",
    "outDir": "lib",
    "declaration": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

`src/index.ts`：

```ts
import {
  TextRetainer, ItemRetainer, formatRetentionNotice,
  type Omitted, type RetainedItems,
} from '@deepseek-ai/dsh-output-retention'

export function boundedProcessOutput(chunks: Iterable<string>): {
  stdout: string; truncated: boolean; omittedBytes: Omitted; omissionFooter: string
} {
  const retainer = new TextRetainer({ kind: 'headTail', headBytes: 8, tailBytes: 8 })
  for (const chunk of chunks) retainer.push(chunk)
  const retained = retainer.finish()
  const omissionFooter = formatRetentionNotice({
    scope: 'command stdout', strategy: 'headTail', unit: 'bytes',
    limit: { head: 8, tail: 8 }, kept: new TextEncoder().encode(retained.text).length,
    omitted: retained.omittedBytes,
  }, () => retained.truncated ? 'Narrow the command output or read a saved file.' : '')
  return { stdout: retained.text, truncated: retained.truncated, omittedBytes: retained.omittedBytes, omissionFooter }
}

export function boundedMatches(matches: Iterable<string>): RetainedItems<string> {
  const retainer = new ItemRetainer<string>({ kind: 'head', maxItems: 2 })
  for (const match of matches) retainer.push(match)
  return retainer.finish()
}
```

`smoke.mjs`：

```js
import assert from 'node:assert/strict'
import { boundedProcessOutput, boundedMatches } from './lib/index.js'

const output = boundedProcessOutput(['abc😀def', 'ghijklmnop'])
assert.equal(output.stdout, 'abc😀dijklmnop')
assert.deepEqual(output.omittedBytes, { kind: 'exact', count: 4 })
assert.equal(output.truncated, true)
assert.equal(output.omissionFooter, 'Omitted 4 bytes. Narrow the command output or read a saved file.')
assert.deepEqual(boundedMatches(['one', 'two', 'three']), {
  items: ['one', 'two'], truncated: true, seen: 3, kept: 2,
  omitted: { kind: 'exact', count: 1 },
})
console.log('bounded bytes/items and exact omission footer')
```

在新目录运行：

```sh
npm install --ignore-scripts --no-audit --no-fund
npm run build
npm run smoke
npm pack --dry-run --json
```

隔离 smoke 验证多字节截断、精确 omittedBytes、条目数量与 footer；未验证实际命令执行、文件流中途取消和 Session 写入。具体执行记录见创建工作区 `evidence/runtime/output-retention-review.md`。
