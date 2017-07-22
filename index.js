function handleHTTP(req,res) {
    if (req.method == 'GET') {
        req.addListener('end', function() {
            static_files.serve(req,res);
        });
        req.resume();
    } else {
        res.writeHead(403);
        res.end();
    }
}
function connection(socket) {
    console.log('Connected');
    socket.on('disconnect', function () {
        console.log('Disconnected');
    });
    socket.on('room', function(num) {
       socket.join(num);
    });
    socket.on('message',function(obj) {
        socket.in(obj.room).broadcast.emit('message',obj);
    });
    socket.on('typing',function(obj) {
       socket.in(obj.room).broadcast.emit('typing',obj);
    });
    socket.on('stoptyping',function(n){
        socket.in(n).broadcast.emit('stoptyping', n);
    });
}
var http = require('http'),
    node_static = require('node-static'),
    host = 'localhost',
    port = 1000,
    static_files = new node_static.Server(__dirname),
    http_server = http.createServer(handleHTTP),
    socket_io = require('socket.io').listen(http_server);
http_server.listen(port, host);
socket_io.configure(function() {
    socket_io.set('log level', 1);
});
socket_io.on('connection', connection);
