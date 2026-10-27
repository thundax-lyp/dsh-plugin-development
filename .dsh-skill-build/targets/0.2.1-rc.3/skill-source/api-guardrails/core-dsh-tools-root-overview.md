# @deepseek-ai/dsh-tools .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

使用 `dsh-tools` 可向模型公开类型化能力、校验调用、执行允许／拒绝／询问策略，并在普通工具失败时返回最终结果而不中止当前轮次。通过 `mode` 选择原生 Function Calling（函数调用）或 PTC mode；单个 agent（智能体）可用 `presentAs` 覆盖默认值。工具作者使用 `defineTool` 声明类型化参数与输出、协作式超时、并行安全属性和可选 UI 展示。模型会看到每个获准工具声明的名称、描述与参数 schema；按 agent 设置的限制可缩小该可见集合。

- [公开对象组 1](api-core-dsh-tools-root-1.md)。
- [公开对象组 2](api-core-dsh-tools-root-2.md)。
- [公开对象组 3](api-core-dsh-tools-root-3.md)。
- [公开对象组 4](api-core-dsh-tools-root-4.md)。
- [公开对象组 5](api-core-dsh-tools-root-5.md)。
- [公开对象组 6](api-core-dsh-tools-root-6.md)。
- [公开对象组 7](api-core-dsh-tools-root-7.md)。
- [公开对象组 8](api-core-dsh-tools-root-8.md)。
- [公开对象组 9](api-core-dsh-tools-root-9.md)。
- [公开对象组 10](api-core-dsh-tools-root-10.md)。
- [公开对象组 11](api-core-dsh-tools-root-11.md)。
- [公开对象组 12](api-core-dsh-tools-root-12.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-tool.md#注册并执行一个模型工具) 给出装载和验证顺序。
