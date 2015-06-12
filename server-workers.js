var ClusterApp = require('node-cluster-app')

var app = new ClusterApp({
    workers: 8,
    timeout: 2000,
    restart: true,
    evlog:   false
})
app.init('./index.js');
app.start();
