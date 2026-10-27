# @deepseek-ai/dsh-fs-observation-policy：文件读取、原子写入与观察保护

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在文件读取、原子写入与观察保护任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-fs.md)。

## FsObservationActor 契约

从 `@deepseek-ai/dsh-fs-observation-policy` 导入 `FsObservationActor`。`FsObservationActor` 是文件读取、原子写入与观察保护的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface FsObservationActor {
    agent?: {
        session?: object;
    };
}
```

成员检索：`agent`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## apply 契约

从 `@deepseek-ai/dsh-fs-observation-policy` 导入 `apply`。这是 Cordis 模块的 apply 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare function apply(ctx: Context): void;
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。

## name 契约

从 `@deepseek-ai/dsh-fs-observation-policy` 导入 `name`。这是 Cordis 模块的 name 导出，由 Loader 在装配该包时使用；消费者不手工重复调用 apply 以免创建第二份注册。

```text
export declare const name = "fs-observation-policy";
```

本对象的注册/资源责任由[文件读取、原子写入与观察保护](api-runtime-fs-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-fs.md)核对成功、拒绝与卸载结果。
