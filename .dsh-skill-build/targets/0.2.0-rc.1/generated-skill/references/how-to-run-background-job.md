# 装载并控制一个后台 Job

## 目标与前置

在 `dsh-v0.2.0-rc.1` 的独立 Host 插件里启动一个 Session 拥有的 Job，给模型返回 job id，再经 `job_output` 收集结果或经 `job_kill` 取消。完整生产者代码见 [Background Jobs](api-jobs.md#最小-host-生产者)；工具定义、规范 JSON 与纯渲染的通用要求见[模型工具](api-tools.md)。此任务需要一个能启动 Agent 的 Profile，以及 `@deepseek-ai/dsh-jobs-local`、`@deepseek-ai/dsh-tool-jobs`、`@deepseek-ai/dsh-tools` 和 `@deepseek-ai/dsh-agent`。仅装载抽象包 `@deepseek-ai/dsh-jobs` 不会创建 registry。

## 实现与组合顺序

1. 以目标版本创建 `dsh-example-background/`。把 [Jobs 示例](api-jobs.md#最小-host-生产者) 的完整 TypeScript 放到 `src/index.ts`。插件的 `inject = ['jobs', 'tools']` 让它在两个服务可用后注册 `example_background_task`。生产者 owner 从真实调用的 `exec.agent.session.id` 取得；无 Agent 时拒绝。
2. 创建下列包、编译配置和 patch。Host 包根入口是编译后的 `lib/index.js`；包名与 patch 行的 `name` 完全一致。这里的 `peerDependencies` 保持消费方唯一服务实例，`devDependencies` 为独立编译提供目标版声明。

`package.json`：

```json
{
  "name": "dsh-example-background",
  "version": "0.1.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "files": ["lib", "cordis.patch.yml"],
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.1",
    "@deepseek-ai/dsh-jobs": "0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.1",
    "@deepseek-ai/dsh-jobs": "0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.1",
    "typescript": "6.0.3"
  }
}
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "lib",
    "declaration": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-background
      name: dsh-example-background
```

3. 在包目录安装目标依赖，运行 `npm run build` 与 `npm pack --dry-run`，确认 JS、声明和 patch 都在包中。用独立 Profile 安装包前，先通过 `dsh --profile demo --dump-config` 检查该 Profile 已有 `jobs`（`dsh-jobs-local`）、`tool-jobs`、`tools` 和 `agents` 行。基于发布的 `dsh-base` 的普通自定义 Profile 有前两行；若自己替换了 Agent preset，还须确认该 Agent 的 scope 仍由 controller 覆盖。缺 `tool-jobs` 时 `start` 会在分配 id 或执行资源前拒绝。
4. 在包父目录执行 `dsh plugin --profile demo add ./dsh-example-background`，再运行 `dsh --profile demo --dump-config` 核查新增行并启动该 Profile。让 Agent 调用 `example_background_task`；成功 JSON 只有 `jobId`。随后调用内置 `job_output({ job_id: id })`，应得到输出与终态；工作仍在运行时可调 `job_kill({ job_id: id, reason: 'no longer needed' })`。等待超时不会自动取消 Job，避免忙轮询。
5. 卸载时先决定尚在运行的 Job 是否仍有意义；需要停止时通过 `job_kill` 请求取消，并收集终态。执行 `dsh plugin --profile demo remove dsh-example-background`，确认配置行消失。插件卸载会撤销其工具注册，但 Job 登记与执行资源属于 producer/owner 及 registry 的生命周期；不能仅凭工具行消失推断现有工作已停止。Agent 或 registry 销毁时才由 Jobs 清理 live Job。真实 producer 的 `cancel` 必须让 `done` 在资源释放后结束。

## 验证边界

本例的完整 TypeScript 代码已从 reference 抽出，在独立消费包对目标版公开声明编译。隔离 Cordis 宿主实际装配 `jobs-local`、`tool-jobs`、Agent/Tools/System Prompt 和本插件，执行工具后读到完成输出与一次性结果；再用 `job_kill` 取消第二个 Job 并观察 `killed`。本地 bundle 打包检查、隔离 Web Profile `plugin add`、配置行核对与 Web 启动均通过。尚未在该 CLI Profile 内发起模型轮次、验证真实长时进程、插件在线卸载或重启恢复。具体成员、环形缓冲、访问控制和失败边界由 [Jobs reference](api-jobs.md) 负责。
