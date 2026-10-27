# @deepseek-ai/dsh-host-directory-picker-browse .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

无法触达 OS 选择器的用户仍能通过 `dsh-host-directory-picker-browse` 选择工作区目录：它基于 Node 标准库提供单层目录列举与子目录创建，宿主屏幕上不渲染任何东西——因此它能服务原生后端无法触及的远程客户端。列举只返回目录、按名称排序，跟随指向目录的符号链接，并携带宿主判定的 `hidden` 标志；创建不递归，且把名称校验为单个路径段。一行组合配置还会用应用内**选择工作区目录**对话框填满工作区流程的目录扩展位。

- [公开对象组 1](api-core-dsh-host-directory-picker-browse-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力) 给出装载和验证顺序。
