# Plugin development routing

- Host service、工具、LLM、Session、交互、job、Skill、subagent 或 workflow：[Host/Core guardrail](api-host-core.md)、[公开对象](api-host-core-surface.md) 与 [HOW-TO](how-to-host-core.md)。
- Client package、slot、store、Remote 或 settings：[Client/Web guardrail](api-client-web.md)、[公开对象](api-client-web-surface.md) 与 [HOW-TO](how-to-client-web.md)。
- package、bundle、Profile、provider、filesystem、process、storage、MCP、route 或 webhook：[基础设施 guardrail](api-infra-runtime.md)、[公开对象](api-infra-runtime-surface.md) 与 [HOW-TO](how-to-infra-runtime.md)。

每条路径都以真实 Profile 装载和卸载为完成边界；静态导出或声明存在只用于定位。
