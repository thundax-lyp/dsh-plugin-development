# @deepseek-ai/dsh-file-reference 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

宿主驱动 UI 使用 `dsh-file-reference` 提供 `@file` 补全：UI 为指定 agent（智能体）请求路径候选，模型输入 `@path` 或 `@"path with spaces"`，选中候选后，匹配的 mention 作为普通提示词文本插入。seam 本身不拥有文件系统访问——具体提供方（如 `@deepseek-ai/dsh-file-reference-local`）负责提供候选、排序、缓存与失效。选中候选绝不读取或附带文件内容；模型必须调用文件系统工具才能查看文件。Session Controller 通过 `fileReferences/list` Remote 向浏览器消费方暴露同一发现能力。

### 使用本包

当宿主驱动 UI（Web 或终端）需要提供 `@file` 补全时选择本包，并搭配一个命名空间与 agent 实际生效的 `read` 工具一致的提供方。单独挂载该 seam 而没有提供方时，UI 只能得到空的补全列表。

#### mention 语法

输入开头或空白后的 `@path` token 会触发补全；其他 token 内部的 `@`（如电子邮件地址）不会。`@"path with spaces"` 打开带引号的 mention，目录候选在其尾斜杠后保持引号打开，使补全可以继续深入下一层。格式化器会拒绝含有语法无法安全表示的控制字符或内嵌引号的路径。 已完成的目录 chip 在末尾斜杠之后闭合引号。相对引用从工作区根目录解析，绝对引用保留主机路径。

#### 获取候选

`ctx.fileReferences.list(agent, query, signal)` 返回指定 agent 工作目录中仅含路径的文件与目录候选，由提供方确定性地排序。目录 mention 呈现时带尾随 `/`，使补全可以继续深入下一层。浏览器消费方通过 Session Controller 适配器的 `ctx.remote.fileReferences.list` 调用同一发现能力；末位 signal 参数可取消慢速自动补全。

#### 搭配提供方

本地文件系统请挂载 `@deepseek-ai/dsh-file-reference-local`；其他命名空间（远程或虚拟文件系统）需要发现能力与生效工具一致的提供方。当指定 agent 可以调用 `read` 时，提供方可以安装稳定的 `FILE_REFERENCE_PROMPT` 指引，告诉模型先读取被引用文件、再声称检查过它。

-----

### 已知限制与延期工作

这些限制说明该 seam 何时不合适。它们是当前包约束。

- **路径候选仅供参考**：该 seam 不保证后续面向模型的文件系统工具能够访问同一命名空间；部署时必须让提供方与实际生效的 `read` 实现对齐。
- **没有文件内容引用对象**：所选文件仍是普通提示词文本，其内容必须经过模型显式调用工具后才对模型可见。

## ActiveAtToken（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ActiveAtToken {
    prefix: string;
    query: string;
    quoted: boolean;
}
```

公开导入：`@deepseek-ai/dsh-file-reference`；公开符号：`ActiveAtToken`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`prefix`、`query`、`quoted`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference.md)。

## FILE_REFERENCE_PROMPT（.）

公开导入：`@deepseek-ai/dsh-file-reference`；公开符号：`FILE_REFERENCE_PROMPT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const FILE_REFERENCE_PROMPT = "Tokens prefixed with @ are paths the user explicitly referenced. Relative paths resolve from the workspace root; absolute paths identify files or directories on the host. A trailing slash marks a directory: list it when its contents matter. Anything else is a file: use the read tool when its contents are needed, and do not claim to have inspected it before reading. @\"...\" quotes a path containing spaces.";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference.md)。

## FileReferenceCandidate（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface FileReferenceCandidate {
    path: string;
    kind: 'file' | 'directory';
}
```

公开导入：`@deepseek-ai/dsh-file-reference`；公开符号：`FileReferenceCandidate`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`kind`、`path`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference.md)。

## FileReferenceService（.）

公开导入：`@deepseek-ai/dsh-file-reference`；公开符号：`FileReferenceService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare abstract class FileReferenceService extends Service {
    constructor(ctx: Context);
    abstract list(agent: Agent, query: string, signal: AbortSignal): Promise<FileReferenceCandidate[]>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference.md)。

## activeAtToken（.）

公开导入：`@deepseek-ai/dsh-file-reference`；公开符号：`activeAtToken`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function activeAtToken(line: string, cursorCol: number): ActiveAtToken | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference.md)。

## formatFileMention（.）

公开导入：`@deepseek-ai/dsh-file-reference`；公开符号：`formatFileMention`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function formatFileMention(candidate: FileReferenceCandidate, preserveQuote: boolean): string | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。

## Context 声明合并入口

完整公开声明：

```text
interface Context {
    fileReferences: FileReferenceService;
}
```


Host 的 Cordis `Context` 由本包声明合并补充以下服务键。先挂载提供者再注入使用；类型可见不代表实际 scope 存在此服务。服务由其提供 fiber 负责撤回，消费者不能自行销毁共享服务。

| 服务键或事件 | 精确公开声明 |
| --- | --- |
| `fileReferences` | `fileReferences: FileReferenceService` |

与对应服务对象一起按[接入指南](../how-to/how-to-capabilities-dsh-file-reference.md)验证装载和卸载；隔离的 scope 不应消费其他 Agent 的事件或服务。
