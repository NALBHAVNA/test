const net = require('net');
const colors = require('colors')
var RandExp = require('randexp')
const timegap=2;   //set time gap in clients in milisecends
const no_of_clients=7000;
var sent=0;
const port = 3001;
const host = '192.168.10.153'

const serverConfig = require('./Sending_command/config').SERVER_CONFIG

var idx = 0;
var intervalID;
var makeConnection = function() {
  const client = new net.Socket();
        client.setEncoding('utf8')
        // client.connect(port,host,function () {
          client.connect(serverConfig.PORT,serverConfig.HOST, function () {
                const imei = new RandExp(/^[0-9]{15,15}$/).gen();
                const imei1= new RandExp(/^[0-9]{15,15}$/).gen();
                const imei2= new RandExp(/^[0-9]{15,15}$/).gen();
                const imei3= new RandExp(/^[0-9]{15,15}$/).gen();
                var data=`$,N,NIPPON,2.0,HA,14,H,${imei1},AP09BU9365,1,24032019,070420,12.933209,N,077.688743,E,051.8,227.13,12,00888.0,001.1,000.6,IDEA,1,1,15.3,00.1,0,C,27,404,44,09D4,5231,09D4,58C3,28,09D4,58C2,25,09D4,0000,25,FFFF,0000,24,0000,00,383201,9B,*`// var data=`$,N,NIPPON,2.6,NR,02,H,${imei},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*$,N,NIPPON,2.6,NR,02,H,${imei1},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*$,N,NIPPON,2.6,NR,02,H,${imei2},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*$,N,NIPPON,2.6,NR,02,H,${imei3},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*`
                client.write(JSON.stringify(data));
                sent++;
                // console.log("sent",sent)
           
        
        })


        client.on('data', function (data) {

            // console.log('server :'.cyan + data);

        })
        client.on('close', function () {
            console.log('server :' + 'Closed'.bold);
        })
        client.on('error', function (err) {
            console.log('server :'.cyan + "error".red, err);
        })

  idx++;
  if (idx === no_of_clients) {
    clearInterval(intervalID);
  }
};


intervalID = setInterval(makeConnection,timegap);

