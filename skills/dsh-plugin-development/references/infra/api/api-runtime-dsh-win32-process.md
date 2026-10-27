# @deepseek-ai/dsh-win32-process：受管理子进程与原始输出

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在受管理子进程与原始输出任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[受管理子进程与原始输出](api-runtime-subprocess-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-subprocess.md)。

## CurrentTokenProcessBindings 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `CurrentTokenProcessBindings`。`CurrentTokenProcessBindings` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CurrentTokenProcessBindings extends Win32ProcessBindings {
    uvGetOsfhandle(fileDescriptor: number): NativePtr | null;
}
```

成员检索：`assignProcessToJobObject`、`closeHandle`、`createJobObjectW`、`createPipe`、`createProcessAsUserW`、`createProcessW`、`formatMessageW`、`getExitCodeProcess`、`getFileType`、`getLastError`、`getStdHandle`、`peekNamedPipe`、`queryInformationJobObject`、`readFile`、`resumeThread`、`setHandleInformation`、`setInformationJobObject`、`terminateJobObject`、`terminateProcess`、`uvGetOsfhandle`、`waitForSingleObject`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## CurrentTokenProcessSpawnOptions 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `CurrentTokenProcessSpawnOptions`。`CurrentTokenProcessSpawnOptions` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CurrentTokenProcessSpawnOptions extends ProcessSpawnOptions {
    applicationName: string;
    env: Readonly<Record<string, string>>;
    stdio: CurrentTokenStdioFileDescriptors;
}
```

成员检索：`applicationName`、`args`、`command`、`cwd`、`env`、`stdio`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## CurrentTokenStdioFileDescriptors 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `CurrentTokenStdioFileDescriptors`。`CurrentTokenStdioFileDescriptors` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface CurrentTokenStdioFileDescriptors {
    stdin: number;
    stdout: number;
    stderr: number;
    control?: 7;
}
```

成员检索：`control`、`stderr`、`stdin`、`stdout`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## ERROR_INSUFFICIENT_BUFFER 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `ERROR_INSUFFICIENT_BUFFER`。`ERROR_INSUFFICIENT_BUFFER` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const ERROR_INSUFFICIENT_BUFFER = 122;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## NativePtr 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `NativePtr`。`NativePtr` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type NativePtr = bigint & {
    readonly [nativePtr]: true;
};
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SpawnedJobProcess 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `SpawnedJobProcess`。`SpawnedJobProcess` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SpawnedJobProcess {
    pid: number;
    process: NativePtr;
    job: NativePtr;
}
```

成员检索：`job`、`pid`、`process`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## SpawnedPipedProcess 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `SpawnedPipedProcess`。`SpawnedPipedProcess` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SpawnedPipedProcess {
    pid: number;
    process: NativePtr;
    stdoutRead: NativePtr;
    stderrRead: NativePtr;
}
```

成员检索：`pid`、`process`、`stderrRead`、`stdoutRead`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## Win32Error 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `Win32Error`。`Win32Error` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare class Win32Error extends Error {
    readonly api: string;
    readonly win32Code: number;
    constructor(api: string, win32Code: number, detail?: string);
}
```

