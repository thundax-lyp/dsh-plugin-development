# @deepseek-ai/dsh-web-app ./startup

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

运行 `dsh --profile web`，获得浏览器内的聊天、模型与设置管理以及会话历史，并与其他 dsh 表层共用同一套模型访问、工具与安全默认值。启动时会打印带 token 的 URL，通常还会在默认浏览器中打开；SSH 会话和 `--no-open` 需要手动打开。你可以更改端口、允许额外 authority、绑定一个具体的本机 IP，并用自己提供的证书直接提供 HTTPS；通配地址会被拒绝。跨机访问使用剥离前缀代理后公告的 HTTP(S) URL、监听器 TLS，或非 loopback 绑定上的明文 HTTP。一次性的命令行任务应使用 headless 配置。

- [公开对象组 1](api-core-dsh-web-app-startup-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service) 给出装载和验证顺序。
