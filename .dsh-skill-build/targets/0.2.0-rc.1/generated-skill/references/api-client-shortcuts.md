# Client keyboard commands

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1` 的 Web/桌面 Client。`@deepseek-ai/dsh-client-shortcuts/client` 安装窗口级 `ctx.shortcuts`，插件可注册可编辑命令或固定按键动作。Host 根导出只把验证后的键盘时序配置注入产品页面；要贡献快捷命令，必须装载包的 Client 半边。Web Profile 已装载 shortcuts 服务与 reference UI；外部包的完整构建、安装、触发和卸载路径见 [增加 Client 快捷命令](how-to-add-client-shortcut.md)。

## 最小完整 Client 示例

以下命令只在 Web macOS 的页面区域默认绑定 `⌘⌥⇧G`。它把一次触发写到当前 document 的测试标记，不代表 Session 或模型可见事实；真实产品的 `run` 应调用拥有该操作的 Client 服务，若结果需被模型或恢复读取，再由业务拥有者写入 Session。此 TS 示例已用 rc.1 发布声明独立编译。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { ShortcutCommandId } from '@deepseek-ai/dsh-client-shortcuts/client'
import type {} from '@deepseek-ai/dsh-client-shortcuts/client'

export const inject = ['shortcuts']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.shortcuts.register({
    id: 'example.markPage' as ShortcutCommandId,
    label: () => 'Mark this page',
    aliases: ['mark page'],
    defaults: { 'web:macos': { code: 'KeyG', modifiers: ['primary', 'alt', 'shift'] } },
    regions: ['page'],
    modals: [],
    resolve: () => ({
      status: 'handled',
      run: () => {
        document.documentElement.dataset.exampleShortcut = 'invoked'
      },
    }),
  }), 'example: shortcut')
}
```

`Shortcuts.register()` 返回幂等 disposer，但**不自行建立调用插件的 effect**。插件必须像上例用 `ctx.effect` 归属注册，或者在已有 effect 的清理函数里调用 disposer。命令标识应稳定且避免与其他 feature 相撞；`ShortcutCommandId` 是品牌类型，字面量在边界作显式转换。`resolve(context)` 同步决定 `pass`、`blocked` 或 `{status:'handled',run}`，并捕获本次目标；键盘 dispatcher 先消费已处理的事件，再调用 `run`。异步业务失败须由 `run` 的拥有者处理，不能指望 dispatcher 回滚按键消费。

## 公开对象与成员

`Shortcuts` 是 `ctx.shortcuts` 的公开服务类型；下表逐项给出插件可用的注册、目录、编辑和平台成员。

| 对象/成员                                         | rc.1 公开契约                                                                   | 插件任务中的语义                                                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `ShortcutCommand`                                 | `id`, `label()`, `aliases`, `defaults`, `regions`, `modals`, `resolve(context)` | `defaults` 按 `web                                                                                                           | desktop`和`macos               | windows                                                                             | linux` 的 Profile 明列；省略某 Profile 即默认未绑定。`label` 可读当前 locale。                                  |
| `ShortcutCommandId`                               | 品牌字符串 ID；Client 与 `./protocol` 两个公开入口使用同一标识类型              | 为命令选稳定且唯一的 ID，在注册和跨端配置引用时保持一致。                                                                    |
| `ShortcutContext`                                 | `source?`, `region: 'page'                                                      | 'editable'                                                                                                                   | 'terminal'`, `modal`, `target` | DOM adapter 根据实际焦点和顶层 modal 生成；`resolve` 应以它确定本次目标或拒绝原因。 |
| `ShortcutCommand.resolve` 的返回值                | `pass`、`blocked` 加 `reason`、`handled` 加同步 `run()`                         | `pass` 交给其他/本地输入；`blocked` 消费按键并报告阻止；`handled` 消费并在非 repeat 时运行。                                 |
| `ShortcutBinding`、`ShortcutProfile`              | 物理 `code`, `secondCode?`, `modifiers[]`; `web                                 | desktop:macos                                                                                                                | windows                        | linux`                                                                              | `primary` 在 macOS 归一为 Meta，其他平台为 Control；Web 的组合受浏览器/系统保留规则约束，不能假定任意键会送达。 |
| `ctx.shortcuts.register`                          | `(ShortcutCommand) => () => void`                                               | 重复 ID、冲突默认组合、保留或不支持的默认组合会抛错；返回的 disposer 移除命令和 catalog 行，调用者负责 fiber 所有权。        |
| `catalog`, `config`, `fixedCatalog`               | `ObservableSnapshot` 的 `getSnapshot()`/`subscribe()`                           | catalog 是当前有效的标签、键帽、冲突和 issue；config 是接受的偏好与 revision，不是命令定义的所有者。                         |
| `describeBinding(binding)`                        | 返回归一 binding、键帽、issue、conflicts                                        | 编辑器提交前预览本机组合；非法 code 抛错。                                                                                   |
| `edit(edit, revision)`                            | `set`、`reset`、`reset-all`，返回分类保存结果                                   | 仅在用户确认后按接受的 revision 保存偏好；失败保留已接受状态与调用者草稿。普通 feature 不应静默改写用户快捷键。              |
| `registerFixed`, `observeFixedInput`              | 固定动作注册与局部输入观察，均返回 disposer                                     | 固定组合占用按键并出现在只读 catalog；监听器在局部控件仲裁后收到 keydown/reset，应尊重 composing、消费状态，均由拥有者清理。 |
| `recording(active)`, `closeWindow()`              | Desktop/native 桥能力                                                           | Web 的 recording adapter 可正常完成而无 native 菜单；`closeWindow()` 在非 Desktop 拒绝。                                     |
| `Shortcuts.runtime`, `platform`, `stopSequenceMs` | 只读的当前 `web                                                                 | desktop`、`macos                                                                                                             | windows                        | linux` 与二段序列等待毫秒数                                                         | 按当前运行环境解释 catalog 与默认绑定；这些值不授权修改用户偏好。                                               |

Web 的偏好由当前 origin 的 `localStorage` 键 `dsh.keybindings.v1` 管理，并接收同 origin storage 更新；Desktop 用 native bridge，不退回浏览器存储。默认组合只是初值：用户可重绑或解除绑定，应用应以 `catalog` 有效值显示键帽。注册期检查每个声明的运行时/平台默认组合，重复和冲突按键会抛错。Web macOS/Windows 对可送达组合有专门白名单及三/四修饰键例外；Web Linux 更窄。`regions` 限制页面、可编辑区和终端的局部路由；modal 名称也限制普通 Web/Linux 输入。桌面 macOS/Windows 的 native 组合优先权不同，不能从 Web smoke 推断 Desktop 行为。

## 生命周期、失败与验证边界

`ctx.shortcuts` 服务持有一个窗口键盘 adapter；插件只贡献命令。若贡献插件卸载，调用其 disposer 才能移除 catalog 与分发表；漏清理会留下指向已卸载服务的回调。固定动作和观察监听器也须归 fiber。命令 `run` 是业务动作，不能把 DOM 或 React 局部标记冒充模型可见事实；需要持久结果时写入 Session 日志。

独立 Client TypeScript 编译、lazy-CJS 包打包和隔离 Web Profile + Chrome 已验证：Web macOS 页面区 `⌘⌥⇧G` 触发一次；同组合在编辑区不触发；在线卸载执行 disposer，之后再按键未触发。未验证用户重绑、持久偏好恢复、冲突 UI、固定按键、Desktop native 菜单和其他平台键盘送达。
