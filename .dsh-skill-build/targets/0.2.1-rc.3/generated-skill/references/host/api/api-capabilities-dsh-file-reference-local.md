# @deepseek-ai/dsh-file-reference-local 插件契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页说明该包公开入口的导入与组合边界。

## 使用目的与组合

agent（智能体）及宿主 UI 可以用各 agent 本地工作区中经过排序的路径补全 `@file` mention；有界发现让大型仓库也能保持响应迅速。结果会在工具活动后刷新且不会阻塞补全，并且始终不会跟随目录符号链接。当 `read` 可用时，模型还会收到关于如何理解引用路径的稳定指引。当 `read` 使用 Harness 宿主文件系统时选择本包；远程或虚拟命名空间需要与之匹配的发现能力。

### 使用本包

切换 Session 工作目录后，旧目录的搜索索引会被丢弃；下一次补全会搜索新目录。

当 `@file` 补全应发现 Harness 宿主自身的文件系统——即随附 `read` 工具所操作的命名空间——时，挂载此提供方。每个 agent 的工作区从其 Session 当前工作目录开始建立索引。

#### 启用提供方

默认设置适合典型工作区，因此最小挂载无需任何配置：

```yaml
- name: '@deepseek-ai/dsh-file-reference-local'
  config:
    maxResults: 20
```

#### 你能得到什么

在宿主 UI 中输入 `@` 会为指定 agent 返回至多 `maxResults` 个排序路径候选。包含 `/` 的查询直接列出匹配目录的条目；裸查询对有界递归索引做模糊排序。目录候选以尾斜杠保持 mention 开放。任何工具结果之后，该 agent 的索引会被标记为陈旧：下一次查询仍由它作答，其替代品在后台构建，因此重建不会挡在光标前面。

#### 配置

| 字段 | 默认值 | 含义 |
|---|---|---|
| `maxResults` | `20` | 单次查询返回的排序候选最大数量 |
| `maxEntries` | `50000` | 每个 agent 工作区建立索引的文件与目录最大数量 |
| `excludedDirectories` | `['.git', 'node_modules', 'dist', 'build', 'out', 'coverage', 'target', '.next', '.nuxt', '.turbo', '.venv', '__pycache__', '.pytest_cache', '.mypy_cache', '.gradle']` | 遍历与候选中排除的目录基名 |

所有数值都必须是正的安全整数，所有排除名都必须是不含 `/` 或 `\` 的非空基名。

-----

### 已知限制与延期工作

这些限制说明该提供方何时不合适。它们是当前包约束。

- **宿主本地命名空间**：提供方扫描 Harness 宿主的文件系统，因此远程或虚拟 `read` 实现需要使用命名空间与该工具一致的提供方。
- **有界的提示性索引**：超大型工作区可能省略 `maxEntries` 之后的路径；被排除或无法读取的目录不会出现。默认排除项只列没有任何生态用作源码目录的构建产物；`lib` 被刻意排除在外，因此构建进 `lib` 的工作区需通过 `excludedDirectories` 自行加上。
- **一次失效的陈旧窗口**：紧接工具结果之后的裸查询反映的是上一次遍历时的目录树；下一次查询才看到重建结果。
- **没有忽略文件语义**：`.gitignore` 和其他项目忽略文件不会影响发现；系统只排除已配置的目录基名。

## Config（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`Config`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export interface Config {
    maxResults?: number;
    maxEntries?: number;
    excludedDirectories?: string[];
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

## DEFAULT_FILE_SEARCH_EXCLUDED_DIRECTORIES（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`DEFAULT_FILE_SEARCH_EXCLUDED_DIRECTORIES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_FILE_SEARCH_EXCLUDED_DIRECTORIES: readonly [
    ".git",
    "node_modules",
    "dist",
    "build",
    "out",
    "coverage",
    "target",
    ".next",
    ".nuxt",
    ".turbo",
    ".venv",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".gradle"
];
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

## DEFAULT_FILE_SEARCH_MAX_ENTRIES（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`DEFAULT_FILE_SEARCH_MAX_ENTRIES`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_FILE_SEARCH_MAX_ENTRIES = 50000;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

## DEFAULT_FILE_SEARCH_MAX_RESULTS（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`DEFAULT_FILE_SEARCH_MAX_RESULTS`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const DEFAULT_FILE_SEARCH_MAX_RESULTS = 20;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

## FILE_REFERENCE_PROMPT（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`FILE_REFERENCE_PROMPT`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare const FILE_REFERENCE_PROMPT = "Tokens prefixed with @ are paths the user explicitly referenced. Relative paths resolve from the workspace root; absolute paths identify files or directories on the host. A trailing slash marks a directory: list it when its contents matter. Anything else is a file: use the read tool when its contents are needed, and do not claim to have inspected it before reading. @\"...\" quotes a path containing spaces.";
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

这是原包的同源重导出；具体语义见[文件引用契约](api-capabilities-dsh-file-reference.md)。

## FileSearchConfig（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface FileSearchConfig {
    maxResults: number;
    maxEntries: number;
    excludedDirectories: readonly string[];
}
```

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`FileSearchConfig`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`excludedDirectories`、`maxEntries`、`maxResults`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

## LocalFileReferenceService（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`LocalFileReferenceService`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class LocalFileReferenceService extends FileReferenceService {
    static inject: string[];
    static Config: z<Config>;
    constructor(ctx: Context, config?: Config);
    list(agent: Agent, query: string, signal: AbortSignal): Promise<FileReferenceCandidate[]>;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

## WorkspaceFileSearch（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`WorkspaceFileSearch`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare class WorkspaceFileSearch {
    constructor(root: string, config: FileSearchConfig);
    list(rawQuery: string, signal: AbortSignal): Promise<FileReferenceCandidate[]>;
    invalidate(): void;
    dispose(): void;
}
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

这是调用方持有的运行时对象。按上文公开使用路径结束任务；取消和释放不同于业务成功，等待异步清理后才能认定资源已退出。跨进程恢复须读取业务拥有的持久数据，不能序列化此活对象。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

## activeAtToken（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`activeAtToken`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function activeAtToken(line: string, cursorCol: number): ActiveAtToken | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

这是原包的同源重导出；具体语义见[文件引用契约](api-capabilities-dsh-file-reference.md)。

## formatFileMention（.）

公开导入：`@deepseek-ai/dsh-file-reference-local`；公开符号：`formatFileMention`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function formatFileMention(candidate: FileReferenceCandidate, preserveQuote: boolean): string | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

这是原包的同源重导出；具体语义见[文件引用契约](api-capabilities-dsh-file-reference.md)。

## activeAtToken（./search）

公开导入：`@deepseek-ai/dsh-file-reference-local/search`；公开符号：`activeAtToken`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function activeAtToken(line: string, cursorCol: number): ActiveAtToken | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

这是原包的同源重导出；具体语义见[文件引用契约](api-capabilities-dsh-file-reference.md)。

## formatFileMention（./search）

公开导入：`@deepseek-ai/dsh-file-reference-local/search`；公开符号：`formatFileMention`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

完整公开声明：

```text
export declare function formatFileMention(candidate: FileReferenceCandidate, preserveQuote: boolean): string | undefined;
```

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-file-reference-local.md)。

这是原包的同源重导出；具体语义见[文件引用契约](api-capabilities-dsh-file-reference.md)。

## 验证边界

将消费包依赖固定到目标版本。声明编译确认导入与类型，真实 Profile 装载确认服务依赖和配置，调用与卸载确认行为；这三个结果需要分别观察。依赖外部模型、浏览器、原生平台或本地程序的提供方还需在对应环境验证，不能用空注册表替代。
