# @deepseek-ai/schemastery .：公开对象 1

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。此页属于 [@deepseek-ai/schemastery 选型与组合](api-core-schemastery-root-overview.md)。

## 接入与所有权

按公开模块导出导入值或类型；类型导入不会激活插件。需要服务时通过 Cordis `inject` 声明依赖，模块被 Loader 装载才会产生运行时贡献。返回的注册释放函数必须归调用插件所有；纯类型和纯转换不拥有资源。跨进程值必须遵循各自 wire 类型，不能直接传 Host 对象。

## default 公开契约

导入入口：`@deepseek-ai/schemastery`；公开符号：`default`。

公开声明签名：

```text
type Schema<S = any, T = S, Mode extends SchemaMode = 'plain'> = Schemastery<S, T, Mode>;

export declare const Schema: Schemastery.Static;
```

字段、方法、可选性及泛型以上方完整公开声明为准；同名声明按其运行侧和来源包分别解释。

可选字段允许省略；只读字段由其生产者拥有。方法参数和返回值以上述签名为准，回调不是独立生命周期，除非注册入口显式返回释放函数。

使用顺序与完成判据见 [操作任务](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。


类型别名与运行时值依赖：默认导出的值 `Schema` 提供 `Schemastery.Static` 中的工厂方法；`Schema.string()` 等调用返回 `Schemastery<S,T,Mode>` 实例，该实例本身可调用以验证数据。`bits`、`callback`、`meta`、`required()` 等属于实例，不能放到静态工厂对象上。命名空间中的 `Static`、`Options`、`Meta` 与泛型辅助类型和实例接口共同定义完整契约：

```text
declare const kSchema: unique symbol;

declare global {
    namespace Schemastery {
        type From<X> = X extends string | number | boolean ? Schema<X> : X extends Schema<any, any, SchemaMode> ? X : X extends typeof String ? Schema<string> : X extends typeof Number ? Schema<number> : X extends typeof Boolean ? Schema<boolean> : X extends typeof Function ? Schema<Function, (...args: any[]) => any> : X extends Constructor<infer S> ? Schema<S> : never;
        type TypeS1<X> = X extends Schema<infer S, infer _T, infer _M> ? S : never;
        type Inverse<X> = X extends Schema<infer _S, infer T, infer M> ? (arg: SchemaOutput<T, M>) => void : never;
        type TypeS<X> = TypeS1<From<X>>;
        type TypeT<X> = ReturnType<From<X>>;
        type Resolve = (data: any, schema: Schema, options: Options, strict?: boolean) => [
            any,
            any?
        ];
        type IntersectS<X> = From<X> extends Schema<infer S, infer _T, infer _M> ? S : never;
        type IntersectT<X> = Inverse<From<X>> extends ((arg: infer T) => void) ? T : never;
        type TupleS<X extends readonly any[]> = X extends readonly [
            infer L,
            ...infer R
        ] ? [
            TypeS<L>?,
            ...TupleS<R>
        ] : any[];
        type TupleT<X extends readonly any[]> = X extends readonly [
            infer L,
            ...infer R
        ] ? [
            TypeT<L>?,
            ...TupleT<R>
        ] : any[];
        type ObjectS<X extends Dict> = {
            [K in keyof X]?: TypeS<X[K]> | null;
        } & Dict;
        type ObjectT<X extends Dict> = {
            [K in keyof X]: TypeT<X[K]>;
        } & Dict;
        type Constructor<T = any> = new (...args: any[]) => T;
        interface Static {
            <T = any>(options: Partial<Schema<T>>): Schema<T>;
            new <T = any>(options: Partial<Schema<T>>): Schema<T>;
            prototype: Schema;
            resolve: Resolve;
            from<X = any>(source?: X): From<X>;
            extend(type: string, resolve: Resolve): void;
            any<T = any>(): Schema<T>;
            never(): Schema<never>;
            const<const T>(value: T): Schema<T>;
            string(): Schema<string>;
            number(): Schema<number>;
            natural(): Schema<number>;
            percent(): Schema<number>;
            boolean(): Schema<boolean>;
            date(): Schema<string | Date, Date>;
            regExp(flag?: string): Schema<string | RegExp, RegExp>;
            arrayBuffer(): Schema<Binary.Source, ArrayBufferLike>;
            arrayBuffer(encoding: 'hex' | 'base64'): Schema<Binary.Source | string, ArrayBufferLike>;
            bitset<K extends string>(bits: Partial<Record<K, number>>): Schema<number | readonly K[], number>;
            function(): Schema<Function, (...args: any[]) => any>;
            is(constructor: string): Schema;
            is<T>(constructor: Constructor<T>): Schema<T>;
            array<X>(inner: X): Schema<TypeS<X>[], TypeT<X>[]>;
            dict<X, Y extends Schema<any, string> = Schema<string>>(inner: X, sKey?: Y): Schema<Dict<TypeS<X>, TypeS<Y>>, Dict<TypeT<X>, TypeT<Y>>>;
            tuple<const X extends readonly any[]>(list: X): Schema<TupleS<X>, TupleT<X>>;
            object<X extends Dict>(dict: X): Schema<ObjectS<NoInfer<X>>, ObjectT<NoInfer<X>>>;
            union<const X>(list: readonly X[]): Schema<TypeS<X>, TypeT<X>>;
            intersect<const X>(list: readonly X[]): Schema<IntersectS<X>, IntersectT<X>>;
            transform<X, T>(inner: X, callback: (value: TypeS<X>, options: Schemastery.Options) => T, preserve?: boolean): Schema<TypeS<X>, T>;
            lazy<X extends Schema<any, any, SchemaMode>>(callback: () => X): X;
            ValidationError: typeof ValidationError;
        }
        interface Options {
            autofix?: boolean;
            ignore?(data: any, schema: Schema): boolean;
            path?: (keyof any)[];
        }
        interface Meta<T = any> {
            default?: T extends {} ? Partial<T> : T;
            required?: boolean;
            volatile?: boolean;
            disabled?: boolean;
            collapse?: boolean;
            badges?: {
                text: string;
                type: string;
            }[];
            hidden?: boolean;
            loose?: boolean;
            role?: string;
            extra?: any;
            link?: string;
            description?: string | Dict<string>;
            comment?: string;
            pattern?: {
                source: string;
                flags?: string;
            };
            max?: number;
            min?: number;
            step?: number;
        }
    }
    interface Schemastery<S = any, T = S, Mode extends SchemaMode = 'plain'> {
        (data?: S | null, options?: Schemastery.Options): SchemaOutput<T, Mode>;
        new (data?: S | null, options?: Schemastery.Options): SchemaOutput<T, Mode>;
        [kSchema]: true;
        uid: number;
        meta: Schemastery.Meta<T>;
        type: string;
        sKey?: Schema;
        inner?: Schema;
        list?: Schema[];
        dict?: Dict<Schema>;
        bits?: Dict<number>;
        callback?: Function;
        constructor?: string | Function;
        builder?: Function;
        value?: T;
        refs?: Dict<Schema>;
        preserve?: boolean;
        '~standard': StandardSchemaV1.Props;
        toString(inline?: boolean): string;
        toJSON(): Schema<S, T, Mode>;
        required<R extends boolean = true>(value?: R): Schema<S, T, SetRequired<Mode, R>>;
        volatile(): Schema<NoInfer<S>, NoInfer<T>, Mode extends 'defined' | 'volatile-defined' ? 'volatile-defined' : 'volatile'>;
        hidden(value?: boolean): Schema<S, T, Mode>;
        loose(value?: boolean): Schema<S, T, Mode>;
        role(text: string, extra?: any): Schema<S, T, Mode>;
        link(link: string): Schema<S, T, Mode>;
        default(value: T | NoInfer<Partial<S>>): Schema<S, T, SetRequired<Mode, true>>;
        comment(text: string): Schema<S, T, Mode>;
        description(text: string): Schema<S, T, Mode>;
        disabled(value?: boolean): Schema<S, T, Mode>;
        collapse(value?: boolean): Schema<S, T, Mode>;
        deprecated(): Schema<S, T, Mode>;
        experimental(): Schema<S, T, Mode>;
        pattern(regexp: RegExp): Schema<S, T, Mode>;
        max(value: number): Schema<S, T, Mode>;
        min(value: number): Schema<S, T, Mode>;
        step(value: number): Schema<S, T, Mode>;
        set(key: string, value: Schema): Schema<S, T, Mode>;
        push(value: Schema): Schema<S, T, Mode>;
        simplify(value?: any): any;
        i18n(messages: Dict): Schema<S, T, Mode>;
        extra<K extends keyof Schemastery.Meta>(key: K, value: Schemastery.Meta[K]): Schema<S, T, Mode>;
    }
}

declare class ValidationError extends TypeError {
    options: Schemastery.Options;
    name: string;
    constructor(message: string, options: Schemastery.Options);
    static is(error: any): error is ValidationError;
}

type SchemaMode = 'plain' | 'defined' | 'volatile' | 'volatile-defined';

type SchemaOutput<T, M extends SchemaMode> = M extends 'volatile' ? Volatile<T | undefined> : M extends 'volatile-defined' ? Volatile<T> : T;

type SetRequired<M extends SchemaMode, R extends boolean> = M extends 'volatile' | 'volatile-defined' ? R extends true ? 'volatile-defined' : 'volatile' : R extends true ? 'defined' : 'plain';
```

`S` 是接受的输入，`T` 是规范化输出；`volatile()` 和 `required()` 通过 `Mode` 改变输出的缺省／Volatile 类型。`deprecated()` 方法只是给 schema 节点添加展示徽章，并非该方法本身已废弃；校验失败由 `ValidationError` 表达，`loose()`、默认值和 `Options.autofix` 各按声明及相应 schema 规则处理。`Binary`、`Dict`、`Volatile` 来自 `@deepseek-ai/cosmokit`，`StandardSchemaV1` 来自 `@standard-schema/spec`；`kSchema` 是包内唯一标记，消费方通过工厂创建实例，不手造这个标记。
