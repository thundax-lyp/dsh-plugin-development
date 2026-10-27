# 工作区归属与会话管理

## 对象关系

WorkspaceRegistry 维护规范目录与 Session 归属，路径要 realpath 后比较；工作区记录和注册顺序通过 storageDomain 保持。create/remove 会保留 pending mutation 以恢复明确操作，不能根据孤立记录猜测。archive 与 unarchive 的存在检查不同；pin 不等于移动到工作区。活动检查和耐久 archive 写入不是单个原子步骤，不能承诺瞬间阻止所有正在执行的模型步骤。

## 选型与使用

WorkspaceActiveSessionError、WorkspaceUnknownSessionError、WorkspaceArchivedSessionPinError 与目录不存在分开处理；archive 的 stop provider 失败被记录后仍可完成隐藏，不证明执行已经停止。

- [@deepseek-ai/dsh-workspace.](api-runtime-dsh-workspace.md)：模块和公开对象。
- [@deepseek-ai/dsh-workspace./types](api-runtime-dsh-workspace--types.md)：子路径对象。

[操作步骤](../how-to/how-to-runtime-workspace.md)说明配置、调用和清理顺序。
