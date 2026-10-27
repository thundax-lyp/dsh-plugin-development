# @deepseek-ai/dsh-spill-policy./notice：大结果落盘与可检索定位符

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在大结果落盘与可检索定位符任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[大结果落盘与可检索定位符](api-runtime-spill-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-spill.md)。

## formatSpillNotice 契约

从 `@deepseek-ai/dsh-spill-policy/notice` 导入 `formatSpillNotice`。`formatSpillNotice` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function formatSpillNotice(omitted: Omitted, ref: Pick<SpillRef, 'locator' | 'retrievalHint'>, images?: number): string;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。

## hasSpillNotice 契约

从 `@deepseek-ai/dsh-spill-policy/notice` 导入 `hasSpillNotice`。`hasSpillNotice` 是大结果落盘与可检索定位符的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function hasSpillNotice(text: string): boolean;
```

本对象的注册/资源责任由[大结果落盘与可检索定位符](api-runtime-spill-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-spill.md)核对成功、拒绝与卸载结果。
