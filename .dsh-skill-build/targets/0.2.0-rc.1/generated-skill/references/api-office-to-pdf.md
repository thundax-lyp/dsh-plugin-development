# Office 文件转 PDF 的 Host 服务

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-office-to-pdf` 的默认插件提供 `ctx.officeToPdf`；Host 插件可提交已授权的 Office 字节源，得到完整 PDF 字节。支持 `doc`、`docx`、`xls`、`xlsx`、`ppt`、`pptx`。它不写 Session 事件，也不为调用方授权源文件。见[转换已授权的 Office 文件](how-to-convert-office-document.md)。

## 公开对象与成员

| 对象                              | 成员与契约                                                                                                                                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OfficeToPdf` / `ctx.officeToPdf` | `convert(request, signal?)` 读取延迟源并返回完整 PDF；`render(scope,path,priority,signal)` 通过 Session 文件权限读取文件；`getGeneration(signal)` 返回当前 provider 代际；卸载时取消队列并释放 converter。 |
| `OfficeToPdfRequest`              | `extension`、`priority` 和 `source`；源含 `key`、`version`、可选 `bytes` 与 `read(signal,maxBytes)`。调用方必须先完成权限检查；`read` 只能在准入后执行，遵守容量与取消信号，返回实际版本。                 |
| `OfficeToPdfResult`               | `pdf` 为调用方持有的完整字节；`missingFonts`、`cacheKey`、`generation` 用于诊断和缓存识别。                                                                                                                |
| `OfficeSourceKey`                 | 为授权域、执行环境、规范路径编码不含歧义的键；工厂只加类型标签，不执行授权。                                                                                                                               |
| `OfficeToPdfError`                | `code` 包括大小限制、格式、输出、超时、不可用、繁忙、源变更等失败。取消按信号原因拒绝。                                                                                                                    |
| `Config`                          | 并发、队列、源/PDF 字节、OOXML 解包、时间、字体资源和缓存上限；`fontDirectories` 只接收绝对路径。                                                                                                          |

## 所有权、恢复与权限

Provider 拥有临时输入/输出目录、转换队列和 converter；调用方拥有授权检查、源版本、读取函数、取消信号与返回的 PDF。`source.key` 必须隔离不同授权域；`version` 必须与 `read` 的实际版本一致，避免跨版本缓存命中。`generation` 在 provider 更换时变化，Client 缓存不能只凭源路径复用。若需要跨 Session 恢复或模型重建转换事实，插件应按自身任务写规范 Session 事件；此服务不会自动记录该事实。

`render` 使用 `WorkspaceFileScope` 和现有文件权限服务，适合已建立相应 Profile 的远程文件预览；直接调用 `convert` 时不得跳过上游授权。后台任务可用 `background`，配置允许零后台并发，可能返回 `busy`。不要把 `missingFonts` 当作成功与否的唯一依据，成功以完整 PDF 返回为准。

## 验证边界

对照精确 tag 的 `src/index.ts`、`types.ts`、`identity.ts`、`queue.ts` 和 provider 测试。独立 npm 消费者已对本页 HOW-TO 的 TypeScript 骨架完成目标声明编译，并在 Cordis 中验证插件装载、过大输入在读取前拒绝及卸载。成功转换、取消、字体处理和真实 LibreOffice 渲染未在本次隔离消费中运行；声明编译与拒绝路径不能证明目标机器的 Office 布局或外部引擎可用。
