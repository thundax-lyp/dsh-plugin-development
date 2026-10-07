# 为应用增加一个 Remote 方法

## 结果与前提

结果是：已装载的 Host Service 对外提供一个严格生成的 Remote 方法，应用自己的 Client assembly 选择它，浏览器插件通过 `ctx.remote.<namespace>` 得到 `RemoteResult` 并处理错误。此任务需要修改应用构建与 Client assembly；把一个 Host 包单独安装到现有 DSH Web Profile 不会自动为浏览器增加方法。基础类型、调用及取消边界先读 [Remote API](api-remote-api.md)，Profile 装载层见 [Bundle 与 Profile](api-profile-bundle.md)。

## 实现步骤

1. **声明 Host owner 和公开边界类型。** 在一个可由 Loader 挂载的 Host 包中导出 `TypertRemoteService` 子类。用 `super(ctx, serviceKey, { namespace })` 固定 Cordis key 与 wire 名；在真正需要给 Client 调用的公开实例方法上标 `@Remote`。方法参数选 JSON 可表示类型，避免 optional/default/rest/解构；若需取消，把 `AbortSignal` 放在末尾。Remote 边界的命名类型必须来自包的公开非根类型子路径，例如 `./types`；仅把 `NoteRow` 从包根导出虽然能通过普通 TypeScript 编译，却会被目标生成器拒绝。业务方法仍由 owner 授权和清理自己的资源，不让 Gateway 代替业务权限检查。

    `src/types.ts`：

    ```ts
    export interface NoteRow {
      readonly id: string
      readonly title: string
    }
    ```

    `src/index.ts`：

    ```ts
    import type { Context } from '@deepseek-ai/cordis'
    import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
    import type { NoteRow } from './types.ts'

    export type { NoteRow } from './types.ts'

    declare module '@deepseek-ai/cordis' {
      interface Context {
        notesController: NotesController
      }
    }

    export class NotesController extends TypertRemoteService {
      constructor(ctx: Context) {
        super(ctx, 'notesController', { namespace: 'notes' })
      }

      @Remote('list')
      async list(): Promise<NoteRow[]> {
        return [{ id: 'n-1', title: 'draft' }]
      }
    }

    export const name = 'notes-controller'
    export function apply(ctx: Context): void {
      ctx.plugin(NotesController)
    }
    ```

2. **声明失败。** 生产端在 `@deepseek-ai/dsh-typert-protocol` 的 `RemoteErrorDetailsMap` 上做声明合并，稳定 code 采用 `<domain>/<reason>`。失败点抛 `new RemoteError(code, message, details)`；将不可控底层异常转成领域 code 时保留 `cause` 供同进程诊断。客户端按 `code` 分支，不按 class identity 或消息文本分支。
3. **生成包出口。** Host 包的 `package.json` 声明 `./types`、`./typert` 和 `./remote` 导出，并把两个生成出口的 JS/声明纳入 `files`。下面是 `packages/<owner>/package.json` 的相关部分；`./types` 指向包自身 TypeScript 构建产物。这里的 `pnpm run build:lib` 适用于把包加入目标仓库 `packages/`，并加入 Host 聚合 tsconfig 的工程；它先构建 Host 类型、运行 Typert，再构建 Client。外部独立包不能仅靠安装该包就被目标仓库的 workspace 生成器发现，须自行提供等价的 Host/Client 工程和生成器调用。不要手写生成文件。构建后用 `ls lib/typert.*` 检查产物，生成错误须回到源声明解决。

    包出口至少包含：

    ```json
    {
      "exports": {
        ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
        "./types": { "types": "./lib/types/types.d.ts", "default": "./lib/types/types.js" },
        "./typert": { "types": "./lib/typert.host.d.ts", "default": "./lib/typert.host.js" },
        "./remote": { "types": "./lib/typert.remote-client.d.ts", "default": "./lib/typert.remote-client.js" }
      },
      "files": [
        "lib/index.js", "lib/types/**/*.js", "lib/types/**/*.d.ts", "lib/typert.host.js", "lib/typert.host.d.ts",
        "lib/typert.remote-client.js", "lib/typert.remote-client.d.ts"
      ]
    }
    ```

