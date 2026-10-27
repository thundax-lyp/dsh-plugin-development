# @deepseek-ai/dsh-settings ./types

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

编辑插件通过 `.volatile()` 声明的字段，并查看其实际值。表单以 profile 条目 id 标识插件、保留秘密值，并拒绝过期写入。更改通过当前 profile 的 Cordis patch 持久化。

- [公开对象组 1](api-core-dsh-settings-types-1.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-state.md#修改配置表单并保护脱敏字段) 给出装载和验证顺序。
