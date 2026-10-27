# 独立 Cordis Service 与 bundle

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。这个 Host 包提供 `ctx.localGreeting`，打印一次可观察的调用，并在插件停用时撤销服务和计时器。它不调用模型或外部服务。

## 文件清单

```text
local-greeting/
  package.json
  tsconfig.json
  cordis.patch.yml
  src/index.ts
```

## package.json

```json
{
    "name": "local-greeting",
    "version": "1.0.0",
    "type": "module",
    "main": "lib/index.js",
    "types": "lib/index.d.ts",
    "exports": {
        ".": {
            "types": "./lib/index.d.ts",
            "default": "./lib/index.js"
        },
        "./package.json": "./package.json",
        "./cordis.patch.yml": "./cordis.patch.yml"
    },
    "files": ["lib", "cordis.patch.yml"],
    "scripts": {"build": "tsc -p tsconfig.json"},
    "engines": {"dsh": "0.2.1-rc.3"},
    "peerDependencies": {"@deepseek-ai/cordis": "4.0.5"},
    "devDependencies": {
        "@deepseek-ai/cordis": "4.0.5",
        "typescript": "6.0.3"
    },
    "dsh": {"bundle": {"patch": "./cordis.patch.yml"}}
}
```

## tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "strict": true,
        "declaration": true,
        "rootDir": "src",
        "outDir": "lib",
        "skipLibCheck": true
    },
    "include": ["src/**/*.ts"]
}
```

## src/index.ts

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    localGreeting: LocalGreeting
  }
}

export class LocalGreeting extends Service {
  constructor(ctx: Context) {
    super(ctx, 'localGreeting')
    ctx.effect(() => {
      const timer = setInterval(() => console.log('local-greeting: 活跃'), 10000)
      return () => {
        clearInterval(timer)
        console.log('local-greeting: 已清理')
      }
    })
  }

  greet(name: string): string {
    return `你好，${name}`
  }
}

export default LocalGreeting
```

服务构造函数调用 `super(ctx, 'localGreeting')` 后立即注册，Cordis 在拥有该实例的 fiber 卸载时撤销注册。计时器由自己的 effect 清理；不需要给 Service 再写一个全局注册表。

## cordis.patch.yml

```yaml
- insert:
    - id: local-greeting
      name: local-greeting
```

`insert` 创建新条目，`id` 必须在组合里唯一。它与模块的 `name`、Cordis 服务键 `localGreeting` 是三个不同标识。

## 构建、装载、调用与卸载

在包目录执行：

```sh
pnpm install
pnpm run build
dsh plugin --profile development add .
dsh --profile development
```

使用现有且信任的开发 Profile。安装本地目录前先构建，普通依赖不自动激活，bundle patch 才把模块加入组合；未启用 HMR 时重启。在消费插件声明 `inject = ['localGreeting']`，通过 `ctx.localGreeting.greet('DSH')` 读取结果。停用该 bundle 后观察 `local-greeting: 已清理`，依赖它的消费插件应离开 ACTIVE，服务不能继续被调用。再次启用只应存在一个计时器。

模块导入失败检查 `lib/index.js`、exports 和 profile 包解析；配置失败检查 Config schema；消费插件 PENDING 检查提供方是否启用。删除依赖之前先停止其插件；取消安装不是撤销已经应用的运行时行为，按管理结果决定重试或重启。
