# 为插件注册主题与临时 token 层

## 接入 ui-theme

目标结果：自有主题或 token 层随浅深色切换组合并在停用时撤销。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。目标是让插件的视觉变化随主题切换保持可读，并随插件停用撤销。读取 [ThemeRuntime、ThemeDefinition 与快照](../api/api-client-ui-theme-index.md) 以及 [theme 数据类型](../api/api-client-ui-theme-index.md)；原语已经只使用主题 tokens，普通控件通常无需主动注册主题。

### 实现步骤

1. 沿用 [完整 Client 包](../examples/example-client-overlay.md) 的构建、Host 空入口与 Profile 行。对 ui-theme/client 只导入类型，Client inject 加 theme；宿主 Profile 必须已挂主题 provider，不从消费者创建第二个 ThemeRuntime。
2. 如果交付一套用户可选择的完整主题，调用 ctx.theme.register(definition)，definition 包含唯一 id、colorScheme 与 tokens。在 ctx.effect 中返回其 disposer；system 是偏好模式，不能注册为主题 id，重复 id 抛错。
3. 如果只需覆盖当前主题的一部分 tokens，选择 ctx.theme.overrideTokens(source,tokens)。每个 token 映射 `{ light:string, dark:string }`，不能传单个字符串；source 用自己的包 id。把返回的 disposer 交给 effect。重复相同 source 会整体替换这一层并置于顶部，旧 disposer 不会撤掉新层。
4. 需要用户偏好动作时，先 getTheme 读取稳定 snapshot，再通过 setTheme 或字体 setter 修改；状态变化通过 theme/change 事件传播。未知 theme id、超范围或小数 font size 会抛错，调用方应将错误显示在其交互处。不要直接改主题的内部 registry 或全局 body style 来假装保存偏好。
5. 切换浅色、深色与 system，观察原语的可读性与样式。移除当前注册主题会回到默认偏好；撤销 token 层应恢复被遮盖的层，不清空其它插件的设置。

### 验证与完成边界

先在目标 Client 类型下检查 definition 和 light/dark 值对；运行时验证重复 id、system id 与非法 token 形状拒绝，确认拒绝前没有部分安装。注册两层并逆序/顺序撤销，观察剩余层与底层主题。真实浏览器中检查浅深色、系统配色变化与停用清理；CSS snapshot 不证明对比度和最终视觉。主题不产生 Session 或模型可见事实，local override 也不等于 Host 持久偏好。

相关对象契约：

- [`AppearanceRowComponentProps`、`AppearanceRowInjected`](../api/api-client-ui-theme-appearancerow.md)。
- [`AppearanceRowState`、`FontRowState`](../api/api-client-ui-theme-settings-store.md)。
- [`FontFamilies`、`FontRole`、`FontSizes`、`ThemePreference` 等对象](../api/api-client-ui-theme-theme-settings.md)。
- [`FontSettingsGroupProps`、`FontSettingsInjected`](../api/api-client-ui-theme-fontsettingsgroup.md)。
- [`ThemeKey`](../api/api-client-ui-theme-locales.md)。
