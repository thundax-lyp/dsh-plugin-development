# @deepseek-ai/dsh-skill-office 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

目录列出 Office 路由及六个创作或操作技能，完整说明按需加载。创作技能使用选定的 Python 库；操作技能提供配置的 Node 与 LibreOffice Kit CLI 路径。SDK 和 Desktop 分别挂载技能提供者和依赖查询。

### 使用本包

在技能注册表和 `dsh-tool-skill` 旁挂载技能提供者。提供者负责技能说明；操作技能在加载时附加解释器和 CLI 的绝对路径。

```yaml
- name: '@deepseek-ai/dsh-skill-office'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `assetRoot` | 载体资源或包内 `assets/` | 包含七个技能目录的绝对路径。 |
| `node` | 宿主 Node.js | 操作技能使用的独立 Node 可执行程序；打包载体显式提供。 |
| `cli` | 已安装 Kit CLI | CLI 入口的绝对路径；`false` 禁用操作执行。 |

无效技能资源会阻止注册。创作说明不解析渲染器路径；操作说明加载时校验现有解释器和 CLI 文件，不准备引擎。Bash 或 PowerShell 负责审批、沙箱、取消和输出管理。资源与执行工具必须位于同一主机。

#### 渐进加载

模型依据任务选择技能；宿主不会根据文件扩展名注入完整说明。七个技能均列入目录，可通过 `skill` 按名称加载或由用户显式调用。用户要求的外观修改，包括电子表格单元格填充和文本对齐，即使没有明确要求视觉检查，也需要渲染；用户明确要求跳过渲染时以该要求为准。纯操作任务可以直接进入对应技能。

新建文件以及内容、数据或公式修改，不会仅因附带基础格式调整而需要渲染。预览图片保存在工作区内随机命名的私有临时目录中，并在检查后删除；回复以文字说明检查结果，不链接这些图片。PDF 导出校验命令结果和 `%PDF-` 签名，不另外查找 PDF 阅读工具。操作结束后，已加载的说明仍属于会话历史。图中描述各端常规预设，不改变 minimal 或 sdk-minimal 的纯 shell 定义。

-----

### 已知限制与后续工作

- 提供者不安装创作库。
- LibreOffice 输出可能不同于原生 Office 应用。
- 旧格式、加密和启用宏的文件需要适用的独立工作流。

## Config（.）

公开导入：`@deepseek-ai/dsh-skill-office`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    assetRoot?: string;
    node?: string;
    cli?: string | false;
}

export declare const Config: z<Config>;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-office.md)。

## apply（.）

公开导入：`@deepseek-ai/dsh-skill-office`；公开符号：`apply`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function apply(ctx: Context, config?: Config): void;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-office.md)。

## inject（.）

公开导入：`@deepseek-ai/dsh-skill-office`；公开符号：`inject`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const inject: string[];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-office.md)。

## name（.）

公开导入：`@deepseek-ai/dsh-skill-office`；公开符号：`name`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const name = "skill-office";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-skill-office.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
