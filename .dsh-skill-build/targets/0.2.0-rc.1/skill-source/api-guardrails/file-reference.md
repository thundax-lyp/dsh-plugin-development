# 文件引用候选与本地 Provider

## 入口与任务

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-file-reference` 默认抽象 `FileReferenceService` 提供 `ctx.fileReferences.list(agent,query,signal)`；Host 插件可以消费候选，也可以实现新的 service Provider。`@deepseek-ai/dsh-file-reference-local` 是具体本地 provider，以 Agent Session cwd 为搜索根并缓存索引；完整消费例见[补全文件引用](how-to-complete-file-reference.md)。

## 对象与语义

| 对象                                 | 成员与边界                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `FileReferenceService`               | 抽象 `list(agent,query,signal):Promise<FileReferenceCandidate[]>`；只发现路径候选，不读取文件内容。                                   |
| `FileReferenceCandidate`             | `path` 是可放入普通 prompt/文件工具的路径，`kind:'file'                                                                               | 'directory'` 决定补全是否继续。 |
| `LocalFileReferenceService`          | `Config.maxResults/maxEntries/excludedDirectories` 控制索引；每 Agent cwd 建搜索器，文件工具结果使缓存失效，Agent/provider 卸载清理。 |
| `activeAtToken`、`formatFileMention` | 解析/序列化输入中的 `@` 文件 token；路径含空格时格式化为 `@"..."`。                                                                   |

## 权限、恢复与模型事实

UI 候选列表不等于读取授权，也不代表模型已经看过内容。Local Provider 的 prompt section 只在 Agent 有 `read` 工具时提醒模型 `@` 是用户指定路径，读取前不得宣称已检查。第三方 Host Remote 必须校验目标 Agent/Session 的访问权并绑定取消；自定义 Provider 不应把 Host 任意路径暴露给无权限用户。候选是即时搜索结果，不持久化；用户接受的引用文本及后续工具读取才可能进入 Session 日志。不要从候选推断文件内容或恢复时仍存在。

## 验证

目标源码 `packages/context/file-reference/src/index.ts`、`src/grammar.ts`、`packages/context/file-reference-local/src/index.ts`、`src/search.ts`。独立消费至少检查精确声明编译、Agent 身份、cwd 范围、目录/文件候选、取消及缓存失效；只调用 grammar helper 不证明 Agent Profile 行为。
