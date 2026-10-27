# @deepseek-ai/dsh-ssh./schemas：远程执行世界与配套后端

适用版本：`@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页定义 Host 插件在远程执行世界与配套后端任务中直接使用的对象。不要把代码导出存在等同于服务已经挂载。

装配与公共失败边界见[远程执行世界与配套后端](api-runtime-ssh-overview.md)，操作与验证见[任务步骤](../how-to/how-to-runtime-ssh.md)。

## SshProcessId 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `SshProcessId`。`SshProcessId` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SshProcessId = Branded<'SshProcessId'>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## SshStreamEndpoint 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `SshStreamEndpoint`。`SshStreamEndpoint` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SshStreamEndpoint = z.infer<typeof streamEndpointSchema>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。


继承与类型组合成员索引：下面的成员来自父声明或联合分支；泛型实参按本对象上方 `extends`／类型组合代入，分支特有字段须先收窄再访问。它们不表示可以同时构造所有分支，也不改变父声明的资源归属。

| 成员 | 公开成员声明 | 权威归属 |
| --- | --- | --- |
| `capability` | `capability: z.ZodString;` | 来自上述类型组合的公开分支 |
| `path` | `path: z.ZodString;` | 来自上述类型组合的公开分支 |

## SshTextStreamId 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `SshTextStreamId`。`SshTextStreamId` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export type SshTextStreamId = Branded<'SshTextStreamId'>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## doneSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `doneSchema`。`doneSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const doneSchema: z.ZodObject<{
    outcome: z.ZodObject<{
        exitCode: z.ZodNullable<z.ZodNumber>;
        signal: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
    spills: z.ZodObject<{
        stdout: z.ZodOptional<z.ZodString>;
        stderr: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    collected: z.ZodObject<{
        stdout: z.ZodOptional<z.ZodObject<{
            tail: z.ZodBase64;
            totalBytes: z.ZodNumber;
        }, z.core.$strict>>;
        stderr: z.ZodOptional<z.ZodObject<{
            tail: z.ZodBase64;
            totalBytes: z.ZodNumber;
        }, z.core.$strict>>;
    }, z.core.$strict>;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## editResultSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `editResultSchema`。`editResultSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const editResultSchema: z.ZodObject<{
    version: z.ZodString;
    before: z.ZodString;
    after: z.ZodString;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## editSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `editSchema`。`editSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const editSchema: z.ZodObject<{
    oldString: z.ZodString;
    newString: z.ZodString;
    replaceAll: z.ZodBoolean;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## entriesSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `entriesSchema`。`entriesSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const entriesSchema: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        file: "file";
        directory: "directory";
        other: "other";
    }>;
    target: z.ZodObject<{
        targetKey: z.ZodString;
        displayPath: z.ZodString;
    }, z.core.$strict>;
    version: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## environmentSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `environmentSchema`。`environmentSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const environmentSchema: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## foregroundSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `foregroundSchema`。`foregroundSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const foregroundSchema: z.ZodNullable<z.ZodObject<{
    processGroupId: z.ZodNumber;
    inputWaiting: z.ZodBoolean;
}, z.core.$strict>>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## helloSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `helloSchema`。`helloSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const helloSchema: z.ZodObject<{
    protocol: z.ZodLiteral<2>;
    hash: z.ZodString;
    kind: z.ZodEnum<{
        executable: "executable";
        "node-script": "node-script";
    }>;
    platform: z.ZodEnum<{
        linux: "linux";
        darwin: "darwin";
    }>;
    nodeVersion: z.ZodString;
    executable: z.ZodString;
    root: z.ZodString;
    workspace: z.ZodString;
    bootstrapHash: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## infoSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `infoSchema`。`infoSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const infoSchema: z.ZodObject<{
    version: z.ZodString;
    type: z.ZodEnum<{
        file: "file";
        directory: "directory";
        other: "other";
    }>;
    size: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## intentSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `intentSchema`。`intentSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const intentSchema: z.ZodDiscriminatedUnion<[
    z.ZodObject<{
        kind: z.ZodLiteral<"createIfAbsent">;
    }, z.core.$strict>,
    z.ZodObject<{
        kind: z.ZodLiteral<"replaceIfVersion">;
        version: z.ZodString;
    }, z.core.$strict>
], "kind">;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## outcomeSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `outcomeSchema`。`outcomeSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const outcomeSchema: z.ZodObject<{
    exitCode: z.ZodNullable<z.ZodNumber>;
    signal: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## outputSnapshotFrameLimit 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `outputSnapshotFrameLimit`。`outputSnapshotFrameLimit` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare function outputSnapshotFrameLimit(maxBytes: number): number;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## outputSnapshotSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `outputSnapshotSchema`。`outputSnapshotSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const outputSnapshotSchema: z.ZodObject<{
    tail: z.ZodBase64;
    totalBytes: z.ZodNumber;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## pathInfoSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `pathInfoSchema`。`pathInfoSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const pathInfoSchema: z.ZodObject<{
    version: z.ZodString;
    size: z.ZodOptional<z.ZodNumber>;
    type: z.ZodEnum<{
        file: "file";
        directory: "directory";
        other: "other";
        symlink: "symlink";
    }>;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## policySchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `policySchema`。`policySchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const policySchema: z.ZodObject<{
    mode: z.ZodEnum<{
        "read-only": "read-only";
        "workspace-write": "workspace-write";
        "danger-full-access": "danger-full-access";
    }>;
    workspaceRoot: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## preparedSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `preparedSchema`。`preparedSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const preparedSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodUUID, z.ZodTransform<SshProcessId, string>>;
    streams: z.ZodRecord<z.ZodEnum<{
        stdin: "stdin";
        stdout: "stdout";
        stderr: "stderr";
        control: "control";
        terminal: "terminal";
    }> & z.core.$partial, z.ZodObject<{
        path: z.ZodString;
        capability: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## processIdSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `processIdSchema`。`processIdSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const processIdSchema: z.ZodPipe<z.ZodUUID, z.ZodTransform<SshProcessId, string>>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## remotePath 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `remotePath`。`remotePath` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const remotePath: z.ZodString;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## spawnSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `spawnSchema`。`spawnSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const spawnSchema: z.ZodObject<{
    argv: z.ZodArray<z.ZodString>;
    cwd: z.ZodString;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    graceMs: z.ZodNumber;
    stdio: z.ZodOptional<z.ZodObject<{
        stdin: z.ZodUnion<readonly [
            z.ZodLiteral<"ignore">,
            z.ZodLiteral<"pipe">,
            z.ZodObject<{
                data: z.ZodString;
            }, z.core.$strict>
        ]>;
        stdout: z.ZodUnion<readonly [
            z.ZodLiteral<"pipe">,
            z.ZodLiteral<"inherit">,
            z.ZodObject<{
                maxBytes: z.ZodNumber;
                spill: z.ZodOptional<z.ZodObject<{
                    maxBytes: z.ZodNumber;
                }, z.core.$strict>>;
            }, z.core.$strict>
        ]>;
        stderr: z.ZodUnion<readonly [
            z.ZodLiteral<"pipe">,
            z.ZodLiteral<"inherit">,
            z.ZodObject<{
                maxBytes: z.ZodNumber;
                spill: z.ZodOptional<z.ZodObject<{
                    maxBytes: z.ZodNumber;
                }, z.core.$strict>>;
            }, z.core.$strict>
        ]>;
        control: z.ZodOptional<z.ZodLiteral<"pipe">>;
    }, z.core.$strict>>;
    terminal: z.ZodOptional<z.ZodObject<{
        terminalType: z.ZodString;
        rows: z.ZodNumber;
        cols: z.ZodNumber;
        shellActivity: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## streamEndpointSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `streamEndpointSchema`。`streamEndpointSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const streamEndpointSchema: z.ZodObject<{
    path: z.ZodString;
    capability: z.ZodString;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## targetSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `targetSchema`。`targetSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const targetSchema: z.ZodObject<{
    targetKey: z.ZodString;
    displayPath: z.ZodString;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## terminalActivitySchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `terminalActivitySchema`。`terminalActivitySchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const terminalActivitySchema: z.ZodObject<{
    state: z.ZodEnum<{
        unknown: "unknown";
        idle: "idle";
        busy: "busy";
    }>;
    revision: z.ZodNumber;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## textStreamIdSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `textStreamIdSchema`。`textStreamIdSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const textStreamIdSchema: z.ZodPipe<z.ZodUUID, z.ZodTransform<SshTextStreamId, string>>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。

## writeResultSchema 契约

从 `@deepseek-ai/dsh-ssh/schemas` 导入 `writeResultSchema`。`writeResultSchema` 是远程执行世界与配套后端的公开类型或辅助函数；输入输出与合法分支以下面的声明为准。

```text
export declare const writeResultSchema: z.ZodObject<{
    operation: z.ZodEnum<{
        create: "create";
        update: "update";
    }>;
    version: z.ZodString;
    before: z.ZodNullable<z.ZodString>;
    after: z.ZodString;
}, z.core.$strict>;
```

本对象的注册/资源责任由[远程执行世界与配套后端](api-runtime-ssh-overview.md)说明；纯数据与品牌类型本身不分配资源。使用本对象完成任务后，按[操作步骤](../how-to/how-to-runtime-ssh.md)核对成功、拒绝与卸载结果。
