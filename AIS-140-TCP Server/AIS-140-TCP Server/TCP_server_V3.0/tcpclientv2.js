const net = require('net');
const colors = require('colors')
var RandExp = require('randexp')
const serverConfig = require('./Sending_command/config').SERVER_CONFIG
const timegap=0;   //set time gap in clients in milisecends
const no_of_clients=16000;
var sent=0;
const no_of_message=20;
var lineReader = require('line-reader');
//for (var i = 0; i <no_of_clients; i++) {

   //setInterval(function(){
     var count = 0;

    lineReader.eachLine('gts-file(testing)', function(line, last) {
      console.log(line);
     
      count = count+1;
      console.log(count);
      console.log(line.split(','));
      const client = new net.Socket();
        client.setEncoding('utf8')
        client.connect(serverConfig.PORT, serverConfig.HOST, function () {
            
           
                //var imei = new RandExp(/^[0-9]{15,15}$/).gen();
                var data=line;             
               
                client.write(JSON.stringify(data));
                sent++;
                console.log("sent",sent)
           
        
        })


        client.on('data', function (data) {

            console.log('server :'.cyan + data);

        })
        client.on('close', function () {
            console.log('server :' + 'rejected'.bold);
        })
        client.on('error', function (err) {
            console.log('server :'.cyan + "error".red, err);
        })
      // do whatever you want with line...
      if(last){
        // or check if it's the last one
      }
    });
		
        
    //}, 10000);  
//}



