var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) 
{
    for (var i = 0; i < numCPUs; i++) 
    {
        cluster.fork();
    }
    cluster.on('exit', function(worker, code, signal) {
        cluster.fork();
        //console.log('Process ' + worker.process.pid + ' Stopped');
      });
}
else
{
    require('./tcpserver');
}