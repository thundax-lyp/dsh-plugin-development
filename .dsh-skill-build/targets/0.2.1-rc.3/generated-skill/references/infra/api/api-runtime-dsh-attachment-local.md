# @deepseek-ai/dsh-attachment-local：图片与文件附件的持久引用

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在图片与文件附件的持久引用任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[图片与文件附件的持久引用](api-runtime-attachment-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-attachment.md)。

## Config 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    dshHome?: string;
    maxImageBytes?: number;
    maxImagesPerMessage?: number;
    maxMessageImageBytes?: number;
    maxImagePixels?: number;
    maxImageDimension?: number;
    normalizedImageMaxPixels?: number;
    normalizedImageMaxDimension?: number;
    normalizedImageMaxBytes?: number;
    imageCompressionConcurrency?: number;
}
```

成员检索：`dshHome`、`imageCompressionConcurrency`、`maxImageBytes`、`maxImageDimension`、`maxImagePixels`、`maxImagesPerMessage`、`maxMessageImageBytes`、`normalizedImageMaxBytes`、`normalizedImageMaxDimension`、`normalizedImageMaxPixels`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_IMAGE_COMPRESSION_CONCURRENCY 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_IMAGE_COMPRESSION_CONCURRENCY`。`DEFAULT_IMAGE_COMPRESSION_CONCURRENCY` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_IMAGE_COMPRESSION_CONCURRENCY = 2;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_MAX_IMAGES_PER_MESSAGE 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_MAX_IMAGES_PER_MESSAGE`。`DEFAULT_MAX_IMAGES_PER_MESSAGE` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_MAX_IMAGES_PER_MESSAGE = 20;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_MAX_IMAGE_BYTES 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_MAX_IMAGE_BYTES`。`DEFAULT_MAX_IMAGE_BYTES` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_MAX_IMAGE_BYTES: number;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_MAX_IMAGE_DIMENSION 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_MAX_IMAGE_DIMENSION`。`DEFAULT_MAX_IMAGE_DIMENSION` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_MAX_IMAGE_DIMENSION = 8192;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_MAX_IMAGE_PIXELS 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_MAX_IMAGE_PIXELS`。`DEFAULT_MAX_IMAGE_PIXELS` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_MAX_IMAGE_PIXELS = 64000000;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_MAX_MESSAGE_IMAGE_BYTES 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_MAX_MESSAGE_IMAGE_BYTES`。`DEFAULT_MAX_MESSAGE_IMAGE_BYTES` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_MAX_MESSAGE_IMAGE_BYTES: number;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_NORMALIZED_IMAGE_MAX_BYTES 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_NORMALIZED_IMAGE_MAX_BYTES`。`DEFAULT_NORMALIZED_IMAGE_MAX_BYTES` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_NORMALIZED_IMAGE_MAX_BYTES: number;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_NORMALIZED_IMAGE_MAX_DIMENSION 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_NORMALIZED_IMAGE_MAX_DIMENSION`。`DEFAULT_NORMALIZED_IMAGE_MAX_DIMENSION` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_NORMALIZED_IMAGE_MAX_DIMENSION = 8192;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## DEFAULT_NORMALIZED_IMAGE_MAX_PIXELS 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `DEFAULT_NORMALIZED_IMAGE_MAX_PIXELS`。`DEFAULT_NORMALIZED_IMAGE_MAX_PIXELS` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_NORMALIZED_IMAGE_MAX_PIXELS: number;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## LocalAttachmentStore 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `LocalAttachmentStore`。`LocalAttachmentStore` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LocalAttachmentStore extends AttachmentStore {
    static Config: z<Config>;
    readonly root: string;
    readonly imageLimits: ImageAttachmentLimits;
    readonly normalizationPolicy: Readonly<NormalizationPolicy>;
    readonly imageCompressionConcurrency: number;
    constructor(ctx: Context, config: Config);
    validateImage(input: SaveImageAttachment): Promise<void>;
    saveImages(inputs: readonly SaveImageAttachment[]): Promise<readonly ImageAttachmentRef[]>;
    saveImage(input: SaveImageAttachment): Promise<ImageAttachmentRef>;
    readImage(ref: ImageAttachmentRef, signal?: AbortSignal): Promise<StoredImageAttachment>;
    imageHostPath(ref: ImageAttachmentRef): string;
    saveFile(input: SaveFileAttachment): Promise<FileAttachmentRef>;
    saveFileStream(input: SaveFileStreamAttachment): Promise<FileAttachmentRef>;
    readFileStream(ref: FileAttachmentRef, signal?: AbortSignal): AsyncIterable<Uint8Array>;
    fileHostPath(ref: FileAttachmentRef): string;
    readImageRequest(ref: ImageAttachmentRef, target: ImageRequestTarget, signal?: AbortSignal): Promise<RequestImageAttachment>;
}
```

