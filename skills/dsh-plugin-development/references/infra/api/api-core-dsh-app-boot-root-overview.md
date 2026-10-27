# @deepseek-ai/dsh-app-boot .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-app-boot` 是 `dsh` profile（包括 Python 运行时 wheel 包所含的 CLI（命令行界面））背后的共享 Loader 启动库。它加载环境层、组合 profile 组合包与 patch、启动每个插件，再返回运行中的应用，或指出失败插件与原因。产品应用使用 `dsh` launcher 而不发布单独 bin；直接配置 helper 只保留给低层嵌入方与测试。你还可以在启动前预览生效配置，按 profile 选择实时或仅启动时应用 patch，并让持有终端的应用在致命退出前恢复终端。



- [公开对象组 3](api-core-dsh-app-boot-root-3.md)。
- [公开对象组 4](api-core-dsh-app-boot-root-4.md)。

- [公开对象组 6](api-core-dsh-app-boot-root-6.md)。
- [公开对象组 7](api-core-dsh-app-boot-root-7.md)。
- [公开对象组 8](api-core-dsh-app-boot-root-8.md)。
- [公开对象组 9](api-core-dsh-app-boot-root-9.md)。
- [公开对象组 10](api-core-dsh-app-boot-root-10.md)。
- [公开对象组 11](api-core-dsh-app-boot-root-11.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service) 给出装载和验证顺序。
