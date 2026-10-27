# ui-dockkit：插件接入

## 对象关系

这是与 DSH 宿主无关的纯停靠布局套件。状态/操作/planner 与 React 呈现分离；planner 返回操作而不修改原状态，由宿主记录与应用。制作 DSH 右侧栏内容优先使用 sidebarRight 注册 tab，不为增加一个 tab 复制整套 DockController。

## 选型与使用

- [adapter 对象契约](api-client-ui-dockkit-adapter.md)。
- [constraints 对象契约](api-client-ui-dockkit-constraints.md)。
- [controller 对象契约](api-client-ui-dockkit-controller.md)。
- [docksurface 对象契约](api-client-ui-dockkit-docksurface.md)。
- [floatlayer 对象契约](api-client-ui-dockkit-floatlayer.md)。
- [geometry 对象契约](api-client-ui-dockkit-geometry.md)。
- [initial 对象契约](api-client-ui-dockkit-initial.md)。
- [operations 对象契约](api-client-ui-dockkit-operations.md)。
- [planner 对象契约](api-client-ui-dockkit-planner.md)。
- [sequence 对象契约](api-client-ui-dockkit-sequence.md)。
- [tree 对象契约](api-client-ui-dockkit-tree.md)。
- [types 对象契约](api-client-ui-dockkit-types.md)。

完整操作见 [接入 ui-dockkit](../how-to/how-to-client-ui-dockkit.md#接入-ui-dockkit)。
