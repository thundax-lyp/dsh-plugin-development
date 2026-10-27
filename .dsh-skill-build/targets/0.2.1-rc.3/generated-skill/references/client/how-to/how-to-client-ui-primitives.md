# 查找与选择现成 Web UI 控件

## 接入 ui-primitives

目标结果：能按对话框、菜单、表单和输出等用途选择并复用目标版本的公开 Web UI 控件。

### 目标与前置

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。如果问题是“DSH Web UI 提供对话框吗”，答案是提供：从 `@deepseek-ai/dsh-client-ui-primitives` 导入 [Modal](../api/api-client-ui-primitives-modal.md)，不需要自己实现遮罩、焦点层和 Escape。这个包的公开 root export 是可复用控件入口；图标名字与内置业务页面不能证明某个完整控件存在。

### 按用户结果选控件

| 需求与检索词 | 公开控件及权威契约 | 选择条件 |
| --- | --- | --- |
| 对话框、弹窗、dialog、modal | [Modal](../api/api-client-ui-primitives-modal.md) | owner 控制 open、onClose；默认头部需要 title 和 closeLabel，headless 是独立联合分支 |
| 敏感操作二次确认、风险复选 | [RiskConfirmation](../api/api-client-ui-primitives-riskconfirmation.md) | 需要明确复选确认时使用，不把普通 Modal 当作业务授权 |
| 按钮、操作入口 | [Button](../api/api-client-ui-primitives-button.md) | primary、ghost、outline、toolbar；需要 ref 的锚点使用原生按钮 ref |
| 开关、复选框 | [Switch](../api/api-client-ui-primitives-switch.md)、[Checkbox](../api/api-client-ui-primitives-checkbox.md) | owner 持有 checked，提供本地化 label；保存未结束时禁用由 owner 决定 |
| 单行输入、多行草稿 | [Input](../api/api-client-ui-primitives-input.md)、[InlineEditor](../api/api-client-ui-primitives-inlineeditor.md) | Input 是原生单行控件；InlineEditor 用 Enter 保存、Shift+Enter 换行、Escape 取消，处理输入法组合 |
| 下拉、菜单、分组、子菜单 | [Menu／MenuItemButton](../api/api-client-ui-primitives-menu.md)、[MenuGroup](../api/api-client-ui-primitives-menugroup.md)、[MenuSurface](../api/api-client-ui-primitives-menusurface.md) | 数据行和组件行共享键盘走位；菜单关闭仍由 owner 修改 open；观察 sticky groups 的 disposer 由 effect 清理 |
| 多选胶囊、只读徽章 | [Pill](../api/api-client-ui-primitives-pill.md)、[Tag](../api/api-client-ui-primitives-tag.md) | Pill 可交互与独立选中；Tag 是只读状态徽章 |
| 互斥模式、页签 | [SegmentedControl](../api/api-client-ui-primitives-segmentedcontrol.md)、[SegmentedTabs](../api/api-client-ui-primitives-segmentedtabs.md) | owner 提供受控值及面板 id，面板内容由 owner 渲染 |
| 提示、悬停预览 | [Tooltip](../api/api-client-ui-primitives-tooltip.md)、[HoverCard](../api/api-client-ui-primitives-hovercard.md)、[HoverCardGroup](../api/api-client-ui-primitives-hovercardgroup.md) | 简短提示用 Tooltip，可阅读内容用 HoverCard；Group 管理物理列表内预览互斥与等待 |
| 图片大图、瞬时通知 | [ImageLightbox](../api/api-client-ui-primitives-imagelightbox.md)、[Toast](../api/api-client-ui-primitives-toast.md) | Lightbox 管焦点与 Escape；Toast 的 holdMs 和关闭回调由 owner 提供 |
| 折叠摘要、加载状态 | [DisclosureRow](../api/api-client-ui-primitives-disclosurerow.md)、[TextShimmer](../api/api-client-ui-primitives-textshimmer.md)、[StateDot](../api/api-client-ui-primitives-statedot.md) | TextShimmer 的装饰副本不得带 effect 或元素 id；StateDot 无 Active 变体，装饰图标本身不命名状态 |
| 连接断线与重试 | [ConnectionIndicator](../api/api-client-ui-primitives-connectionindicator.md) | owner 提供连接状态、文案和立即重试动作，原语不建立连接 |
| Markdown、数学、代码 | [MarkdownText](../api/api-client-ui-primitives-markdowntext.md)、[MarkdownDelegateProvider](../api/api-client-ui-primitives-markdowndelegate.md)、[CodeBlock](../api/api-client-ui-primitives-codeblock.md) | 不可信文本走安全渲染；导航回调由 owner 提供，本地路径默认不成为任意文件打开能力 |
| JSON 查看 | [JsonTree](../api/api-client-ui-primitives-jsontree.md)、[JsonBlock](../api/api-client-ui-primitives-jsonblock.md) | 只读检查，不提供编辑或持久化 |
| 工具输出、终端、读取、差异、搜索、网页 | [TerminalBlock](../api/api-client-ui-primitives-terminalblock.md)、[ReadBlock](../api/api-client-ui-primitives-readblock.md)、[DiffBlock](../api/api-client-ui-primitives-diffblock.md)、[SearchBlock](../api/api-client-ui-primitives-searchblock.md)、[WebBlock](../api/api-client-ui-primitives-webblock.md) | 按真实规范结果选择卡片；TerminalBlock 是输出展示，不是可交互终端模拟器 |
| 用户文本与文件引用 | [UserTextRun／ReferenceChip](../api/api-client-ui-primitives-user-text.md)、[PathLabel](../api/api-client-ui-primitives-pathlabel.md)、[CommandText](../api/api-client-ui-primitives-commandtext.md) | 识别与业务解析由 owner 完成，原语只呈现结果 |
| 设置表单、暂存字段、密文 | [SettingsForm](../api/api-client-ui-primitives-settingsform.md)、[SettingsFormModel](../api/api-client-ui-primitives-form-model.md)、[SettingsValueField／SettingsSecretField](../api/api-client-ui-primitives-fields.md) | 显式保存才写 scope；密文字段不回显已保存秘密，保存未落地保留草稿 |
| 文件、权限、品牌、普通图标 | [FileTypeIcon](../api/api-client-ui-primitives-filetypeicon.md)、[LinkIcon](../api/api-client-ui-primitives-linkicon.md)、[ReferenceIcon](../api/api-client-ui-primitives-referenceicon.md)、[PermissionIcon](../api/api-client-ui-primitives-permissionicon.md)、[图标目录](../api/api-client-ui-primitives-icons.md) | Regular／Medium 是线重，size 是渲染尺寸；麦克风图标不包含录音功能 |

