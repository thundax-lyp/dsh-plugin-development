# 转换已授权的 Office 文件

相关公开契约：[API 参考](api-office-to-pdf.md)。

## 任务与依赖

在 Host 插件中将已获准读取的 Office 文件转换成 PDF。安装精确版本的 `@deepseek-ai/cordis@4.0.4`、`@deepseek-ai/dsh-office-to-pdf@0.2.0-rc.1`。以下示例从可信 Host 配置给出的绝对路径读取；面向用户或模型的入口须先执行自己的路径授权，不能直接传入未审查的参数。

## 完整最小骨架

```ts
import { readFile, stat } from 'node:fs/promises'
import { Context } from '@deepseek-ai/cordis'
import OfficeToPdf, { OfficeSourceKey, type OfficeExtension } from '@deepseek-ai/dsh-office-to-pdf'

async function convertAuthorizedFile(path: string, extension: OfficeExtension, signal: AbortSignal): Promise<Uint8Array> {
  const ctx = new Context()
  try {
    await ctx.plugin(OfficeToPdf)
    // path comes from trusted Host configuration; authorize untrusted callers before this point.
    const before = await stat(path)
    if (!before.isFile()) throw new Error('Expected a regular Office file')
    const version = `${before.dev}:${before.ino}:${before.size}:${before.mtimeMs}`
    const result = await ctx.officeToPdf.convert({
      extension,
      priority: 'foreground',
      source: {
        key: OfficeSourceKey(JSON.stringify(['host-config', path])),
        version,
        bytes: before.size,
        async read(readSignal, maxBytes) {
          readSignal.throwIfAborted()
          if (before.size > maxBytes) throw new Error('Source exceeds reserved bytes')
          const bytes = await readFile(path, { signal: readSignal })
          if (bytes.length > maxBytes) throw new Error('Source exceeds reserved bytes')
          const after = await stat(path)
          const actualVersion = `${after.dev}:${after.ino}:${after.size}:${after.mtimeMs}`
          return { bytes, version: actualVersion }
        },
      },
    }, signal)
    return result.pdf
  } finally {
    await ctx.fiber.dispose()
  }
}
```

调用方拥有返回字节，负责存储、交付或丢弃。Provider 卸载负责释放 converter 和临时目录。`finally` 在装载失败、读取失败、取消和转换失败时同样执行。对可由攻击者替换的文件，使用经授权的文件句柄和版本策略，避免 `stat` 与读取之间的路径替换；本例仅适用于受 Host 控制的文件。

## 验证

在隔离 Host 环境运行声明编译，并分别用真实 Office 输入与目标机 LibreOffice 引擎检查 `%PDF-` 输出、取消和卸载。若只跑精确 tag 的 provider 测试，其 converter 为 mock，只能验证队列、资源上限和清理逻辑。
