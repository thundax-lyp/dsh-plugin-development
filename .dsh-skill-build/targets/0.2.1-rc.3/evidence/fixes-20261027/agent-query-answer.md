提供。目标版本 **DSH 0.2.1-rc.3** 的公开控件入口是：

```tsx
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'
```

最小受控用法如下，放在已挂载的 Client React 组件中：

```tsx
import { useState } from 'react'
import { Modal } from '@deepseek-ai/dsh-client-ui-primitives'

export function Example() {
  const [open, setOpen] = useState(false)

  return <>
    <button onClick={() => setOpen(true)}>打开设置</button>

    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="设置"
      closeLabel="关闭"
    >
      <label>
        名称
        <input data-modal-autofocus />
      </label>
      <button onClick={() => setOpen(false)}>完成</button>
    </Modal>
  </>
}
```

关键行为与责任：

- **受控状态**：`Modal` 不持有打开状态；`onClose` 必须让 owner 更新 `open=false`。`open=false` 时返回 `null`，打开时 portal 到 `document.body`。
- **初始焦点**：用 `data-modal-autofocus` 标记目标元素，不用 React `autoFocus`。
- **Escape**：由组件的焦点层处理；嵌套菜单优先消费 Escape。不要另加全局 Escape 监听重复关闭。
- **关闭后焦点**：组件恢复打开前的焦点。示例中通常是“打开设置”按钮；业务应保留该触发元素，避免恢复目标随关闭一起消失。
- **标题与文案**：普通模式必须提供 `title`、`closeLabel`；`headless={true}` 分支不能传 `closeLabel`，需要自行呈现内容。
- **挂载**：导入控件不会自动注册 DSH 页面或 slot；应在现有 Web shell 中使用，样式依赖 `--dsw-*` tokens。

**自己的异步业务需要自己清理。** Modal 卸载只清理自身监听、焦点层等资源，不会取消你的请求、订阅或定时器。若任务只属于这次打开周期，可用：

```tsx
useEffect(() => {
  if (!open) return

  const controller = new AbortController()
  let active = true

  void load(controller.signal).then(
    value => {
      if (active && !controller.signal.aborted) setValue(value)
    },
    error => {
      if (active && !controller.signal.aborted) setError(error)
    },
  )

  return () => {
    active = false
    controller.abort()
  }
}, [open, load]) // load 应保持稳定
```

关闭或 owner 卸载都会清理；`active` 防止不支持取消的任务晚到后更新界面。订阅还需 unsubscribe，定时器需清除。`abort()` 不代表服务端业务已回滚；写操作的取消与结果确认仍由业务协议负责。

依据本地 [Modal 契约](../../generated-skill/references/client/api/api-client-ui-primitives-modal.md)。已核对安装的 Agent/Cordis 为目标版本，但当前目录没有安装 ui-primitives 包，因此上述签名与行为依据随附技能契约，**未做该包实现复核、编译或真实 Profile／浏览器验证**。