4. **装载与选择。** 将 Host 包加到实际 Profile 的 bundle/patch 并确认目标 Service fiber 激活。应用 owner 在自己的 Client Remote assembly 中以运行时 value import 引入 `<pkg>/remote`，用 `ctx.remote.$mount()` 挂载它，并把生成的 declaration merge 暴露给消费项目。目标 Web 应用的现有 assembly 是 `@deepseek-ai/dsh-api-remotes/client`；它只选择源码里显式列出的贡献，不因 Profile 包出现而动态扩展。

    Client assembly 的最小新增部分是 `import notesRemote from '<pkg>/remote'`、`export type {} from '<pkg>/remote'`，并在其 `apply(ctx)` 的选中贡献数组中加入 `notesRemote`。每次 `await ctx.remote.$mount(notesRemote)` 返回异步 disposer；失败回滚和卸载按逆序 await。目标应用已有的 `api-remotes` 实现展示这一资源所有权，不能只添加 type import。若不修改目标内置 assembly，应用可另外安装自己的 Client assembly，但仍须由 Web Client 模块路径实际加载该 assembly、注入 `remote` 并将其类型声明带进消费编译面。仅有一个贡献时，该 assembly 的 Client 源文件可写为：

    ```ts
    import type { Context } from '@deepseek-ai/cordis'
    import type {} from '@deepseek-ai/dsh-api-gateway/client'
    import notesRemote from '@fixture/notes-controller/remote'
    export type {} from '@fixture/notes-controller/remote'

    export const inject = ['remote']

    export async function apply(ctx: Context): Promise<() => Promise<void>> {
      const dispose = await ctx.remote.$mount(notesRemote)
      return async () => { await dispose() }
    }
    ```

    上面自有 assembly 文件命名为 `client-assembly.ts`，`@fixture/notes-controller` 是示例包名，换成实际 Host owner 包名。此 Client assembly 包也要发布 `./client`，声明 `dsh.client: { platform: 'web', inject: ['@deepseek-ai/dsh-api-gateway'], immediately: true }`，构建成目标模块登记格式，并由应用的 Web 模块装配加载；目标 `@deepseek-ai/dsh-api-remotes` 正是这样声明装载顺序的。`./remote` 是生成贡献，不是浏览器插件本体。安装一个自有 assembly 时，消费插件的编译面要导入该 assembly 的 `./client` 类型，而不是只导入目标内置 `api-remotes/client`。

5. **调用与释放。** 消费 Client 插件声明 `inject: ['remote', 'remote.<namespace>']`，等待 `ctx.remote.<namespace>.<method>(...)`，检查 `result.ok`。需要按关闭/卸载取消时，给方法传拥有者的 `AbortSignal`，并在 fiber 的 effect disposer 中 abort。卸载 Host Service、Client assembly 或调用插件后分别观察方法撤销、在途调用中止和调用方资源清理。

    ```ts
    import type { Context } from '@deepseek-ai/cordis'
    import type {} from './client-assembly.ts'

    export const inject = ['remote', 'remote.notes']

    export async function listNoteTitles(ctx: Context): Promise<string[]> {
      const result = await ctx.remote.notes.list()
      if (!result.ok) throw result.error
      return result.value.map(note => note.title)
    }
    ```

    上面相对导入适用于调用插件和自有 assembly 在同一 Client 工程的情形；若 assembly 是单独发布的包，改为导入该包公开的 `./client` 类型入口。只有直接修改目标内置 `api-remotes` assembly 时才导入 `@deepseek-ai/dsh-api-remotes/client`。

## 验证与完成判据

目标包构建后确认两个生成出口与声明均存在；Host 和 Client 分开 typecheck，不能用 Host SRC fallback 代替。Host 测试直接调用业务 Service 的成功、领域错误和取消；Client 测试以真实生成贡献或目标测试 runtime 验证 `RemoteResult` 的成功、按 code 失败及卸载后的句柄行为。实际启动应用后，再观察 `/api/<namespace>/<method>` 经 Connection 和 Gateway 到达当前 Service，并在浏览器界面看到相同结果。只有 wire 成功而调用插件没有正确处理失败，任务仍未完成。

已用目标版本发布的 Cordis/协议声明编译修正后的 Host 骨架；在隔离 workspace 中，目标版本生成器发现包并生成 `typert.host` 与 `typert.remote-client`，产物可作为模块导入且含 `notes/list` descriptor。单贡献 Client assembly 与调用片段也通过目标版本发布声明的 TypeScript 检查。隔离生成工程为识别协议 decorator 使用了目标生成器测试夹具的类型 shim，故这只验证生成链和示例形状，不等于目标仓库完整构建；真实 `ctx.remote.$mount`、`/api` 调用及浏览器插件仍未运行，这些是冻结前必须补上的验证。
