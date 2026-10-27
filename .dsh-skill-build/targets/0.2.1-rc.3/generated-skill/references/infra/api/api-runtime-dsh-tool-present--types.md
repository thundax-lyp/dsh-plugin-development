# @deepseek-ai/dsh-tool-present./types：交付物与工作区变更呈现

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在交付物与工作区变更呈现任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-deliverables.md)。

## PresentedFile 契约

从 `@deepseek-ai/dsh-tool-present/types` 导入 `PresentedFile`。`PresentedFile` 是交付物与工作区变更呈现的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface PresentedFile {
    path: string;
    description?: string;
}
```

成员检索：`description`、`path`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[交付物与工作区变更呈现](api-runtime-deliverables-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-deliverables.md)核对成功、拒绝与卸载结果。
