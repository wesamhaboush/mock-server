var http = require('http'),
    mockserver = require('mockserver');

var server = http.createServer(mockserver('./mocks'));
var port = '9001';

var connectionCount = 0;
server
    .listen(port, function () {
        console.log('server started on port [%s]', port);
    });

