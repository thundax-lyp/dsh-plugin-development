# 非 Session 状态的持久化

## 对象关系

Storage 是后端注册和数据形态挂载中心，不直接执行 IO。消费者使用 storageDomain.open(defineDomain(...))；schema 使用 zod，插件 Config 使用 schemastery。Domain 读取同步返回已校验内存值，返回对象不可原地修改；写入经每个 domain 的队列先持久化再更新内存并发 domain/changed。监听者抛错不会推翻已经提交的写入。调用者拥有 Domain handle，卸载必须 await close；同名 domain 在打开及关闭期间均被预留。global 初始 null 是未写哨兵，schema 不可接受 null。per-record、compatibleVersions 和 backup-and-skip 只用于明确声明的可兼容或可丢弃记录；权威数据默认因 invalid-record 拒绝打开。

## 选型与使用

重复后端/形态、backend-not-found、facet-unsupported、already-open、invalid-record、missing-key、closed 均要显式处理；没有跨表事务或跨进程变更广播，不能据 domain/changed 推断多实例一致性。

- [@deepseek-ai/dsh-storage-domain.](api-runtime-dsh-storage-domain.md)：模块和公开对象。
- [@deepseek-ai/dsh-storage-json.](api-runtime-dsh-storage-json.md)：模块和公开对象。
- [@deepseek-ai/dsh-storage-sqlite.](api-runtime-dsh-storage-sqlite.md)：模块和公开对象。
- [@deepseek-ai/dsh-storage.](api-runtime-dsh-storage.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-storage.md)说明配置、调用和清理顺序。
