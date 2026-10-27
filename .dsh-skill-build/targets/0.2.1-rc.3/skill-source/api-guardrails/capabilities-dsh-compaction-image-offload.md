# @deepseek-ai/dsh-compaction-image-offload 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

当较早的图片超出模型路由的预算时，图片密集的会话仍可继续。本插件永久将这些图片替换为注明附件及其可用只读路径的文本，然后重试，不消耗提供方重试预算。后续请求在切换路由、恢复和回放时都保留这一选择。token 计量随日志记录的选择更新，提供方缓存只能复用到第一条被修改的消息之前。

### 使用本包

凡是运行 agent loop（智能体循环）并带有支持图片的路由的组合，都应挂载本插件，随附的 `dsh` 基础配置已经挂载。没有它，`IMAGE_OFFLOAD_REQUIRED` 失败会进入普通恢复并以错误结束该轮次。本插件没有配置：DeepSeek 适配器执行其 file 模式和内联回退预算，pi-ai 适配器执行其 base64 上限，各自上报需要省略的数量。

#### 最小可用组合

```yaml
- name: '@deepseek-ai/dsh-compaction-image-offload'
```

#### 你可以观察到什么

每次决定追加一条 `image/offload` 事件，通过当前消息事件的序号和消息内深度优先的图片序号指定省略位置。消息事件和表层节点标识保持不变。agent 重试前会追加新的 `request/header`，标明新的消息序列。摘要重试保留在同一对压缩标记内。

#### 失败与恢复

本插件只处理带 `offloadImages` 的 `IMAGE_OFFLOAD_REQUIRED` 失败。它按模型请求顺序遍历表层，跳过 assistant 节点和已经标记的图片，给指定数量的出现位置打标记。没有可省略的图片时在 `agent/request-error` waterfall 上委派下游，由下游恢复或普通的轮次错误处理。这次重试不占提供方重试预算，也不追加 `llm/retry` 事件。记录选择前发生取消时会委派后续处理，不新增 `image/offload` 事件；选择提交后发生取消时停止重试，但保留省略记录。

-----

### 已知限制与延期工作

- **被省略的图片不会自动回归**——更大的预算、更大的路由或 compaction 降低总量都不会移除标记；恢复手段是占位文本中的只读路径。
- **每次省略都要先失败一次**——发送前没有任何规划，路由的拒绝就是信号，这和计划中改由 provider 报告无法缓存图片的方向一致。
- **临时的小预算会永久省略**——迫使内联回退的 Files 故障，或临时切到小预算路由，会省略后来的路由本可以发送的图片。

## apply（.）

公开导入：`@deepseek-ai/dsh-compaction-image-offload`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-image-offload.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-compaction-image-offload`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-image-offload.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-compaction-image-offload`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "compaction-image-offload";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-image-offload.md)。

## ImageOffloadTarget（./projection）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ImageOffloadTarget {
    seq: SessionSeq;
    imageIndexes: number[];
}
```

公开导入：`@deepseek-ai/dsh-compaction-image-offload/projection`；公开符号：`ImageOffloadTarget`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`imageIndexes`、`seq`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-image-offload.md)。

## imageOffloadProjection（./projection）

公开导入：`@deepseek-ai/dsh-compaction-image-offload/projection`；公开符号：`imageOffloadProjection`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const imageOffloadProjection: SessionMessageProjection<'image/offload'>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-compaction-image-offload.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
