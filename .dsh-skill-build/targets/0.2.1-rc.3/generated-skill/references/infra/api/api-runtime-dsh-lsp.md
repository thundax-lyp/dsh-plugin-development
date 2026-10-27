# @deepseek-ai/dsh-lsp：语言服务 Provider 与四类查询

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在语言服务 Provider 与四类查询任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-lsp.md)。

## Lsp 契约

从 `@deepseek-ai/dsh-lsp` 导入 `Lsp`。Host ctx.lsp 服务，按 filePath 最后扩展选择 provider；注册时一次性检查 id 和全部 extensionToLanguage，失败不保留部分路由。

```text
export declare class Lsp extends Service implements LspService {
    constructor(ctx: Context);
    registerProvider(provider: LspProvider): () => void;
    query(request: LspQueryRequest, signal?: AbortSignal): Promise<LspQueryResult>;
}
```

成员检索：`query`、`registerProvider`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspError 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspError`。`LspError` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare class LspError extends HarnessError {
}
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspHover 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspHover`。`LspHover` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LspHover {
    readonly contents: string;
    readonly range?: LspRange;
}
```

成员检索：`contents`、`range`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspLocation 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspLocation`。`LspLocation` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LspLocation {
    readonly uri: string;
    readonly range: LspRange;
}
```

成员检索：`range`、`uri`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspOperation 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspOperation`。`LspOperation` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type LspOperation = 'goToDefinition' | 'findReferences' | 'goToImplementation' | 'hover';
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspPosition 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspPosition`。`LspPosition` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LspPosition {
    readonly line: number;
    readonly character: number;
}
```

成员检索：`character`、`line`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspProvider 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspProvider`。实现 id、extensionToLanguage、query，provider 自己拥有 server 启动、同步文档与通信资源；卸载先撤销注册再关闭资源。

```text
export interface LspProvider {
    readonly id: LspProviderId;
    readonly extensionToLanguage: Readonly<Record<string, string>>;
    query(request: LspProviderQuery, signal?: AbortSignal): Promise<LspQueryResult>;
}
```

成员检索：`extensionToLanguage`、`id`、`query`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspProviderId 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspProviderId`。`LspProviderId` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function LspProviderId(id: string): LspProviderId;

export type LspProviderId = Branded<'LspProviderId'>;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspProviderQuery 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspProviderQuery`。`LspProviderQuery` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LspProviderQuery extends LspQueryRequest {
    readonly languageId: string;
}
```

成员检索：`filePath`、`languageId`、`operation`、`position`、`workspaceRoot`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspQueryRequest 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspQueryRequest`。`LspQueryRequest` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LspQueryRequest {
    readonly operation: LspOperation;
    readonly filePath: string;
    readonly position: LspPosition;
    readonly workspaceRoot: string;
}
```

成员检索：`filePath`、`operation`、`position`、`workspaceRoot`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspQueryResult 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspQueryResult`。`LspQueryResult` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export type LspQueryResult = {
    readonly kind: 'locations';
    readonly locations: readonly LspLocation[];
    readonly resolvedWorkspaceUri: string;
} | {
    readonly kind: 'hover';
    readonly hover: LspHover | null;
};
```

成员检索：`kind`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspRange 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspRange`。`LspRange` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LspRange {
    readonly start: LspPosition;
    readonly end: LspPosition;
}
```

成员检索：`end`、`start`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## LspService 契约

从 `@deepseek-ai/dsh-lsp` 导入 `LspService`。`LspService` 是语言服务 Provider 与四类查询的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface LspService {
    registerProvider(provider: LspProvider): () => void;
    query(request: LspQueryRequest, signal?: AbortSignal): Promise<LspQueryResult>;
}
```

成员检索：`query`、`registerProvider`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。

## finalExtension 契约

从 `@deepseek-ai/dsh-lsp` 导入 `finalExtension`。`finalExtension` 是语言服务 Provider 与四类查询的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function finalExtension(filePath: string): string;
```

本对象的注册/资源责任由[语言服务 Provider 与四类查询](api-runtime-lsp-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-lsp.md)核对成功、拒绝与卸载结果。
