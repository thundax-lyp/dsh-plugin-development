# 读取工作区依赖载荷

相关公开契约：[API 参考](api-workspace-dependencies.md)。

## 任务

Host 插件从可信部署配置给出的绝对 `source` 目录读取 bundled runtime 路径。安装 `@deepseek-ai/dsh-tool-workspace-dependencies@0.2.0-rc.1`；`source` 须含相应平台/架构的 `runtime.json` 和 `dependencies/`。此示例只读原位载荷，不创建永久安装副本。

```ts
import { resolvePrimaryRuntime, type WorkspaceDependencies } from '@deepseek-ai/dsh-tool-workspace-dependencies'
import { isAbsolute } from 'node:path'

export async function loadBundledRuntime(source: string): Promise<WorkspaceDependencies> {
  if (!isAbsolute(source)) throw new Error('Expected a trusted absolute source path')
  return resolvePrimaryRuntime(source)
}
```

调用方从 Host 配置传入路径，不把用户或模型字符串直接传入。函数没有持有资源；若改用 `installPrimaryRuntime`，应由部署方拥有安装根与更新/清理策略。模型侧需要此信息时，Profile 装载该包的 `apply` 插件和 `tools` service，使用 `load_workspace_dependencies` 规范工具结果。

## 验证

精确声明编译，在隔离目录放置对应平台的有效 `runtime.json` 与所需入口文件并运行一次；再用错误平台、缺少入口和取消/失败路径验证。单独编译不证明实际载荷运行。
