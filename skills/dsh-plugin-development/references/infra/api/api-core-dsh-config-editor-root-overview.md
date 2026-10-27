# @deepseek-ai/dsh-config-editor .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

将插件配置保存到当前 profile 的 patch 并立即应用。写入在改动磁盘前验证完整候选值，并与 profile 更改及 HMR 串行执行。无效值和更高层覆盖不会改动文件。

- [公开对象组 1](api-core-dsh-config-editor-root-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段) 给出装载和验证顺序。