`FoldToggle` 是内部组件，没有 root export，不能作为共享控件导入。目录中没有可交互终端模拟器；要接终端页面需选择对应业务扩展契约。组件目录不意味着所有业务组件都能跨插件导入。

### 实现步骤

1. 先按结果选控件，再读其权威子主题确认 props 与联合分支。较长的最小包见 [状态按钮与对话框完整示例](../examples/example-client-overlay.md)，包括 manifest、Host/Client 入口、独立 factory 构建、bundle patch 和实际装载。
2. 在自己的组件中持有 open/value 状态，并提供完整中文或当前语言文案；原语没有应用 locale fallback。需要应用语言时在 Client apply 注册字典，从 t 取得文案后传入 props。
3. 通过公开 slot 装入页面。原语本身没有 Cordis 依赖，不会自动出现在 DSH 页面。使用 shell.overlay 时给独立 id，外层 pointerEvents:auto，避免替换 root AppFrame。
4. 对 Modal 标记 data-modal-autofocus；不要使用 React autoFocus。模拟嵌套菜单、关闭按钮、遮罩和 Escape；onClose 必须确实更新 owner 状态。
5. 自己创建的请求、订阅和注册随 owner 清理；原语只清理自身 React 生命周期中的 DOM 资源。若内容会影响模型，另经 Host 公开提交路径持久记录，不能只把 UI 写入当作模型事实。

