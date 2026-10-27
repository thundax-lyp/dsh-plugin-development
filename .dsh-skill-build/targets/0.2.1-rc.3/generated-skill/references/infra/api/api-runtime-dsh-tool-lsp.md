# @deepseek-ai/dsh-tool-lsp：语言服务 Provider 与四类查询

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在语言服务 Provider 与四类查询任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-lsp.md)。

## Config 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    maxLocations?: number;
    maxResultChars?: number;
    timeoutMs?: number;
}

export declare const Config: z<Config>;
```

成员检索：`maxLocations`、`maxResultChars`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## DEFAULT_LSP_TOOL_TIMEOUT_MS 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `DEFAULT_LSP_TOOL_TIMEOUT_MS`。`DEFAULT_LSP_TOOL_TIMEOUT_MS` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_LSP_TOOL_TIMEOUT_MS = 60000;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## DEFAULT_MAX_LOCATIONS 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `DEFAULT_MAX_LOCATIONS`。`DEFAULT_MAX_LOCATIONS` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_MAX_LOCATIONS = 100;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## DEFAULT_MAX_RESULT_CHARS 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `DEFAULT_MAX_RESULT_CHARS`。`DEFAULT_MAX_RESULT_CHARS` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_MAX_RESULT_CHARS = 16000;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LSP_OPERATIONS 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `LSP_OPERATIONS`。`LSP_OPERATIONS` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const LSP_OPERATIONS: readonly LspOperation[];
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LSP_PROMPT_TEXT 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `LSP_PROMPT_TEXT`。`LSP_PROMPT_TEXT` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const LSP_PROMPT_TEXT = "Use search/read for ordinary navigation. Use lsp when textual matches are ambiguous or before a change requires precise definitions, implementations, or references. Positions are one-based line and character (UTF-16) at the cursor; an off-symbol position may return no results. findReferences always includes the declaration.";
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): void;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## formatHover 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `formatHover`。`formatHover` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatHover(hover: LspHover | null, maxResultChars: number): string;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## formatLocations 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `formatLocations`。`formatLocations` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatLocations(locations: readonly LspLocation[], workspaceUri: string, maxLocations: number, maxResultChars: number): string;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "tool-lsp";
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## parseLspArgs 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `parseLspArgs`。`parseLspArgs` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseLspArgs(args: LspToolArgs): LspToolInput;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## presentLspCall 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `presentLspCall`。`presentLspCall` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentLspCall(args: LspToolArgs): GenericCallView;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## renderUri 契约

从 `@deepseek-ai/dsh-tool-lsp` 导入 `renderUri`。`renderUri` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function renderUri(uri: string, workspaceUri: string): string;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。
