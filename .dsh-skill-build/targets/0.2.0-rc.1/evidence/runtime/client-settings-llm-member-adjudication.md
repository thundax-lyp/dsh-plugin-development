# rc.1 Client 设置/权限与 DeepSeek LLM 逐成员裁决

目标 checkout `dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。表格基于当前 `api-surface.json` 的**全部**指定 entry/object/member；`include` 表示当前 reference 有可执行第三方任务且应映射，`merge` 表示归入同一任务的既有入口/类型，不另立 reference，`exclude` 表示此 Skill 的普通插件作者任务不使用。它不是对 TypeScript 可导出性的否认。owner 是建议生成产物路径，section 是目标正文节。

精确源码：`packages/client/ui-settings/src/{index,client/index,client/{config-form,config-form-types,schema,settings-mirror,contract/slots}}.ts`、`packages/client/ui-permission-presets/src/{index,client/index}.ts`、`packages/client/ui-settings-account/src/{index,client/index}.ts`、`packages/client/ui-settings-plugins/src/{index,client/index}.ts`、`packages/llm/llm-deepseek/src/{index,host,adapter,config,types,file-store,files-api,upload-index,request-pricing}.ts`。

## Entry 裁决

| Entry | 决定 | owner / section | 具体理由 |
| --- | --- | --- | --- |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:.` | exclude | — / — | Host 根 apply 是空体，仅使 Loader 行发现 Client 半边。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client` | merge | references/api-permission-presets.md / Web Client 组合 | 内置 Client 选择器与默认预设行是组合前置，第三方调用 Host 预设服务或复用 slot。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.` | exclude | — / — | 内置账号 onboarding/contact 配置；自有认证使用 authorization 与凭证 Provider。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client` | exclude | — / — | 仅 Desktop 的内置 DeepSeek 账号页面和私有注入状态；不是通用认证 UI 注册 seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-plugins:.` | exclude | — / — | Host 根 apply 空体，仅使 Loader 发现 Client 半边。 |
| `export:@deepseek-ai/dsh-client-ui-settings-plugins:./client` | merge | references/api-client-settings-forms.md / 适用范围与入口 | 已装载的 Plugins settings section 声明 settings.plugins.tab slot；第三方注册 tab，勿再次装载同名 section。 |
| `export:@deepseek-ai/dsh-client-ui-settings:.` | exclude | — / — | Host 根半边只配置内置 developerTools 开关，第三方卡片使用自己的 Host Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client` | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享 ConfigForms/SettingsSchema service 与 slot owner 类型；第三方卡片可复用。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.` | include | references/api-llm-providers.md / 对象类型与成员 | 根入口公开 Messages adapter、配置解析与注册 helper；自身无 Cordis apply。 |

## Object / member 裁决

每个对象行和每个成员行独立列出；无成员对象只列对象。`merge` 的对象成员仍需按所指 owner 的实际任务解释。

