# 选择、安装与核对 Profile bundle

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。profile 的 package.json 选择有序的 dsh.profile.bundles；bundle 的 dsh.bundle.patch 指定一个文件或有序文件列表。bundle 层之后应用 profile patch、home patch 与调用覆盖。

## 通过 ACP 使用组合的主层

ACP surface 装配协议适配与其 app 入口；它运行在 Host，通过 profile 的依赖和 transport 暴露给外部消费方。不要把 ACP endpoint 当作浏览器 Remote。

1. 在信任的开发 profile 读取依赖与有序 bundle 列表，区分 installed、enabled 和实际加载成功。已保存 enabled 不证明 bundle 可读或其条目 ACTIVE。
2. 通过 `dsh plugin --profile <profile> add <package>` 安装自建 bundle，或在受控 profile 中选择已安装 bundle；包中应发布 patch 和编译入口。普通依赖不会自动加入 Cordis 树。
3. 在 `cordis.patch.yml` 用 insert 创建自己的唯一 id，服务用 inject 排序；替换 config 时重述需要保留的字段。空或只有注释的 patch 会失败，不需要覆盖时用 `[]`。
4. 启动 profile，检查 skippedBundles 和 Loader ACTIVE/FAILED/PENDING。缺少 HMR 时改配置后重启；HMR 可用时也要等待 reload 落定再判断功能。
5. 调用自己的一个可观察行为，停用后确认注销；卸载依赖前先停止对应插件。安装成功但激活失败可以保留 dependency 和 selection，按操作返回状态重试，不把安装回滚规则当成运行时回滚。

完成判据：所需 surface 启动，插件入口实际可调用，禁用后资源释放；源码路径线索 `packages/bundle/acp-app/cordis.patch.yml` 只说明组合 owner，不替代该验证。基础结构见 [独立 Service bundle](../examples/example-core-service.md)。

## 提供基础插件组合的主层

基础 bundle 为其余 app surface 提供共享服务和插件。它本身不是一个单独用户界面，也不创建自己的启动 bin；选择它之后还需要所需 mode bundle 或消费方。

1. 在信任的开发 profile 读取依赖与有序 bundle 列表，区分 installed、enabled 和实际加载成功。已保存 enabled 不证明 bundle 可读或其条目 ACTIVE。
2. 通过 `dsh plugin --profile <profile> add <package>` 安装自建 bundle，或在受控 profile 中选择已安装 bundle；包中应发布 patch 和编译入口。普通依赖不会自动加入 Cordis 树。
3. 在 `cordis.patch.yml` 用 insert 创建自己的唯一 id，服务用 inject 排序；替换 config 时重述需要保留的字段。空或只有注释的 patch 会失败，不需要覆盖时用 `[]`。
4. 启动 profile，检查 skippedBundles 和 Loader ACTIVE/FAILED/PENDING。缺少 HMR 时改配置后重启；HMR 可用时也要等待 reload 落定再判断功能。
5. 调用自己的一个可观察行为，停用后确认注销；卸载依赖前先停止对应插件。安装成功但激活失败可以保留 dependency 和 selection，按操作返回状态重试，不把安装回滚规则当成运行时回滚。

完成判据：所需 surface 启动，插件入口实际可调用，禁用后资源释放；源码路径线索 `packages/bundle/base/cordis.patch.yml` 只说明组合 owner，不替代该验证。基础结构见 [独立 Service bundle](../examples/example-core-service.md)。

## 运行无界面任务的主层

headless surface 以非交互方式驱动 Agent；执行与持久 Session 仍由共享服务负责。默认组合是否包含某个 provider 以实际 profile 层为准。

1. 在信任的开发 profile 读取依赖与有序 bundle 列表，区分 installed、enabled 和实际加载成功。已保存 enabled 不证明 bundle 可读或其条目 ACTIVE。
2. 通过 `dsh plugin --profile <profile> add <package>` 安装自建 bundle，或在受控 profile 中选择已安装 bundle；包中应发布 patch 和编译入口。普通依赖不会自动加入 Cordis 树。
3. 在 `cordis.patch.yml` 用 insert 创建自己的唯一 id，服务用 inject 排序；替换 config 时重述需要保留的字段。空或只有注释的 patch 会失败，不需要覆盖时用 `[]`。
4. 启动 profile，检查 skippedBundles 和 Loader ACTIVE/FAILED/PENDING。缺少 HMR 时改配置后重启；HMR 可用时也要等待 reload 落定再判断功能。
5. 调用自己的一个可观察行为，停用后确认注销；卸载依赖前先停止对应插件。安装成功但激活失败可以保留 dependency 和 selection，按操作返回状态重试，不把安装回滚规则当成运行时回滚。

