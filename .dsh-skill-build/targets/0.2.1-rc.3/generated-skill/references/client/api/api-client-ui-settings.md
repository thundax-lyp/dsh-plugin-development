# ui-settings：插件接入

## 对象关系

ConfigForms 是浏览器读取与编辑 Host 配置的入口。通过 namespace/entryId 取得表单，订阅不可变 snapshot，再使用 set/mutate 提交；Host 验证成功才接受持久值。配置无效或 revision 不匹配应保留错误与重新读取，不能把本地表单 staging 当已保存状态。

## 选型与使用

- [config-form 对象契约](api-client-ui-settings-config-form.md)。
- [config-form-types 对象契约](api-client-ui-settings-config-form-types.md)。
- [index 对象契约](api-client-ui-settings-index.md)。
- [schema 对象契约](api-client-ui-settings-schema.md)。
- [settings-mirror 对象契约](api-client-ui-settings-settings-mirror.md)。
- [slots 对象契约](api-client-ui-settings-slots.md)。

完整操作见 [接入 ui-settings](../how-to/how-to-client-ui-settings.md#接入-ui-settings)。
