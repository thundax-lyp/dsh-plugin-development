# @deepseek-ai/dsh-tool-fs-search：文件读取、原子写入与观察保护

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在文件读取、原子写入与观察保护任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-fs.md)。

## Config 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    sampleOverCapGlobResults: boolean;
    globMaxResults?: number;
    grepMaxMatches?: number;
    grepMaxLineBytes?: number;
    searchMetaMaxBytes?: number;
    rawOutputMaxBytes?: number;
    graceMs?: number;
    stderrMaxBytes?: number;
    timeoutMs?: number;
}

export declare const Config: z<Config>;
```

成员检索：`globMaxResults`、`graceMs`、`grepMaxLineBytes`、`grepMaxMatches`、`rawOutputMaxBytes`、`sampleOverCapGlobResults`、`searchMetaMaxBytes`、`stderrMaxBytes`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GLOB_MAX_RESULTS 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GLOB_MAX_RESULTS`。`GLOB_MAX_RESULTS` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const GLOB_MAX_RESULTS = 100;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GLOB_VCS_EXCLUDES 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GLOB_VCS_EXCLUDES`。`GLOB_VCS_EXCLUDES` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const GLOB_VCS_EXCLUDES: readonly string[];
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GREP_MAX_LINE_BYTES 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GREP_MAX_LINE_BYTES`。`GREP_MAX_LINE_BYTES` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const GREP_MAX_LINE_BYTES = 2000;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GREP_MAX_MATCHES 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GREP_MAX_MATCHES`。`GREP_MAX_MATCHES` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const GREP_MAX_MATCHES = 250;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GlobInput 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GlobInput`。`GlobInput` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface GlobInput {
    pattern: string;
    path?: string;
}
```

成员检索：`path`、`pattern`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GlobSample 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GlobSample`。`GlobSample` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface GlobSample {
    items: string[];
    shown: number;
    total: number;
}
```

成员检索：`items`、`shown`、`total`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GlobToolCaps 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GlobToolCaps`。`GlobToolCaps` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface GlobToolCaps {
    sampleOverCapGlobResults: boolean;
    maxResults: number;
    maxMetaBytes: number;
    rawOutputMaxBytes: number;
    graceMs: number;
    stderrMaxBytes: number;
    timeoutMs: number;
}
```

成员检索：`graceMs`、`maxMetaBytes`、`maxResults`、`rawOutputMaxBytes`、`sampleOverCapGlobResults`、`stderrMaxBytes`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GrepInput 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GrepInput`。`GrepInput` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface GrepInput {
    pattern: string;
    path?: string;
    include?: string;
}
```

成员检索：`include`、`path`、`pattern`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GrepMatch 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GrepMatch`。`GrepMatch` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface GrepMatch {
    path: string;
    lineNumber: number;
    line: string;
}
```

成员检索：`line`、`lineNumber`、`path`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## GrepToolCaps 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `GrepToolCaps`。`GrepToolCaps` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface GrepToolCaps {
    maxMatches: number;
    maxLineBytes: number;
    maxMetaBytes: number;
    rawOutputMaxBytes: number;
    graceMs: number;
    stderrMaxBytes: number;
    timeoutMs: number;
}
```

