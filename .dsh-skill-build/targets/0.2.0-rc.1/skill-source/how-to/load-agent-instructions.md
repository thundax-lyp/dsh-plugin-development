# 读取工作区指令基线

相关公开契约：[API 参考](api-agent-instructions.md)。

## 任务

Host 插件预览一个可信工作区当前会给 Agent 使用的指令文本。安装 `@deepseek-ai/dsh-agent-instructions@0.2.0-rc.1`；`cwd` 与 `dshHome` 来自 Host 已授权配置，不能从不可信请求直接决定扫描根。

```ts
import { loadBaselineInstructions, type RenderedAgentInstructions } from '@deepseek-ai/dsh-agent-instructions'

export async function previewAgentInstructions(
  cwd: string, dshHome: string, signal: AbortSignal,
): Promise<RenderedAgentInstructions | undefined> {
  signal.throwIfAborted()
  return loadBaselineInstructions({ cwd, dshHome, maxBytes: 16_384, signal })
}
```

此函数不修改 Session 或工作区；调用者拥有预览结果，取消时撤销请求。真正向 Agent 注入指令时在 Profile 装载该包的 `apply` 插件与 `sessionProjections`，不能把此只读预览直接当作已提交模型上下文。自定义 FileSystem Provider 时将其传给 `loadBaselineInstructions` 的第二个参数，避免绕过产品的文件读取策略。

## 验证

精确声明编译；在隔离临时项目写入根标记、根/子目录指令和本地 overlay，检查优先级、字节截断、取消与无文件返回。真实 Agent 的首轮/触及更新和恢复仍需独立 Profile 测试。