### 验证与完成边界

分别检查 Host 与 Client 类型，构建 factory 并装入 Web Profile。观察控件可见、受控状态可改变、键盘与可访问名称有效；停用插件后 slot、portal 与监听不再存在。失败的保存不应显示成功，取消不应有晚到写入。只读控件不要求模拟业务写入；有 Clipboard、文件导航或网络动作的控件必须分别检验 owner 提供的能力。编译通过不能代替页面中的焦点、菜单和卸载行为。

相关对象契约：

- [`AnchoredPositionOptions`、`useAnchoredPosition`](../api/api-client-ui-primitives-useanchoredposition.md)。
- [`BrandWordmark`、`BrandWordmarkProps`](../api/api-client-ui-primitives-brandwordmark.md)。
- [`CODE_HIGHLIGHT_EXTENSIONS`、`languageForPath`](../api/api-client-ui-primitives-index.md)。
- [`CodeFileType`、`FileTypeProjectContext`](../api/api-client-ui-primitives-code-file-types.md)。
- [`CodeHighlighter`、`useCodeHighlighter`](../api/api-client-ui-primitives-code-highlighting.md)。
- [`CodeToolbarLabels`](../api/api-client-ui-primitives-codetoolbar.md)。
- [`FISH_LOGO_PATH`、`FISH_LOGO_VIEWBOX`、`FishLogo`](../api/api-client-ui-primitives-fishlogo.md)。
- [`GuideArtworkBrowser`、`GuideArtworkFiles`](../api/api-client-ui-primitives-guide-artwork.md)。
- [`HighlightSpan`](../api/api-client-ui-primitives-highlight.md)。
- [`MarkdownCodeLabels`、`MarkdownFileMentions`、`MarkdownLabels`、`MarkdownPathImages`](../api/api-client-ui-primitives-render.md)。
- [`MarkdownPlainTextMode`、`MarkdownPlainTextOptions`、`extractMarkdownPlainText`](../api/api-client-ui-primitives-plain-text.md)。
- [`PluginArtworkDefault`、`PluginArtworkLoop`、`PluginArtworkSearch`、`PluginArtworkSubagent` 等对象](../api/api-client-ui-primitives-plugin-artwork.md)。
- [`RelativeTime`、`RelativeTimeUnit`、`relativeTime`](../api/api-client-ui-primitives-relative-time.md)。
- [`ShortcutKeys`](../api/api-client-ui-primitives-shortcutkeys.md)。
- [`TooltipSide`](../api/api-client-ui-primitives-tooltip-placement.md)。
- [`closeTopModal`、`isBehindModal`、`modalSelector`、`useModalLayer`](../api/api-client-ui-primitives-usemodallayer.md)。
- [`fileSizeText`](../api/api-client-ui-primitives-file-size.md)。
- [`focusWithoutRing`](../api/api-client-ui-primitives-focus.md)。
- [`isDarwinDesktop`](../api/api-client-ui-primitives-darwin-desktop.md)。
- [`observeComposition`](../api/api-client-ui-primitives-keyboard-composition.md)。
- [`pointerModality`](../api/api-client-ui-primitives-input-modality.md)。
- [`rankByName`](../api/api-client-ui-primitives-rank-by-name.md)。
- [`useAnchoredMaxHeight`](../api/api-client-ui-primitives-useanchoredmaxheight.md)。
- [`useDismissOnOutsidePointer`](../api/api-client-ui-primitives-usedismissonoutsidepointer.md)。
- [`writeClipboard`](../api/api-client-ui-primitives-clipboard.md)。
