# rc.1 独立 Loader Profile smoke

目标 `dsh-v0.2.0-rc.1` / `4878cdabd87d4041bdaff61d04c966883b9fd07a`。`packages/test-support/loader-smoke/src/index.ts` 的 `runLoaderSmoke` 封装隔离 cwd、DSH homes、stdin close、子进程超时/退出码和 cleanup；`resolveExampleLaunch` 区分 src/tsx 与 lib/Node，并清除继承代理。真实 Loader 由目标 `packages/boot/app-boot/src/index.ts:972-1035` 的 `boot` 装载。建议 owner `references/api-loader-smoke-profile.md` 的 `对象类型与成员`，完整任务 `references/how-to-smoke-loader-profile.md`。它是测试支持库，不是 runtime service。

隔离 `evidence/tests/loader-profile-consumer/` 安装 `@deepseek-ai/dsh-loader-smoke@0.2.0-rc.1`、`dsh-app-boot@0.2.0-rc.1`、Cordis 4.0.4、Loader 1.0.5、Include 1.0.9、TypeScript 6.0.3。`npm install --ignore-scripts --no-audit --no-fund`、`npm run build`、`npm run smoke`、`npm pack --dry-run --json` 最终通过。初始 install 因错误固定 Include 1.0.5 与 app-boot peer `~1.0.9` 冲突，改用发布的 1.0.9；初始 TS 编译因缺 Node 类型显式 `types` 失败，加入后通过；初始断言误以为 Loader entry id 是 `fixture`，实际是 root Include 下的 `include:fixture`，修正后通过。

smoke 的真实子进程执行编译 bin → `boot()` → Include/Loader 载入相对 `./lib/fixture-plugin.js` → 写 `activated.txt` 和 entry report → root fiber 卸载写 `unloaded.txt`；`inspect` 在临时 cwd 删除前确认三个文件，零退出且 stderr 无 UNHANDLED。包干只含 `cordis.yml`、编译 JS/d.ts 与 package.json。未运行生产 base Profile、复杂插件依赖、Agent turn、浏览器或失败超时 lane。
