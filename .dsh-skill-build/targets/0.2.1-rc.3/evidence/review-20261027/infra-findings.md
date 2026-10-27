# Infra 独立审核

目标：`dsh-v0.2.1-rc.3`，commit `1f81c047fc48fa190a683e469daa699857e9afe8`。checkout HEAD 已核对且 tracked status 干净。只新增本审核证据，没有修改产物、源码、生成素材或版本账本。

## 任务结果与边界

先检查目标源码的公开教程、实际 exports/types、Cordis Service/effect、真实 base Profile 与 Remote assembly 调用方，再映射产物。独立任务及完成判据见 `infra-report.json` 的 tasks。没有访问真实消费项目、安装到用户 Profile、调用外部服务、改变凭证或穷尽所有插件任务。

- 独立导出名称检查：全部 473 个所属 reference，2399 个“入口/符号”声明；从目标 checkout 的实际 package.json 导出与编译声明通过 TypeScript checker 解析，2399 个均存在 named export。该结果不证明全部成员签名、生命周期或用户可见行为。
- 静态路由图：473/473 从分发 SKILL.md 可达。可达不代表实际 Agent 找到并使用；Agent 对照由主 Agent 负责。
- 本次运行正式示例检查器：Host 10 个代码块、Client 3 个代码块，0 diagnostics、0 ignored；1208 Markdown、15945 本地链接/锚点、14 JSON fence 与 1646 源码路径检查通过。输出 `infra-examples.log`。
- 自建真实 Cordis/ShellExecutor 探针已运行：首次注册成功，第二次 shell provider 被拒绝；未启动真实 OS 子进程。`infra-shell-duplicate.mjs`。
- Service/tool、FS/Domain/Web 完整例有公开依赖与构建/装载基础，静态路径与编译可用；本组未重跑其 Profile 端到端或故障耐久矩阵。新 Remote 的 Client 部分缺失，不能据 Host 例编译通过称跨端任务已完成。

## 分配与逐文件状态

分配 473：已审 11，部分审核 462，未审 0。完整路径、任务、读取路径、适用起点、证据层级、五维状态、发现号和未核查处逐项见 `infra-report.json` 的 files。部分审核只代表已做路由/导出名称/主题检查，不能计入完成内容审核。

已审文件：

- references/infra/examples/example-core-service.md
- references/infra/examples/example-core-tool.md
- references/infra/examples/example-core-remote.md
- references/infra/examples/example-runtime-fs.md
- references/infra/examples/example-runtime-storage.md
- references/infra/examples/example-runtime-web.md
- references/infra/how-to/how-to-core-remote.md
- references/infra/how-to/how-to-core-service.md
- references/infra/how-to/how-to-runtime-shell.md
- references/infra/api/api-runtime-shell-overview.md
- references/infra/api/api-core-dsh-settings-types-1.md

这里“已审”包含明确标识的静态审核，并不声称每份文件都有真实 Agent 或端到端执行证据。462 份部分审核的主要缺口是全部公开成员的语义/继承、各后端运行时序、实际 Agent 阅读和消融。没有因为文字长或重复样式就建议删除 reference。

## [P1] INFRA-1 默认 Profile 的 Shell 接入仍指导重复装载 provider

任务与起点：在新自定义或已有 base-backed Profile 中开发一个消费 `ctx.shell` 的插件。期望复用已存在的执行边界并调用，不破坏原组合。

实际观察：`references/infra/how-to/how-to-runtime-shell.md:9` 定位为消费 Profile；第 13 行直接要求装载 `subprocess-local` 与 `bash-local`，没有像 FS/storage/Web 文档那样先检查默认组合、区分独立空组合或明确停止旧 provider。目标源码 `packages/bundle/base/cordis.patch.yml:234-252` 已装载 subprocess-local 与 bash-sandbox；后者继承 LocalBashExecutor 注册同一 `ctx.shell`（`packages/shell/bash-sandbox/src/index.ts:45-69`、`packages/shell/bash-local/src/index.ts:97-110`、`packages/shell/shell/src/index.ts:64-66`）。`vendor/cordis/src/reflect.ts:277-305` 对重复服务明确抛错。

已复现：使用目标 built Context、SubprocessRuntime、LocalBashExecutor，第二个 shell provider 抛 `service "shell" has been registered at <root>`。此探针证明真实注册冲突；没有声称完整 base 在所有平台启动过。