成员检索：`graceMs`、`maxLineBytes`、`maxMatches`、`maxMetaBytes`、`rawOutputMaxBytes`、`stderrMaxBytes`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## RAW_OUTPUT_MAX_BYTES 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `RAW_OUTPUT_MAX_BYTES`。`RAW_OUTPUT_MAX_BYTES` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const RAW_OUTPUT_MAX_BYTES = 20000000;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## RipgrepRun 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `RipgrepRun`。`RipgrepRun` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface RipgrepRun {
    stdout: string;
    noMatches: boolean;
    workdir: string;
}
```

成员检索：`noMatches`、`stdout`、`workdir`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## SEARCH_GRACE_MS 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `SEARCH_GRACE_MS`。`SEARCH_GRACE_MS` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SEARCH_GRACE_MS = 3000;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## SEARCH_META_MAX_BYTES 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `SEARCH_META_MAX_BYTES`。`SEARCH_META_MAX_BYTES` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SEARCH_META_MAX_BYTES = 65536;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## SEARCH_STDERR_MAX_BYTES 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `SEARCH_STDERR_MAX_BYTES`。`SEARCH_STDERR_MAX_BYTES` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SEARCH_STDERR_MAX_BYTES: number;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## SEARCH_TIMEOUT_MS 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `SEARCH_TIMEOUT_MS`。`SEARCH_TIMEOUT_MS` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SEARCH_TIMEOUT_MS = 30000;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## SearchError 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `SearchError`。`SearchError` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class SearchError extends HarnessError {
    readonly code: SearchErrorCode;
    constructor(message: string, code: SearchErrorCode, options?: ErrorOptions);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## SearchErrorCode 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `SearchErrorCode`。`SearchErrorCode` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SearchErrorCode = 'SEARCH_INVALID_PATTERN' | 'SEARCH_FAILED' | 'SEARCH_RAW_OUTPUT_OVERFLOW' | 'SEARCH_ABORTED';
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context, config: Config): Promise<void>;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## applyGlobTool 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `applyGlobTool`。`applyGlobTool` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function applyGlobTool(ctx: Context, caps: GlobToolCaps): void;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## applyGrepTool 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `applyGrepTool`。`applyGrepTool` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function applyGrepTool(ctx: Context, caps: GrepToolCaps): void;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## buildGlobCommand 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `buildGlobCommand`。`buildGlobCommand` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function buildGlobCommand(input: GlobInput): string[];
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## buildGrepCommand 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `buildGrepCommand`。`buildGrepCommand` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function buildGrepCommand(input: GrepInput): string[];
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## formatGlobOutput 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `formatGlobOutput`。`formatGlobOutput` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatGlobOutput(sample: GlobSample, seen: number, spillRef: SpillRef | undefined): string;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## formatGrepMatches 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `formatGrepMatches`。`formatGrepMatches` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatGrepMatches(matches: GrepMatch[]): string;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## formatGrepOutput 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `formatGrepOutput`。`formatGrepOutput` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatGrepOutput(retained: RetainedItems<GrepMatch>, spillRef: SpillRef | undefined): string;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## inject 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `inject`。这是 Cordis 模块的 inject 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const inject: string[];
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "tool-fs-search";
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## parseGlobArgs 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `parseGlobArgs`。`parseGlobArgs` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseGlobArgs(args: {
    pattern: string;
    path?: string;
}): GlobInput;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## parseGrepArgs 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `parseGrepArgs`。`parseGrepArgs` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseGrepArgs(args: {
    pattern: string;
    path?: string;
    include?: string;
}): GrepInput;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## parseGrepMatches 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `parseGrepMatches`。`parseGrepMatches` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function parseGrepMatches(stdout: string): GrepMatch[];
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## presentGlobCall 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `presentGlobCall`。`presentGlobCall` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentGlobCall(args: {
    pattern: string;
    path?: string;
}): GenericCallView;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## presentGlobResult 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `presentGlobResult`。`presentGlobResult` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentGlobResult(_args: {
    pattern: string;
    path?: string;
}, result: ToolResult): SearchResultView | undefined;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## presentGrepCall 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `presentGrepCall`。`presentGrepCall` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentGrepCall(args: {
    pattern: string;
    path?: string;
    include?: string;
}): GenericCallView;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## presentGrepResult 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `presentGrepResult`。`presentGrepResult` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function presentGrepResult(_args: {
    pattern: string;
    path?: string;
    include?: string;
}, result: ToolResult): SearchResultView | undefined;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## previewLine 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `previewLine`。`previewLine` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function previewLine(line: string, maxBytes: number): string;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## resolveRgPath 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `resolveRgPath`。`resolveRgPath` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveRgPath(): Promise<string>;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## runRipgrep 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `runRipgrep`。`runRipgrep` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function runRipgrep(ctx: Context, exec: ToolExecution, toolName: string, argv: readonly string[], rawOutputMaxBytes: number, graceMs: number, stderrMaxBytes: number): Promise<RipgrepRun>;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## sampleAcrossTopLevel 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `sampleAcrossTopLevel`。`sampleAcrossTopLevel` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sampleAcrossTopLevel(paths: readonly string[], maxItems: number, root?: string): GlobSample;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## toWorkdirRelative 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `toWorkdirRelative`。`toWorkdirRelative` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function toWorkdirRelative(path: string, workdir: string): string;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## trySaveFormattedResult 契约

从 `@deepseek-ai/dsh-tool-fs-search` 导入 `trySaveFormattedResult`。`trySaveFormattedResult` 是文件读取、原子写入与观察保护的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function trySaveFormattedResult(ctx: Context, exec: ToolExecution, suggestedName: string, content: string): Promise<SpillRef | undefined>;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。
