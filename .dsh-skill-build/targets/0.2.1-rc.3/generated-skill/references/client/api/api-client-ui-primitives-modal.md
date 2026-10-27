# ui-primitives：modal 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## Modal root

入口 `@deepseek-ai/dsh-client-ui-primitives`，公开符号 `Modal`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export declare function Modal({ open, onClose, title, closeLabel, description, children, footer, className, contentClassName, onKeyDownCapture, headless, backdropBlur, shortcutModal, }: ModalProps): import("react").ReactPortal | null;
```

这是现成的对话框／弹窗控件。`open`、`onClose`、`title` 必填；默认带头部且必须提供本地化 `closeLabel`。`headless:true` 分支禁止 closeLabel 并直接呈现 children；遮罩、aria-label 和 Escape 仍保留。`open:false` 返回 null，开启时 portal 到 document.body；初始焦点用 `data-modal-autofocus`，不用 React autoFocus。关闭时恢复先前焦点；嵌套菜单先消费 Escape。`backdropBlur` 默认 true，仅设置样式；实际 mask 使用主题的 `--dsw-mask-blur`。此控件不持有 open 状态，onClose 必须由 owner 将状态设为 false。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
type ModalProps = ModalBaseProps & (
  | { headless: true; closeLabel?: never }
  | { headless?: false; closeLabel: string }
)

interface ModalBaseProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
  contentClassName?: string
  shortcutModal?: string
  onKeyDownCapture?: KeyboardEventHandler<HTMLDivElement>
  backdropBlur?: boolean
}
```
