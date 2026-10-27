# 包声明与读取方

## 对象关系

DshPackageManifest包含DshManifest与DshEnginesManifest；dsh下再声明bundle、profile、client。展示类型与执行型声明独立，均无运行时导出。详见 [各字段契约](api-core-package-manifest.md)。

## 选型与使用

构建代码只检查自身对象时用devDependency；发布的.d.ts引用这些类型时列生产依赖。类型正确不能代替JSON文件检查、包导出检查、profile真实装载与Client构建。见 [完整独立Service包](../examples/example-core-service.md)。
