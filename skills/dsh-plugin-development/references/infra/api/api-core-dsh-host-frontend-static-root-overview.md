# @deepseek-ai/dsh-host-frontend-static .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

从配置的发布目录向浏览器提供已构建的 Web 壳。根路径与配置的 index 路径渲染包含启动信息的 index；已有资产直接提供，而缺失或非文件路径返回 404、路径遍历返回 403、不支持的方法返回 405。访问 index 需要有效的进程 token 或浏览器 cookie，但静态资产仍可公开访问。同一时间只能有一个实例处理未匹配的路由；第二个实例启动失败，卸载活动实例后，未匹配的请求返回 404。

- [公开对象组 1](api-core-dsh-host-frontend-static-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力) 给出装载和验证顺序。
