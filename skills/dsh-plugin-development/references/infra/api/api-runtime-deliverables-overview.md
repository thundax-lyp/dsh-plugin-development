# 交付物与工作区变更呈现

## 对象关系

交付物呈现通过工具规范结果和 Client 消费协作，不将 Host 绝对路径当浏览器可访问链接。工作区变更是观察投影，不能替代文件实际版本或事务提交。附件、文件、终端结果分别由对应服务拥有；在 Session 中记录可重建的描述及引用，由 Client 纯渲染。

## 选型与使用

呈现失败与内容生成失败分开；不要因为工具返回描述就宣称浏览器已打开文件或用户已看到渲染。

- [@deepseek-ai/dsh-tool-present.](api-runtime-dsh-tool-present.md)：模块和公开对象。
- [@deepseek-ai/dsh-tool-present./types](api-runtime-dsh-tool-present--types.md)：子路径对象。
- [@deepseek-ai/dsh-workspace-changes.](api-runtime-dsh-workspace-changes.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-deliverables.md)说明配置、调用和清理顺序。
