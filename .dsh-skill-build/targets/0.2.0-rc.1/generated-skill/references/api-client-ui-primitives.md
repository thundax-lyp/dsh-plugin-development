# Client UI primitives：在自有 slot 渲染安全内容

## 适用范围与入口

目标 `dsh-v0.2.0-rc.1`。`@deepseek-ai/dsh-client-ui-primitives` 根入口导出无 Cordis 服务依赖的 React 组件、图标、Markdown/代码/JSON/文件块和表单控件。它不提供 `apply()`、`ctx.*` 注册或新的运行时 slot；外部插件先通过 [Client slots](api-client-slots.md) 找到合法位置，再把这些组件用作纯视图。`SettingsFormModel`/控件的表单任务由 [Client 设置表单](api-client-settings-forms.md) 负责。完整 slot 例子见 [在自有 Client slot 渲染 Markdown](how-to-render-markdown-slot.md)。

## 组件契约

`Button` 接受原生 button 属性，`variant` 为 `primary | ghost | outline | toolbar`，`size` 为 `md | sm`，另有 `icon`、`className` 与 `children`；默认 type 是 `button`。它只提供 `--dsw-*` token 样式，不持有业务权限。`MarkdownText` 需要 `text` 与 `labels`，可选 `streaming`、`fileMentions`、`pathImages`、`variant: body | compact`。原始 HTML 和不安全协议会被禁用；本地文件链接只有附近 `MarkdownDelegateProvider` 提供 `openFile` 才可打开，普通 HTTP(S) 链接可由其 `openExternalLink` 接管。不要把组件的安全处理当成 Host 访问授权。

`streaming` 对增长的 Markdown 逐块解析；`labels` 对象应在一个 locale revision 内保持引用稳定，否则会丢弃流式渲染缓存。`fileMentions` 与 `pathImages` 只在完整 settled 渲染中生效。插件必须从自己拥有的 Session/Remote 数据构造文本，组件不会把本地 UI 状态写进 Session 日志。图标、菜单、提示、Modal、CodeBlock、TerminalBlock 等导出是同一展示工具箱；使用时依各组件属性给安全的输入与可观察的失败 UI，不应为这些纯组件虚构 Cordis 注册入口。

## 对象类型与成员

| 对象                                            | 公开成员与用途                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `Button` / `ButtonVariant`                      | React 按钮；variant 四种值；原生 `onClick`、`disabled`、`type` 等属性向下传递。                                                      |
| `MarkdownText`                                  | `text`、`labels` 必需；`streaming?`、`fileMentions?`、`pathImages?`、`variant?` 可选。                                               |
| `MarkdownLabels`                                | `code: MarkdownCodeLabels`、`footnotes: string` 必需。                                                                               |
| `MarkdownCodeLabels`                            | `copyLabel`、`copiedLabel` 必需；`toolbarLabels?` 可选。                                                                             |
| `MarkdownDelegate` / `MarkdownDelegateProvider` | 可选 `openExternalLink`、`openFile`、`fileImages` 作用于最近子树；无 handler 时本地链接仍是纯文本。                                  |
| `SettingsFormModel`                             | `actions()`、`bind()`、`dispose()`、`field()`、`save()`、`shell()` 归 [Client 设置表单](api-client-settings-forms.md) 的逐成员契约。 |

## 生命周期、失败与验证

primitives 本身没有 Cordis fiber。它们随注册它们的 slot 组件卸载；异步资源、Session 订阅、文件/链接打开回调由插件或对应服务拥有。外部文本宜由稳定 Session 数据重建；纯 UI 点击不产生模型可见事实。目标源码见 `packages/client/ui-primitives/src/index.ts` 与 `src/markdown/MarkdownText.tsx`、`src/Button.tsx`。最小示例对发布 rc.1 声明已独立编译；尚未对该示例做浏览器视觉或交互验证。
