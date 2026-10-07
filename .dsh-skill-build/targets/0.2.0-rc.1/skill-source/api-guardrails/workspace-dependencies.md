# 工作区依赖运行时载荷

## 入口与任务

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-tool-workspace-dependencies` 把部署提供的 `runtime.json` 与 `dependencies/` 载荷作为模型工具 `load_workspace_dependencies` 暴露；Host 插件也可用 `resolvePrimaryRuntime(source)` 在原位验证并读取绝对路径，或用 `installPrimaryRuntime(source,root)` 在 Harness home 下安装副本。完整 Host 消费见[读取工作区依赖载荷](how-to-resolve-workspace-dependencies.md)。该包不下载或构建 Python/Node 载荷。

## 对象与边界

| 对象                                                                    | 成员与契约                                                                                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `PrimaryRuntimeManifest` / `parsePrimaryRuntime` / `readPrimaryRuntime` | 验证桌面版本、平台、架构、Python/Node/pnpm 版本、可选 payload digest 和锁定的 Python distribution map；旧 components 结构仅在读取时归一化。 |
| `WorkspaceDependencies` / `workspaceDependencyPaths`                    | 返回 Python、可选 Node/pnpm 的绝对入口，以及 site-packages/node_modules 路径与锁定发行版版本。                                              |
| `resolvePrimaryRuntime(source)`                                         | 校验来源目录的 manifest、当前平台/架构及入口文件，在原位返回路径。                                                                          |
| `installPrimaryRuntime(source,root)`                                    | 将来源载荷以 staging/rename 放入指定绝对安装根，处理上次遗留副本，再返回路径。调用方拥有私有安装根。                                        |
| `Config.source/root`、`apply`                                           | `source` 必填绝对路径，`root` 可选绝对路径；注册模型工具，首次调用才解析/安装，失败可重试。                                                 |

## 所有权与安全

部署方负责载荷来源、版本、平台与私有目录权限；工具只验证元数据和文件存在，不证明第三方包可信。不能把模型输入直接作为 `source/root`，也不能把返回路径误当已启动环境或自动改变 PATH。`root` 省略时只读原位载荷；设定时可能复制大量文件，Profile 卸载仅等待进行中的准备结束，不自动删除已安装载荷。工具输出是一次路径查询，不构成 Session 的永久环境快照；需要恢复时记录实际命令与环境。

## 验证

目标源码 `packages/skill/tool-workspace-dependencies/src/index.ts`；精确版本独立消费可编译 helper，并用隔离临时目录构造最小 manifest/入口验证原位解析。真实打包 payload、Python/Node 执行和跨平台安装须分别观察，不能用只解析 manifest 的测试替代。
