# Host/Remote 服务包 API 候选矩阵

目标 `dsh-v0.2.0-rc.1`，commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`。机器裁决见 [host-remote-core-api-decisions.json](host-remote-core-api-decisions.json)，由 [生成脚本](generate-host-remote-core-matrix.py) 从同一目标的 `skill-source/api-surface.json` 中仅取 `pending` entry、object 和 member 重建。每行保留原始 ID、精确源文件、签名、`include`/`merge`/`exclude`、现有 owner/section 与判定理由。没有修改共享账本。

本轮选择此前七包以外的五个 Host/Remote 核心包：`dsh-plugin-manager`、`cordis`、`dsh-client-connection`、`dsh-host-webserver`、`dsh-typert-loader`。共 439 行：6 entry、154 object、279 member；30 `include`、326 `merge`、83 `exclude`。

| 包 | entry | object | member | 裁决要点 |
| --- | ---: | ---: | ---: | --- |
| `dsh-plugin-manager` | 4 | 58 | 103 | Service 和结果归现有管理 reference；`./operations` 的 pnpm/manifest 事务步骤与 `./registry` 规划不提升为普通插件 SPI；`./types` 合并同名类型。 |
| `cordis` | 1 | 43 | 92 | Context/Service 相关事件、effect、注入、日志类型合并到 Cordis 核心；格式化、反射、stack 等基础实现 helper 排除。 |
| `dsh-client-connection` | 0 | 39 | 54 | Host fetch/RPC route、handler、endpoint matcher 纳入受保护 ingress 任务；carrier envelope/schema 和固定 `/api` 协议排除。 |
| `dsh-host-webserver` | 0 | 8 | 29 | `WebRoute`、`WebUpgradeRoute`、`Config`、`IndexInjection` 等归现有 Web ingress；`renderIndexInjections` 是纯渲染 helper。 |
| `dsh-typert-loader` | 1 | 6 | 1 | Loader 的 generated `./typert` 装载与 manifest 检查归 Remote 组合；业务插件不调用验证器或手写描述符。 |

`include` 所属真实作者任务已在 [Connection reference](../../skill-source/api-guardrails/client-connection.md#对象类型与成员) 和 [Web ingress reference](../../skill-source/api-guardrails/web-ingress.md#对象类型与成员) 给出成员契约。本轮特别补上 `ConnectionRpcEndpointMatcher` 的函数签名与非认证语义；所有 include 对象/成员名称在 owner 文本可定位。`dsh-client-connection` 的 `HostConnectionHandle`、Client handle 等此前已有纳入裁决，本矩阵只复核剩余 pending，不改变其既有决定。

验证：生成脚本成功；439 行的 owner 文件与精确 heading、源文件存在性、ID 唯一、include token 在 owner 文本中可定位均通过。本轮只做源码/声明/文档一致性审查，未新跑 HTTP、RPC、Loader、浏览器或 Profile 集成测试；既有专题的隔离运行证据与未验证边界仍保持原样。
