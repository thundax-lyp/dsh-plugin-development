# 远程执行世界与配套后端

## 对象关系

SSH 管理传输与远程 helper，fs-ssh、subprocess-ssh、sandbox-ssh 组成同一远程执行世界；不要把本地 Host 文件路径作为远程可打开路径。取消、连接关闭和远端进程清理必须由相应 handle 确认，连接断开本身不证明远程进程静止。

## 选型与使用

helper/protocol/schemas 是传输实现边界，不是面向模型的任意远程命令工具；主机密钥和凭证配置由部署者决定。

- [@deepseek-ai/dsh-fs-ssh.](api-runtime-dsh-fs-ssh.md)：模块和公开对象。
- [@deepseek-ai/dsh-sandbox-ssh.](api-runtime-dsh-sandbox-ssh.md)：模块和公开对象。
- [@deepseek-ai/dsh-ssh.](api-runtime-dsh-ssh.md)：模块和公开对象。
- [@deepseek-ai/dsh-ssh./protocol](api-runtime-dsh-ssh--protocol.md)：子路径对象。
- [@deepseek-ai/dsh-ssh./schemas](api-runtime-dsh-ssh--schemas.md)：子路径对象。
- [@deepseek-ai/dsh-subprocess-ssh.](api-runtime-dsh-subprocess-ssh.md)：模块和公开对象。

[操作步骤](../how-to/how-to-runtime-ssh.md)说明配置、调用和清理顺序。
