# 注册运行时检查与 Session Telemetry 脱敏

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。此 Host 插件要求部署有 Session Telemetry service，拒绝自己的配置中未经允许的 `full` sharing，并把每条导出记录的 body 改为元数据标记。公开契约见 [运行时诊断与 Telemetry](api-runtime-diagnostics-telemetry.md)。示例故意保留 `sourceEvent`、session id 与部分属性以便事件关联；部署如不能导出这些标识，需再收紧政策。

`package.json`：

```json
{
  "name": "example-telemetry-policy",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-invariants": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session-telemetry": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-invariants": "0.2.0-rc.1",
    "@deepseek-ai/dsh-session-telemetry": "0.2.0-rc.1",
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
    - id: example-telemetry-policy
      name: example-telemetry-policy
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-invariants'
import type {} from '@deepseek-ai/dsh-session-telemetry'

export const name = 'example-telemetry-policy'
export const inject = ['invariants', 'sessionTelemetry']

export function apply(ctx: Context): void {
  const stopInvariant = ctx.invariants.register('@example/telemetry-policy', (child, fail) => {
    if (child.sessionTelemetry.sharing === 'full') {
      fail('full Session sharing is outside this package policy')
    }
  })
  ctx.effect(() => stopInvariant, 'example-telemetry-policy.invariant')

  ctx.on('session-telemetry/record', (record, next) => {
    const accepted = next()
    const attributes = { ...accepted.attributes }
    delete attributes['session.cwd']
    delete attributes['session.parent_id']
    return { ...accepted, attributes, body: { redacted: true } }
  })
}
```

Profile 先装载 `invariants`、选择的 `sessionTelemetry` backend，再装载本插件。`invariants.register` 返回的精确 disposer 经本插件 effect 绑定到自身卸载；registry 自己拥有 child fiber，`ctx.on` 也随插件 fiber 撤销。waterfall 返回新 record，不修改规范 Session 事件；不调用 `next()` 会替换更深层规则，此例调用以保留组合。务必按真实外部数据政策决定是否还需删除 `sourceEvent`、session id、时间和 event type；匿名化 body 不是自动取得用户授权。Telemetry 后端 `emit` 必须非阻塞，关闭时 drain；直接向已发布 OTel Session backend 调 `emit` 不会触发上传，其授权入口仍是明确反馈事件。

隔离消费包 `evidence/tests/runtime-telemetry-consumer/` 在发布 rc.1 声明上编译，使用 on-demand coordinator 与真实 Session 验证规范日志保持原样、导出副本被改写、卸载后规则消失；不连接外部 collector。结果见 `evidence/runtime/runtime-telemetry-review.md`。
