const net = require('net');
const colors = require('colors')
var RandExp = require('randexp')
const serverConfig = require('./Sending_command/config').SERVER_CONFIG
const timegap = 0;   //set time gap in clients in milliseconds
const no_of_clients=16000;
var sent=0;	
	
for (var i = 0; i < no_of_clients; i++) 
{
				
        const client = new net.Socket();
		
        client.setEncoding('utf8')
		
        client.connect(serverConfig.PORT, serverConfig.HOST, function () 
		{
			for(var m=0;m<5;m++){
				var imei_1 = new RandExp(/^[0-9]{15,15}$/).gen();
				var imei_2 = new RandExp(/^[0-9]{15,15}$/).gen();
				var imei_3 = new RandExp(/^[0-9]{15,15}$/).gen();
				var imei_4 = new RandExp(/^[0-9]{15,15}$/).gen();
				var imei_5 = new RandExp(/^[0-9]{15,15}$/).gen();
		
				
		
				var data_0 =`$,N,NIPPON,2.0,HA,14,L,${imei_1},AP09BU9365,1,03032019,220813,28.622110,N,077.248001,E,069.0,343.95,12,00193.3,001.3,000.6,!DEA-H,1,1,15.1,05.7,0,O,20,404,04,0088,373E,0096,320C,26,0096,6024,20,0096,08AD,18,0088,3E83,16,1000,00,000000,E2,*`
				var data_1 =`$,N,NIPPON,2.6,NR,01,L,${imei_2},AP09BU9365,0,00000000,000000,00.000000,N,000.000000,E,000.0,000.00,00,00000.0,000.0,000.0,CELLONE,0,1,26.0,00.1,1,C,15,404,64,0926,A643,0926,A52A,15,FFFF,0000,10,FFFF,0000,09,FFFF,0000,09,1000,00,00.46,00.12,340132,B1,-0.02,-0.02,-0.02,-0.02,0.99,1.00,*`
				var data_2 =`$,N,NIPPON,2.6,NR,02,H,${imei_3},AF,1,03032019,183603,13.069523,N,077.576156,E,000.0,045.50,12,00945.5,001.6,000.7,0,0,1,14.5,05.5,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.44,00.09,246099,B6,-0.40,-0.40,-0.19,-0.19,0.88,0.88,*`
				var data_3 =`$,N,NIPPON,2.6,NR,02,H,${imei_4},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*`
				var data_4 =`$,N,NIPPON,2.6,NR,01,L,${imei_5},AP09BU9365,0,00000000,000000,00.000000,N,000.000000,E,000.0,000.00,00,00000.0,000.0,000.0,CELLONE,0,1,26.0,00.1,1,C,15,404,64,0926,A643,0926,A52A,15,FFFF,0000,10,FFFF,0000,09,FFFF,0000,09,1000,00,00.46,00.12,340132,B1,-0.02,-0.02,-0.02,-0.02,0.99,1.00,*`
			   
				var data = [data_0, data_1, data_2, data_3, data_4];
				
				
					setTimeout((m) => {
					sent++;
					client.write((data[m]),'utf8');
					console.log("Sent",sent);
				}, 2000 * m, m);  
			}
		})
		
		// var data=`$,N,NIPPON,2.7,NR,01,L,358943051633625,AP09BU9365,1,03032019,220812,28.779739,N,078.178474,E,000.0,226.33,12,00185.3,001.2,000.7,!DEA,1,1,15.3,05.4,0,C,20,404,56,0190,FBEB,FFFF,0000,28,0190,0000,21,00AF,C0E5,19,0190,0000,18,0000,00,00.50,00.17,102779,EC,-0.38,-0.40,-0.13,-0.15,0.90,0.92,*`
		// client.write((data),'utf8');
		
        client.on('data', function (data) {

            console.log('server :'.cyan + data);

        })
		
        client.on('close', function () {
            console.log('server :' + 'rejected'.bold);
        })
		
        client.on('error', function (err) {
            console.log('server :'.cyan + "error".red, err);
        })
		
    
}