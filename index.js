var ClusterApp = require('node-cluster-app')

var app = new ClusterApp({
    workers: 1,
    timeout: 2000,
    restart: true,
    evlog:   false
})
app.init(__dirname + '/mock-server.js');
app.start();