成员检索：`api`、`win32Code`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## Win32ProcessBindings 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `Win32ProcessBindings`。`Win32ProcessBindings` 是受管理子进程与原始输出的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface Win32ProcessBindings {
    closeHandle(handle: NativePtr): number;
    getLastError(): number;
    getFileType(handle: NativePtr): number;
    uvGetOsfhandle(fileDescriptor: number): NativePtr | null;
    formatMessageW(flags: number, source: null, messageId: number, languageId: number, buffer: Buffer, size: number, args: null): number;
    createPipe(readHandle: NativePtr, writeHandle: NativePtr, attributes: null, size: number): number;
    setHandleInformation(handle: NativePtr, mask: number, flags: number): number;
    createProcessAsUserW(token: NativePtr, applicationName: string | null, commandLine: string, processAttributes: null, threadAttributes: null, inheritHandles: number, creationFlags: number, environment: null, currentDirectory: string | null, startupInfo: NativePtr, processInfo: NativePtr): number;
    createProcessW(applicationName: string | null, commandLine: string, processAttributes: null, threadAttributes: null, inheritHandles: number, creationFlags: number, environment: Buffer | null, currentDirectory: string | null, startupInfo: NativePtr, processInfo: NativePtr): number;
    readFile(file: NativePtr, buffer: Buffer, count: number, bytesRead: NativePtr, overlapped: null): number;
    peekNamedPipe(pipe: NativePtr, buffer: null, size: number, bytesRead: NativePtr | null, totalAvail: NativePtr, leftThisMessage: NativePtr | null): number;
    waitForSingleObject(handle: NativePtr, milliseconds: number): number;
    getExitCodeProcess(process: NativePtr, exitCode: NativePtr): number;
    createJobObjectW(attributes: null, name: null): NativePtr;
    setInformationJobObject(job: NativePtr, cls: number, information: Buffer, length: number): number;
    queryInformationJobObject(job: NativePtr, cls: number, information: Buffer, length: number, returnLength: null): number;
    assignProcessToJobObject(job: NativePtr, process: NativePtr): number;
    resumeThread(thread: NativePtr): number;
    terminateProcess(process: NativePtr, exitCode: number): number;
    terminateJobObject(job: NativePtr, exitCode: number): number;
    getStdHandle(stdHandle: number): NativePtr;
}
```

成员检索：`assignProcessToJobObject`、`closeHandle`、`createJobObjectW`、`createPipe`、`createProcessAsUserW`、`createProcessW`、`formatMessageW`、`getExitCodeProcess`、`getFileType`、`getLastError`、`getStdHandle`、`peekNamedPipe`、`queryInformationJobObject`、`readFile`、`resumeThread`、`setHandleInformation`、`setInformationJobObject`、`terminateJobObject`、`terminateProcess`、`uvGetOsfhandle`、`waitForSingleObject`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## allocPtrSlot 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `allocPtrSlot`。`allocPtrSlot` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function allocPtrSlot(): NativePtr;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## allocUint32 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `allocUint32`。`allocUint32` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function allocUint32(): NativePtr;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## closeHandleChecked 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `closeHandleChecked`。`closeHandleChecked` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function closeHandleChecked(api: Win32ProcessBindings, handle: NativePtr, detail: string): void;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## decodePtr 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `decodePtr`。`decodePtr` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function decodePtr(slot: NativePtr): NativePtr | null;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## decodeUint32 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `decodeUint32`。`decodeUint32` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function decodeUint32(slot: NativePtr): number;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## drainPipe 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `drainPipe`。`drainPipe` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function drainPipe(api: Win32ProcessBindings, handle: NativePtr): Promise<Buffer>;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## extendWin32ProcessBindings 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `extendWin32ProcessBindings`。`extendWin32ProcessBindings` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function extendWin32ProcessBindings<Extension extends object>(create: (context: Win32BindingContext) => Extension): CurrentTokenProcessBindings & Extension;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## isJobEmpty 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `isJobEmpty`。`isJobEmpty` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isJobEmpty(api: Win32ProcessBindings, job: NativePtr): boolean;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## isNullPtr 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `isNullPtr`。`isNullPtr` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isNullPtr(value: NativePtr | null | undefined): value is null | undefined;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## loadWin32ProcessBindings 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `loadWin32ProcessBindings`。`loadWin32ProcessBindings` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function loadWin32ProcessBindings(): CurrentTokenProcessBindings;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## pollProcessExit 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `pollProcessExit`。`pollProcessExit` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function pollProcessExit(api: Win32ProcessBindings, process: NativePtr): number | undefined;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## probeCurrentTokenJobSupport 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `probeCurrentTokenJobSupport`。`probeCurrentTokenJobSupport` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function probeCurrentTokenJobSupport(api: CurrentTokenProcessBindings): void;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## spawnCurrentTokenJobProcess 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `spawnCurrentTokenJobProcess`。`spawnCurrentTokenJobProcess` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function spawnCurrentTokenJobProcess(api: CurrentTokenProcessBindings, options: CurrentTokenProcessSpawnOptions): SpawnedJobProcess;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## spawnInheritedJobProcess 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `spawnInheritedJobProcess`。`spawnInheritedJobProcess` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function spawnInheritedJobProcess(api: Win32ProcessBindings, options: RestrictedProcessSpawnOptions): SpawnedJobProcess;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## spawnPipedProcess 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `spawnPipedProcess`。`spawnPipedProcess` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function spawnPipedProcess(api: Win32ProcessBindings, options: RestrictedProcessSpawnOptions): SpawnedPipedProcess;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## terminateJob 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `terminateJob`。`terminateJob` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function terminateJob(api: Win32ProcessBindings, job: NativePtr, exitCode: number): void;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## throwLastError 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `throwLastError`。`throwLastError` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function throwLastError(api: Win32ProcessBindings, name: string, detail?: string): never;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## throwWin32 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `throwWin32`。`throwWin32` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function throwWin32(api: Win32ProcessBindings, name: string, win32Code: number, detail?: string): never;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。

## waitForProcessExit 契约

从 `@deepseek-ai/dsh-win32-process` 导入 `waitForProcessExit`。`waitForProcessExit` 是受管理子进程与原始输出的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function waitForProcessExit(api: Win32ProcessBindings, process: NativePtr): number;
```

本对象的注册/资源责任由[受管理子进程与原始输出](api-runtime-subprocess-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-subprocess.md)核对成功、拒绝与卸载结果。
