# 在自有 Client slot 渲染 Markdown

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。本例在普通 Session header 的 list slot 增加一个 Help 控件；点击后显示一段固定 Markdown。该文本只属于 Client UI，不作为 Session 或模型事实。组件契约见 [Client UI primitives](api-client-ui-primitives.md)，slot 规则见 [Client slots](api-client-slots.md)。Profile 要先装载 renderer、Session、Conversation 以及本插件的 Client 半边；完整包/Loader 构建见 [Web Client 插件构建](how-to-build-and-load-web-client-plugin.md)。

## 实现步骤

独立包的 `./client` 入口安装 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-client-ui-primitives@0.2.0-rc.1`、`@deepseek-ai/dsh-client-ui-renderer@0.2.0-rc.1`、`@deepseek-ai/dsh-client-ui-conversation@0.2.0-rc.1`、`@deepseek-ai/dsh-client-ui-slots@0.2.0-rc.1`，以及与宿主一致的 React。TSX 使用 `jsx: react-jsx`、`module: NodeNext`、`strict: true`。`src/client.tsx`：

```tsx
import { useState } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { Button, MarkdownText, type MarkdownLabels } from '@deepseek-ai/dsh-client-ui-primitives'

const labels: MarkdownLabels = {
  code: { copyLabel: 'Copy', copiedLabel: 'Copied' },
  footnotes: 'Footnotes',
}

function HelpAction() {
  const [open, setOpen] = useState(false)
  return <div>
    <Button variant="ghost" size="sm" onClick={() => setOpen(value => !value)}>Help</Button>
    {open && <MarkdownText text={'**Local help**\n\nThis panel is Client UI.'}
      labels={labels} variant="compact" />}
  </div>
}

export const inject = ['slots']

export function apply(ctx: Context): void {
  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'example-help-markdown',
    order: 100,
  }, HelpAction))
}
```

`ctx.slots.inject` 等待 Conversation 所有者声明该位置，注册和撤销都属于本插件 fiber；Session 页面离开或插件卸载后组件消失。`labels` 是模块常量，切换语言时应按 locale revision 重新 memoize。若 Markdown 来源于 Host，先通过已授权的 Remote/Session API 获取，再传给纯 renderer；若点击或链接打开会产生业务效果，另行检查对应服务的接受结果和持久日志。

## 验证与边界

对目标发布声明编译 Client TSX；真实 Web Profile 中检查按钮出现、点击后 Markdown 显示、Session 离开和插件卸载后消失。当前隔离检查仅完成 TSX 编译；未运行这一 Help 控件的浏览器交互。`MarkdownText` 的链接与图片行为需按插件提供的 delegate、目标路径权限和浏览器策略单独验证。
