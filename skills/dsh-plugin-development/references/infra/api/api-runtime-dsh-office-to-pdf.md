# @deepseek-ai/dsh-office-to-pdf：图片与文件附件的持久引用

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在图片与文件附件的持久引用任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[图片与文件附件的持久引用](api-runtime-attachment-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-attachment.md)。

## Config 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    maxConcurrentConversions: number;
    maxQueuedJobs: number;
    maxReaders: number;
    maxSourceBytes: number;
    maxBackgroundConversions: number;
    maxCachedEntries: number;
    maxCachedBytes: number;
    maxSourceEntries: number;
    timeoutMs: number;
    maxInputBytes: number;
    maxOutputBytes: number;
    maxImageResolution: number;
    maxArchiveEntries: number;
    maxUncompressedBytes: number;
    fontDirectories?: string[];
    fontFallbacks?: string[][];
    maxFontFiles: number;
    maxFontFileBytes: number;
    maxLoadedFontBytes: number;
}

export declare const Config: z<Partial<Config>, Config>;
```

成员检索：`fontDirectories`、`fontFallbacks`、`maxArchiveEntries`、`maxBackgroundConversions`、`maxCachedBytes`、`maxCachedEntries`、`maxConcurrentConversions`、`maxFontFileBytes`、`maxFontFiles`、`maxImageResolution`、`maxInputBytes`、`maxLoadedFontBytes`、`maxOutputBytes`、`maxQueuedJobs`、`maxReaders`、`maxSourceBytes`、`maxSourceEntries`、`maxUncompressedBytes`、`timeoutMs`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeExtension 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeExtension`。`OfficeExtension` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type OfficeExtension = 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx';
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeSourceKey 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeSourceKey`。`OfficeSourceKey` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function OfficeSourceKey(key: string): OfficeSourceKey;

export type OfficeSourceKey = Branded<'OfficeSourceKey'>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeToPdf 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeToPdf`。`OfficeToPdf` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class OfficeToPdf extends TypertRemoteService {
    static Config: z<Partial<Config>, Config>;
    readonly generation: OfficeToPdfGeneration;
    constructor(ctx: Context, config: Config);
    convert(request: OfficeToPdfRequest, signal?: AbortSignal): Promise<OfficeToPdfResult>;
    render(workspaceFileScope: WorkspaceFileScope, path: string, priority: OfficeToPdfPriority, signal: AbortSignal): Promise<RenderedDocumentBytes>;
    getGeneration(signal: AbortSignal): OfficeToPdfGeneration;
}
```

成员检索：`convert`、`generation`、`getGeneration`、`render`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeToPdfError 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeToPdfError`。`OfficeToPdfError` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class OfficeToPdfError extends Error {
    readonly code: OfficeToPdfErrorCode;
    constructor(code: OfficeToPdfErrorCode, message: string, options?: ErrorOptions);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeToPdfErrorCode 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeToPdfErrorCode`。`OfficeToPdfErrorCode` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type OfficeToPdfErrorCode = 'input-too-large' | 'output-too-large' | 'invalid-document' | 'unsupported-format' | 'invalid-output' | 'timeout' | 'unavailable' | 'failed' | 'busy' | 'source-changed';
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeToPdfGeneration 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeToPdfGeneration`。`OfficeToPdfGeneration` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function OfficeToPdfGeneration(value: string): OfficeToPdfGeneration;

export type OfficeToPdfGeneration = Branded<'OfficeToPdfGeneration'>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeToPdfKey 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeToPdfKey`。`OfficeToPdfKey` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function OfficeToPdfKey(value: string): OfficeToPdfKey;

export type OfficeToPdfKey = Branded<'OfficeToPdfKey'>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeToPdfPriority 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeToPdfPriority`。`OfficeToPdfPriority` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type OfficeToPdfPriority = 'foreground' | 'background';
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeToPdfRequest 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeToPdfRequest`。`OfficeToPdfRequest` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface OfficeToPdfRequest {
    readonly extension: OfficeExtension;
    readonly priority: OfficeToPdfPriority;
    readonly source: {
        readonly key: OfficeSourceKey;
        readonly version: string;
        readonly bytes?: number;
        read(signal: AbortSignal, maxBytes: number): Promise<{
            readonly bytes: Uint8Array;
            readonly version: string;
        }>;
    };
}
```

成员检索：`extension`、`priority`、`source`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## OfficeToPdfResult 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `OfficeToPdfResult`。`OfficeToPdfResult` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface OfficeToPdfResult {
    readonly pdf: Uint8Array;
    readonly missingFonts: string[];
    readonly cacheKey: OfficeToPdfKey;
    readonly generation: OfficeToPdfGeneration;
}
```

成员检索：`cacheKey`、`generation`、`missingFonts`、`pdf`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## RenderedDocumentBytes 契约

从 `@deepseek-ai/dsh-office-to-pdf` 导入 `RenderedDocumentBytes`。`RenderedDocumentBytes` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface RenderedDocumentBytes extends WorkspaceFileBytes {
    readonly missingFonts: string[];
    readonly generation: OfficeToPdfGeneration;
}
```

成员检索：`generation`、`missingFonts`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。
