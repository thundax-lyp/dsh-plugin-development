# @deepseek-ai/dsh-sandbox-windows-acl：沙箱能力、执行策略与升级审批

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在沙箱能力、执行策略与升级审批任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-sandbox.md)。

## ACL_DIAGNOSIS_SKILL 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `ACL_DIAGNOSIS_SKILL`。`ACL_DIAGNOSIS_SKILL` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const ACL_DIAGNOSIS_SKILL = "diagnose-windows-sandbox-acl";
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## AclSandbox 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `AclSandbox`。`AclSandbox` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class AclSandbox {
    readonly writableDirs: string[];
    readonly writeSid: string | undefined;
    readonly tempWriteSid: string | undefined;
    readonly mode: 'read-only' | 'workspace-write';
    constructor(options: AclSandboxOptions);
    get tempDir(): string | null | undefined;
    init(): Promise<void>;
    spawn(options: AclSandboxSpawnOptions): AclSandboxChild;
    dispose(): void;
}
```

成员检索：`dispose`、`init`、`mode`、`spawn`、`tempDir`、`tempWriteSid`、`writableDirs`、`writeSid`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## AclSandboxChild 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `AclSandboxChild`。`AclSandboxChild` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AclSandboxChild {
    pid: number;
    wait(): Promise<AclSandboxChildResult>;
}
```

成员检索：`pid`、`wait`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## AclSandboxChildResult 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `AclSandboxChildResult`。`AclSandboxChildResult` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AclSandboxChildResult {
    stdout: Buffer;
    stderr: Buffer;
    exitCode: number;
}
```

成员检索：`exitCode`、`stderr`、`stdout`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## AclSandboxOptions 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `AclSandboxOptions`。`AclSandboxOptions` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AclSandboxOptions {
    writableDirs: readonly string[];
    tempDir?: string | null;
    writeSid?: string;
    tempWriteSid?: string;
    mode: 'read-only' | 'workspace-write';
    manageDacls?: boolean;
}
```

成员检索：`manageDacls`、`mode`、`tempDir`、`tempWriteSid`、`writableDirs`、`writeSid`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## AclSandboxSpawnOptions 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `AclSandboxSpawnOptions`。`AclSandboxSpawnOptions` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface AclSandboxSpawnOptions {
    command: string;
    args?: readonly string[];
    cwd?: string;
    stdio?: 'pipe' | 'inherit';
    controlFileDescriptor?: 7;
}
```

成员检索：`args`、`command`、`controlFileDescriptor`、`cwd`、`stdio`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## AclWriteGrant 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `AclWriteGrant`。`AclWriteGrant` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class AclWriteGrant {
    readonly writeSid: string;
    static create(writeSid: string, api?: Win32Bindings): AclWriteGrant;
    add(path: string, standing?: boolean): void;
    get paths(): readonly string[];
    dispose(): void;
}
```

成员检索：`add`、`dispose`、`paths`、`writeSid`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## assertTempRootOutsideWorkspace 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `assertTempRootOutsideWorkspace`。`assertTempRootOutsideWorkspace` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function assertTempRootOutsideWorkspace(workspaceRoot: string, tempRoot: string): void;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## registerAclDiagnosisSkill 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `registerAclDiagnosisSkill`。`registerAclDiagnosisSkill` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function registerAclDiagnosisSkill(ctx: Context): void;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## tempWriteSid 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `tempWriteSid`。`tempWriteSid` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function tempWriteSid(tempDir: string): string;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## workspaceWriteSid 契约

从 `@deepseek-ai/dsh-sandbox-windows-acl` 导入 `workspaceWriteSid`。`workspaceWriteSid` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function workspaceWriteSid(workspaceRoot: string): string;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。
