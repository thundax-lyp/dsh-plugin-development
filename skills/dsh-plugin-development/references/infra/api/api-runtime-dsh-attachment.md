# @deepseek-ai/dsh-attachment：图片与文件附件的持久引用

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在图片与文件附件的持久引用任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[图片与文件附件的持久引用](api-runtime-attachment-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-attachment.md)。

## AdmittedPromptContentPart 契约

从 `@deepseek-ai/dsh-attachment` 导入 `AdmittedPromptContentPart`。`AdmittedPromptContentPart` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type AdmittedPromptContentPart = {
    readonly type: 'text';
    readonly text: string;
} | {
    readonly type: 'image';
    readonly attachment: ImageAttachmentRef;
} | {
    readonly type: 'file';
    readonly attachment: FileAttachmentRef;
};
```

成员检索：`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## AttachmentAdmissionPart 契约

从 `@deepseek-ai/dsh-attachment` 导入 `AttachmentAdmissionPart`。`AttachmentAdmissionPart` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type AttachmentAdmissionPart = PromptContentPart | {
    readonly type: 'file';
    readonly attachment: FileAttachmentRef;
};
```

成员检索：`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## AttachmentError 契约

从 `@deepseek-ai/dsh-attachment` 导入 `AttachmentError`。`AttachmentError` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class AttachmentError extends Error {
    readonly code: AttachmentErrorCode;
    constructor(message: string, code: AttachmentErrorCode, options?: ErrorOptions);
}
```

成员检索：`code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## AttachmentErrorCode 契约

从 `@deepseek-ai/dsh-attachment` 导入 `AttachmentErrorCode`。`AttachmentErrorCode` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type AttachmentErrorCode = typeof ATTACHMENT_ERROR_CODES[number];
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## AttachmentId 契约

从 `@deepseek-ai/dsh-attachment` 导入 `AttachmentId`。`AttachmentId` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function AttachmentId(value: string): AttachmentId;

export type AttachmentId = Branded<'AttachmentId'>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## AttachmentIdType 契约

完整公开声明：

```text
export declare function AttachmentId(value: string): AttachmentId;

export type AttachmentId = Branded<'AttachmentId'>;
```


从 `@deepseek-ai/dsh-attachment` 导入 `AttachmentIdType`。`AttachmentIdType` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## AttachmentStore 契约

从 `@deepseek-ai/dsh-attachment` 导入 `AttachmentStore`。ctx.attachments 后端，先验证并保存 binary 再追加 Session event；默认不支持的文件和图像派生操作显式拒绝。批量验证失败不开始写，存储失败可能留下不可达内容对象。

```text
export declare abstract class AttachmentStore extends Service {
    constructor(ctx: Context);
    abstract readonly imageLimits: ImageAttachmentLimits;
    abstract validateImage(input: SaveImageAttachment): Promise<void>;
    saveImages(inputs: readonly SaveImageAttachment[]): Promise<readonly ImageAttachmentRef[]>;
    admitPromptContent(content: readonly AttachmentAdmissionPart[]): Promise<AdmittedPromptContentPart[]>;
    admitEncodedFile(input: EncodedFileAttachment): Promise<FileAttachmentRef>;
    isAttachmentError(error: unknown): error is AttachmentError;
    abstract saveImage(input: SaveImageAttachment): Promise<ImageAttachmentRef>;
    abstract readImage(ref: ImageAttachmentRef, signal?: AbortSignal): Promise<StoredImageAttachment>;
    imageHostPath(ref: ImageAttachmentRef): string | undefined;
    saveFile(input: SaveFileAttachment): Promise<FileAttachmentRef>;
    saveFileStream(input: SaveFileStreamAttachment): Promise<FileAttachmentRef>;
    readFileStream(ref: FileAttachmentRef, signal?: AbortSignal): AsyncIterable<Uint8Array>;
    fileHostPath(ref: FileAttachmentRef): string | undefined;
    readImageRequest(ref: ImageAttachmentRef, target: ImageRequestTarget, signal?: AbortSignal): Promise<RequestImageAttachment>;
}
```

