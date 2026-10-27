# web：插件接入

## 对象关系

Web shell 的 baseline module table 共享 react、react/jsx-runtime、react-dom、react-dom/client、@deepseek-ai/cordis、zod、@tanstack/react-virtual、dsh-client-store、dsh-client-ui-slots、dsh-client-ui-primitives、dsh-client-ui-dockkit。动态插件复用这些身份，不能把另一个 React 或 Cordis bundle 进自己的 factory。

## 选型与使用

- [apply-injections 对象契约](api-client-web-apply-injections.md)。
- [boot 对象契约](api-client-web-boot.md)。
- [platform 对象契约](api-client-web-platform.md)。
- [seed 对象契约](api-client-web-seed.md)。

完整操作见 [接入 web](../how-to/how-to-client-web.md#接入-web)。
