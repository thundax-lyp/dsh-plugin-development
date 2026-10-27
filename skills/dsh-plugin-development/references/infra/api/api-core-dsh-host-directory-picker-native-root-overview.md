# @deepseek-ai/dsh-host-directory-picker-native .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

坐在宿主屏幕前的操作者通过原生 OS 选择器选择工作区目录：`dsh-host-directory-picker-native` 每次选择打开一个平台目录选择器，并解析出所选绝对路径（取消时为 `null`）。macOS 驱动带标准「编辑」菜单的脚本化 AppKit 面板，Linux 使用 Zenity 并以 KDialog 回退，Windows 在 spawn 的子进程中打开现代 `IFileOpenDialog`。只有操作者坐在宿主屏幕前时才可用——远程部署应组合浏览后端。一行组合配置还会在工作区流程中注册匹配的浏览器侧交互，因此同时选择两侧。

- [公开对象组 1](api-core-dsh-host-directory-picker-native-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力) 给出装载和验证顺序。
