# @deepseek-ai/dsh-browser-use./brand：浏览器自动化能力注册

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在浏览器自动化能力注册任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[浏览器自动化能力注册](api-runtime-browser-use-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-browser-use.md)。

## BrowserUseProviderName 契约

从 `@deepseek-ai/dsh-browser-use/brand` 导入 `BrowserUseProviderName`。`BrowserUseProviderName` 是浏览器自动化能力注册的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function BrowserUseProviderName(name: string): BrowserUseProviderName;

export type BrowserUseProviderName = Branded<'BrowserUseProviderName'>;
```

本对象的注册/资源责任由[浏览器自动化能力注册](api-runtime-browser-use-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-browser-use.md)核对成功、拒绝与卸载结果。
