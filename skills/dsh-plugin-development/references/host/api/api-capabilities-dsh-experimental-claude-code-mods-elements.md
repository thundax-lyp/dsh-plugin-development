# dsh-experimental-claude-code-mods-elements 对象契约

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。本页负责 elements 声明中的相关对象。公开装载前置、结果和故障边界见[本包组合约束](api-capabilities-dsh-experimental-claude-code-mods.md)；本页逐项保留对象的参数、字段和判别分支。

## BoxProps（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface BoxProps {
    readonly flexDirection?: 'row' | 'column' | undefined;
    readonly paddingX?: number | undefined;
    readonly paddingY?: number | undefined;
    readonly padding?: number | undefined;
    readonly gap?: number | undefined;
    readonly border?: boolean | string | undefined;
    readonly borderColor?: string | undefined;
    readonly children?: UiNode | undefined;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`BoxProps`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`border`、`borderColor`、`children`、`flexDirection`、`gap`、`padding`、`paddingX`、`paddingY`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## ButtonProps（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface ButtonProps {
    readonly label: string;
    readonly hotkey?: string | undefined;
    readonly disabled?: boolean | undefined;
    readonly onPress?: (() => unknown) | undefined;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`ButtonProps`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`disabled`、`hotkey`、`label`、`onPress`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## TextProps（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface TextProps {
    readonly color?: string | undefined;
    readonly bold?: boolean | undefined;
    readonly dimColor?: boolean | undefined;
    readonly italic?: boolean | undefined;
    readonly underline?: boolean | undefined;
    readonly children?: UiNode | undefined;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`TextProps`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`bold`、`children`、`color`、`dimColor`、`italic`、`underline`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## UiElement（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface UiElement {
    readonly type: 'Box' | 'Text' | 'Button';
    readonly props: Readonly<Record<string, unknown>>;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`UiElement`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`props`、`type`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## UiElements（.）

完整公开接口如下；继承成员由对应基接口的小节定义：

```text
export interface UiElements {
    readonly Box: (props: BoxProps) => UiElement;
    readonly Text: (props: TextProps) => UiElement;
    readonly Button: (props: ButtonProps) => UiElement;
}
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`UiElements`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型、值空间与调用形式以上方完整声明为准。

成员检索：`Box`、`Button`、`Text`。具体类型、可选性和继承关系以上面的精确接口声明为准。

这些字段由相应创建方提供；`undefined` 表示该成员允许缺省，不承诺由类型本身生成默认值。含 `signal` 的调用应传递调用方取消；具体业务结果和错误应按本页使用约束处理。纯数据对象不持有独立 disposer。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。

## UiNode（.）

完整公开类型与分支如下；按判别字段选择分支，不把聚合成员清单当作所有字段同时必填：

```text
export type UiNode = UiElement | string | number | null | undefined | false | readonly UiNode[];
```

公开导入：`@deepseek-ai/dsh-experimental-claude-code-mods`；公开符号：`UiNode`。 Host 插件须在所需服务已注入后调用；导入本身不证明 Profile 已挂载。

类型以本节完整源码声明为准。

此符号用于该包的公开配置、类型或函数组合；它本身不代表已运行的任务。以本页使用约束选择入口，并验证实际装载后的结果。

操作路径见[接入指南](../how-to/how-to-capabilities-dsh-experimental-claude-code-mods.md)。