成员检索：`fileHostPath`、`imageCompressionConcurrency`、`imageHostPath`、`imageLimits`、`normalizationPolicy`、`readFileStream`、`readImage`、`readImageRequest`、`root`、`saveFile`、`saveFileStream`、`saveImage`、`saveImages`、`validateImage`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## MAX_IMAGE_COMPRESSION_CONCURRENCY 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `MAX_IMAGE_COMPRESSION_CONCURRENCY`。`MAX_IMAGE_COMPRESSION_CONCURRENCY` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const MAX_IMAGE_COMPRESSION_CONCURRENCY = 8;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## NormalizationPolicy 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `NormalizationPolicy`。`NormalizationPolicy` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface NormalizationPolicy {
    maxPixels: number;
    maxDimension: number;
    maxBytes: number;
}
```

成员检索：`maxBytes`、`maxDimension`、`maxPixels`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## NormalizedImage 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `NormalizedImage`。`NormalizedImage` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface NormalizedImage {
    data: Uint8Array;
    mediaType: ImageMediaType;
    width: number;
    height: number;
}
```

成员检索：`data`、`height`、`mediaType`、`width`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## PreparedImageFile 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `PreparedImageFile`。`PreparedImageFile` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface PreparedImageFile {
    data: Uint8Array;
    ref: ImageAttachmentRef;
}
```

成员检索：`data`、`ref`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## canPassThroughNormalization 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `canPassThroughNormalization`。`canPassThroughNormalization` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function canPassThroughNormalization(detected: DetectedImage, bytes: number, policy: NormalizationPolicy): boolean;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## commitPreparedImageFile 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `commitPreparedImageFile`。`commitPreparedImageFile` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function commitPreparedImageFile(root: string, prepared: PreparedImageFile): Promise<ImageAttachmentRef>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## normalizeImage 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `normalizeImage`。`normalizeImage` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function normalizeImage(data: Uint8Array, detected: DetectedImage, policy: NormalizationPolicy): Promise<NormalizedImage>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## prepareImageFile 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `prepareImageFile`。`prepareImageFile` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function prepareImageFile(input: SaveImageAttachment, limits: ImageAttachmentLimits, policy: NormalizationPolicy): Promise<PreparedImageFile>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## readImageFile 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `readImageFile`。`readImageFile` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function readImageFile(root: string, ref: ImageAttachmentRef, signal?: AbortSignal): Promise<StoredImageAttachment>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## readRequestImageFile 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `readRequestImageFile`。`readRequestImageFile` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function readRequestImageFile(root: string, attachment: StoredImageAttachment, target: ImageRequestTarget, signal?: AbortSignal): Promise<RequestImageAttachment>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## requestImageVariantId 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `requestImageVariantId`。`requestImageVariantId` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function requestImageVariantId(attachment: ImageAttachmentRef, target: ImageRequestTarget): ReturnType<typeof ImageVariantId>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## saveImageFile 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `saveImageFile`。`saveImageFile` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function saveImageFile(root: string, input: SaveImageAttachment, limits: ImageAttachmentLimits, policy: NormalizationPolicy): Promise<ImageAttachmentRef>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## validateImageFile 契约

从 `@deepseek-ai/dsh-attachment-local` 导入 `validateImageFile`。`validateImageFile` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function validateImageFile(input: SaveImageAttachment, limits: ImageAttachmentLimits, policy: NormalizationPolicy): Promise<void>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。
