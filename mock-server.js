var _ = require('underscore');
var restify = require('restify');
var port = process.env.port || '9001';
var specSet = [];
var HESSIAN_CONTENT_TYPE = 'x-application/hessian';
var server = restify.createServer({
    name: 'mock-server',
    version: require(__dirname + '/package.json').version
});


function serveMocks(req, res, next) {
    req.setEncoding(null);
    var body = [];

    req.on('data', function(chunk) {
        console.log("body before push: " , body);
        console.log("chunk type: " + typeof chunk);
        console.log("chunk: " , chunk);
        body.push(chunk);
        console.log("body after push: " , body);
    });
    req.on('error', function(err) {
        console.log("Error during HTTP request");
        console.log(JSON.stringify(err));
    });
    req.on('end', function() {
        var resultSpecs = specSet.find(firstMatchingSpecs(req, body));
        res.statusCode = resultSpecs.response.statusCode;
        res.contentType = resultSpecs.response.contentType;
        if (resultSpecs.response.contentType === HESSIAN_CONTENT_TYPE) {
            var buf = new Buffer(resultSpecs.response.body, 'base64');
            res.end(buf);
        } else {
            res.end(JSON.stringify(resultSpecs.response.body));
        }
        next();
    })
};

function getSpec(req, res, next) {
    res.send(201, {
        specs: specSet
    });
    next();
};


function addSpec(req, res, next) {
    req.setEncoding("utf8");//for adding specs, we are receiving a json string, so encoding here is utf8
    var body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('error', function(err) {
        console.log("Error during HTTP request");
        console.log(JSON.stringify(err));
    });
    req.on('end', function() {
        var specs = JSON.parse(body);
        specSet.push(specs);
        res.send(201);
        next();
    });
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

function compareBody(req, data, currentSpecs) {
    console.log("i am in compare body");
    if (req.header('Content-Type') === HESSIAN_CONTENT_TYPE) {
        console.log("data in compare Body: ", data.join(''));
        var base64 = new Buffer(data.join(''), 'binary').toString('base64');
        console.log("base64 as hex: ", new Buffer(data, 'binary').toString('hex'));
        console.log("base64: ", base64);
        console.log("currentSpecs.body: ", currentSpecs.request.body);
        console.log("returning: ", base64 === currentSpecs.request.body);
        return base64 === currentSpecs.request.body;
    }
    console.log("returning ", true);
    return true;
}

function firstMatchingSpecs(req, data) {
    return function isMatchingSpecs(currentSpecs, index, array) {
        if (process.env.debug) {
            console.log("===============");
            console.log("currentSpecs.request.url: " + currentSpecs.request.url);
            console.log("req.url: " + req.url);
            console.log("currentSpecs.request.method: " + currentSpecs.request.method);
            console.log("req.method: " + req.method);
            console.log("return: " + (new RegExp(currentSpecs.request.url).test(req.url) && (req.method == currentSpecs.request.method)));
            console.log("currentSpecs.request.contentType: " + currentSpecs.request.contentType);
            console.log("req.contentType: " + req.header('contenT-Type'));
        }
        return new RegExp(currentSpecs.request.url).test(req.url) &&
            (req.method == currentSpecs.request.method) &&
            (req.header('Content-Type') == currentSpecs.request.contentType) &&
            compareBody(req, data, currentSpecs);
    };
};

server.get('/specs', getSpec);
server.post('/specs', addSpec);
server.del('/specs', deleteSpec);
server.get('.*', serveMocks);
server.post('.*', serveMocks);
server.use(serveMocks);

server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
