var http = require('http');
var fs = require('fs');
var specSet = [];

var server = http.createServer(mockserver('./manual-mocks/'));
var port = '9001';

var connectionCount = 0;
server
    .listen(port, function() {
        console.log('server started on port [%s]', port);
    });


function mockserver(dir) {
    loadFiles(dir);
    return function db(req, res) {
        var resultSpecs = specSet.find(firstMatchingSpecs(req));
        res.statusCode = resultSpecs.response.statusCode;
        res.contentType = resultSpecs.response.contentType;
        res.end(JSON.stringify(resultSpecs.response.body));
    }
}


function loadFiles(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var content = fs.readFileSync(dir + file, 'utf-8');
        var specs = JSON.parse(content);
        specSet.push(specs);
    });
}

function firstMatchingSpecs(req) {
    return function isMatchingSpecs(currentSpecs, index, array) {
        if (process.env.debug) {
            console.log("===============");
            console.log("currentSpecs.request.url: " + currentSpecs.request.url);
            console.log("req.url: " + req.url);
            console.log("currentSpecs.request.method: " + currentSpecs.request.method);
            console.log("req.method: " + req.method);
            console.log("return: " + (new RegExp(currentSpecs.request.url).test(req.url) && (req.method == currentSpecs.request.method)));
        }
        return new RegExp(currentSpecs.request.url).test(req.url) && (req.method == currentSpecs.request.method);
    };
}