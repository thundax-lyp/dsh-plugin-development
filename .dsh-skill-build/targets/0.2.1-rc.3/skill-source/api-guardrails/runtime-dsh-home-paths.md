# @deepseek-ai/dsh-home-paths：工具输出预算、取消期限与进程代理

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在工具输出预算、取消期限与进程代理任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-util.md)。

## AGENTS_HOME_DIR_NAME 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `AGENTS_HOME_DIR_NAME`。`AGENTS_HOME_DIR_NAME` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const AGENTS_HOME_DIR_NAME = ".agents";
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## AGENTS_HOME_ENV 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `AGENTS_HOME_ENV`。`AGENTS_HOME_ENV` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const AGENTS_HOME_ENV = "DSH_AGENTS_HOME";
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## DEFAULT_AGENTS_HOME_DISPLAY 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `DEFAULT_AGENTS_HOME_DISPLAY`。`DEFAULT_AGENTS_HOME_DISPLAY` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_AGENTS_HOME_DISPLAY = "~/.agents";
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## DEFAULT_DSH_HOME_DISPLAY 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `DEFAULT_DSH_HOME_DISPLAY`。`DEFAULT_DSH_HOME_DISPLAY` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DEFAULT_DSH_HOME_DISPLAY = "~/.dsh";
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## DSH_HOME_DIR_NAME 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `DSH_HOME_DIR_NAME`。`DSH_HOME_DIR_NAME` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DSH_HOME_DIR_NAME = ".dsh";
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## DSH_HOME_ENV 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `DSH_HOME_ENV`。`DSH_HOME_ENV` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const DSH_HOME_ENV = "DSH_HOME";
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## agentsHomeDisplay 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `agentsHomeDisplay`。`agentsHomeDisplay` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function agentsHomeDisplay(resolvedHome: string): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## canonicalizeWatchPath 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `canonicalizeWatchPath`。`canonicalizeWatchPath` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function canonicalizeWatchPath(path: string): Promise<string>;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## defaultAgentsHome 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `defaultAgentsHome`。`defaultAgentsHome` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function defaultAgentsHome(): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## defaultDshHome 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `defaultDshHome`。`defaultDshHome` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function defaultDshHome(): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## dshCachePath 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `dshCachePath`。`dshCachePath` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function dshCachePath(optionsOrSegment?: {
    dshHome?: string;
} | string, ...segments: string[]): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## dshHomeDisplay 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `dshHomeDisplay`。`dshHomeDisplay` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function dshHomeDisplay(resolvedHome: string): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## dshHomePath 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `dshHomePath`。`dshHomePath` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function dshHomePath(...segments: string[]): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## expandHomePath 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `expandHomePath`。`expandHomePath` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function expandHomePath(path: string): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## resolveAgentsHome 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `resolveAgentsHome`。`resolveAgentsHome` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveAgentsHome(configured?: string, env?: Record<string, string | undefined>): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。

## resolveDshHome 契约

从 `@deepseek-ai/dsh-home-paths` 导入 `resolveDshHome`。`resolveDshHome` 是工具输出预算、取消期限与进程代理的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function resolveDshHome(configured?: string, env?: Record<string, string | undefined>): string;
```

本对象的注册/资源责任由[工具输出预算、取消期限与进程代理](api-runtime-util-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-util.md)核对成功、拒绝与卸载结果。
