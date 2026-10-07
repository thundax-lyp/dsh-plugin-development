# fiber 所有权下的定时任务

## 适用范围与入口

目标版本 `dsh-v0.2.0-rc.1` 的 Host 插件可从 `@deepseek-ai/cordis-plugin-timer` 导入 `TimerService`。该包在 Cordis `Context` 上增量提供 `timer` 服务和 `timeout`、`interval`、`throttle`、`debounce` 方法。内置 `dsh-base` 与 `sdk-minimal` patch 都挂载 timer；自定义 Profile 仍须查看最终组合，并在插件声明 `inject = ['timer']`。基础 fiber 规则见 [Cordis 插件契约](api-cordis-core.md)，Profile 装载见 [Bundle 与 Profile](api-profile-bundle.md)。

根入口还将同一 `TimerService` 类作为 default 导出；两种导入名称拥有同一方法和生命周期契约。

## 契约与运行语义

`TimerService` 构造时 `super(ctx, 'timer')`，随后将方法混入 `ctx`。定时器由调用方法时的插件 fiber 拥有，不由 timer 服务单独延长生命周期。调用方可以提前撤销句柄；卸载 fiber 时未撤销的计时器自动清除。

独立 Host 插件的最小入口如下，使用 base 已挂载的 timer 服务。两次调度都会随本插件卸载清除；这里没有跨重启状态，不能用计时器回调承担必须持久化的事实。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/cordis-plugin-timer'

export const name = 'example-timer'
export const inject = ['timer']

export function apply(ctx: Context): void {
  const stop = ctx.interval(() => {
    ctx.logger('example-timer').info('heartbeat')
  }, 1000)

  ctx.timeout(() => {
    stop()
  }, 5000)
}
```

将上述代码保存为 `src/index.ts`，其余文件如下。包须发布构建输出及 patch；DSH 与 Cordis 包在目标 Profile 中共用实例，所以将 Cordis 与 timer 放入 peer，并在开发环境安装相同版本的声明依赖。

`package.json`：

```json
{
  "name": "dsh-example-timer-bundle",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/cordis-plugin-timer": "1.1.6"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/cordis-plugin-timer": "1.1.6",
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
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-timer
      name: dsh-example-timer-bundle
```

在包目录运行 `npm install --ignore-scripts --no-audit --no-fund`、`npm run build`，再检查 `npm pack --dry-run --json` 包含两个 `lib` 文件和 patch。使用目标版本的 CLI 在包的父目录执行 `dsh plugin --profile demo add ./dsh-example-timer-bundle`，先用 `dsh --profile demo --dump-config` 确认 timer 服务行和 `example-timer` 行，再真实启动；若安装的是其他 Profile，先确认它已挂载 timer 或在其 bundle 层补入 timer。观察 1 秒左右开始的 `heartbeat` 日志，约 5 秒后停止；移除包并重启后应再无该日志。配置 dump 不证明回调曾执行，日志是否可见还取决于 Profile 的日志 exporter 与级别。

## 对象类型与成员

| `TimerService`/`Context` 成员            | 签名                                                               | 取消、失败与适用性                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `timeout(callback, delay)`               | `(callback: () => void, delay: number) => () => void`              | 一次触发；返回的 disposer 可提前取消。callback 抛错不经 Promise 返回给调用处。                |
| `timeout(delay)`                         | `(delay: number) => Promise<void>`                                 | 到时 resolve；所属 Context 卸载前尚未到时则以 `Context has been disposed` 拒绝。              |
| `interval(callback, delay)`              | `(callback: () => void, delay: number) => () => void`              | 周期触发；返回的 disposer 清除定时器。                                                        |
| `interval(delay)`                        | `<R = any>(delay: number) => AsyncIterableIterator<void, R, void>` | 每次 tick 产出 `void`；`return()`/`throw()` 或 fiber 卸载结束迭代。卸载时未结束的等待会拒绝。 |
| `throttle(callback, delay, noTrailing?)` | `WithDispose<F>`                                                   | 返回保留原函数调用形状且有 `.dispose()` 的包装器；`noTrailing` 抑制尾随调度。                 |
| `debounce(callback, delay)`              | `WithDispose<F>`                                                   | 返回有 `.dispose()` 的包装器，每次调用重设延迟。                                              |

源码仍导出 `setTimeout` 与 `setInterval`，但两者在方法声明上标记 `@deprecated`，新插件使用表中的 `timeout`、`interval`。`_schedule` 是私有实现，不作为插件 API。上表的延迟参数类型是 `number`；目标实现没有额外的正数校验承诺，调用者须自行给出合理值。

## 生命周期与验证

定时器登记在调用方 fiber 的 effect 列表中。一次性 callback 执行前会先撤销该 effect；周期性 callback 持续到 disposer 或 fiber 卸载。Promise overload 通过 effect 的 disposer 在卸载时 reject，故应处理拒绝；async iterator 在主动 `return()` 后关闭定时器。源码证据在 `vendor/timer/src/index.ts`，内置装载行在 `packages/bundle/base/cordis.patch.yml` 和 `packages/bundle/sdk-minimal/cordis.patch.yml`。隔离消费项目已完成声明编译、打包检查、Profile add/dump、实际启动中 fiber `ACTIVE` 观察，以及移除后重启时 fiber 缺失的观察。此次 Profile 没有输出 `heartbeat` 日志，实际 tick 次数和卸载后定时器不再触发尚未得到行为证明。
