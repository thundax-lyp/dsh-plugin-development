# @deepseek-ai/dsh-experimental-computer-use-cua-driver-native 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

使用 Cua Driver 检查和操作桌面窗口，无需安装其独立 CLI 或应用。原生 npm 依赖在 DSH 主机进程内运行，提供 Cua Driver 自己的工具。截图通过持久化附件传给支持图像的模型。此实验性软件包会发布到 npm，需要启动主机的桌面权限，并且必须在组合配置中显式启用。

### 使用本包

在已经提供工具注册表和系统提示词的组合中挂载此提供者。

#### 最小配置

```yaml
- name: '@deepseek-ai/dsh-computer-use'
- name: '@deepseek-ai/dsh-experimental-computer-use-cua-driver-native'
```

此提供者没有配置字段。它加载 package.json 声明的确切 Cua Driver npm 版本，并采用其进程内默认配置。原生模块导入、运行时初始化、目录格式、工具重名或电脑操作注册冲突会使激活失败，并回滚所拥有的资源。注册的提供者名称为 `cua-driver-native`。

挂载附件存储并使用明确声明支持图像输入的模型路由，才能接收截图。MCP 结果适配器 负责图像接纳和诊断行为；模型无法接收图像时，程序调用方仍保留规范原始结果。调用采用 Cua Driver 上游的工具参数和结果。

#### 主机要求

原生依赖通过 npm 可选依赖提供各平台二进制文件，因此必须保留可选依赖安装。请向启动 DSH 的应用授予桌面权限；此提供者既不安装独立持有权限的应用，也不更改操作系统授权。原生运行时与主机共享进程，因此原生崩溃可能终止该进程。如果需要由独立的 Cua Driver 应用持有权限并执行操作，请使用已安装的 MCP 提供者。

#### 验证已安装的 SDK

在仓库根目录运行这项显式启用的检查，验证已安装的原生依赖。它发现工具、通过 `prompt: false` 读取权限状态，并验证卸载；它不截图、不发送输入，也不请求操作系统权限。清除 `NODE_USE_ENV_PROXY` 可防止 Node 在测试初始化之前采用启动 shell 的代理设置。

-----

### 已知限制与延后工作

此软件包保留上游驱动的平台和应用限制。

- **主机权限与图形会话**——npm 安装不会授予桌面访问权限或创建图形会话。
- **原生光标覆盖层**——无界面的 macOS Node 主机可能对覆盖层操作返回 `facility_unavailable`，同时截图和后台输入仍可用。
- **共享桌面**——此提供者不为某个 Session 预留窗口或完整工作流。其他调用方和应用可以在两次调用之间更改同一桌面。
- **取消**——被取消的调用可能已经传入输入；重试前必须检查新状态。卸载时提供者等待 SDK 关闭，但不承诺回滚原生操作。
- **关闭失败**——如果原生关闭失败，注册名额保持占用。挂载其他电脑操作提供者之前必须重启主机。
- **实验性发布**——工具 schema 跟随锁定的上游 SDK，不作 DSH 稳定性承诺。

## Config（.）

公开导入：`@deepseek-ai/dsh-experimental-computer-use-cua-driver-native`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const Config: Schema<Schemastery.ObjectS<{}>, Schemastery.ObjectT<{}>, "plain">;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-native.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-experimental-computer-use-cua-driver-native`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context): Promise<void>;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-native.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-experimental-computer-use-cua-driver-native`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-native.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-experimental-computer-use-cua-driver-native`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "experimental-computer-use-cua-driver-native";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-computer-use-cua-driver-native.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
