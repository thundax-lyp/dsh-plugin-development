# @deepseek-ai/dsh-experimental-auto-review 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

为 Web profile 当前会话权限选择器添加 Auto review。每次原生或 PTC inner 工具调用前，当前 agent 的 provider 与模型会评估待执行动作；获准调用以 Full access 执行，被拒绝调用会请求用户审批。dsh 安装随附此层但默认关闭；在 Web 侧栏插件页开启或显式安装之前，默认 Web 保持三种权限模式。Auto review 是实验功能：它可能误放行不安全动作、误拒绝有用操作，并消耗额外 token。

### 使用本包

评审环境记录待执行操作对应的 Session 当前工作目录。

#### 安装到 profile

从源码 checkout 通过既有 CLI 将包安装到 Web profile：

```sh
pnpm dsh plugin --profile web add ./packages/experimental/auto-review
```

CLI 会在需要时初始化 profile，并将本包声明的 patch 追加到 base 与 Web 层之后。Reconciliation 将 patch 激活为 profile 层；没有 `dsh.bundle.patch` 的包只是已安装依赖。在 composer 菜单或 `/permission` 选择器中选择带 `EXP` 标记的「自动审查」，并确认当前会话风险对话框。显式 `/permission auto` 命令直接切换。通用设置与未来会话默认值不提供 Auto。

通过同一 CLI 移除此层：

```sh
pnpm dsh plugin --profile web remove @deepseek-ai/dsh-experimental-auto-review
```

#### 获得的能力

Auto 在每个受支持调用的 body 执行前审查一次，包括每个已开始的 PTC `tools.*` inner call。它按实际效果分类：普通项目内操作和精确清理本 Session 创建的对象属于 low，直接允许；不可逆删除既有对象、生产操作、外部写入和安全控制变更属于 medium，需要当前 human 或直接父级明确授权动作、目标与范围。跨信任边界泄露敏感信息属于 high，始终拒绝。效果不明确和授权冲突未解决时拒绝。选择 Auto 会设置 `ask` 审批策略，因此被拒绝调用会请求用户审批，获批后才执行；审批被拒绝或取消时 body 不执行。进程内委派 child 固定 `never` 策略，其拒绝是最终结果。Reviewer 响应不合法和技术失败会以具体错误使调用失败，且从不执行。

最终拒绝使用普通工具卡片。折叠行标识 Auto review；展开输出说明 body 未执行，并显示可选理由。Web 权限包拥有选择器交互，工具 UI拥有理由展示。

-----

### 已知限制与延期工作

- Auto 需要开启此 Web 层；默认 Web、Headless、通用设置与新会话默认值都不包含它。
- Auto 不提供文件沙箱。外层 `run_code` transport 及PTC 程序内直接 Node 效果不经过 inner-tool review。
- 模型分类可能出错。不提供确定性工具豁免、持久 grant、可配置策略或重试层。
- 进程内 Auto child 独立审查自身调用。进程外 child 在父委派调用获准后保留原生权限系统。
- reviewer 在带行级豁免的情况下，通过已废弃的同步 `snapshotEvents()` 读取 Session 动作历史。此前的调用、PTC start 与直接父级的初始 prompt 目前都没有投影或分页读取方，因此迁移按同步读取决策继续延期。

## apply（.）

公开导入：`@deepseek-ai/dsh-experimental-auto-review`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-auto-review.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-experimental-auto-review`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-auto-review.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-experimental-auto-review`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "experimental-auto-review";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-auto-review.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
