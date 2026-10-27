# product-analytics：events 契约

适用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

本页定义 product-analytics 中供类型组合和界面装配使用的公开对象。运行时由该包的 Host／Client 安装入口建立，消费方按实际运行侧导入。

## AnalyticsPreset client

入口 `@deepseek-ai/dsh-client-product-analytics/client`，公开符号 `AnalyticsPreset`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type AnalyticsPreset = 'creator' | 'ptc' | 'minimal' | 'standard';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## EntryAnalyticsRegion client

入口 `@deepseek-ai/dsh-client-product-analytics/client`，公开符号 `EntryAnalyticsRegion`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type EntryAnalyticsRegion = 'sidebar' | 'conversation' | 'rightbar';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## ProductEvent client

入口 `@deepseek-ai/dsh-client-product-analytics/client`，公开符号 `ProductEvent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ProductEvent = {
    [K in keyof ProductEventMap]: {
        eventName: K;
        attributes: ProductEventMap[K];
        timestamp: number;
    };
}[keyof ProductEventMap];
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ProductEventMap {
  desktop_app_launch: Record<string, never>
  auth_page_view: Record<string, never>
  auth_page_click: { button_name: 'sign_in' | 'api-key' }
  api_key_save_click: Record<string, never>
  onboarding_page_view: { page_name: OnboardingPage }
  onboarding_page_click: {
    page_name: OnboardingPage
    button_name: 'next' | 'back' | 'skip' | 'charge' | 'later' | 'continue'
    selected_content?: 'office' | 'code' | 'code_office' | 'focus_result' | 'key_detail' | 'full_process'
  }
  onboarding_popup_view: { popup_name: 'skip_charge' | 'skip_setting' }
  onboarding_popup_click: { popup_name: 'skip_charge' | 'skip_setting'; button_name: 'charge' | 'know' | 'enter' | 'setting' | 'close' }
  desktop_upgrade_click: Record<string, never>
  desktop_upgrade_download_result: { is_success: boolean; error_reason?: string }
  desktop_upgrade_install_restart_click: Record<string, never>
  send_button_click: {
    session_id?: SessionId
    model_name?: string
    thinking_effort?: string
    run_mode: 'plan' | 'goal' | 'default'
    msg_type: 'default' | 'steer' | 'queue'

    is_new_session: boolean

    agent_preset?: AnalyticsPreset | 'other'
  }
  model_switch: { session_id?: SessionId; switch_from: string; switch_to: string }
  thinking_level_switch: { session_id?: SessionId; switch_from: string; switch_to: string; model_name: string }
  context_compression: { session_id: SessionId; trigger_type: 'auto' | 'manual' }
  branch_session_click: {
    session_id: SessionId
    parent_session_id: SessionId
    parent_message_id?: MessageId
    click_position: 'footer' | 'sidebar'
  }
  sidebar_menu_click: { menu_name: SidebarAnalyticsEntry; position?: SidebarAnalyticsPosition }
  more_menu_item_click: { region: EntryAnalyticsRegion; action: 'browse_plugins' | 'create_plugin' }
  agent_preset_switch: { switch_from: AnalyticsPreset | 'other'; switch_to: AnalyticsPreset; code_work_view_enabled: boolean }
  code_work_view_toggle: { is_enabled: boolean }
  plugin_toggle: { plugin_name: string; plugin_type: 'plugin' | 'bundle'; is_enabled: boolean; is_builtin: boolean }
  plugin_add_button_click: Record<string, never>
  plugin_install_click: { input_value: string }
  install_plugin_result: {
    input_value: string
    is_success: boolean
    error_reason?: string
    duration: number
    plugin_name?: string
  }
  confirm_uninstall_plugin: { plugin_name: string }
}

export type SidebarAnalyticsEntry = 'new_session' | 'plugin' | 'cron' | 'more'

export type SidebarAnalyticsPosition = 'sidebar' | 'sidebar_more' | 'titlebar'

export type EntryAnalyticsRegion = 'sidebar' | 'conversation' | 'rightbar'

export type AnalyticsPreset = 'creator' | 'ptc' | 'minimal' | 'standard'

export type OnboardingPage = 'onboarding_welcome' | 'onboarding_recharge' | 'onboarding_use_case' | 'onboarding_process'
```

