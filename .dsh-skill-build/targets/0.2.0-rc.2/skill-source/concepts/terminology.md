# Terminology

- **Plugin**：由 Cordis Loader 挂载并由其 effect scope 管理生命周期的代码单元。
- **Package**：发布边界；可同时包含 Host root export 与浏览器 `./client` export。
- **Bundle**：有序应用 Cordis patch 的分发层，不等于正在运行的 Profile。
- **Profile**：启动时叠加 bundles、profile patch、home patch 与命令行 overlay 的命名组合。
- **Service seam**：公开定义、provider 与 consumer 共同形成的可替换能力；具体 provider 不是新的服务契约。
- **Remote**：由 Typert 生成并装配的 Host/Client 调用面，不是手写 wire envelope。
- **Durable fact**：能够从 Session 日志重建的事实；通知、Client store 与 cache 不属于此类。