| API ID | 层级 | 决定 | owner / section | 具体理由 |
| --- | --- | --- | --- | --- |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:.:apply` | object | exclude | — / — | 空 Host body，仅用于 Loader 发现。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:apply` | object | merge | references/api-permission-presets.md / Web Client 组合 | 内置 UI 组合插件装载/依赖；第三方不重注册其选择器。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:inject` | object | merge | references/api-permission-presets.md / Web Client 组合 | 内置 UI 组合插件装载/依赖；第三方不重注册其选择器。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionCatalogState` | object | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionCatalogState.value` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionDefaultOption` | object | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionDefaultOption.id` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionDefaultOption.label` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionRowInjected` | object | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionRowInjected.hooks` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionRowInjected.load` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionRowInjected.select` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionRowProps` | object | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSelectInjected` | object | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSelectInjected.hooks` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSelectInjected.select` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSelectProps` | object | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSettingsState` | object | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSettingsState.currentValue` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSettingsState.error` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSettingsState.options` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSettingsState.revision` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSettingsState.status` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-permission-presets:./client:PermissionSettingsState.writable` | member | exclude | — / — | 内置 permission 行/选择器的组件 props 或私有目录状态；第三方使用 Host permissionPresets 与 slots。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:apply` | object | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:Config` | object | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:Config.completion` | member | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:Config.developerTools` | member | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:Config.process` | member | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:Config.purpose` | member | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:Config.step` | member | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:Config.usage` | member | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:.:Config.version` | member | exclude | — / — | 内置账号 onboarding/contact 部署配置；第三方应实现自己的认证/Settings namespace。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountKey` | object | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountMenuProps` | object | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected` | object | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.bonusNoticeDismissed` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.bonusNoticeShown` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.cancel` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.contactUs` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.hasRunningAccountTasks` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.hooks` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.openPlatformPage` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.refreshAccount` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.setOnboarding` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.showLogin` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.signOut` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.start` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.subscribeModelSignInRequired` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionInjected.subscribeSessionExpired` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSectionProps` | object | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSnapshot` | object | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSnapshot.details` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSnapshot.failed` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSnapshot.loginFailed` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSnapshot.loginVisible` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSnapshot.notice` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSnapshot.onboarding` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:AccountSnapshot.view` | member | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:apply` | object | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-account:./client:inject` | object | exclude | — / — | Desktop 专有账号页面的组件注入/快照；不是通用授权或凭证 Provider seam。 |
| `export:@deepseek-ai/dsh-client-ui-settings-plugins:.:apply` | object | exclude | — / — | 空 Host body，仅用于 Loader 发现。 |
| `export:@deepseek-ai/dsh-client-ui-settings-plugins:./client:apply` | object | merge | references/api-client-settings-forms.md / 适用范围与入口 | 内置 Plugins section 的装载/依赖，第三方在其 tab slot 注册。 |
| `export:@deepseek-ai/dsh-client-ui-settings-plugins:./client:inject` | object | merge | references/api-client-settings-forms.md / 适用范围与入口 | 内置 Plugins section 的装载/依赖，第三方在其 tab slot 注册。 |
| `export:@deepseek-ai/dsh-client-ui-settings-plugins:./client:PluginsSettingsSectionInjected` | object | exclude | — / — | 内置 Plugins section 自身的组件 props；第三方 tab 使用 settings.plugins.tab 的 owner props。 |
| `export:@deepseek-ai/dsh-client-ui-settings-plugins:./client:PluginsSettingsSectionInjected.hooks` | member | exclude | — / — | 内置 Plugins section 自身的组件 props；第三方 tab 使用 settings.plugins.tab 的 owner props。 |
| `export:@deepseek-ai/dsh-client-ui-settings-plugins:./client:PluginsSettingsSectionProps` | object | exclude | — / — | 内置 Plugins section 自身的组件 props；第三方 tab 使用 settings.plugins.tab 的 owner props。 |
| `export:@deepseek-ai/dsh-client-ui-settings:.:apply` | object | exclude | — / — | 内置 developerTools 偏好，不是插件设置卡片的注册入口。 |
| `export:@deepseek-ai/dsh-client-ui-settings:.:Config` | object | exclude | — / — | 内置 developerTools 偏好，不是插件设置卡片的注册入口。 |
| `export:@deepseek-ai/dsh-client-ui-settings:.:Config.enabled` | member | exclude | — / — | 内置 developerTools 偏好，不是插件设置卡片的注册入口。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:apply` | object | merge | references/api-client-settings-forms.md / 适用范围与入口 | 基础 Client provider 的装载/依赖，由现成 bundle 提供。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForm` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForm.getSnapshot` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForm.mutate` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForm.set` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForm.subscribe` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForm.unset` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForms` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForms.describe` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForms.developerTools` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForms.get` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigForms.whileServed` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot.base` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot.mode` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot.revision` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot.status` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot.user` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot.value` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:ConfigFormSnapshot.writable` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:inject` | object | merge | references/api-client-settings-forms.md / 适用范围与入口 | 基础 Client provider 的装载/依赖，由现成 bundle 提供。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SchemaNode` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeFace` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeFace.acceptView` | member | exclude | — / — | 写入回执由 ConfigForms 内部折叠；第三方通过 ConfigForm.mutate 写入。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeFace.ensure` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeFace.getSnapshot` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeFace.subscribe` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeView` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeView.hasDocument` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeView.namespaces` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsDescribeView.writable` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsGeneralItemOwnerProps` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsGeneralItemOwnerProps.children` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsHeaderOwnerProps` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsHeaderOwnerProps.children` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsLauncherOwnerProps` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsLauncherOwnerProps.openOnboarding` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsLauncherOwnerProps.openSettings` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsLauncherOwnerProps.settingsOpen` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsLauncherOwnerProps.settingsShortcut` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsLauncherOwnerProps.wide` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsMirrorSnapshot` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsMirrorSnapshot.error` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsMirrorSnapshot.status` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsMirrorSnapshot.view` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 共享表单或跨 namespace 读面，供自有 Settings 卡片订阅。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsOnboardingOwnerProps` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsOnboardingOwnerProps.complete` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsOnboardingOwnerProps.explicit` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsOnboardingOwnerProps.openSection` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsOnboardingOwnerProps.stepId` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsPluginsTabOwnerProps` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsPluginsTabOwnerProps.children` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 可复用的 ctx.settingsSchema helper，供自有卡片验证/不可变路径草稿。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService.deletePath` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 可复用的 ctx.settingsSchema helper，供自有卡片验证/不可变路径草稿。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService.getPath` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 可复用的 ctx.settingsSchema helper，供自有卡片验证/不可变路径草稿。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService.hasPath` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 可复用的 ctx.settingsSchema helper，供自有卡片验证/不可变路径草稿。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService.nodeAtPath` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 可复用的 ctx.settingsSchema helper，供自有卡片验证/不可变路径草稿。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService.rehydrate` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 可复用的 ctx.settingsSchema helper，供自有卡片验证/不可变路径草稿。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService.setPath` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 可复用的 ctx.settingsSchema helper，供自有卡片验证/不可变路径草稿。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSchemaService.validate` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 可复用的 ctx.settingsSchema helper，供自有卡片验证/不可变路径草稿。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSectionOwnerProps` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsSectionOwnerProps.close` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsTriggerOwnerProps` | object | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-client-ui-settings:./client:SettingsTriggerOwnerProps.wide` | member | include | references/api-client-settings-forms.md / 对象类型与成员 | 公开 slot owner 注入面，供自有 Settings 页面/行贡献。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:catalogModelInfo` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.baseURL` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.defaultContextWindow` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.fileExpiresAfterSeconds` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.fileQuotaCleanupBatch` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.fileRefreshMarginSeconds` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.filesApiTimeoutMs` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.imageOffloadByteQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.imageOffloadCountQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.inlineImageOffloadByteQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.maxImagesPerRequest` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.maxInlineRequestImageBytes` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.maxRequestFilesBytes` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.maxTokens` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.models` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.reasoningEffort` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.retryPolicy` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.streamIdleTimeoutMs` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Config.thinking` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapter` | object | include | references/api-llm-providers.md / 对象类型与成员 | 可装配自有 Messages route 的公开适配器/回调契约。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapter.imageRequestPricing` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 同 LlmAdapter 方法但使用 Messages 认证、附件和 replay；自有 route 可实例化，细节需独立验证。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapter.listModels` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 同 LlmAdapter 方法但使用 Messages 认证、附件和 replay；自有 route 可实例化，细节需独立验证。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapter.prepareCall` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 同 LlmAdapter 方法但使用 Messages 认证、附件和 replay；自有 route 可实例化，细节需独立验证。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapter.providerInfo` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 同 LlmAdapter 方法但使用 Messages 认证、附件和 replay；自有 route 可实例化，细节需独立验证。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapter.providerRetryPolicy` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 同 LlmAdapter 方法但使用 Messages 认证、附件和 replay；自有 route 可实例化，细节需独立验证。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapter.resolveModel` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 同 LlmAdapter 方法但使用 Messages 认证、附件和 replay；自有 route 可实例化，细节需独立验证。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapter.stream` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 同 LlmAdapter 方法但使用 Messages 认证、附件和 replay；自有 route 可实例化，细节需独立验证。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions` | object | include | references/api-llm-providers.md / 对象类型与成员 | 可装配自有 Messages route 的公开适配器/回调契约。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.discoverModels` | member | include | references/api-llm-providers.md / 对象类型与成员 | 可装配自有 Messages route 的公开适配器/回调契约。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.onExtensionsOmitted` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 低层直建 adapter 的回调；优先使用 registerDeepSeekProvider，其余回调由 helper 装配。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.onReplayDegrade` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 低层直建 adapter 的回调；优先使用 registerDeepSeekProvider，其余回调由 helper 装配。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.options` | member | include | references/api-llm-providers.md / 对象类型与成员 | 可装配自有 Messages route 的公开适配器/回调契约。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.prepareExtensions` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 低层直建 adapter 的回调；优先使用 registerDeepSeekProvider，其余回调由 helper 装配。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.providerName` | member | include | references/api-llm-providers.md / 对象类型与成员 | 可装配自有 Messages route 的公开适配器/回调契约。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.resolveAttachments` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 低层直建 adapter 的回调；优先使用 registerDeepSeekProvider，其余回调由 helper 装配。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.resolveAuth` | member | include | references/api-llm-providers.md / 对象类型与成员 | 可装配自有 Messages route 的公开适配器/回调契约。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.resolveFiles` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 低层直建 adapter 的回调；优先使用 registerDeepSeekProvider，其余回调由 helper 装配。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.resolveImageAccess` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 低层直建 adapter 的回调；优先使用 registerDeepSeekProvider，其余回调由 helper 装配。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekAdapterOptions.resolveUserId` | member | merge | references/api-llm-providers.md / 对象类型与成员 | 低层直建 adapter 的回调；优先使用 registerDeepSeekProvider，其余回调由 helper 装配。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.contextWindow` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.description` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.id` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.imageMaxBytes` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.imagePixelBudget` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.inputModalities` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.maxTokens` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.name` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.systemPromptUpdate` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekCatalogModel.toolUpdate` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:deepSeekConfigFields` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.baseURL` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.defaultContextWindow` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.defaults` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.filePolicy` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.filesApiTimeoutMs` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.imageOffloadByteQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.imageOffloadCountQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.inlineImageOffloadByteQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.maxImagesPerRequest` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.maxInlineRequestImageBytes` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.maxRequestFilesBytes` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.maxTokens` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.models` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.retryPolicy` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekConnectionOptions.streamIdleTimeoutMs` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileConnection` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileConnection.baseURL` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileConnection.headers` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileId` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileIdType` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileObject` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileObject.bytes` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileObject.createdAt` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileObject.expiresAt` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileObject.filename` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileObject.id` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePage` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePage.data` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePage.firstId` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePage.hasMore` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePage.lastId` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePolicy` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePolicy.expiresAfterSeconds` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePolicy.quotaCleanupBatch` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilePolicy.refreshMarginSeconds` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileReference` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileReference.record` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileReference.uploaded` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilesClient` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilesClient.delete` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilesClient.list` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilesClient.retrieve` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFilesClient.upload` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:deepSeekFileScope` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileStore` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileStore.ensureUploaded` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileStore.invalidate` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileStore.reclaimOldestOwned` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileStore.release` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekFileStore.releaseAll` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:deepSeekImageRequestPricing` | object | exclude | — / — | 图片估价/投影内部 helper；普通插件通过 DeepSeekAdapter.imageRequestPricing 获取结果。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:deepSeekImageTokens` | object | exclude | — / — | 图片估价/投影内部 helper；普通插件通过 DeepSeekAdapter.imageRequestPricing 获取结果。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekRequestAuth` | object | include | references/api-llm-providers.md / 对象类型与成员 | 请求级凭证 headers 与失败分类快照，认证不得跨请求复用。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekRequestAuth.headers` | member | include | references/api-llm-providers.md / 对象类型与成员 | 请求级凭证 headers 与失败分类快照，认证不得跨请求复用。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekRequestAuth.onRequestError` | member | include | references/api-llm-providers.md / 对象类型与成员 | 请求级凭证 headers 与失败分类快照，认证不得跨请求复用。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:deepSeekRequestImageDimensions` | object | exclude | — / — | 图片估价/投影内部 helper；普通插件通过 DeepSeekAdapter.imageRequestPricing 获取结果。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadIndex` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadIndex.clear` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadIndex.commit` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadIndex.get` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadIndex.path` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadIndex.remove` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadRecord` | object | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadRecord.attachmentId` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadRecord.bytes` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadRecord.createdAt` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadRecord.expiresAt` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadRecord.fileId` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadRecord.scope` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DeepSeekUploadRecord.variantId` | member | exclude | — / — | Files API 上传复用/索引/配额恢复的低层策略；普通 route helper 已封装，独立文件缓存插件任务与验证缺失。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_CONTEXT_WINDOW` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_FILE_EXPIRY_SECONDS` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_FILE_QUOTA_CLEANUP_BATCH` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_FILE_REFRESH_MARGIN_SECONDS` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_FILES_API_TIMEOUT_MS` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_IMAGE_OFFLOAD_BYTE_QUANTUM` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_IMAGE_OFFLOAD_COUNT_QUANTUM` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_INLINE_IMAGE_OFFLOAD_BYTE_QUANTUM` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_LOW_DETAIL_IMAGE_PIXEL_BUDGET` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_MAX_IMAGES_PER_REQUEST` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_MAX_INLINE_REQUEST_IMAGE_BYTES` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_MAX_REQUEST_FILES_BYTES` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_MAX_TOKENS` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_REQUEST_IMAGE_MAX_BYTES` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:DEFAULT_STREAM_IDLE_TIMEOUT_MS` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:MAX_FILE_EXPIRY_SECONDS` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:MAX_FILE_UPLOAD_BYTES` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:MAX_IMAGE_BYTES` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:MAX_STORED_FILE_BYTES` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:MAX_STORED_FILE_COUNT` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:MIN_FILE_EXPIRY_SECONDS` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.baseURL` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.defaultContextWindow` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.fileExpiresAfterSeconds` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.fileQuotaCleanupBatch` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.fileRefreshMarginSeconds` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.filesApiTimeoutMs` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.imageOffloadByteQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.imageOffloadCountQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.inlineImageOffloadByteQuantum` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.maxImagesPerRequest` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.maxInlineRequestImageBytes` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.maxRequestFilesBytes` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.maxTokens` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.models` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.reasoningEffort` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.retryPolicy` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.streamIdleTimeoutMs` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:Options.thinking` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:plainOptions` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:PUBLIC_BASE_URL` | object | merge | references/api-llm-builtins-retry-meter.md / 包的任务边界 | 官方 endpoint 默认常量，不是独立注册 seam。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:registerDeepSeekProvider` | object | include | references/api-llm-providers.md / 对象类型与成员 | 真实 Host helper：注册自有 provider route，并由 ctx fiber 清理。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:REQUEST_IMAGE_MAX_DIMENSION` | object | exclude | — / — | 协议/文件/图像策略默认值或边界常量，由 Config/resolveAdapterOptions 或 adapter 内部使用；不构成独立插件任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:RequestDefaults` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:RequestDefaults.reasoningEffort` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:RequestDefaults.thinking` | member | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:resolveAdapterOptions` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:ResolvedDeepSeekOptions` | object | merge | references/api-llm-builtins-retry-meter.md / 对象类型与成员 | 自有 Messages route 的配置/解析/模型目录，和注册 helper 组成同一任务。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:resolveRequestImageMaxBytes` | object | exclude | — / — | 图片估价/投影内部 helper；普通插件通过 DeepSeekAdapter.imageRequestPricing 获取结果。 |
| `export:@deepseek-ai/dsh-llm-deepseek:.:resolveRequestImageTarget` | object | exclude | — / — | 图片估价/投影内部 helper；普通插件通过 DeepSeekAdapter.imageRequestPricing 获取结果。 |

## 验证边界

本轮逐项复核 target tag 的 public export 与源码调用链，并核对现有 Reference 的对应任务；没有新建 DeepSeek 自有 Messages route 的隔离编译、网络请求、Files API 或真实 Client 浏览器验证。已有 `evidence/runtime/settings-ui-review.md`、`permission-presets-review.md`、`llm-provider-review.md`、`llm-builtins-retry-meter-review.md` 各自覆盖的范围不能外推到这些未运行路径。若要将 DeepSeek helper 及其 Config/Options/AdapterOptions 从“候选 include/merge”升为冻结的完整任务，须增加自有 route HOW-TO、独立 consumer 编译及真实 Cordis 注册/注销 smoke。
