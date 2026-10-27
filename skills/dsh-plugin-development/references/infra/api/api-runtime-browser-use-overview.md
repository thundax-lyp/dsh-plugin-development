# 浏览器自动化能力注册

## 对象关系

BrowserUseRegistry 是独占名称注册表，仅保存一个 providerName。register(name) 返回异步 effect disposer；即使重复同一个名称，第二次注册也失败。provider 必须先停止自己的工具并等待工作清理，最后 await disposer 释放槽。注册表本身没有页面操作、截图或键鼠方法，实际功能由具体 provider 的工具提供；不能从 providerName 存在推断驱动已经可用。

## 选型与使用

清理期间仍保留 providerName，以阻止另一个 provider 抢占未释放资源。OS/浏览器权限与具体驱动错误由 provider 处理；名称注册不是用户授权。

- [@deepseek-ai/dsh-browser-use.](api-runtime-dsh-browser-use.md)：模块和公开对象。
- [@deepseek-ai/dsh-browser-use./brand](api-runtime-dsh-browser-use--brand.md)：子路径对象。

[操作步骤](../how-to/how-to-runtime-browser-use.md)说明配置、调用和清理顺序。
