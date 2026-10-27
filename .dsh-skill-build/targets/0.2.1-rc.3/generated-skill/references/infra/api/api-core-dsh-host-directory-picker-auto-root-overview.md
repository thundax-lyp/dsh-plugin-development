# @deepseek-ai/dsh-host-directory-picker-auto .

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。

## 对象关系

`dsh-host-directory-picker-auto` 为每次启动选出正确的目录选择交互：它在启动时一次性判定宿主处境，并把匹配的后端——原生或浏览——连同其 browser 半侧一起，作为真实的 Loader 条目挂进内存根树。判定是一次纯函数的启动时采样：`native` 要求无远程 authority 信任、仅回环绑定、非 SSH 启动与可服务的显示会话；任何含糊情形都判定为处处可用的 `browse`。固定某种交互就是直接组合那个后端。挂载的能力在服务生命周期内保持稳定，符合 seam 的要求。

- [公开对象组 1](api-core-dsh-host-directory-picker-auto-root-1.md)。
- [公开对象组 2](api-core-dsh-host-directory-picker-auto-root-2.md)。

## 选型与使用

根据需要的运行侧选此模块，不把 Host 导出带入浏览器。导入数据类型时优先 `import type`；消费服务前声明 `inject`，服务不满足时观察 PENDING，不能用配置列表位置代替依赖。具体 [接入任务](../how-to/how-to-core-advanced.md#选用-host-目录与-web-集成能力) 给出装载和验证顺序。
