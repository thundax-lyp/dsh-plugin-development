# 凭证引用、记录与本地 Provider

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1` 的 Host 插件使用 `@deepseek-ai/dsh-credentials` 根导出的 `credentialRef`、`credentialKey` 和 `CredentialProvider`；`./types` 是无 Host 运行时代码的类型入口。`@deepseek-ai/dsh-credentials-local` 根导出 `LocalCredentialProvider`，在 base bundle 挂载为 `ctx.credentials` 的实际 Provider。自定义 Profile 必须自行装载 Provider；消费插件声明 `inject = ['credentials']`。此处的凭证是插件调用外部服务的秘密，不是工具执行权限。需要与人交互取得 grant 时看 [授权流程](api-authorization.md)，在插件 Config 中暴露可编辑字段时看 [设置表单](api-settings.md)。

## 契约与运行语义

引用空间：`credentialRef(value: string): CredentialRef` 只接受 `/^[A-Za-z_][A-Za-z0-9_]*$/`；`isCredentialRefName(value): boolean` 可先判定外部输入。Config 和 `cordis.yml` 保存引用名称，不保存秘密值。`ctx.credentials.resolve(ref)` 每次操作读取现值，返回 `{ value, source } | undefined`；空值视为未配置，消费者不可跨操作缓存。`describe(ref)` 给 UI `{ configured, source?, writable }`，从不带值。`set(ref, value)` 写入非空值，`unset(ref)` 删除；只读更高优先级来源遮蔽时拒绝写入。本地 Provider 的来源顺序为进程环境、管理文件、项目 `.env`、用户 `.env`；其 `Config` 的 `path?` 指定文档，默认 `$DSH_HOME/.credentials.yaml`，`watch?` 默认 true，`debounceMs?` 默认 100。

记录空间：`credentialKey(scope, id)` 以两个小写连字符标识段构成 `<scope>/<id>`；`parseCredentialKey` 验证已保存的地址，`credentialKeyScope`、`credentialKeyId` 取两段，`isCredentialKeySegment` 判断能否构造。`scope` 必须是记录拥有插件的注册名。`readRecord(key)` 返回 `CredentialRecord | undefined`，`describeRecord(key)` 返回不含秘密的配置状态，`listRecords()` 只列键和种类。`modifyRecord(key, mutate)` 是唯一记录写入路径；回调返回 `undefined` 不改变记录，返回记录则在独占区写入。`deleteRecord(key)` 移除记录。记录值没有引用的环境层叠。

插件需要在真实操作入口中解析凭证；可独立装载和调用的消费包示例仍需补写并编译，这一稿不能据此冻结。秘密不得写入 Session、模型工具结果、Client wire 或日志。

## 对象类型与成员

| 对象/成员                                                  | 公开形状与约束                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CredentialProvider`                                       | `resolve`、`describe`、`set`、`unset` 操作引用；`readRecord`、`describeRecord`、`listRecords`、`modifyRecord`、`deleteRecord` 操作记录；接口由 Host Service 实现，消费者不能以文件路径替代。                                                                     |
| `credentialKey` / `credentialKeyId` / `credentialKeyScope` | 构造记录 key 或拆出两个段；`parseCredentialKey`、`isCredentialKeySegment` 验证外部字符串。                                                                                                                                                                       |
| `credentialRef` / `isCredentialRefName`                    | 前者构造且验证环境式引用名，后者仅判断；不解析秘密值。                                                                                                                                                                                                           |
| `CredentialRef`                                            | 名义字符串；由 `credentialRef` 验证并构造；不可和 `CredentialKey` 混用。                                                                                                                                                                                         |
| `CredentialKey`                                            | 名义字符串 `<scope>/<id>`；两个段匹配 `/^[a-z][a-z0-9-]*$/`。                                                                                                                                                                                                    |
| `ResolvedCredential`                                       | 必需 `value: string`、`source: string`；Host 私有值。                                                                                                                                                                                                            |
| `CredentialInfo`                                           | 必需 `configured: boolean`、`writable: boolean`，可选 `source?: string`；UI 安全。                                                                                                                                                                               |
| `CredentialRecord`                                         | `ApiKeyRecord` 或 `GrantRecord`；前者 `kind: 'api-key'` 且 `key?: string`、`env?: Readonly<Record<string,string>>`，后者 `kind: 'grant'` 且 `payload: unknown`（必须可 JSON 往返，由 owner 解释）。空字段的 api-key 记录表示已确认环境认证，与不存在的记录不同。 |
| `CredentialRecordInfo`                                     | 必需 `configured: boolean`、`writable: boolean`，可选 `kind?: 'api-key' \| 'grant'`。                                                                                                                                                                            |
| `CredentialRecordEntry`                                    | `key: CredentialKey`、`kind: CredentialRecord['kind']`；不含值。                                                                                                                                                                                                 |

## 生命周期与状态

Host Provider 的服务生命周期随挂载 fiber 结束。本地 Provider 在初始化时读文档并可监听外部编辑；处置时拒绝新工作、排空排队操作并关闭 watcher。`credentials/reference-updated(ref)` 和 `credentials/record-updated(key)` 在 Provider 管理的提交后通知；进程环境变量变化没有通知。监听器可刷新配置状态，但消费者仍应在每次操作前重新 `resolve`。监听器失败通常记录日志，不逆转已提交修改；同步 `INVARIANT` 异常是例外。

## 失败、权限与边界

本地凭证文件在 POSIX 上若有 group/other 权限位，读取前拒绝；写入使用受控文件权限。文件系统故障、写锁等待、只读来源遮蔽、无效键名或空 `set` 值均不能当作“未配置”。`modifyRecord` 的回调持有独占区，避免在无界操作中占锁。记录不自动识别卸载插件留下的孤儿；UI 需把 `listRecords` 与插件注册表连接。授权流程的取消不等于服务端撤销。

## 验证

可用目标版本 `packages/credentials/credentials/tests/credentials.spec.ts`、`packages/credentials/credentials-local/tests/{local,records,watcher,drain}.spec.ts` 对照成员、层叠、提交事件和资源关闭。独立消费包须编译 Host 声明、确认 base 或自定义 Profile 装载 Provider，并运行配置、轮换、卸载路径；这些端到端步骤尚未运行。
