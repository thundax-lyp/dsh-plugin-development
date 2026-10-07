# 制作并装载一个模型工具插件

## 目标与前置

目标版本是 `dsh-v0.2.0-rc.1`。本任务创建独立的 TypeScript bundle，向装有 `@deepseek-ai/dsh-tools` 的 Profile 注册 `greet` 工具，使 Agent 调用后得到一份规范字符串结果，并在插件卸载时撤销注册。需要已安装的 `dsh` CLI 和可构建的 Node.js 项目。隔离消费项目中的声明编译、打包、Profile 装载、直接工具调用和移除后重启已检查；Agent 轮次和 Session 日志仍待验证。

`@deepseek-ai/dsh-tools` 的 `defineTool` 构造带类型的工具；`ctx.tools.register()` 返回撤销函数，并通过 Cordis scope 归属注册。`output.schema` 约束成功时的规范 JSON 值，`output.render` 只把该值投影为模型可见文本。对象成员与执行边界见[工具 API 契约](api-tools.md)，安装与配置层见[Bundle 与 Profile 装载边界](api-profile-bundle.md)。

插件的 `apply`、`inject`、`Context` 与 fiber 清理规则由 [Cordis 插件基础契约](api-cordis-core.md)说明。这里的 `ctx.tools.register()` 属于插件 fiber，Profile 移除后的实际撤销仍须通过重新启动并观察工具缺失来验证。

## 实现步骤

1. 在 Profile 外创建 `dsh-greet-bundle/`，准备下面四个文件。将包的 DSH peer 和开发依赖固定到目标版本，避免独立编译时解析到另一版声明。

`package.json`：

```json
{
  "name": "dsh-greet-bundle",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1",
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

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'greet-tool'
export const inject = ['tools']

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Greet a person by name.',
    parameters: {
      name: { type: 'string', required: true, description: 'Person to greet' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args, exec) {
      exec.signal.throwIfAborted()
      return `Hello, ${args.name}!`
    },
  }))
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: greet-tool
      name: dsh-greet-bundle
```

2. 在包目录安装依赖并运行 `npm run build`。检查 `lib/index.js` 和 `lib/index.d.ts` 均已生成，且 `npm pack --dry-run` 列出编译产物与 patch。对 git 安装还需要自包含的 `prepare` 构建脚本；此处按本地已构建目录安装。
3. 在安装有该目标版本 CLI 的环境中运行 `dsh plugin --profile demo add ./dsh-greet-bundle`。`dsh --profile demo --dump-config` 应显示 bundle 层和 `greet-tool` 行。再启动 `dsh --profile demo`，让 Agent 调用 `greet` 并检查规范结果和模型可见文本均为 `Hello, Ada!`。Profile 必须实际挂载 `dsh-tools`；缺失注入时插件不会激活。
4. 失败与取消：无效参数在执行前被 schema 拒绝；执行体若已收到取消信号则抛出而不产生成功值。本例没有外部资源或跨重启私有状态，工具调用事实由 Session 的 `tool/call` 与 `tool/result` 保存。卸载时运行 `dsh plugin --profile demo remove dsh-greet-bundle`，重新观察配置中不再有该 bundle 层；已注册工具的 scope disposer 随插件卸载执行。

## 验证与完成边界

在隔离消费目录运行了 `npm install --ignore-scripts --no-audit --no-fund`、`npm run build` 和构建完成后的 `npm pack --dry-run --json`；编译通过，打包清单包含 `lib/index.js`、`lib/index.d.ts`、`cordis.patch.yml` 和 `package.json`。`dsh plugin --profile demo add` 和配置 dump 成功；实际启动后，诊断插件观察到 `greet` 注册，直接调用得到 `Hello, Ada!`，无效参数和预取消调用分别得到错误结果。移除 bundle 后重启，诊断插件观察到工具缺失，调用返回未知工具错误。诊断插件没有创建 Agent 轮次，所以模型是否看到工具、Session 是否保存 `tool/call` 和 `tool/result`、进程恢复以及执行中取消仍待验证。目标 checkout 的定义、注册、CLI、Profile 与测试来源会在 `maintenance/source-map.md` 中逐项列出。