成员检索：`admitEncodedFile`、`admitPromptContent`、`fileHostPath`、`imageHostPath`、`imageLimits`、`isAttachmentError`、`readFileStream`、`readImage`、`readImageRequest`、`saveFile`、`saveFileStream`、`saveImage`、`saveImages`、`validateImage`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## EncodedFileAttachment 契约

从 `@deepseek-ai/dsh-attachment` 导入 `EncodedFileAttachment`。`EncodedFileAttachment` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface EncodedFileAttachment {
    data: string;
    name?: string;
}
```

成员检索：`data`、`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## EncodedImageAttachment 契约

从 `@deepseek-ai/dsh-attachment` 导入 `EncodedImageAttachment`。`EncodedImageAttachment` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface EncodedImageAttachment {
    mediaType: ImageMediaType;
    data: string;
    name?: string;
}
```

成员检索：`data`、`mediaType`、`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## FileAttachmentRef 契约

从 `@deepseek-ai/dsh-attachment` 导入 `FileAttachmentRef`。`FileAttachmentRef` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface FileAttachmentRef {
    attachmentId: AttachmentId;
    name: string;
    bytes: number;
}
```

成员检索：`attachmentId`、`bytes`、`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## ImageAdmissionErrorCode 契约

从 `@deepseek-ai/dsh-attachment` 导入 `ImageAdmissionErrorCode`。`ImageAdmissionErrorCode` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ImageAdmissionErrorCode = typeof IMAGE_ADMISSION_ERROR_CODES[number];
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## ImageAttachmentLimits 契约

从 `@deepseek-ai/dsh-attachment` 导入 `ImageAttachmentLimits`。`ImageAttachmentLimits` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ImageAttachmentLimits {
    maxImageBytes: number;
    maxImagesPerMessage: number;
    maxMessageImageBytes: number;
    maxImagePixels: number;
    maxImageDimension: number;
    mediaTypes: readonly ImageMediaType[];
}
```

成员检索：`maxImageBytes`、`maxImageDimension`、`maxImagePixels`、`maxImagesPerMessage`、`maxMessageImageBytes`、`mediaTypes`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## ImageAttachmentRef 契约

从 `@deepseek-ai/dsh-attachment` 导入 `ImageAttachmentRef`。`ImageAttachmentRef` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ImageAttachmentRef {
    attachmentId: AttachmentId;
    mediaType: ImageMediaType;
    bytes: number;
    width: number;
    height: number;
    name?: string;
    originalDimensions?: {
        width: number;
        height: number;
    };
}
```

成员检索：`attachmentId`、`bytes`、`height`、`mediaType`、`name`、`originalDimensions`、`width`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## ImageMediaType 契约

从 `@deepseek-ai/dsh-attachment` 导入 `ImageMediaType`。`ImageMediaType` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ImageMediaType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## ImageRequestTarget 契约

从 `@deepseek-ai/dsh-attachment` 导入 `ImageRequestTarget`。`ImageRequestTarget` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ImageRequestTarget {
    width: number;
    height: number;
    maxBytes: number;
}
```

成员检索：`height`、`maxBytes`、`width`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## ImageVariantId 契约

从 `@deepseek-ai/dsh-attachment` 导入 `ImageVariantId`。`ImageVariantId` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function ImageVariantId(value: string): ImageVariantId;

export type ImageVariantId = Branded<'ImageVariantId'>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## ProjectedDimensions 契约

从 `@deepseek-ai/dsh-attachment` 导入 `ProjectedDimensions`。`ProjectedDimensions` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ProjectedDimensions {
    width: number;
    height: number;
}
```

成员检索：`height`、`width`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## PromptContentPart 契约

