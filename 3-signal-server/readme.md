### 主要功能就是记录每一个登录打开客户端的用户

监听三块功能

1. 客户连接时， 生成其code 并记录其 code 对应的ws实例
2. 监听login，返回连接时生成的code
3. 监听发起控制 control event
   - 先判断这个remote code 有没连接 webSocket server
   - 如果有，给remote 用户发送 be-controlled, 并带上code
4. forward 发送事件给remote

web socket server 作为一个一对多的中间服务，处理控制端和傀儡端的数据传输问题。