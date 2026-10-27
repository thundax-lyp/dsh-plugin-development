# @deepseek-ai/dsh-experimental-voice-input-bundle 使用路径

## 在 Web 提供录音转写输入

目标结果：在 Web 提供录音转写输入并观察结果及资源释放。

### 目标与前置

此可选 Bundle 组合语音服务定义、本地 SenseVoice Provider、带认证的 Remote 与浏览器麦克风控件。随包配置默认禁用。

使用 `@deepseek-ai/dsh-agent@0.2.1-rc.3`，安装同一版本的公开包；本任务的 API 契约由包专题（本页维护其配置与装载契约）维护。

### 操作与装载

1. 在消费项目用 `pnpm add @deepseek-ai/dsh-experimental-voice-input-bundle@0.2.1-rc.3` 固定依赖；不要把源码 monorepo 的 `workspace:` 依赖直接复制给消费项目。
2. 按下列公开使用步骤选择配置、注入依赖与运行侧；服务声明与具体提供方分别挂载，不把纯类型子路径当成可执行插件。
3. 交付代码扩展时，把本包作为插件的 peer/dev 依赖，在插件入口用 `inject` 声明所需服务。bundle 的 `package.json` 声明 `dsh.bundle.patch`，patch 用 `- insert:` 加入插件行。从包的父目录运行 `dsh plugin --profile demo add ./你的插件包`，再运行 `dsh --profile demo`；已安装普通依赖没有 bundle patch 时不会自动激活。注册在贡献插件 scope 内完成，返回的清理函数归此 scope 所有。

### 使用此包

打开 Web 侧栏的插件管理页并启用带蓝色声波图标的“语音输入”。模型需要准备时，弹窗提供“前往安装”和“稍后”选项；“前往安装”打开 Bundle 详情。缓存完整时不会提示安装。在详情中选择“下载并准备”；默认折叠的当前步骤摘要可展开为完整步骤列表。下载报告真实字节，校验和加载显示等待时间。就绪后点击模型选择器与发送按钮之间的麦克风，再点击停止以插入转写文字。Bundle 详情通过 Settings 服务保存识别器和语言。禁用 Bundle 会取消当前任务；缓存资源保留在磁盘上。

-----

### 已知限制与后续工作

- 此 Bundle 提供一个本地识别器。额外 Provider 使用不同 id 注册到同一服务；云端识别需要显式增加 Provider 与凭据配置。Bundle 不增加模型工具或修改智能体循环。
- 安装 dsh 时会一并安装 `sherpa-onnx-node` 及其平台原生运行时（含 ONNX Runtime），即使此 Bundle 处于禁用状态。运行时的磁盘占用和下载量独立于“下载并准备”所下载的模型；原生包体积随平台和版本变化。

-----