完成判据：所需 surface 启动，插件入口实际可调用，禁用后资源释放；源码路径线索 `packages/bundle/headless/cordis.patch.yml` 只说明组合 owner，不替代该验证。基础结构见 [独立 Service bundle](../examples/example-core-service.md)。

## 运行 SDK 应用组合的主层

SDK app 是 JSON-RPC app surface，服务于独立 SDK 客户端。客户端/服务器协议与 Web ctx.remote 是不同边界，不复用两者的 wire 类型。

1. 在信任的开发 profile 读取依赖与有序 bundle 列表，区分 installed、enabled 和实际加载成功。已保存 enabled 不证明 bundle 可读或其条目 ACTIVE。
2. 通过 `dsh plugin --profile <profile> add <package>` 安装自建 bundle，或在受控 profile 中选择已安装 bundle；包中应发布 patch 和编译入口。普通依赖不会自动加入 Cordis 树。
3. 在 `cordis.patch.yml` 用 insert 创建自己的唯一 id，服务用 inject 排序；替换 config 时重述需要保留的字段。空或只有注释的 patch 会失败，不需要覆盖时用 `[]`。
4. 启动 profile，检查 skippedBundles 和 Loader ACTIVE/FAILED/PENDING。缺少 HMR 时改配置后重启；HMR 可用时也要等待 reload 落定再判断功能。
5. 调用自己的一个可观察行为，停用后确认注销；卸载依赖前先停止对应插件。安装成功但激活失败可以保留 dependency 和 selection，按操作返回状态重试，不把安装回滚规则当成运行时回滚。

完成判据：所需 surface 启动，插件入口实际可调用，禁用后资源释放；源码路径线索 `packages/bundle/sdk-app/cordis.patch.yml` 只说明组合 owner，不替代该验证。基础结构见 [独立 Service bundle](../examples/example-core-service.md)。

## 运行独立最小 SDK 组合的主层

sdk-minimal 的 bundle patch 插入完整树，独立于 dsh-base；不要再因名称相似机械追加 base 导致重复服务。组合包含 JSON-RPC、单一模型适配、持久 shell 与 JSONL Session。

1. 在信任的开发 profile 读取依赖与有序 bundle 列表，区分 installed、enabled 和实际加载成功。已保存 enabled 不证明 bundle 可读或其条目 ACTIVE。
2. 通过 `dsh plugin --profile <profile> add <package>` 安装自建 bundle，或在受控 profile 中选择已安装 bundle；包中应发布 patch 和编译入口。普通依赖不会自动加入 Cordis 树。
3. 在 `cordis.patch.yml` 用 insert 创建自己的唯一 id，服务用 inject 排序；替换 config 时重述需要保留的字段。空或只有注释的 patch 会失败，不需要覆盖时用 `[]`。
4. 启动 profile，检查 skippedBundles 和 Loader ACTIVE/FAILED/PENDING。缺少 HMR 时改配置后重启；HMR 可用时也要等待 reload 落定再判断功能。
5. 调用自己的一个可观察行为，停用后确认注销；卸载依赖前先停止对应插件。安装成功但激活失败可以保留 dependency 和 selection，按操作返回状态重试，不把安装回滚规则当成运行时回滚。

完成判据：所需 surface 启动，插件入口实际可调用，禁用后资源释放；源码路径线索 `packages/bundle/sdk-minimal/cordis.patch.yml` 只说明组合 owner，不替代该验证。基础结构见 [独立 Service bundle](../examples/example-core-service.md)。

## 运行 Web 插件组合的主层

Web surface 提供 Host 服务与 Client 装配；Host package 能安装不代表 Client 插件已进入其 bundle。需要浏览器真实装配、交互和重连验证。

1. 在信任的开发 profile 读取依赖与有序 bundle 列表，区分 installed、enabled 和实际加载成功。已保存 enabled 不证明 bundle 可读或其条目 ACTIVE。
2. 通过 `dsh plugin --profile <profile> add <package>` 安装自建 bundle，或在受控 profile 中选择已安装 bundle；包中应发布 patch 和编译入口。普通依赖不会自动加入 Cordis 树。
3. 在 `cordis.patch.yml` 用 insert 创建自己的唯一 id，服务用 inject 排序；替换 config 时重述需要保留的字段。空或只有注释的 patch 会失败，不需要覆盖时用 `[]`。
4. 启动 profile，检查 skippedBundles 和 Loader ACTIVE/FAILED/PENDING。缺少 HMR 时改配置后重启；HMR 可用时也要等待 reload 落定再判断功能。
5. 调用自己的一个可观察行为，停用后确认注销；卸载依赖前先停止对应插件。安装成功但激活失败可以保留 dependency 和 selection，按操作返回状态重试，不把安装回滚规则当成运行时回滚。

