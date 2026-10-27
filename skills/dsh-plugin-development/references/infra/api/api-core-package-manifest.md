# DSH 包元数据

适用于 `@deepseek-ai/dsh-agent@0.2.1-rc.3`。`@deepseek-ai/dsh-package-manifest` 仅导出类型，读取方分别拥有JSON校验、默认值、文件检查与兼容性执行。

## DshBundleManifest 包元数据契约

发布组合层。patch必填，为一个字符串路径或有序字符串数组，相对包根。launcher按声明顺序串接为同一bundle层；文件须发布且可读，空patch写[]。普通npm依赖不会自动成为已启用bundle。

完整公开声明：

```text
export interface DshBundleManifest {
    patch: string | string[];
}
```

| 字段 | 类型 |
| --- | --- |
| `patch` | `string \| string[]` |

操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## DshClientManifest 包元数据契约

声明浏览器模块装配。platform必填，Web消费者选择web；inject是包名信息依赖，不是Cordis服务inject。immediately标记phase-one注册屏障，省略进入共享批次；external给出隐式baseline之外的精确模块表请求，可含/pkg/client子路径，type-only import被擦除不会产生请求。

完整公开声明：

```text
export interface DshClientManifest {
    platform: string;
    inject?: string[];
    immediately?: boolean;
    external?: string[];
}
```

| 字段 | 类型 |
| --- | --- |
| `external` | `string[] \| undefined` |
| `immediately` | `boolean \| undefined` |
| `inject` | `string[] \| undefined` |
| `platform` | `string` |

操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## DshEnginesManifest 包元数据契约

声明运行时要求。dsh、node、npm及额外runtime键的值都是可选字符串。dsh写SemVer范围或精确预发布；声明库本身不解析或拒绝JSON。DSH launcher拥有的profile/bundle/entry边界会检查兼容性：engines.dsh优先，否则检查DSH peer ranges；不把此声明当成沙箱，也不覆盖任意ctx.plugin embedder的边界。

完整公开声明：

```text
export interface DshEnginesManifest {
    dsh?: string;
    node?: string;
    npm?: string;
    [engine: string]: string | undefined;
}
```

| 字段 | 类型 |
| --- | --- |
| `dsh` | `string \| undefined` |
| `node` | `string \| undefined` |
| `npm` | `string \| undefined` |

操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## DshManifest 包元数据契约

一个包可同时声明的DSH角色。manifestVersion仅能声明1，独立于npm包与Session格式版本；bundle/profile/client可并存且可选。没有字段时不自行补默认角色，内部configTrees/sessionFormatMigration/moduleFallback不属于此公共作者类型。

完整公开声明：

```text
export interface DshManifest {
    manifestVersion?: 1;
    bundle?: DshBundleManifest;
    profile?: DshProfileManifest;
    client?: DshClientManifest;
}
```

| 字段 | 类型 |
| --- | --- |
| `bundle` | `DshBundleManifest \| undefined` |
| `client` | `DshClientManifest \| undefined` |
| `manifestVersion` | `1 \| undefined` |
| `profile` | `DshProfileManifest \| undefined` |

操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## DshPackageManifest 包元数据契约

发布包身份与npm字段。name、version必填；description、icon、private、dependencies、peerDependencies、engines、dsh可选。这不是完整npm schema；本地profile读取可接受Partial。icon是相对manifest所在目录的SVG/PNG/JPEG/WebP，最多256KiB，realpath后仍须在该目录内。private阻止npm发布，不决定Cordis可装载性。

完整公开声明：

```text
export interface DshPackageManifest {
    name: string;
    version: string;
    description?: string;
    icon?: string;
    private?: boolean;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    engines?: DshEnginesManifest;
    dsh?: DshManifest;
}
```

| 字段 | 类型 |
| --- | --- |
| `dependencies` | `Record<string, string> \| undefined` |
| `description` | `string \| undefined` |
| `dsh` | `DshManifest \| undefined` |
| `engines` | `DshEnginesManifest \| undefined` |
| `icon` | `string \| undefined` |
| `name` | `string` |
| `peerDependencies` | `Record<string, string> \| undefined` |
| `private` | `boolean \| undefined` |
| `version` | `string` |

操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## DshProfileManifest 包元数据契约

选择有序bundle。bundles可省略，否则是已安装包名的有序数组。顺序决定组合覆盖次序；已选中不代表可读、兼容或ACTIVE，加载失败进入skippedBundles。

完整公开声明：

```text
export interface DshProfileManifest {
    bundles?: string[];
}
```

| 字段 | 类型 |
| --- | --- |
| `bundles` | `string[] \| undefined` |

操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## LocalizedText 包元数据契约

提供本地化展示文字。值可为字面字符串，或以小写language id为键且必含en回退的只读映射。翻译选择由消费者执行，本类型不读locale文件、加载插件或解析语言。

完整公开声明：

```text
export type LocalizedText = string | {
    readonly en: string;
    readonly [locale: string]: string;
};
```

操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。

## PluginLocalizedMeta 包元数据契约

读取已验证展示信息。title/description为可选LocalizedText；icon为可选base64 image data URL，作为图片显示，不能注入为内联HTML；error保存原始本地诊断，不阻止插件继续被管理。类型不负责加载文件或执行fallback。

完整公开声明：

```text
export interface PluginLocalizedMeta {
    readonly title?: LocalizedText;
    readonly description?: LocalizedText;
    readonly icon?: string;
    readonly error?: string;
}
```

| 字段 | 类型 |
| --- | --- |
| `description` | `LocalizedText \| undefined` |
| `error` | `string \| undefined` |
| `icon` | `string \| undefined` |
| `title` | `LocalizedText \| undefined` |

操作路径见 [独立包与生命周期](../how-to/how-to-core-service.md#注册并验证可卸载的-service)。
