# @deepseek-ai/dsh-typert-generator ./tsdown

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-typert-generator` 让维护者把公开的 TypeScript 类型转换为构建产物和与编译器无关的模型。包通过 `./typert` 和可选的 `./client/typert` 导出选择加入；如果声明、发布清单、Remote 导出或 Zod 投影无法被正确表示，生成过程就会失败。仓库构建会生成可执行 schema factory 与配套声明，工具也可以调用 `WorkspaceAnalyzer` 完成检查或目录生成而不发布产物。生成过程只在构建时运行，绝不会进入实时 agent（智能体）会话。

- [公开对象组 1](api-core-dsh-typert-generator-tsdown-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-remote.md#发布带取消与失败码的-remote) 给出装载和验证顺序。
