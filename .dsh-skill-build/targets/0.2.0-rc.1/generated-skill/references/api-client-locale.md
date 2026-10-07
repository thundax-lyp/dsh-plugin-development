# Client 本地化字典与语言注册

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1` 的 Web Client。`@deepseek-ai/dsh-client-locale/client` 提供 `ctx.locale` 字典、语言目录和偏好服务。外部插件本地化自己拥有的 UI 时，声明独立 namespace，在同一 effect 中注册 `zh`/`en` 字典；slot 注册写 `locale`，组件获得响应式 `t`。完整独立包、Web Profile 切换语言和卸载步骤见 [本地化自有 Client 面板](how-to-localize-client-panel.md)。

## 最小完整 Client 示例

此例只展示 Client 半边；包的 Host 根、manifest 和 Loader 输出见 HOW-TO。

```tsx
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'example.panel': 'title' | 'body'
  }
}

const NS = 'example.panel'
const PANEL_ID = 'example.locale.panel' as MainPanelId
const zh = { title: '示例语言面板', body: '你好，世界' }
const en = { title: 'Example language panel', body: 'Hello, world' }

function Page({ t }: PropsRuntime<'main'> & PropsLocale<typeof NS>) {
  return <div>{t('body')}</div>
}

function Icon({ size }: PropsRuntime<'sidebar.panellist'>) {
  return <span aria-hidden="true" style={{ fontSize: size / 2 }}>文</span>
}

export const inject = ['locale', 'slots', 'layout']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'example: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main', key: PANEL_ID, locale: NS,
  }, Page))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist', id: PANEL_ID, order: 50, label: () => t('title'), locale: NS,
  }, Icon))
}
```

`PropsLocale<typeof NS>.t` 由 renderer 注入并订阅字典修订；`ctx.locale.bind(NS)` 是稳定函数引用，用于 sidebar 元数据 `label()`。字典、页面和图标都随插件 fiber 清理。这个静态 UI 没有异步资源，也没有模型可见事实；业务事实应另走 Session 日志。

## 公开对象与成员

`LocaleRuntime` 是 `ctx.locale` 的公开服务类型。`LocaleSnapshot` 是 `getLocale()`、`getSnapshot()` 和 `locale/change` 共用的不可变状态；`LanguageRegistration` 是 `addLanguage` 的输入，`LocaleDefinition` 是目录中的标准化项目，`LocaleDict` 是单语言字典。`Translate` 与 `TranslateNS<N>` 是 `bind()` 返回的函数类型。

| 对象/成员                                 | 公开契约                                                              | 插件任务中的语义                                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `LocaleNamespaceMap` 与 `LocaleDictOf<N>` | namespace 与 key union 可 declaration merge；类型化字典必须覆盖这些键 | 自有 UI 选择独立 namespace，避免与内建字典冲突；`zh`、`en` 两份键集合一致。                            |
| `ctx.locale.register(ns, {zh,en})`        | 返回幂等 disposer；重复 `(ns,locale)` 抛错                            | 类型化双语注册，一次拥有两份字典；注册与撤销均提升 snapshot revision。                                 |
| `ctx.locale.register(ns, locale, dict)`   | 返回 disposer；语言 ID 需是 BCP 47 风格                               | 单语言/动态 namespace 形式，适合语言包；需自行保证 fallback 与键覆盖。                                 |
| `ctx.locale.bind(ns)`                     | 返回稳定的 `TranslateNS<N>` 或动态 `Translate`                        | 每次调用读取当前语言；也可交给 slot metadata 的 `label()`。                                            |
| `PropsLocale<N>.t`                        | `locale: N` 的 slot 组件标准属性                                      | renderer 订阅 LocaleFace，使已挂载组件在语言或字典 revision 变化后重绘。                               |
| `ctx.locale.addLanguage(input)`           | `{id,label,fallback}`；返回幂等 disposer                              | 扩充设置中的可选语言；fallback 必须已注册且终止于 English；注销当前语言会回退，但不清空存储的偏好 ID。 |
| `ctx.locale.setLocale(id)`                | 仅接受已注册语言；未知 ID 抛错                                        | 写入显式偏好；即使当前画面已是同语言，仍保存显式选择。                                                 |
| `getLocale` / `getSnapshot` / `subscribe` | 不可变 `{active,locales,revision}`，订阅返回退订                      | 读当前值并持续观察；字典注册会增加 revision。                                                          |
| `resolveText(text)`                       | 字符串原样返回；语言 map 按 fallback 解析                             | 适合不在字典 namespace 中的短文本。                                                                    |
| `locale/change`                           | 活跃语言切换事件                                                      | 仅语言变化时发出；字典注册只提升 LocaleFace revision。                                                 |

字典查找先走活跃语言的 fallback 链，再查共享 `common` namespace，最后显示 key。内建 `zh`/`en` 的完整性由 typed 注册面约束；新增语言由拥有它的插件提供对应字典和 fallback。`addLanguage` 是可选语言目录注册，和本例给自有 UI 增加双语字典是两项不同任务。

根入口 `Config` 与 `LocaleSettings` 都通过 `preference` 表达持久的显式语言选择；插件注册字典时读取 `ctx.locale` 当前 snapshot，不应自行覆盖用户偏好。

## 失败、清理与验证边界

重复 namespace/locale 抛错，缺少类型化 key 导致编译失败；未知语言 ID 或非法 fallback 在运行时拒绝。不要在其他包的 namespace 下抢占其字典。字典应注册在 `ctx.effect` 中，组件/slot 归自身 fiber；若业务文本需异步取得，按组件和请求的生命周期取消。

独立 Client TSX 编译、包构建/pack、Web Profile + Chrome 已观察中文标签“示例语言面板”与正文“你好，世界”；通过设置改为 English 后同一界面变为 “Example language panel” / “Hello, world”；在线卸载后两者消失。未验证第三语言包、重启持久、Desktop、远程文本或模型会话。
