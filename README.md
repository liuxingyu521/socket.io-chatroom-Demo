## socket.io-chatroom-Demo

### socket.io 安装

* 服务端先安装npm包 `npm install socket.io`
* 然后在服务端代码里使用
```
var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
});

server.listen(port);
```
* 在客户端里使用时，直接用`<script src="/socket.io/socket.io.js"></script>`引入

**特别注意**

io监听的端口和server监听的端口保持一致才能引这个绝对路径，因为socket.io会拦截`/socket.io/socket.io.js`这个请求，转换到对应socket路径下。
