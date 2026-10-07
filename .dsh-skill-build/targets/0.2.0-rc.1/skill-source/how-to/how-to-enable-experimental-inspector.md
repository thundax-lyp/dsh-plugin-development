# 启用 Inspector 诊断端点

## 目标与前置

在已有 `webServer` 的本机诊断 Profile 显式安装 Inspector，查看 Host/Client Cordis 树与 fetch 记录。公开契约见 [Inspector 诊断端点](api-experimental-inspector.md)。本任务是部署 patch，无额外 TypeScript 插件入口。

## 实现步骤

新建 `example-inspector-profile/`。`package.json`：

```json
{
  "name": "example-inspector-profile",
  "version": "0.1.0",
  "private": true,
  "files": ["cordis.patch.yml"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } },
  "dependencies": {
    "@deepseek-ai/dsh-experimental-inspector": "0.2.0-rc.1"
  }
}
```

`cordis.patch.yml`：

```yaml
- insert:
    - id: example-inspector
      name: '@deepseek-ai/dsh-experimental-inspector'
      config:
        host: 127.0.0.1
        port: 0
        captureFetch: false
        clientOrigins: []
```

将该层放在提供 `webServer` 的 Profile 后，执行 `npm install`，启动目标 Profile。读取启动时打印的 `devtoolsFrontendUrl`；Worker 实际端口可能与配置的首选端口不同，本例由系统分配。请求 `http://127.0.0.1:<实际端口>/json/version`，确认返回一个 CDP WebSocket URL；对 `/ingest` 不带正确 protocol token 的升级应返回 403。若浏览器页来自非 localhost Origin，先明确其精确 Origin，再填 `clientOrigins` 并重新装载；不要通过扩大监听地址代替来源配置。触发 `webserver/index-inject` 后检查 `__DSH_INSPECTOR__` bootstrap 只在目标页面出现。卸载 patch 后，再访问先前端口应连接失败，`ctx.inspector` 与注入监听应消失。

`/devtools/page/<target>` 没有 ingest token 门禁。此 patch 只用于本机受控诊断，不通过反向代理发布该端口；`captureFetch:true` 时按实际请求正文敏感度调低大小上限。若启动/关闭失败，检查 Worker 和端口是否仍存活，再处理该失败。
