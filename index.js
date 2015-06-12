var http = require('http'),
    mockserver = require('mockserver');

var server = http.createServer(mockserver('./mocks'));
var port = '9001';

var connectionCount = 0;
server
//    .on('connection', function (socket) {
//        console.log("A new connection was made by a client total [%s]", ++connectionCount);
//        socket.setTimeout(10 * 1000); // 10 seconds
//        socket.setKeepAlive(true);
//    })
    .on('request', function(request, response){
 //       console.log('A new request arrived');
    })
    .listen(port, function () {
        console.log('server started on port [%s]', port);
    });

