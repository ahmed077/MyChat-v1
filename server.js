function handleHTTP(req,res) {
    if (req.method == 'GET') {
        // if (/^\/\d+(?=$|[?/#])/.test(req.url)) {
        //     req.addListener('end', function() {
        //         req.url = req.url.replace(/^\/(\d+).*$/, '/\$1.html/');
        //         static_files.serve(req,res);
        //     });
        //     req.resume();
        // } else if (/^\w+[.]$[html]/.test(req.url)) {
        //     req.addListener('end', function() {
        //         static_files.serve(req,res);
        //     });
        //     req.resume();
        // } else {
        //     res.writeHead(403);
        //     res.end();
        // }
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
    socket.on('message',function(msg,num) {
        socket.in(num).broadcast.emit('broadcast',msg);
    });
    socket.on('typing',function(name,num) {
       socket.in(num).broadcast.emit('typing',name + ' is typing ...');
    });
    socket.on('stoptyping',function(n){
        socket.in(n).broadcast.emit('stoptyping');
    });
}
var http = require('http'),
    node_static = require('node-static'),
    host = 'localhost',
    port = 1000,
    ASQ = require('asynquence'),
    static_files = new node_static.Server(__dirname),
    http_server = http.createServer(handleHTTP),
    socket_io = require('socket.io').listen(http_server);
http_server.listen(port, host);
socket_io.configure(function() {
    socket_io.set('log level', 1);
});
require('asynquence-contrib');
socket_io.on('connection', connection);