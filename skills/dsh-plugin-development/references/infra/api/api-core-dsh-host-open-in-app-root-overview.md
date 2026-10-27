# @deepseek-ai/dsh-host-open-in-app .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

将 `dsh-host-open-in-app` 与其浏览器配套包一起使用，让用户能在已安装的编辑器、Git GUI、终端或文件管理器中打开 workspace 目录。本包提供固定的应用目录，并只显示主机能够验证的条目；新安装的应用在重启后出现，而检测到启动器缺失时会移除对应条目。请求须通过部署的浏览器认证与主机来源信任检查。检测与启动命令使用可配置的期限，且不会把继承的凭据传给启动的应用。

- [公开对象组 1](api-core-dsh-host-open-in-app-root-1.md)。
- [公开对象组 2](api-core-dsh-host-open-in-app-root-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力) 给出装载和验证顺序。
