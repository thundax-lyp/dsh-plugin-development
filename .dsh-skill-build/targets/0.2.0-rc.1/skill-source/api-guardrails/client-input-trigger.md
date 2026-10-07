# Client 输入触发源

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1` Web Client 的 `/` 与 `@` 输入触发管线。`@deepseek-ai/dsh-client-ui-input-trigger/client` 提供 `ctx.inputTriggers.registerSource(source)`；Conversation 输入框负责检测、候选菜单和 pick 执行。插件只注册来源，不要覆盖 `conversation.input.overlay` 的菜单占位。完整独立包与实际浏览器任务见 [增加斜杠候选](how-to-add-input-trigger.md)。

## 最小完整 Client 示例

```ts
import type { Context } from '@deepseek-ai/cordis'
import type { InputTriggerSource } from '@deepseek-ai/dsh-client-ui-input-trigger/client'
import type {} from '@deepseek-ai/dsh-client-ui-input-trigger/client'

const source: InputTriggerSource = {
  trigger: '/',
  name: 'example',
  order: 100,
  async candidates(_session, req) {
    if (req.signal.aborted || !'greet'.includes(req.query.toLowerCase())) return []
    return [{ name: 'greet', label: 'Greeting', description: 'Insert a greeting into the draft' }]
  },
  onPick() {
    return { text: 'Hello from example ' }
  },
}

export const inject = ['inputTriggers']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.inputTriggers.registerSource(source), 'example: slash source')
}
```

这段只替换用户当前草稿，不会自动发送。用户若发送草稿，模型输入由正常 Session 路径记录。若候选来自远程服务，应在 `req.signal` 取消时中止请求；插件卸载时撤销来源并清理自己持有的缓存、订阅和请求。

## 公开对象与成员

`InputTriggerController` 是 `ctx.inputTriggers.sessionOf(actx)` 返回的 Session 局部控制器；来源插件通常只需 `registerSource`，不直接操纵控制器。它的 `lexicon` 是当前文本引用名的快照源，`pick(source,index,action?)` 将菜单项交给来源并执行 outcome，`openReference(source,reference)` 将引用预览请求交给来源，返回是否被接受。

| 对象/成员                                                                            | 公开契约                                                                                                                        | 插件任务中的语义                                                                                                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ctx.inputTriggers.registerSource`                                                   | `(InputTriggerSource) => disposer`                                                                                              | `(trigger,name)` 唯一；重复抛错。迟到注册会通知现有 Session controller；卸载撤销菜单组。                                                                                  |
| `ctx.inputTriggers.sessionOf(actx)`                                                  | 返回 Session scope 拥有的 `InputTriggerController`                                                                              | 仅给有效、保留的 Session scope；普通来源通常只用 `registerSource`，无需直接操作 controller。                                                                              |
| `InputTriggerService` / `InputTriggerServiceContract`                                | `registerSource(source)`、`sessionOf(actx)`                                                                                     | 前者是根服务的来源注册，后者取得 Session 局部控制器；同一服务的两种类型视图，不是两套独立 registry。                                                                      |
| `InputTriggerController.lexicon`, `pick`, `openReference`                            | `lexicon` 为触发词快照；`pick(source,index,action?)` 执行当前菜单候选；`openReference(source,reference)` 返回是否有来源接受预览 | 控制器按 Session scope 存活，调用者须确保目标 Session 有效；自有来源的常规注册不需要手工调用这些成员。                                                                    |
| `InputTriggerController.menu`, `launcher`, `headers`                                 | 三个 `SnapshotStore`，分别保存菜单状态、程序化打开的来源名或 `null`、按来源名分组的面包屑                                       | 自定义 Session 输入外壳可订阅这些快照；不要另建一份权威菜单状态。                                                                                                         |
| `InputTriggerController.toggleSource(source,hit)`                                    | 切换一个已注册来源的菜单；`hit` 是带草稿 revision 的合成 `TriggerHit`                                                           | 仅供自定义 launcher 使用；必须从当前输入状态构造 span，否则 pick 的 CAS 可能失败。                                                                                        |
| `InputTriggerController.pickCrumb(source,index)`, `hover(source,index)`, `dismiss()` | 分别对面包屑 drill、同步指针高亮、关闭并记住当前命中                                                                            | 仅供自定义菜单视图；内置 `MenuView` 已处理这些手势，重复接管会产生冲突。                                                                                                  |
| `InputTriggerSource.trigger`, `name`, `order`, `showGroupTitle`                      | trigger 仅 `'/' \| '@'`；name 是组 ID；order 默认 0；标题默认显示                                                               | 影响候选来源身份、分组顺序与菜单呈现。                                                                                                                                    |
| `candidates(session, req)`                                                           | Promise 候选数组；req 有 `query`, `position`, `quoted?`, `drilled`, `signal`                                                    | 来源自行筛选；每次输入可启动新查询。旧查询被 abort，迟到结果不进入菜单。错误会记录日志并移除该组。                                                                        |
| `InputTriggerCandidate`                                                              | `name` 必填；`label`, `description`, `icon`, `hint`, `section`, `value`, `drill` 可选                                           | 纯显示和来源自有 payload；候选本身不定义点击行为。                                                                                                                        |
| `onPick(pick)`                                                                       | 同步返回 `PickOutcome`                                                                                                          | `pick` 带候选、Session ID 投影、触发位置、`via`、`action` 和 token span。返回 `{text,continue?}`、`{claim}`、`{insert}`、`'handled'` 或 `undefined`。来源按自身业务决定。 |
| `matchSpace`, `matchEnter`                                                           | 可选的 leading token 裁决                                                                                                       | 实现即加入争用。Space 必须同步；Enter 可异步并有 signal/envelope。未定义者让默认提交路径继续。                                                                            |
| `warm`, `lexicon`, `subscribeLexicon`                                                | 可选预热与纯同步词表                                                                                                            | Session scope 初生时预热；词表用于文本引用装饰，订阅返回退订。渲染路径不能发请求。                                                                                        |
| `header`, `openReference`, `codec`                                                   | 可选面包屑、引用预览、结构化引用序列化                                                                                          | 只有 drill 或结构化引用来源需要；输出 `{insert}` 时须有对应 codec，模型序列化错误会阻止提交。                                                                             |

`PickOutcome` 由管线通过 Session scope 的输入事件执行。`{text}` 是草稿文本替换；`{claim}` 进入命令态；`{insert}` 放入结构化引用。菜单候选与草稿都不是模型已见事实，不能仅凭它们断言已提交。

控制器的 `track`、`arbitrate`、`onSpace`、`adjudicate`、`serializeReference` 属于 Conversation 输入与提交管线；`sourceAdded`、`sourceRemoved`、`refreshOpenMenu` 和 `dispose` 由根触发服务管理。来源插件调用 `registerSource`，不直接驱动这些内部步骤或销毁 Session 控制器。

## 失败、取消、清理与验证边界

同 `(trigger,name)` 冲突会抛错；不同 trigger 可共用 name。菜单 fetch 的 `signal` 因查询变化、菜单关闭或 Session scope 消亡被 abort；异步来源必须协同取消，并检查迟到结果。`registerSource` disposer 应由插件 fiber 拥有；若来源保有跨 Session 状态，卸载时还要清理自身状态。

独立 Client TS 编译、打包及隔离 Web Profile + Chrome 已验证输入 `/gr` 出现 “Greeting greet”，点击后草稿成为 `Hello from example `，在线卸载后重新输入 `/gr` 不再有该候选。未发送消息，未验证 `@`、远程候选、结构化引用、Enter/Space 裁决或 Desktop。