从 `@deepseek-ai/dsh-attachment` 导入 `PromptContentPart`。`PromptContentPart` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type PromptContentPart = {
    readonly type: 'text';
    readonly text: string;
} | {
    readonly type: 'image';
    readonly mediaType: ImageMediaType;
    readonly data: string;
    readonly name?: string;
};
```

成员检索：`type`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## RequestImageAttachment 契约

从 `@deepseek-ai/dsh-attachment` 导入 `RequestImageAttachment`。`RequestImageAttachment` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface RequestImageAttachment {
    variantId: ImageVariantId;
    attachment: ImageAttachmentRef;
    data: Uint8Array;
    mediaType: ImageMediaType;
    bytes: number;
    width: number;
    height: number;
    depth: 'uchar';
    space: 'srgb';
    hasAlpha: boolean;
}
```

成员检索：`attachment`、`bytes`、`data`、`depth`、`hasAlpha`、`height`、`mediaType`、`space`、`variantId`、`width`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## SaveFileAttachment 契约

从 `@deepseek-ai/dsh-attachment` 导入 `SaveFileAttachment`。`SaveFileAttachment` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SaveFileAttachment {
    data: Uint8Array;
    name?: string;
}
```

成员检索：`data`、`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## SaveFileStreamAttachment 契约

从 `@deepseek-ai/dsh-attachment` 导入 `SaveFileStreamAttachment`。`SaveFileStreamAttachment` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SaveFileStreamAttachment {
    data: AsyncIterable<Uint8Array>;
    signal?: AbortSignal;
    name?: string;
}
```

成员检索：`data`、`name`、`signal`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## SaveImageAttachment 契约

从 `@deepseek-ai/dsh-attachment` 导入 `SaveImageAttachment`。`SaveImageAttachment` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SaveImageAttachment {
    data: Uint8Array;
    mediaType: ImageMediaType;
    name?: string;
}
```

成员检索：`data`、`mediaType`、`name`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## StoredImageAttachment 契约

从 `@deepseek-ai/dsh-attachment` 导入 `StoredImageAttachment`。`StoredImageAttachment` 是图片与文件附件的持久引用的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface StoredImageAttachment {
    ref: ImageAttachmentRef;
    data: Uint8Array;
}
```

成员检索：`data`、`ref`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## admitEncodedFile 契约

从 `@deepseek-ai/dsh-attachment` 导入 `admitEncodedFile`。`admitEncodedFile` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function admitEncodedFile(attachments: AttachmentStore, file: EncodedFileAttachment): Promise<FileAttachmentRef>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## admitEncodedImages 契约

从 `@deepseek-ai/dsh-attachment` 导入 `admitEncodedImages`。`admitEncodedImages` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function admitEncodedImages(attachments: AttachmentStore, images: readonly EncodedImageAttachment[]): Promise<readonly ImageAttachmentRef[]>;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## isAttachmentError 契约

从 `@deepseek-ai/dsh-attachment` 导入 `isAttachmentError`。`isAttachmentError` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isAttachmentError(error: unknown): error is AttachmentError;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## isImageAdmissionError 契约

从 `@deepseek-ai/dsh-attachment` 导入 `isImageAdmissionError`。`isImageAdmissionError` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isImageAdmissionError(error: unknown): error is AttachmentError & {
    readonly code: ImageAdmissionErrorCode;
};
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## longEdgeDimensions 契约

从 `@deepseek-ai/dsh-attachment` 导入 `longEdgeDimensions`。`longEdgeDimensions` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function longEdgeDimensions(width: number, height: number, longEdge: number): ProjectedDimensions;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。

## requestImageDimensions 契约

从 `@deepseek-ai/dsh-attachment` 导入 `requestImageDimensions`。`requestImageDimensions` 是图片与文件附件的持久引用的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function requestImageDimensions(width: number, height: number, maxPixels: number): ProjectedDimensions;
```

本对象的注册/资源责任由[图片与文件附件的持久引用](api-runtime-attachment-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-attachment.md)核对成功、拒绝与卸载结果。
