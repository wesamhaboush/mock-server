var _ = require('underscore');
var restify = require('restify');
var port = process.env.port || '9001';
var specSet = [];

var server = restify.createServer({
    name: 'mock-server',
    version: require(__dirname + '/package.json').version
});


function serveMocks(req, res, next) {
    var resultSpecs = specSet.find(firstMatchingSpecs(req));
    res.statusCode = resultSpecs.response.statusCode;
    res.contentType = resultSpecs.response.contentType;
    res.end(JSON.stringify(resultSpecs.response.body));
    next();
};

function getSpec(req, res, next) {
    res.send(201, {
        specs: specSet
    });
    next();
};


function addSpec(req, res, next) {
    var specs = JSON.parse(req.body);
    specSet.push(specs);
    res.send(201);
    next();
};

function deleteSpec(req, res, next) {
    var specs = JSON.parse(req.body);
    var newSpecSet = specSet.filter(function(current) {
        return !_.isEqual(specs, current);
    });
    if (newSpecSet.length === specSet.length) {
        res.send(404, {
            message: "count not find specs to delete"
        });
    } else {
        specSet = newSpecSet;
        res.send(200);
    }
    next();
};

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
};

server.use(restify.bodyParser());

server.get('/spec', getSpec);
server.post('/spec', addSpec);
server.del('/spec', deleteSpec);
server.get('.*', serveMocks);
server.use(serveMocks);

server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
