# PR #14 外部 checkout 验证器定位修复

来源：PR #14 / Codex comment #4387079085。分类 `accept-as-proposed`，修改前添加并回读 👍。无额度提示需要删除，无重复 summary finding。

触发：`check_examples.cjs --dsh <独立精确 checkout>` 根据 checkout 的父目录查找 evidence，丢失当前 Skill 的冻结验证器，进而把合法的多文件 TypeScript fence 视为未分配。另有 API/设置验证脚本固定使用原 checkout，无法满足传入路径的语义。

修复：从所选生成 Skill 的 provenance 目录或维护仓库的同版本 target 定位冻结清单；由 runner 向 `loadTarget` 传入实际 checkout，并将路径传至冻结验证器。原位置无需存在；commit 一致性、干净 checkout、冻结正文/脚本/辅助输入哈希仍保持。默认创建流程仍使用原 target checkout。API/设置两个脚本改为接收已有 `DSH_TARGET_CHECKOUT`，Remote 原已支持。增加目标解析、版本不匹配、原 checkout 不存在、脏证据拒绝和路径透传回归。

修改冻结脚本后将当前目标素材置为 draft，重新冻结和构建，`verify-generated-skill.mjs` 通过。仅 contractInputsSha256 更新，知识素材和全部 1,211 个分发文件字节未变，正式目录与重建目录一致。

验证：`pnpm test:validation` 67 通过；`pnpm format:check`、`pnpm format:ledgers`、`git diff --check` 通过。独立 checkout 上显式生成目录检查通过 1,662 源码路径、冻结 API/Remote/设置/Worker 验证器及普通 Host 10 / Client 4 编译。独立副本复用本地锁定依赖，构建输出实际复制；不是全新网络安装验证。最初符号链接构建输出造成 rsync 冲突，改用真实目录后重跑通过；依赖链接触发 pnpm 自动依赖同步警告并被 pnpm 的目录保护拒绝，随后的本地编译零诊断，不将该警告当成安装成功。

正式目录复验与远端 CI/回复状态以 PR #14 的最终回读为准。本次未修改产品行为或正文，不扩大原 fix-report.md 的浏览器、Worker preview、真实用户 Profile 等覆盖范围。
