# 添加一个纯 Client slash 命令

## 目标与前置

目标 `dsh-v0.2.0-rc.1`。示例在 `/` 菜单增加 `/demo_help`，打开一个可见的本地帮助提示；它不向模型提交内容。Profile 先装载 `client-ui-input-trigger`、`client-ui-commands/client` 及其 Session、Remote、locale、slots 依赖。服务语义见 [Client 命令 UI](api-client-command-ui.md)；包的根入口、`./client` 导出、lazy-CJS 和 `dsh.client` 元数据按 [Web Client 插件构建](how-to-build-and-load-web-client-plugin.md) 设置。

## 实现步骤

将下列 `src/client.ts` 编进插件的 `./client` 半边；根入口可用空 `apply()` 供 Host Loader 装载。

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-commands/client'

export const inject = ['commandUi']

export function apply(ctx: Context): void {
  ctx.effect(() => ctx.commandUi.register({
    name: 'demo_help',
    label: () => 'Help',
    description: () => 'Show local plugin help',
    available: () => true,
    ui: {
      kind: 'action',
      run: () => { window.alert('This is local plugin help.') },
    },
  }), 'demo_help registration')
}
```

将自有包装入 Profile，打开普通 Session，在 composer 输入 `/`，选择 `demo_help`；提示显示后命令 token 被消费。重复名称会拒绝注册；若 Host 同时提供同名命令，候选合成明确失败，应改名。用户离开 Session 或卸载插件时，当前 fiber 会撤销贡献。需要异步选项时把 `ui` 换成 `popupSelect`，在 `options(session,signal)` 中使用该 signal；如果 `onSelect` 产生模型可见效果，要另行调用 Host Session/Remote 并检查接受及可回放日志。

## 验证与边界

对精确 rc.1 发布类型编译，再在真实 Client Profile 中观察菜单项、点击提示、卸载后菜单项消失；检查重连及 Session 切换后的候选更新。当前隔离验证只完成源码裁决和 TypeScript 编译，未完成浏览器 slash 菜单运行。纯本地 `alert` 不产生 Session 记录，也不能当作 Host 命令执行结果。