## ProductEventMap client

入口 `@deepseek-ai/dsh-client-product-analytics/client`，公开符号 `ProductEventMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ProductEventMap {
    desktop_app_launch: Record<string, never>;
    auth_page_view: Record<string, never>;
    auth_page_click: {
        button_name: 'sign_in' | 'api-key';
    };
    api_key_save_click: Record<string, never>;
    onboarding_page_view: {
        page_name: OnboardingPage;
    };
    onboarding_page_click: {
        page_name: OnboardingPage;
        button_name: 'next' | 'back' | 'skip' | 'charge' | 'later' | 'continue';
        selected_content?: 'office' | 'code' | 'code_office' | 'focus_result' | 'key_detail' | 'full_process';
    };
    onboarding_popup_view: {
        popup_name: 'skip_charge' | 'skip_setting';
    };
    onboarding_popup_click: {
        popup_name: 'skip_charge' | 'skip_setting';
        button_name: 'charge' | 'know' | 'enter' | 'setting' | 'close';
    };
    desktop_upgrade_click: Record<string, never>;
    desktop_upgrade_download_result: {
        is_success: boolean;
        error_reason?: string;
    };
    desktop_upgrade_install_restart_click: Record<string, never>;
    send_button_click: {
        session_id?: SessionId;
        model_name?: string;
        thinking_effort?: string;
        run_mode: 'plan' | 'goal' | 'default';
        msg_type: 'default' | 'steer' | 'queue';
        is_new_session: boolean;
        agent_preset?: AnalyticsPreset | 'other';
    };
    model_switch: {
        session_id?: SessionId;
        switch_from: string;
        switch_to: string;
    };
    thinking_level_switch: {
        session_id?: SessionId;
        switch_from: string;
        switch_to: string;
        model_name: string;
    };
    context_compression: {
        session_id: SessionId;
        trigger_type: 'auto' | 'manual';
    };
    branch_session_click: {
        session_id: SessionId;
        parent_session_id: SessionId;
        parent_message_id?: MessageId;
        click_position: 'footer' | 'sidebar';
    };
    sidebar_menu_click: {
        menu_name: SidebarAnalyticsEntry;
        position?: SidebarAnalyticsPosition;
    };
    more_menu_item_click: {
        region: EntryAnalyticsRegion;
        action: 'browse_plugins' | 'create_plugin';
    };
    agent_preset_switch: {
        switch_from: AnalyticsPreset | 'other';
        switch_to: AnalyticsPreset;
        code_work_view_enabled: boolean;
    };
    code_work_view_toggle: {
        is_enabled: boolean;
    };
    plugin_toggle: {
        plugin_name: string;
        plugin_type: 'plugin' | 'bundle';
        is_enabled: boolean;
        is_builtin: boolean;
    };
    plugin_add_button_click: Record<string, never>;
    plugin_install_click: {
        input_value: string;
    };
    install_plugin_result: {
        input_value: string;
        is_success: boolean;
        error_reason?: string;
        duration: number;
        plugin_name?: string;
    };
    confirm_uninstall_plugin: {
        plugin_name: string;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `desktop_app_launch` | `desktop_app_launch: Record<string, never>;` |
| `auth_page_view` | `auth_page_view: Record<string, never>;` |
| `auth_page_click` | `auth_page_click: { button_name: 'sign_in' \| 'api-key'; };` |
| `api_key_save_click` | `api_key_save_click: Record<string, never>;` |
| `onboarding_page_view` | `onboarding_page_view: { page_name: OnboardingPage; };` |
| `onboarding_page_click` | `onboarding_page_click: { page_name: OnboardingPage; button_name: 'next' \| 'back' \| 'skip' \| 'charge' \| 'later' \| 'continue'; selected_content?: 'office' \| 'code' \| 'code_office' \| 'focus_result' \| 'key_detail' \| 'full_process'; };` |
| `onboarding_popup_view` | `onboarding_popup_view: { popup_name: 'skip_charge' \| 'skip_setting'; };` |
| `onboarding_popup_click` | `onboarding_popup_click: { popup_name: 'skip_charge' \| 'skip_setting'; button_name: 'charge' \| 'know' \| 'enter' \| 'setting' \| 'close'; };` |
| `desktop_upgrade_click` | `desktop_upgrade_click: Record<string, never>;` |
| `desktop_upgrade_download_result` | `desktop_upgrade_download_result: { is_success: boolean; error_reason?: string; };` |
| `desktop_upgrade_install_restart_click` | `desktop_upgrade_install_restart_click: Record<string, never>;` |
| `send_button_click` | `send_button_click: { session_id?: SessionId; model_name?: string; thinking_effort?: string; run_mode: 'plan' \| 'goal' \| 'default'; msg_type: 'default' \| 'steer' \| 'queue'; is_new_session: boolean; agent_preset?: AnalyticsPreset \| 'other'; };` |
| `model_switch` | `model_switch: { session_id?: SessionId; switch_from: string; switch_to: string; };` |
| `thinking_level_switch` | `thinking_level_switch: { session_id?: SessionId; switch_from: string; switch_to: string; model_name: string; };` |
| `context_compression` | `context_compression: { session_id: SessionId; trigger_type: 'auto' \| 'manual'; };` |
| `branch_session_click` | `branch_session_click: { session_id: SessionId; parent_session_id: SessionId; parent_message_id?: MessageId; click_position: 'footer' \| 'sidebar'; };` |
| `sidebar_menu_click` | `sidebar_menu_click: { menu_name: SidebarAnalyticsEntry; position?: SidebarAnalyticsPosition; };` |
| `more_menu_item_click` | `more_menu_item_click: { region: EntryAnalyticsRegion; action: 'browse_plugins' \| 'create_plugin'; };` |
| `agent_preset_switch` | `agent_preset_switch: { switch_from: AnalyticsPreset \| 'other'; switch_to: AnalyticsPreset; code_work_view_enabled: boolean; };` |
| `code_work_view_toggle` | `code_work_view_toggle: { is_enabled: boolean; };` |
| `plugin_toggle` | `plugin_toggle: { plugin_name: string; plugin_type: 'plugin' \| 'bundle'; is_enabled: boolean; is_builtin: boolean; };` |
| `plugin_add_button_click` | `plugin_add_button_click: Record<string, never>;` |
| `plugin_install_click` | `plugin_install_click: { input_value: string; };` |
| `install_plugin_result` | `install_plugin_result: { input_value: string; is_success: boolean; error_reason?: string; duration: number; plugin_name?: string; };` |
| `confirm_uninstall_plugin` | `confirm_uninstall_plugin: { plugin_name: string; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SidebarAnalyticsEntry = 'new_session' | 'plugin' | 'cron' | 'more'

export type SidebarAnalyticsPosition = 'sidebar' | 'sidebar_more' | 'titlebar'

export type EntryAnalyticsRegion = 'sidebar' | 'conversation' | 'rightbar'

export type AnalyticsPreset = 'creator' | 'ptc' | 'minimal' | 'standard'

export type OnboardingPage = 'onboarding_welcome' | 'onboarding_recharge' | 'onboarding_use_case' | 'onboarding_process'
```

## SidebarAnalyticsEntry client

入口 `@deepseek-ai/dsh-client-product-analytics/client`，公开符号 `SidebarAnalyticsEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarAnalyticsEntry = 'new_session' | 'plugin' | 'cron' | 'more';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## SidebarAnalyticsPosition client

入口 `@deepseek-ai/dsh-client-product-analytics/client`，公开符号 `SidebarAnalyticsPosition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarAnalyticsPosition = 'sidebar' | 'sidebar_more' | 'titlebar';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## TrackProductEvent client

入口 `@deepseek-ai/dsh-client-product-analytics/client`，公开符号 `TrackProductEvent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TrackProductEvent = <K extends keyof ProductEventMap>(name: K, attributes: ProductEventMap[K]) => void;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ProductEventMap {
  desktop_app_launch: Record<string, never>
  auth_page_view: Record<string, never>
  auth_page_click: { button_name: 'sign_in' | 'api-key' }
  api_key_save_click: Record<string, never>
  onboarding_page_view: { page_name: OnboardingPage }
  onboarding_page_click: {
    page_name: OnboardingPage
    button_name: 'next' | 'back' | 'skip' | 'charge' | 'later' | 'continue'
    selected_content?: 'office' | 'code' | 'code_office' | 'focus_result' | 'key_detail' | 'full_process'
  }
  onboarding_popup_view: { popup_name: 'skip_charge' | 'skip_setting' }
  onboarding_popup_click: { popup_name: 'skip_charge' | 'skip_setting'; button_name: 'charge' | 'know' | 'enter' | 'setting' | 'close' }
  desktop_upgrade_click: Record<string, never>
  desktop_upgrade_download_result: { is_success: boolean; error_reason?: string }
  desktop_upgrade_install_restart_click: Record<string, never>
  send_button_click: {
    session_id?: SessionId
    model_name?: string
    thinking_effort?: string
    run_mode: 'plan' | 'goal' | 'default'
    msg_type: 'default' | 'steer' | 'queue'

    is_new_session: boolean

    agent_preset?: AnalyticsPreset | 'other'
  }
  model_switch: { session_id?: SessionId; switch_from: string; switch_to: string }
  thinking_level_switch: { session_id?: SessionId; switch_from: string; switch_to: string; model_name: string }
  context_compression: { session_id: SessionId; trigger_type: 'auto' | 'manual' }
  branch_session_click: {
    session_id: SessionId
    parent_session_id: SessionId
    parent_message_id?: MessageId
    click_position: 'footer' | 'sidebar'
  }
  sidebar_menu_click: { menu_name: SidebarAnalyticsEntry; position?: SidebarAnalyticsPosition }
  more_menu_item_click: { region: EntryAnalyticsRegion; action: 'browse_plugins' | 'create_plugin' }
  agent_preset_switch: { switch_from: AnalyticsPreset | 'other'; switch_to: AnalyticsPreset; code_work_view_enabled: boolean }
  code_work_view_toggle: { is_enabled: boolean }
  plugin_toggle: { plugin_name: string; plugin_type: 'plugin' | 'bundle'; is_enabled: boolean; is_builtin: boolean }
  plugin_add_button_click: Record<string, never>
  plugin_install_click: { input_value: string }
  install_plugin_result: {
    input_value: string
    is_success: boolean
    error_reason?: string
    duration: number
    plugin_name?: string
  }
  confirm_uninstall_plugin: { plugin_name: string }
}

export type SidebarAnalyticsEntry = 'new_session' | 'plugin' | 'cron' | 'more'

export type SidebarAnalyticsPosition = 'sidebar' | 'sidebar_more' | 'titlebar'

export type EntryAnalyticsRegion = 'sidebar' | 'conversation' | 'rightbar'

export type AnalyticsPreset = 'creator' | 'ptc' | 'minimal' | 'standard'

export type OnboardingPage = 'onboarding_welcome' | 'onboarding_recharge' | 'onboarding_use_case' | 'onboarding_process'
```

## AnalyticsPreset types

入口 `@deepseek-ai/dsh-client-product-analytics/types`，公开符号 `AnalyticsPreset`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type AnalyticsPreset = 'creator' | 'ptc' | 'minimal' | 'standard';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## EntryAnalyticsRegion types

入口 `@deepseek-ai/dsh-client-product-analytics/types`，公开符号 `EntryAnalyticsRegion`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type EntryAnalyticsRegion = 'sidebar' | 'conversation' | 'rightbar';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## OnboardingPage types

入口 `@deepseek-ai/dsh-client-product-analytics/types`，公开符号 `OnboardingPage`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type OnboardingPage = 'onboarding_welcome' | 'onboarding_recharge' | 'onboarding_use_case' | 'onboarding_process';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## ProductEvent types

入口 `@deepseek-ai/dsh-client-product-analytics/types`，公开符号 `ProductEvent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type ProductEvent = {
    [K in keyof ProductEventMap]: {
        eventName: K;
        attributes: ProductEventMap[K];
        timestamp: number;
    };
}[keyof ProductEventMap];
```

成员及调用形式以上方完整声明或权威链接为准。

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export interface ProductEventMap {
  desktop_app_launch: Record<string, never>
  auth_page_view: Record<string, never>
  auth_page_click: { button_name: 'sign_in' | 'api-key' }
  api_key_save_click: Record<string, never>
  onboarding_page_view: { page_name: OnboardingPage }
  onboarding_page_click: {
    page_name: OnboardingPage
    button_name: 'next' | 'back' | 'skip' | 'charge' | 'later' | 'continue'
    selected_content?: 'office' | 'code' | 'code_office' | 'focus_result' | 'key_detail' | 'full_process'
  }
  onboarding_popup_view: { popup_name: 'skip_charge' | 'skip_setting' }
  onboarding_popup_click: { popup_name: 'skip_charge' | 'skip_setting'; button_name: 'charge' | 'know' | 'enter' | 'setting' | 'close' }
  desktop_upgrade_click: Record<string, never>
  desktop_upgrade_download_result: { is_success: boolean; error_reason?: string }
  desktop_upgrade_install_restart_click: Record<string, never>
  send_button_click: {
    session_id?: SessionId
    model_name?: string
    thinking_effort?: string
    run_mode: 'plan' | 'goal' | 'default'
    msg_type: 'default' | 'steer' | 'queue'

    is_new_session: boolean

    agent_preset?: AnalyticsPreset | 'other'
  }
  model_switch: { session_id?: SessionId; switch_from: string; switch_to: string }
  thinking_level_switch: { session_id?: SessionId; switch_from: string; switch_to: string; model_name: string }
  context_compression: { session_id: SessionId; trigger_type: 'auto' | 'manual' }
  branch_session_click: {
    session_id: SessionId
    parent_session_id: SessionId
    parent_message_id?: MessageId
    click_position: 'footer' | 'sidebar'
  }
  sidebar_menu_click: { menu_name: SidebarAnalyticsEntry; position?: SidebarAnalyticsPosition }
  more_menu_item_click: { region: EntryAnalyticsRegion; action: 'browse_plugins' | 'create_plugin' }
  agent_preset_switch: { switch_from: AnalyticsPreset | 'other'; switch_to: AnalyticsPreset; code_work_view_enabled: boolean }
  code_work_view_toggle: { is_enabled: boolean }
  plugin_toggle: { plugin_name: string; plugin_type: 'plugin' | 'bundle'; is_enabled: boolean; is_builtin: boolean }
  plugin_add_button_click: Record<string, never>
  plugin_install_click: { input_value: string }
  install_plugin_result: {
    input_value: string
    is_success: boolean
    error_reason?: string
    duration: number
    plugin_name?: string
  }
  confirm_uninstall_plugin: { plugin_name: string }
}

export type SidebarAnalyticsEntry = 'new_session' | 'plugin' | 'cron' | 'more'

export type SidebarAnalyticsPosition = 'sidebar' | 'sidebar_more' | 'titlebar'

export type EntryAnalyticsRegion = 'sidebar' | 'conversation' | 'rightbar'

export type AnalyticsPreset = 'creator' | 'ptc' | 'minimal' | 'standard'

export type OnboardingPage = 'onboarding_welcome' | 'onboarding_recharge' | 'onboarding_use_case' | 'onboarding_process'
```

## ProductEventMap types

入口 `@deepseek-ai/dsh-client-product-analytics/types`，公开符号 `ProductEventMap`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export interface ProductEventMap {
    desktop_app_launch: Record<string, never>;
    auth_page_view: Record<string, never>;
    auth_page_click: {
        button_name: 'sign_in' | 'api-key';
    };
    api_key_save_click: Record<string, never>;
    onboarding_page_view: {
        page_name: OnboardingPage;
    };
    onboarding_page_click: {
        page_name: OnboardingPage;
        button_name: 'next' | 'back' | 'skip' | 'charge' | 'later' | 'continue';
        selected_content?: 'office' | 'code' | 'code_office' | 'focus_result' | 'key_detail' | 'full_process';
    };
    onboarding_popup_view: {
        popup_name: 'skip_charge' | 'skip_setting';
    };
    onboarding_popup_click: {
        popup_name: 'skip_charge' | 'skip_setting';
        button_name: 'charge' | 'know' | 'enter' | 'setting' | 'close';
    };
    desktop_upgrade_click: Record<string, never>;
    desktop_upgrade_download_result: {
        is_success: boolean;
        error_reason?: string;
    };
    desktop_upgrade_install_restart_click: Record<string, never>;
    send_button_click: {
        session_id?: SessionId;
        model_name?: string;
        thinking_effort?: string;
        run_mode: 'plan' | 'goal' | 'default';
        msg_type: 'default' | 'steer' | 'queue';
        is_new_session: boolean;
        agent_preset?: AnalyticsPreset | 'other';
    };
    model_switch: {
        session_id?: SessionId;
        switch_from: string;
        switch_to: string;
    };
    thinking_level_switch: {
        session_id?: SessionId;
        switch_from: string;
        switch_to: string;
        model_name: string;
    };
    context_compression: {
        session_id: SessionId;
        trigger_type: 'auto' | 'manual';
    };
    branch_session_click: {
        session_id: SessionId;
        parent_session_id: SessionId;
        parent_message_id?: MessageId;
        click_position: 'footer' | 'sidebar';
    };
    sidebar_menu_click: {
        menu_name: SidebarAnalyticsEntry;
        position?: SidebarAnalyticsPosition;
    };
    more_menu_item_click: {
        region: EntryAnalyticsRegion;
        action: 'browse_plugins' | 'create_plugin';
    };
    agent_preset_switch: {
        switch_from: AnalyticsPreset | 'other';
        switch_to: AnalyticsPreset;
        code_work_view_enabled: boolean;
    };
    code_work_view_toggle: {
        is_enabled: boolean;
    };
    plugin_toggle: {
        plugin_name: string;
        plugin_type: 'plugin' | 'bundle';
        is_enabled: boolean;
        is_builtin: boolean;
    };
    plugin_add_button_click: Record<string, never>;
    plugin_install_click: {
        input_value: string;
    };
    install_plugin_result: {
        input_value: string;
        is_success: boolean;
        error_reason?: string;
        duration: number;
        plugin_name?: string;
    };
    confirm_uninstall_plugin: {
        plugin_name: string;
    };
}
```

| 成员 | 公开声明 |
| --- | --- |
| `desktop_app_launch` | `desktop_app_launch: Record<string, never>;` |
| `auth_page_view` | `auth_page_view: Record<string, never>;` |
| `auth_page_click` | `auth_page_click: { button_name: 'sign_in' \| 'api-key'; };` |
| `api_key_save_click` | `api_key_save_click: Record<string, never>;` |
| `onboarding_page_view` | `onboarding_page_view: { page_name: OnboardingPage; };` |
| `onboarding_page_click` | `onboarding_page_click: { page_name: OnboardingPage; button_name: 'next' \| 'back' \| 'skip' \| 'charge' \| 'later' \| 'continue'; selected_content?: 'office' \| 'code' \| 'code_office' \| 'focus_result' \| 'key_detail' \| 'full_process'; };` |
| `onboarding_popup_view` | `onboarding_popup_view: { popup_name: 'skip_charge' \| 'skip_setting'; };` |
| `onboarding_popup_click` | `onboarding_popup_click: { popup_name: 'skip_charge' \| 'skip_setting'; button_name: 'charge' \| 'know' \| 'enter' \| 'setting' \| 'close'; };` |
| `desktop_upgrade_click` | `desktop_upgrade_click: Record<string, never>;` |
| `desktop_upgrade_download_result` | `desktop_upgrade_download_result: { is_success: boolean; error_reason?: string; };` |
| `desktop_upgrade_install_restart_click` | `desktop_upgrade_install_restart_click: Record<string, never>;` |
| `send_button_click` | `send_button_click: { session_id?: SessionId; model_name?: string; thinking_effort?: string; run_mode: 'plan' \| 'goal' \| 'default'; msg_type: 'default' \| 'steer' \| 'queue'; is_new_session: boolean; agent_preset?: AnalyticsPreset \| 'other'; };` |
| `model_switch` | `model_switch: { session_id?: SessionId; switch_from: string; switch_to: string; };` |
| `thinking_level_switch` | `thinking_level_switch: { session_id?: SessionId; switch_from: string; switch_to: string; model_name: string; };` |
| `context_compression` | `context_compression: { session_id: SessionId; trigger_type: 'auto' \| 'manual'; };` |
| `branch_session_click` | `branch_session_click: { session_id: SessionId; parent_session_id: SessionId; parent_message_id?: MessageId; click_position: 'footer' \| 'sidebar'; };` |
| `sidebar_menu_click` | `sidebar_menu_click: { menu_name: SidebarAnalyticsEntry; position?: SidebarAnalyticsPosition; };` |
| `more_menu_item_click` | `more_menu_item_click: { region: EntryAnalyticsRegion; action: 'browse_plugins' \| 'create_plugin'; };` |
| `agent_preset_switch` | `agent_preset_switch: { switch_from: AnalyticsPreset \| 'other'; switch_to: AnalyticsPreset; code_work_view_enabled: boolean; };` |
| `code_work_view_toggle` | `code_work_view_toggle: { is_enabled: boolean; };` |
| `plugin_toggle` | `plugin_toggle: { plugin_name: string; plugin_type: 'plugin' \| 'bundle'; is_enabled: boolean; is_builtin: boolean; };` |
| `plugin_add_button_click` | `plugin_add_button_click: Record<string, never>;` |
| `plugin_install_click` | `plugin_install_click: { input_value: string; };` |
| `install_plugin_result` | `install_plugin_result: { input_value: string; is_success: boolean; error_reason?: string; duration: number; plugin_name?: string; };` |
| `confirm_uninstall_plugin` | `confirm_uninstall_plugin: { plugin_name: string; };` |

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

同文件声明的形状依赖：

```text
export type SidebarAnalyticsEntry = 'new_session' | 'plugin' | 'cron' | 'more'

export type SidebarAnalyticsPosition = 'sidebar' | 'sidebar_more' | 'titlebar'

export type EntryAnalyticsRegion = 'sidebar' | 'conversation' | 'rightbar'

export type AnalyticsPreset = 'creator' | 'ptc' | 'minimal' | 'standard'

export type OnboardingPage = 'onboarding_welcome' | 'onboarding_recharge' | 'onboarding_use_case' | 'onboarding_process'
```

## SidebarAnalyticsEntry types

入口 `@deepseek-ai/dsh-client-product-analytics/types`，公开符号 `SidebarAnalyticsEntry`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarAnalyticsEntry = 'new_session' | 'plugin' | 'cron' | 'more';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## SidebarAnalyticsPosition types

入口 `@deepseek-ai/dsh-client-product-analytics/types`，公开符号 `SidebarAnalyticsPosition`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type SidebarAnalyticsPosition = 'sidebar' | 'sidebar_more' | 'titlebar';
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。

## TrackProductEvent types

入口 `@deepseek-ai/dsh-client-product-analytics/types`，公开符号 `TrackProductEvent`。以下形状保留输入、输出和联合分支；`?` 或 `undefined` 表示允许缺省，不代表运行时会创建值。

```text
export type TrackProductEvent = <K extends keyof ProductEventMap>(name: K, attributes: ProductEventMap[K]) => void;
```

生命周期与验证：遵守本页开头的运行侧和资源归属；类型对象本身不创建资源。调用返回的 disposer／unsubscribe 需要由创建者释放，传入 AbortSignal 的调用随 owner 中止；纯展示 props 的状态由父级维护。按 [使用任务](../how-to/how-to-client-product-analytics.md#接入-product-analytics) 在真实装载路径检验成功、失败与卸载。


同文件声明的形状依赖：

```text
export interface ProductEventMap {
  desktop_app_launch: Record<string, never>
  auth_page_view: Record<string, never>
  auth_page_click: { button_name: 'sign_in' | 'api-key' }
  api_key_save_click: Record<string, never>
  onboarding_page_view: { page_name: OnboardingPage }
  onboarding_page_click: {
    page_name: OnboardingPage
    button_name: 'next' | 'back' | 'skip' | 'charge' | 'later' | 'continue'
    selected_content?: 'office' | 'code' | 'code_office' | 'focus_result' | 'key_detail' | 'full_process'
  }
  onboarding_popup_view: { popup_name: 'skip_charge' | 'skip_setting' }
  onboarding_popup_click: { popup_name: 'skip_charge' | 'skip_setting'; button_name: 'charge' | 'know' | 'enter' | 'setting' | 'close' }
  desktop_upgrade_click: Record<string, never>
  desktop_upgrade_download_result: { is_success: boolean; error_reason?: string }
  desktop_upgrade_install_restart_click: Record<string, never>
  send_button_click: {
    session_id?: SessionId
    model_name?: string
    thinking_effort?: string
    run_mode: 'plan' | 'goal' | 'default'
    msg_type: 'default' | 'steer' | 'queue'

    is_new_session: boolean

    agent_preset?: AnalyticsPreset | 'other'
  }
  model_switch: { session_id?: SessionId; switch_from: string; switch_to: string }
  thinking_level_switch: { session_id?: SessionId; switch_from: string; switch_to: string; model_name: string }
  context_compression: { session_id: SessionId; trigger_type: 'auto' | 'manual' }
  branch_session_click: {
    session_id: SessionId
    parent_session_id: SessionId
    parent_message_id?: MessageId
    click_position: 'footer' | 'sidebar'
  }
  sidebar_menu_click: { menu_name: SidebarAnalyticsEntry; position?: SidebarAnalyticsPosition }
  more_menu_item_click: { region: EntryAnalyticsRegion; action: 'browse_plugins' | 'create_plugin' }
  agent_preset_switch: { switch_from: AnalyticsPreset | 'other'; switch_to: AnalyticsPreset; code_work_view_enabled: boolean }
  code_work_view_toggle: { is_enabled: boolean }
  plugin_toggle: { plugin_name: string; plugin_type: 'plugin' | 'bundle'; is_enabled: boolean; is_builtin: boolean }
  plugin_add_button_click: Record<string, never>
  plugin_install_click: { input_value: string }
  install_plugin_result: {
    input_value: string
    is_success: boolean
    error_reason?: string
    duration: number
    plugin_name?: string
  }
  confirm_uninstall_plugin: { plugin_name: string }
}

export type SidebarAnalyticsEntry = 'new_session' | 'plugin' | 'cron' | 'more'

export type SidebarAnalyticsPosition = 'sidebar' | 'sidebar_more' | 'titlebar'

export type EntryAnalyticsRegion = 'sidebar' | 'conversation' | 'rightbar'

export type AnalyticsPreset = 'creator' | 'ptc' | 'minimal' | 'standard'

export type OnboardingPage = 'onboarding_welcome' | 'onboarding_recharge' | 'onboarding_use_case' | 'onboarding_process'
```
