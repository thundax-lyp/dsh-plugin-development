# shortcuts：插件接入

## 对象关系

命令 owner 注册语义命令与有效键位，显示方读取同一 binding 描述。web 与 desktop 的可用修饰键与保留键不同，不能直接监听一个全局 keydown 绕过 modal/terminal/composition 仲裁。注册结果或订阅必须随 ctx.effect 清理。

## 选型与使用

- [binding 对象契约](api-client-shortcuts-binding.md)。
- [config 对象契约](api-client-shortcuts-config.md)。
- [configuration 对象契约](api-client-shortcuts-configuration.md)。
- [index 对象契约](api-client-shortcuts-index.md)。
- [native 对象契约](api-client-shortcuts-native.md)。
- [persistence 对象契约](api-client-shortcuts-persistence.md)。
- [types 对象契约](api-client-shortcuts-types.md)。

完整操作见 [接入 shortcuts](../how-to/how-to-client-shortcuts.md#接入-shortcuts)。