完成判据：所需 surface 启动，插件入口实际可调用，禁用后资源释放；源码路径线索 `packages/bundle/web-app/cordis.patch.yml` 只说明组合 owner，不替代该验证。基础结构见 [独立 Service bundle](../examples/example-core-service.md)。

## 运行 Web 插件组合的预设层

Web surface 提供 Host 服务与 Client 装配；Host package 能安装不代表 Client 插件已进入其 bundle。需要浏览器真实装配、交互和重连验证。

1. 在信任的开发 profile 读取依赖与有序 bundle 列表，区分 installed、enabled 和实际加载成功。已保存 enabled 不证明 bundle 可读或其条目 ACTIVE。
2. 通过 `dsh plugin --profile <profile> add <package>` 安装自建 bundle，或在受控 profile 中选择已安装 bundle；包中应发布 patch 和编译入口。普通依赖不会自动加入 Cordis 树。
3. 在 `cordis.patch.yml` 用 insert 创建自己的唯一 id，服务用 inject 排序；替换 config 时重述需要保留的字段。空或只有注释的 patch 会失败，不需要覆盖时用 `[]`。
4. 启动 profile，检查 skippedBundles 和 Loader ACTIVE/FAILED/PENDING。缺少 HMR 时改配置后重启；HMR 可用时也要等待 reload 落定再判断功能。
5. 调用自己的一个可观察行为，停用后确认注销；卸载依赖前先停止对应插件。安装成功但激活失败可以保留 dependency 和 selection，按操作返回状态重试，不把安装回滚规则当成运行时回滚。

完成判据：所需 surface 启动，插件入口实际可调用，禁用后资源释放；源码路径线索 `packages/bundle/web-app/presets/cordis.patch.yml` 只说明组合 owner，不替代该验证。基础结构见 [独立 Service bundle](../examples/example-core-service.md)。


## 在已有 Profile 中复用或替换服务

目标：在既有组合中添加消费者或 provider，而不重复创建同一服务。适用于默认 web/base 和用户已有 Profile；独立空组合需要另外提供它真正缺失的依赖。

1. 在当前 Profile 所有者授权范围内运行 `dsh --profile development --dump-config`，读取合成条目的 id、name、disabled、配置和实际 Loader 状态。dump 只是配置，不代表激活；不要对已有 Profile 运行 `--from-default-profile` 初始化。
2. 默认 web 复用 base。base 的 `subprocess` 已提供本地子进程，`bash-sandbox` 或 Windows 的 `pwsh-sandbox` 提供 shell，`goal` 提供 goals，`subagent-spawn-in-process` 提供 spawn 后端；同样已有 session、LLM、Skill、storage、Web 等基础服务。按目标 id 和运行侧核对，不因服务名相似改写另一个条目。消费者只声明 `inject` 并 insert 自己的唯一 id。
3. 改配置使用对既有 id 的 patch。`config` 整体替换，必须重述要保留的字段；不要用带新 id 的 insert 来修改现有实例。已有可选 provider 只需启用/配置，未安装才安装缺失依赖。多个 registry provider 可以并存时也须遵守各 registry 的 id/选择规则，不能据此重复提供相同 Cordis Service。
4. 替换互斥 provider 时，先停用原 owner，再激活新 owner；分别核对依赖方恢复和失败回滚。Loader 根据依赖可用性激活，列表先后不是时序保证。停用新 provider 不会自动恢复旧 provider；恢复须显式撤回替换 patch 并核对原条目。
5. 卸载自己的贡献只撤回自己的注册；不能连带关闭共享的基础服务。空组合的最小栈配置与默认组合的覆盖 patch 分开维护。

例如仅调整默认 shell 的时限：

```yaml
- id: bash-sandbox
  config:
    timeoutMs: 30000
```

这里 `config` 仅覆盖这个条目；完整 schema 默认值会继续解析未写字段，但既有自定义值不会被合并保留，先读取并重述它们。若明确选择无沙箱的独立本地后端，可在非 Windows 的开发组合使用下面替换；它不提供沙箱隔离：

```yaml
- id: bash-sandbox
  disabled: true
- insert:
    - id: local-bash-replacement
      name: '@deepseek-ai/dsh-bash-local'
      config:
        timeoutMs: 30000
```

前置是原组合只有该 bash shell provider，且已有 subprocess；Windows 或自定义组合先查实际条目后处理，不照搬 id。回退时先停用/移除自己的替换并重新启用原条目。

完成判据：合成配置只含一个启用的互斥 provider、原服务无重复注册错误，自己的消费者可调用；禁用贡献后共享服务仍可用，恢复原 provider 后其他消费者重新激活。配置校验、Loader 装载和真实业务调用分别验证。
