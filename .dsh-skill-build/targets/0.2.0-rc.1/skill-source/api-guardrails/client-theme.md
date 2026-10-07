# Client 主题注册与令牌覆写

## 适用范围与入口

本页锁定 `dsh-v0.2.0-rc.1` 的 Web Client。`@deepseek-ai/dsh-client-ui-theme/client` 向 Cordis Context 提供 `ctx.theme`：可注册可选主题、改变偏好，或以 `overrideTokens` 为现有主题叠加 CSS 令牌。`@deepseek-ai/dsh-client-ui-layout/client` 的 `ThemePresenter` 订阅并把快照投射到 DOM。外部插件通常以有所有权的 token layer 定制已有 light/dark 主题；完整独立包见 [添加主题令牌层](how-to-add-theme-layer.md)。

## 最小完整 Client 示例

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'

export const inject = ['theme']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.theme.overrideTokens('dsh-example-theme-layer', {
    '--dsw-alias-bg-base': { light: '#ffe8e8', dark: '#3b1010' },
  }), 'example: theme layer')
}
```

每个值必须同时给 `light` 和 `dark`；固定值可在两侧重复。`ctx.effect` 拥有 disposer，插件卸载后该层撤销。此例没有异步资源或模型可见数据。

## 公开对象与成员

`ThemeRuntime` 是 `ctx.theme` 的公开 Client service；`ThemeTokenOverrides` 定义双模式 token 层输入。

| 对象/成员                                  | 公开契约                                                                        | 插件任务中的语义                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `ThemeDefinition`                          | `id: string`, `colorScheme: 'light' \| 'dark'`, `tokens: Record<string,string>` | `ctx.theme.register` 加入可选主题；`light`、`dark` 已占用，`system` 只作偏好。                                 |
| `ctx.theme.register(definition)`           | 返回 disposer；重复 ID 抛错                                                     | 卸载当前偏好所指主题时，偏好重置为默认值并发布新快照。                                                         |
| `ctx.theme.overrideTokens(source, tokens)` | `tokens` 每项为 `{light:string,dark:string}`；返回 disposer                     | 同 source 新调用替换旧层且进入最新叠层位置；旧 disposer 不会移除新层。后注册的层按 token 覆盖前层。            |
| `ctx.theme.getTheme()`                     | 返回不可变 `ThemeSnapshot`                                                      | 包含 `preference`、`fontSize`、`active`、已注册 `themes`、`revision`；`active.tokens` 已合并适用主题与覆写层。 |
| `ctx.theme.exportInspectTokens()`          | 返回 JSON 安全 token 名录                                                       | 用于发现内建和动态 token 名；动态名称可注册，但应先确认消费者会使用。                                          |
| `ctx.theme.setTheme(id)`                   | 已注册主题 ID 或 `system`；未知 ID 抛错                                         | 切换主题偏好。内建/`system` 偏好通过 settings scope 保存；自定义主题偏好没有同样的持久写入承诺。               |
| `ctx.theme.setFontSize(px)`                | 限定整数范围；无效值抛错                                                        | 更改会话内容字号并通过 settings scope 保存。                                                                   |
| `theme/change`                             | 快照事件                                                                        | 订阅时由插件 effect 拥有退订；`getTheme()` 可拿当前值，避免错过首帧。                                          |

`ThemePresenter` 根据 `active.colorScheme` 设置 `body[data-ds-dark-theme]`，并把 `active.tokens` 写到 body inline CSS variables。它不从 theme ID 猜测暗色。注册主题和令牌层是两种不同用途：前者供用户选择新的具体主题，后者在当前主题之上持续生效。样式消费仍以目标 CSS token 实际引用为准。

## 失败、卸载与验证边界

裸字符串或缺少任一模式的 token 值会在运行时抛 `TypeError`。别让多个插件共用同一个 `source`，否则新层会替换旧层。应通过 `ctx.effect` 保存 disposer；直接写 `document.body.style` 绕过主题快照及主题切换。独立 Client TS 编译、包构建/pack、隔离 Web Profile + Chrome 已验证 `--dsw-alias-bg-base` 为 `#ffe8e8`，在线移除插件后 body inline 值清空、计算值恢复 `#fff`。未验证自定义主题的设置 UI 选择、暗色模式实测、Desktop 与重启持久化。
