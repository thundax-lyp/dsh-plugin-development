# @deepseek-ai/dsh-sandbox：沙箱能力、执行策略与升级审批

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在沙箱能力、执行策略与升级审批任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-sandbox.md)。

## ConfinedArgv 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `ConfinedArgv`。`ConfinedArgv` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface ConfinedArgv {
    argv: string[];
    enforcement: SandboxEnforcement;
    denialSignatures: readonly string[];
    runnerFailureRules: readonly RunnerFailureRule[];
}
```

成员检索：`argv`、`denialSignatures`、`enforcement`、`runnerFailureRules`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## ConfinedSandboxMode 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `ConfinedSandboxMode`。`ConfinedSandboxMode` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type ConfinedSandboxMode = Exclude<SandboxMode, 'danger-full-access'>;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## ESCALATION_TARGETS 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `ESCALATION_TARGETS`。`ESCALATION_TARGETS` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const ESCALATION_TARGETS: readonly SandboxMode[];
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## EscalationApproval 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `EscalationApproval`。`EscalationApproval` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface EscalationApproval<A = object, C = string> {
    approver: EscalationApprover<A, C> | undefined;
    agent: A | undefined;
    callId: C;
    toolName: string;
    signal?: AbortSignal;
}
```

成员检索：`agent`、`approver`、`callId`、`signal`、`toolName`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## EscalationApprover 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `EscalationApprover`。`EscalationApprover` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface EscalationApprover<A = object, C = string> {
    request(req: {
        agent: A;
        toolName: string;
        callId: C;
        reason: string;
        displayReason?: {
            readonly en: string;
            readonly [locale: string]: string;
        };
        signal?: AbortSignal;
    }): Promise<EscalationOutcome>;
}
```

成员检索：`request`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## EscalationOutcome 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `EscalationOutcome`。`EscalationOutcome` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type EscalationOutcome = 'allowed-once' | 'rejected' | 'cancelled' | 'unavailable';
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## EscalationRequest 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `EscalationRequest`。`EscalationRequest` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface EscalationRequest {
    requestedMode: string;
    justification: string;
    effectiveMode: SandboxMode;
    subject: string;
}
```

成员检索：`effectiveMode`、`justification`、`requestedMode`、`subject`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## RunnerFailureRule 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `RunnerFailureRule`。`RunnerFailureRule` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface RunnerFailureRule {
    allowedExitCodes?: readonly number[];
    fatalSignatures: readonly string[];
    informationalLines?: readonly string[];
}
```

成员检索：`allowedExitCodes`、`fatalSignatures`、`informationalLines`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SANDBOX_UNAVAILABLE 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `SANDBOX_UNAVAILABLE`。`SANDBOX_UNAVAILABLE` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const SANDBOX_UNAVAILABLE = "SANDBOX_UNAVAILABLE";
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxEnforcement 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `SandboxEnforcement`。`SandboxEnforcement` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SandboxEnforcement = 'full' | 'partial';
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxExecutionPolicy 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `SandboxExecutionPolicy`。`SandboxExecutionPolicy` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SandboxExecutionPolicy {
    mode: SandboxMode;
    workspaceRoot: string;
    sessionId?: SessionId;
}
```

成员检索：`mode`、`sessionId`、`workspaceRoot`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxMode 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `SandboxMode`。`SandboxMode` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SandboxMode = 'read-only' | 'workspace-write' | 'danger-full-access';
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxPolicy 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `SandboxPolicy`。`SandboxPolicy` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export interface SandboxPolicy extends SandboxExecutionPolicy {
    mode: ConfinedSandboxMode;
}
```

成员检索：`mode`、`sessionId`、`workspaceRoot`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxProvider 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `SandboxProvider`。`SandboxProvider` 是沙箱能力、执行策略与升级审批的公开结构/调用对象；输入输出与合法分支以下面的声明为准。

```text
export declare abstract class SandboxProvider extends Service {
    constructor(ctx: Context);
    abstract confine(argv: readonly string[], policy: SandboxPolicy, signal?: AbortSignal): Promise<ConfinedArgv>;
}
```

成员检索：`confine`。字段类型、必填/可选和分支关系见上方声明。

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## SandboxUnavailableError 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `SandboxUnavailableError`。`SandboxUnavailableError` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare class SandboxUnavailableError extends HarnessError {
    constructor(mode: ConfinedSandboxMode, detail?: string);
}
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## WIDER_MODES 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `WIDER_MODES`。`WIDER_MODES` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const WIDER_MODES: Record<string, readonly SandboxMode[]>;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## approveEscalation 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `approveEscalation`。`approveEscalation` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function approveEscalation<A, C>(request: EscalationRequest, approval: EscalationApproval<A, C>): Promise<SandboxMode>;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## canonicalPath 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `canonicalPath`。`canonicalPath` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function canonicalPath(path: string): string;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## classifyRunnerFailure 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `classifyRunnerFailure`。`classifyRunnerFailure` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function classifyRunnerFailure(exitCode: number | null, stderr: string, rules: readonly RunnerFailureRule[]): RunnerFailureMatch | undefined;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## escalationHintMarker 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `escalationHintMarker`。`escalationHintMarker` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function escalationHintMarker(subject: string): string;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## isRunnerSpawnFailure 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `isRunnerSpawnFailure`。`isRunnerSpawnFailure` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function isRunnerSpawnFailure(error: unknown, runnerProgram: string | undefined, workdir: string): boolean;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## matchesSignature 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `matchesSignature`。`matchesSignature` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function matchesSignature(exitCode: number | null, stderr: string, signatures: readonly string[]): boolean;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## sandboxDenialMarker 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `sandboxDenialMarker`。`sandboxDenialMarker` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sandboxDenialMarker(mode: SandboxMode): string;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## sandboxPermissionsDescription 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `sandboxPermissionsDescription`。`sandboxPermissionsDescription` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function sandboxPermissionsDescription(subject: string): string;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## validateEscalationArgs 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `validateEscalationArgs`。`validateEscalationArgs` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function validateEscalationArgs(sandboxPermissions: string | undefined, justification: string | undefined): void;
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。

## writableRoots 契约

从 `@deepseek-ai/dsh-sandbox` 导入 `writableRoots`。`writableRoots` 是沙箱能力、执行策略与升级审批的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function writableRoots(policy: SandboxExecutionPolicy): string[];
```

本对象的注册/资源责任由[沙箱能力、执行策略与升级审批](api-runtime-sandbox-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-sandbox.md)核对成功、拒绝与卸载结果。
