# 对已装配 Profile 做 Loader 进程测试

## 前提与任务

目标 `dsh-v0.2.0-rc.1`。当插件包已有可启动的 app bin 和真实 `cordis.yml` Profile 时，`@deepseek-ai/dsh-loader-smoke` 的 `runLoaderSmoke` 可起一个隔离进程并观察完整装载结果。它不会代写 Profile，也不适合只测试一个纯函数。先在配置中装入待测 Host 插件，准备能在关闭 stdin 后自行退出的测试 driver；driver 应把注册、一次性操作、卸载等可检事实写入隔离 cwd 的报告。API 归属见[测试支持包](api-testing-support.md)。

## 调用骨架

从测试包安装目标版本 `@deepseek-ai/dsh-loader-smoke@0.2.0-rc.1`，并拥有实际绝对路径 `srcBin`、`builtBin`、`configPath`、`tsconfigPath`。构建完成的独立消费测试用 `mode: 'lib'`；仓库源码测试可用 `mode: 'src'` 和 `sourceImport: 'tsx/esm'`。例如：

```ts
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { runLoaderSmoke } from '@deepseek-ai/dsh-loader-smoke'

interface Report { registered: boolean; unloaded: boolean }

async function checkProfile(paths: {
  srcBin: string; builtBin: string; configPath: string; tsconfigPath: string
}): Promise<void> {
  let report: Report | undefined
  const result = await runLoaderSmoke({
    label: 'my-plugin-profile',
    tempDirPrefix: 'my-plugin-profile-',
    binScript: paths.srcBin,
    libBinScript: paths.builtBin,
    configPath: paths.configPath,
    tsconfigPath: paths.tsconfigPath,
    mode: 'lib',
    inspect: async cwd => {
      report = JSON.parse(await readFile(join(cwd, 'report.json'), 'utf8')) as Report
    },
  })
  assert.equal(result.stderr.includes('UNHANDLED'), false)
  assert.deepEqual(report, { registered: true, unloaded: true })
}
```

`runLoaderSmoke` 设置隔离 `DSH_HOME`/`DSH_AGENTS_HOME`，关闭 stdin，按配置预期退出码检查进程，最后删除自己创建的 cwd；`inspect` 在删除前执行。`report.json` 必须由被测 driver 实际写出，不能由调用方预填后当作插件行为。若 caller 提供现有 `cwd`，caller 自己清理。超时会 SIGKILL 并携带 stdout/stderr 诊断。此骨架未在独立 Profile 中运行，因为它依赖插件自己的 bin、Profile 和 driver；运行前将四条路径换成该项目已构建产物的实际绝对路径。
