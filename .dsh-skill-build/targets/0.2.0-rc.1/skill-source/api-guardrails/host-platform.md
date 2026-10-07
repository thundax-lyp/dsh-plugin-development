# Host 目录选择与打开应用

## 目标与公开入口

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`@deepseek-ai/dsh-host-directory-picker` 默认导出抽象 `DirectoryPicker`，服务 `ctx.directoryPicker`。Host 插件可依赖它消费目录选择能力，或继承该 Service 实现一个新 backend；完整消费示例见[使用目录选择能力](how-to-use-directory-picker.md)。`@deepseek-ai/dsh-host-directory-picker-native` 和 `...-browse` 是发布的具体 backend，`...-auto` 根据启动环境挂载相应 Host backend 与 Client UI；单独挂载 Host backend 不会自动提供 Client UI。

## 能力和错误

| 对象                                                | 成员与边界                                                                                                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 默认 `DirectoryPicker`                              | 是具名抽象 Service 的别名；backend 实现 `capability(): DirectoryPickerCapability` 并保证返回对象在服务生命周期内稳定。                                                 |
| `DirectoryPickerNativeCapability`                   | `kind:'native'`、`pick(signal): Promise<string \| null>`；`null` 只表示操作员取消。                                                                                    |
| `DirectoryPickerBrowseCapability`                   | `kind:'browse'`、`list(path?,signal?)`、`createDirectory(path,name)`；路径须是完整 Host 路径，name 是单个非空片段。                                                    |
| `DirectoryPickerCapability`                         | 从可声明合并的 `DirectoryPickerCapabilities` 按 kind 得到的联合；未知 kind 要由消费者显式处理。                                                                        |
| `DirectoryEntry` / `DirectoryListing`               | entry 的 `name/path/hidden` 分别是显示名、绝对 Host 路径、隐藏标记；listing 的 `path/home/crumbs/entries/truncated` 是一层目录与祖先链。截断表示还有未报告的有序尾部。 |
| `DirectoryPickerError` / `DirectoryPickerErrorCode` | `code/path` 供业务分支；闭合代码为 `directory-unreadable`、`directory-exists`、`directory-create-failed`。                                                             |

`capability()` 在服务生命周期内应返回稳定对象。`kind:'native'` 提供 `pick(signal):Promise<string|null>`，调用 Host 显示器的 OS 对话框；`null` 表示操作员取消。`kind:'browse'` 提供 `list(path?,signal?)` 与 `createDirectory(parent,name)`；`list` 返回 `DirectoryListing`，包含绝对 `path`、`home`、从根到当前目录的 `crumbs`、直接子目录 `entries` 和 `truncated`。Client 应使用 Host 返回的绝对路径，不能拼接浏览器本地路径。browse 错误码为 `directory-unreadable`、`directory-exists`、`directory-create-failed`。能力 union 由 `DirectoryPickerCapabilities` 声明合并扩展；遇到未知 kind 的消费者应隐藏相应操作。一个 Context 只可有一个目录选择服务。

`native` 只适合操作员位于 Host 显示器；远程浏览器应用用 browse。现有 browse backend 的作用域是 Host 文件系统，列出隐藏项但以 `hidden` 标记，目录 symlink 可以进入；它不是自动权限门。发给远端的操作必须在独立可信入口做身份、工作区范围及路径授权，取消信号应绑定连接生命周期。

## open-in-app 边界

`@deepseek-ai/dsh-host-open-in-app` 与 `@deepseek-ai/dsh-client-ui-open-in-app` 组成固定目录的应用启动功能，Host 侧导出配置、函数插件和共享路由常量：`GET /open-in-app/apps`、`GET /open-in-app/icon/<id>`、`POST /open-in-app/open`。它从固定 `OPEN_IN_APP_CATALOG` 解析可用安装，不提供 `registerApp` 插件扩展入口。Host 三个路由先做 connection 的 Host/Origin 与认证拒绝，再做请求验证。不能把直接 HTTP POST 当作插件内部 API；扩展自定义应用启动需要自建授权路由与进程所有权。

## 验证边界

独立消费包用 npm 精确声明编译，真实 Cordis 服务运行目录选择适配层，覆盖 browse/list/create/错误/取消。具体 OS chooser、自动环境选择、Client UI 和 open-in-app 路由未在此消费 smoke 中启动。
