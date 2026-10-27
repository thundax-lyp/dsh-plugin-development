# 文件读取、原子写入与观察保护

## 对象关系

FileSystem.resolve 将路径解析为不透明 FsTarget；不要解析 targetKey。processPath 属于后端执行世界，不一定是 Host 路径。readBytes 必须给完整文件字节上限，超限拒绝而不截断；readByteRange 的 offset/length 是非负整数字节窗口。readText/streamText 为常规 UTF-8 文本；listDir 稳定排序且不读取内容。writeText 省略 expected 是无条件覆盖；createIfAbsent 拒绝已有文件，replaceIfVersion 携带旧版本拒绝缺失或变更。editText 先核对 version 再匹配文字；replaceAll=false 要求唯一匹配。watch 的 signal 只管初始化取消，调用者还必须 await close。fs/observed 是同步记录通知；write-intent/edit-intent 是单槽 waterfall，不是多个授权器叠加。观察保护由 fs-observation-policy 提供，裸 fs-local 不自动实施已读才写。

## 选型与使用

按 FsError.code 区分 FS_STALE_VERSION、FS_NOT_OBSERVED、FS_EDIT_NOT_FOUND、FS_AMBIGUOUS_EDIT、FS_ABORTED；冲突后重新读取并取得新版本，不能删掉 expected 强制重放。

- [@deepseek-ai/dsh-fs-local.](api-runtime-dsh-fs-local.md)：模块和公开对象。
- [@deepseek-ai/dsh-fs-observation-policy.](api-runtime-dsh-fs-observation-policy.md)：模块和公开对象。
- [@deepseek-ai/dsh-fs-sandbox.](api-runtime-dsh-fs-sandbox.md)：模块和公开对象。
- [@deepseek-ai/dsh-fs.](api-runtime-dsh-fs.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-fs-search.](api-runtime-dsh-tool-fs-search.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-fs.](api-runtime-dsh-tool-fs.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-str-replace-editor.](api-runtime-dsh-tool-str-replace-editor.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-fs.md)说明配置、调用和清理顺序。
