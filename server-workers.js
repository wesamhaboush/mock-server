var ClusterApp = require('node-cluster-app')

var app = new ClusterApp({
    workers: 10,
    timeout: 2000,
    restart: true,
    evlog:   false
})
console.log(__dirname + '/manual-mock.js');
app.init(__dirname + '/manual-mock.js');
//app.init('./index.js');
app.start();
