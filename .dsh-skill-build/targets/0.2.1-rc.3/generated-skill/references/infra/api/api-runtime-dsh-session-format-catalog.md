# @deepseek-ai/dsh-session-format-catalog：Session 耐久句柄、格式与只读投影

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在Session 耐久句柄、格式与只读投影任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-session.md)。

## SessionFormatUnsupportedMigrationError 契约

完整公开声明：

```text
export declare class SessionFormatUnsupportedMigrationError extends SessionFormatError {
    readonly name = "SessionFormatUnsupportedMigrationError";
}
```


从 `@deepseek-ai/dsh-session-format-catalog` 导入 `SessionFormatUnsupportedMigrationError`。`SessionFormatUnsupportedMigrationError` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## createSessionFormatCatalogWithChildren 契约

从 `@deepseek-ai/dsh-session-format-catalog` 导入 `createSessionFormatCatalogWithChildren`。`createSessionFormatCatalogWithChildren` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function createSessionFormatCatalogWithChildren(children: readonly SessionFormatJsonValue[]): SessionFormatCatalog;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## historicalSessionFormatCatalog 契约

从 `@deepseek-ai/dsh-session-format-catalog` 导入 `historicalSessionFormatCatalog`。`historicalSessionFormatCatalog` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const historicalSessionFormatCatalog: import("@deepseek-ai/dsh-session-format").SessionFormatCatalog;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。

## sessionFormatCatalog 契约

从 `@deepseek-ai/dsh-session-format-catalog` 导入 `sessionFormatCatalog`。`sessionFormatCatalog` 是Session 耐久句柄、格式与只读投影的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const sessionFormatCatalog: import("@deepseek-ai/dsh-session-format").SessionFormatCatalog;
```

本对象的注册/资源责任由[Session 耐久句柄、格式与只读投影](api-runtime-session-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-session.md)核对成功、拒绝与卸载结果。
