var respawn = require('respawn');
var http= require('http');
http.post = require('http-post');
var msgcounter = 0;
var monitor = respawn(['cluster.js'], {
    // env: {ENV_VAR:'test'}, // set env vars
    // cwd: '.',              // set cwd
    // maxRestarts:10,        // how many restarts are allowed within 60s
    // sleep:1000,            // time to sleep between restarts
    name: 'msilhttp',          // set monitor name
    //env: {ENV_VAR:'test'}, // set env vars
    cwd: '.',              // set cwd
    maxRestarts:10,        // how many restarts are allowed within 60s
                         // or -1 for infinite restarts
    sleep:[7000, 60000, 60000, 12000],            // time to sleep between restarts,
    kill:10000,            // wait 30s before force killing after stopping
    fork: true,         // fork instead of spawn
    stdio:['ipc']   // forward stdio options
});
monitor.start(); // spawn and watch
monitor.on('stdio', function(data) {
    console.log(data.toString('utf8'))
    console.log(data)
  })

  monitor.on('stdout', function(data) {
    console.log(data.toString('utf8'));
  })
monitor.on('exit',()=>{
    console.log("Stoped with ")
    if(msgcounter<3)
    {
		msgcounter++;
		
	}
	else if(msgcounter==10)
	{
		msgcounter++;
	}
	else
	{
		msgcounter++
	}

})

monitor.on('error',()=>{
    console.log("Error")
})

monitor.on('crash',()=>{
    console.log("Error")
})