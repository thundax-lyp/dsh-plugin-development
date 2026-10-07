# 把已安装的 Host 插件移入 Loader Group

## 目标与前置

目标版本为 `dsh-v0.2.0-rc.1`。此任务把已安装在命名 Profile 中的 `dsh-greet-bundle` 工具插件移入一个 Loader Group；原平面行禁用，子行仍能注入 base 层的 `tools` 服务，调用 `greet` 返回 `Hello, Ada!`。先按 [独立工具插件示例](how-to-register-model-tool.md)构建并安装包。这里仅变更 Profile 的 patch，不修改插件入口代码。

`EntryOptions`、Group 和 patch 的字段与失败边界见 [Loader 配置契约](api-loader-composition.md)；工具注册与执行见 [工具契约](api-tools.md)；层顺序和 Profile 规则见 [Bundle 与 Profile](api-profile-bundle.md)。Group 只改变行的层次，本例不使用 `isolate`，因此子行继承 base 的 `tools` 服务。

## 实现步骤

1. 确认 `dsh-greet-bundle` 已通过 `dsh plugin --profile demo add ./dsh-greet-bundle` 安装。先运行 `dsh --profile demo --dump-config`，检查其 `greet-tool` 行与 base 的 `tools` 行均在组合里。插件包的 `package.json`、`src/index.ts`、`tsconfig.json` 和 `cordis.patch.yml` 内容在[工具插件示例](how-to-register-model-tool.md#实现步骤)完整列出。
2. 在调用方工作目录保存 `group.patch.yml`，使它作为命令行最后一层 patch：

```yaml
- id: greet-tool
  disabled: true
- insert:
    - id: greeting-group
      name: cordis:group
      group: true
      config:
        - id: nested-greet
          name: dsh-greet-bundle
```

3. 运行 `dsh --profile demo --patch ./group.patch.yml --dump-config`。输出应保留原 `greet-tool` 行但标记 `disabled: true`，并增加 `greeting-group` 及 `nested-greet` 子行。`cordis:group` 由 DSH Host 的 app boot 注册为 Loader builtin；独立 Cordis Host 若未注册该 builtin，须显式安装并解析 `@deepseek-ai/cordis-plugin-group`。
4. 用同一个 `--patch` 实际启动 Profile，再观察 `greet` 是否注册及一次规范工具调用结果。若原行未禁用而两份插件都注册 `greet`，会出现重名冲突；若给 Group 隔离 `tools` 却未在 Group 内提供它，子行因缺少注入而不会激活。配置 dump 仅证明最终行结构，不能证明子 fiber 已运行。
5. 停止启动进程后不再传 `--patch`，原 Profile 回到安装包提供的平面行；若要永久保留 Group，把经验证的 patch 写入 Profile 自有的 `cordis.patch.yml`。卸载插件包时运行 `dsh plugin --profile demo remove dsh-greet-bundle`，移除引用该包的用户 patch 或停止传入命令行 patch，重启后确认目标工具缺失。工具调用没有本任务新增的持久业务状态；如实际插件有持久事实，应由其自身的 Session/存储契约恢复。

## 验证与完成边界

本次隔离消费 Profile 中，`--dump-config` 显示了禁用的原行及 Group 子行；带同一 patch 的真实启动中，诊断插件在启动稳定后观察到 `greet`，直接调用返回 `isError: false`、规范值及模型文本 `Hello, Ada!`。无效参数与预取消分别成为工具错误结果。诊断插件没有创建 Agent 轮次，未检查模型选用、Session 日志或跨重启恢复。Include 文件热刷新、`isolate` realm 转移及 Group 的动态更新也不由此验证。
