var Promise = require("bluebird"),
    rp = require("request-promise");


function BaseModule() {
    this.Promise = Promise;
    this.requestPromise = function (host, path, method, data) {
        var endpoint = path ? host + path : host;
        return rp({url: endpoint, transform: this.autoParse}).promise()
            .cancellable()
            .catch(this.Promise.TimeoutError, this.Promise.CancellationError, function (e) {
                throw e;
            });
    }

    function printMyName(){
        console.log('my name is unknown');
    };

    this.printMyName2 = function() { return printMyName(); }
}



module.exports = BaseModule;
