# ui-primitives：插件接入

## 对象关系

这些是 React 展示原语，不读取 Cordis、Session 或应用语言；文案必须由调用方以 labels 等 props 传入。控件本身不会注册 slot，直接导入组件也不会让它出现在 DSH 页面。打开状态、表单值和业务请求由调用方持有；React 卸载清理原语自己的 DOM 监听、观察器和 portal，调用方仍须取消自己的异步任务。样式使用 `--dsw-*` tokens，应在现有 DSH Web shell 中呈现。

## 选型与使用

- [brandwordmark 对象契约](api-client-ui-primitives-brandwordmark.md)。
- [button 对象契约](api-client-ui-primitives-button.md)。
- [checkbox 对象契约](api-client-ui-primitives-checkbox.md)。
- [clipboard 对象契约](api-client-ui-primitives-clipboard.md)。
- [code-file-types 对象契约](api-client-ui-primitives-code-file-types.md)。
- [code-highlighting 对象契约](api-client-ui-primitives-code-highlighting.md)。
- [codeblock 对象契约](api-client-ui-primitives-codeblock.md)。
- [codetoolbar 对象契约](api-client-ui-primitives-codetoolbar.md)。
- [commandtext 对象契约](api-client-ui-primitives-commandtext.md)。
- [connectionindicator 对象契约](api-client-ui-primitives-connectionindicator.md)。
- [darwin-desktop 对象契约](api-client-ui-primitives-darwin-desktop.md)。
- [diffblock 对象契约](api-client-ui-primitives-diffblock.md)。
- [disclosurerow 对象契约](api-client-ui-primitives-disclosurerow.md)。
- [fields 对象契约](api-client-ui-primitives-fields.md)。
- [file-size 对象契约](api-client-ui-primitives-file-size.md)。
- [filetypeicon 对象契约](api-client-ui-primitives-filetypeicon.md)。
- [fishlogo 对象契约](api-client-ui-primitives-fishlogo.md)。
- [focus 对象契约](api-client-ui-primitives-focus.md)。
- [form-model 对象契约](api-client-ui-primitives-form-model.md)。
- [guide-artwork 对象契约](api-client-ui-primitives-guide-artwork.md)。
- [highlight 对象契约](api-client-ui-primitives-highlight.md)。
- [hovercard 对象契约](api-client-ui-primitives-hovercard.md)。
- [hovercardgroup 对象契约](api-client-ui-primitives-hovercardgroup.md)。
- [icons 对象契约](api-client-ui-primitives-icons.md)。
- [imagelightbox 对象契约](api-client-ui-primitives-imagelightbox.md)。
- [index 对象契约](api-client-ui-primitives-index.md)。
- [inlineeditor 对象契约](api-client-ui-primitives-inlineeditor.md)。
- [input 对象契约](api-client-ui-primitives-input.md)。
- [input-modality 对象契约](api-client-ui-primitives-input-modality.md)。
- [jsonblock 对象契约](api-client-ui-primitives-jsonblock.md)。
- [jsontree 对象契约](api-client-ui-primitives-jsontree.md)。
- [keyboard-composition 对象契约](api-client-ui-primitives-keyboard-composition.md)。
- [linkicon 对象契约](api-client-ui-primitives-linkicon.md)。
- [markdowndelegate 对象契约](api-client-ui-primitives-markdowndelegate.md)。
- [markdowntext 对象契约](api-client-ui-primitives-markdowntext.md)。
- [menu 对象契约](api-client-ui-primitives-menu.md)。
- [menugroup 对象契约](api-client-ui-primitives-menugroup.md)。
- [menusurface 对象契约](api-client-ui-primitives-menusurface.md)。
- [modal 对象契约](api-client-ui-primitives-modal.md)。
- [pathlabel 对象契约](api-client-ui-primitives-pathlabel.md)。
- [permissionicon 对象契约](api-client-ui-primitives-permissionicon.md)。
- [pill 对象契约](api-client-ui-primitives-pill.md)。
- [plain-text 对象契约](api-client-ui-primitives-plain-text.md)。
- [plugin-artwork 对象契约](api-client-ui-primitives-plugin-artwork.md)。
- [rank-by-name 对象契约](api-client-ui-primitives-rank-by-name.md)。
- [readblock 对象契约](api-client-ui-primitives-readblock.md)。
- [referenceicon 对象契约](api-client-ui-primitives-referenceicon.md)。
- [relative-time 对象契约](api-client-ui-primitives-relative-time.md)。
- [render 对象契约](api-client-ui-primitives-render.md)。
- [riskconfirmation 对象契约](api-client-ui-primitives-riskconfirmation.md)。
- [searchblock 对象契约](api-client-ui-primitives-searchblock.md)。
- [segmentedcontrol 对象契约](api-client-ui-primitives-segmentedcontrol.md)。
- [segmentedtabs 对象契约](api-client-ui-primitives-segmentedtabs.md)。
- [settingsform 对象契约](api-client-ui-primitives-settingsform.md)。
- [shortcutkeys 对象契约](api-client-ui-primitives-shortcutkeys.md)。
- [statedot 对象契约](api-client-ui-primitives-statedot.md)。
- [switch 对象契约](api-client-ui-primitives-switch.md)。
- [tag 对象契约](api-client-ui-primitives-tag.md)。
- [terminalblock 对象契约](api-client-ui-primitives-terminalblock.md)。
- [textshimmer 对象契约](api-client-ui-primitives-textshimmer.md)。
- [toast 对象契约](api-client-ui-primitives-toast.md)。
- [tooltip 对象契约](api-client-ui-primitives-tooltip.md)。
- [tooltip-placement 对象契约](api-client-ui-primitives-tooltip-placement.md)。
- [useanchoredmaxheight 对象契约](api-client-ui-primitives-useanchoredmaxheight.md)。
- [useanchoredposition 对象契约](api-client-ui-primitives-useanchoredposition.md)。
- [usedismissonoutsidepointer 对象契约](api-client-ui-primitives-usedismissonoutsidepointer.md)。
- [usemodallayer 对象契约](api-client-ui-primitives-usemodallayer.md)。
- [user-text 对象契约](api-client-ui-primitives-user-text.md)。
- [webblock 对象契约](api-client-ui-primitives-webblock.md)。

完整操作见 [接入 ui-primitives](../how-to/how-to-client-ui-primitives.md#接入-ui-primitives)。