改进：修改当前目标 `skill-source/how-to/runtime-shell.md`，首步先检查 `ctx.shell`、已有 entry 与平台。base-backed Profile 直接注入并复用；只有手工空组合添加 subprocess 与唯一 shell provider。明确切换裸后端需停用原 bash-sandbox/pwsh-sandbox 并由部署者决定执行边界，不能把重复挂载作为接入步骤。将同类默认 provider 任务一起检查（主 Agent 合并其他组同根因），避免只修本页。

验证：基于真实 base 的隔离 Profile 安装一个仅 inject shell 的消费包，无 provider 重复且保持原 sandboxMode；另测空组合与显式替换，检查 ACTIVE、命令结果、拒绝、取消和卸载。从源修复后走冻结、构建、独立验证与整目录替换。

## [P1] INFRA-2 自建 Remote 任务缺少 Client contribution 装配的可执行路径

任务与起点：在目标源码 workspace 新增自己的 Host Remote，再让浏览器 Client 调用。独立包只有消费已发布产物路径；生成器的 workspace 限制是目标版本事实，不要求其支持任意目录。

实际观察：`references/infra/examples/example-core-remote.md:3` 给最小 Host 实现；:50-71 的 package manifest 只有 Host/typert/remote 与 bundle 元数据，没有 Client 入口、./client 导出或 dsh.client。:102 仅写“Client 的 remote assembly 必须挂载本包生成的 contribution，并导入其声明合并”，:110 再要求“启用相应 assembly”。`how-to-core-remote.md:18` 同样只说 Client 装配挂载，直接跳到业务方 inject remote.localNotes。没有指出创建/改动哪个 Client 文件、怎样导入运行时 contribution 与声明、怎样 $mount/回滚/卸载、怎样把它加入实际 Client 模块组合。

精确版本实际做法：`packages/api/remotes/src/client/index.ts` 运行时 import 各 owner 的 /remote 并 export type{} 引入声明合并；:185-207 的 async apply 逐个 `await ctx.remote.$mount(contribution)`，失败倒序回滚并返回倒序 disposer。其 package.json 有 ./client 导出和 dsh.client.inject Gateway。正式产物全文搜索 `$mount` 只有协议声明、概述与泛述，没有任何实际 $mount 调用代码；localNotes 只出现在上述 HOWTO 和 Host 例。其他 reference 没有补齐此路径。

原因分类：步骤不足，非不存在的 API，也非独立包公开生成器缺陷。仅把现有 Settings Remote 挂好或编译 Host 例不能验证新自建 Remote 生成与装配。

改进：修改当前目标 `skill-source/examples/core-remote.md`，补齐源码 workspace 起点的 Client assembly 文件、真实 generated /remote 导入、声明合并、$mount/失败回滚/异步卸载、./client 与 dsh.client 及 Client 编译 reference/模块装载步骤。`skill-source/how-to/core-remote.md` 先指明两种起点和可执行状态；路由相应说明 Host-only 契约例与完整跨端路径。不要手写 fake Remote 声明或借现成 Settings 产物冒充新契约。

验证：从目标精确 checkout 的隔离副本中创建全新 LocalNotes，真实生成两侧工件，Host+Client 分别构建；生产 Client 模块系统装配后调用 echo，验证坏参不进方法、业务错误 details、取消、Client卸载、Host停用；没有完成前把该路径标为契约示例/未验证，不暗示完整照做。

## 跨组设置页时序证据（交主 Agent 合并）

`how-to-core-state.md:34-36` 只要求 describe 后保留 revision、写入带 expectedRevision、冲突重读协调；settings-root-1.md:116 同样泛述。没有说明编辑第一次变脏时捕获 baseline、远端更新期间仍持原 baseline、冲突保留草稿与用户决定如何协调。core-remote 也未补此流程。真实教程提供 form.state 与 form.mutate(operations, expectedRevision)，具体 UI 归 Client 组。本组不重复定级此项。

## 未覆盖

没有本组真实 Agent 对照、消融、完整自定义 Remote 生成装配、真实浏览器重连/授权、并发设置页交互、跨平台 SSH/CUA/native 后端、全部 long-tail provider 的生命周期或 Profile 运行矩阵。没有根据导出检查和示例编译把这些标为通过。
