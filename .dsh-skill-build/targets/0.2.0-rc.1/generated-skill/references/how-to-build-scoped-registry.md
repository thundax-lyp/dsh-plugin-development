# 建立带覆盖关系的 Scope 标签注册表

## 目标与所有权

目标精确 `dsh-v0.2.0-rc.1`。本例是插件作者自己的 `ScopedLabelRegistry`：全局默认值、父 scope 和子 scope 可用同名标签逐层覆盖。`ScopedLayers.effect` 同时决定可见性和 Cordis fiber 所有权；同一表重复名失败，scope 卸载释放它注册的贡献。公开 API 见[Scope 注册表](api-scope-registry.md)。注册表是当前进程内的读模型；若标签决策必须在恢复后重建，业务插件另将决定写入自己的 Session 事件。

## 独立最小包

`package.json`：

```json
{"name":"dsh-scope-registry-consumer-rc1","version":"0.1.0","private":true,"type":"module","main":"./lib/index.js","types":"./lib/index.d.ts","files":["lib"],"scripts":{"build":"tsc -p tsconfig.json","smoke":"node smoke.mjs"},"dependencies":{"@deepseek-ai/dsh-scope":"0.2.0-rc.1"},"devDependencies":{"@deepseek-ai/cordis":"4.0.4","typescript":"6.0.3"}}
```

`tsconfig.json`：

```json
{"compilerOptions":{"target":"ES2022","module":"NodeNext","moduleResolution":"NodeNext","rootDir":"src","outDir":"lib","declaration":true,"strict":true,"skipLibCheck":true},"include":["src/**/*.ts"]}
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import { NamedEntries, ScopedLayers, type ScopeKey, type ScopeLayer } from '@deepseek-ai/dsh-scope'

interface Layer extends ScopeLayer {
  values: NamedEntries<string>
}

export class ScopedLabelRegistry {
  private revision = 0
  private readonly layers = new ScopedLayers<Layer>(
    () => {
      const values = new NamedEntries<string>(name => new Error(`duplicate label: ${name}`))
      return { values, isEmpty: () => values.isEmpty() }
    },
    () => { this.revision++ },
  )

  register(ctx: Context, name: string, value: string): () => void {
    return this.layers.effect(ctx, layer => layer.values.insert(name, value), {
      label: `label ${name}`,
    })
  }

  resolve(scope: ScopeKey | undefined, name: string): string | undefined {
    return this.layers.merge(scope, layer => layer.values).get(name)
  }

  currentRevision(): number { return this.revision }
  hasOwnLayer(scope: ScopeKey): boolean { return this.layers.peek(scope) !== undefined }
}
```

`smoke.mjs`：

```js
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import { createScope } from '@deepseek-ai/dsh-scope'
import { ScopedLabelRegistry } from './lib/index.js'

const root = new Context()
const registry = new ScopedLabelRegistry()
const base = registry.register(root, 'tone', 'global')
const parentKey = {}
const parent = createScope(root, parentKey)
const parentRegistration = registry.register(parent.ctx, 'tone', 'parent')
const childKey = {}
const child = createScope(root, childKey, { parent: parentKey })
const childRegistration = registry.register(child.ctx, 'tone', 'child')
assert.equal(registry.resolve(undefined, 'tone'), 'global')
assert.equal(registry.resolve(parentKey, 'tone'), 'parent')
assert.equal(registry.resolve(childKey, 'tone'), 'child')
assert.throws(() => registry.register(child.ctx, 'tone', 'duplicate'), /duplicate label/)
assert.equal(registry.resolve(childKey, 'tone'), 'child')
const before = registry.currentRevision()
childRegistration()
childRegistration()
assert.equal(registry.resolve(childKey, 'tone'), 'parent')
assert.equal(registry.hasOwnLayer(childKey), false)
assert.equal(registry.currentRevision(), before + 1)
await child.dispose()
parentRegistration()
await parent.dispose()
assert.equal(registry.resolve(parentKey, 'tone'), 'global')
base()
assert.equal(registry.resolve(undefined, 'tone'), undefined)
console.log('global, parent, child shadows; duplicate rollback; idempotent removal')
```

运行：

```sh
npm install --ignore-scripts --no-audit --no-fund
npm run build
npm run smoke
npm pack --dry-run --json
```

`register(ctx,...)` 把同步插入和 undo 一起交给 `ctx.effect`；不把 raw `NamedEntries.insert` 的 disposer 遗失。异常时刚建的空层会回收；单项 undo 幂等；完整 `Scope.dispose()` 等待 fiber quiescence。实例中的 key 必须保持同一对象身份。该 smoke 不模拟 Session 日志、跨进程恢复或事件 carrier dispatch，验证记录见创建工作区 `evidence/runtime/scope-registry-review.md`。
