# 在 Profile 中组合 Computer Use Driver

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。本例让 Host 插件装载已发布的 Cua Driver MCP provider；实际桌面能力来自部署安装的 `cua-driver mcp`，注册槽只负责独占所有权。契约见 [Browser/Computer Use Provider](api-browser-computer-use.md)。

`package.json`：

```json
{
  "name": "example-computer-use-profile",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-computer-use": "0.2.0-rc.1",
    "@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-computer-use": "0.2.0-rc.1",
    "@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp": "0.2.0-rc.1",
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
    - id: example-computer-use-profile
      name: example-computer-use-profile
```

`src/index.ts`：

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-computer-use'
import * as CuaDriverMcp from '@deepseek-ai/dsh-experimental-computer-use-cua-driver-mcp'

export const name = 'example-computer-use-profile'
export const inject = ['computerUse', 'tools']

export async function apply(ctx: Context): Promise<void> {
  const child = ctx.plugin(CuaDriverMcp, CuaDriverMcp.Config({
    command: 'cua-driver',
    args: ['mcp'],
  }))
  await child.await()
}
```

Profile 先装载 `computerUse` 与 `tools`，再装载本插件；需要目标主机上已安装可运行的 `cua-driver`。provider 的 `apply` 等待连接与工具发现，失败则拒绝激活并回滚预留；子 fiber 随父插件卸载，在连接关闭后释放 slot。不要同装另一个 computer-use provider。真正桌面操作的授权、当前窗口/元素定位、取消后的新鲜状态核查由调用和 driver 路径负责，不由 `providerName` 证明。隔离消费包只编译此组合代码与验证 registry 独占；未连接 CUA Driver，见 `evidence/runtime/browser-computer-use-review.md`。
