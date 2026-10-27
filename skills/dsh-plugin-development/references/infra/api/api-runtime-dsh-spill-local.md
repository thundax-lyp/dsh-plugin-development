# @deepseek-ai/dsh-spill-local：大结果落盘与可检索定位符

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在大结果落盘与可检索定位符任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[大结果落盘与可检索定位符](api-runtime-spill-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-spill.md)。

## Config 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `Config`。这是该插件的配置对象/校验 schema，按下面声明的可选字段与初始化器构造；schema 默认值在公开初始化表达式中列出。

```text
export interface Config {
    root?: string;
    cleanupPeriodDays?: number;
}
```

成员检索：`cleanupPeriodDays`、`root`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## DEFAULT_ROOT_PREFIX 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `DEFAULT_ROOT_PREFIX`。`DEFAULT_ROOT_PREFIX` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_ROOT_PREFIX = "dsh-spill-";
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## LocalSpillStore 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `LocalSpillStore`。`LocalSpillStore` 是大结果落盘与可检索定位符的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class LocalSpillStore extends SpillStore {
    static Config: z<Config>;
    readonly root: string;
    readonly config: ResolvedConfig;
    constructor(ctx: Context, config: Config);
    saveText(input: SaveTextSpill): Promise<SpillRef>;
}
```

成员检索：`config`、`root`、`saveText`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SaveTextOptions 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `SaveTextOptions`。`SaveTextOptions` 是大结果落盘与可检索定位符的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SaveTextOptions {
    root: string;
    sessionId: string;
    suggestedName: string;
    content: string;
}
```

成员检索：`content`、`root`、`sessionId`、`suggestedName`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SavedText 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `SavedText`。`SavedText` 是大结果落盘与可检索定位符的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SavedText {
    path: string;
    bytes: number;
}
```

成员检索：`bytes`、`path`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SweepOptions 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `SweepOptions`。`SweepOptions` 是大结果落盘与可检索定位符的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SweepOptions {
    roots: SweepRoot[];
    cutoffMs: number;
    warn: WarnFn;
}
```

成员检索：`cutoffMs`、`roots`、`warn`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## SweepRoot 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `SweepRoot`。`SweepRoot` 是大结果落盘与可检索定位符的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SweepRoot {
    path: string;
    pruneWhenEmpty: boolean;
}
```

成员检索：`path`、`pruneWhenEmpty`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## WarnFn 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `WarnFn`。`WarnFn` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type WarnFn = (message: string) => void;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## discoverDefaultRoots 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `discoverDefaultRoots`。`discoverDefaultRoots` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function discoverDefaultRoots(warn: WarnFn, base?: string): Promise<string[]>;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## encodeSegment 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `encodeSegment`。`encodeSegment` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function encodeSegment(raw: string): string;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## isErrno 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `isErrno`。`isErrno` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isErrno(error: unknown, code: string): boolean;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## privateRoot 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `privateRoot`。`privateRoot` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function privateRoot(): string;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## saveTextFile 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `saveTextFile`。`saveTextFile` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function saveTextFile(options: SaveTextOptions): Promise<SavedText>;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## sessionDir 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `sessionDir`。`sessionDir` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sessionDir(root: string, sessionId: string): string;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## sweepSpillRoots 契约

从 `@deepseek-ai/dsh-spill-local` 导入 `sweepSpillRoots`。`sweepSpillRoots` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sweepSpillRoots(options: SweepOptions): Promise<void>;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。
