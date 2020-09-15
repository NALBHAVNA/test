const net = require('net');
const colors = require('colors')
var RandExp = require('randexp')
const serverConfig = require('./Sending_command/config').SERVER_CONFIG
const timegap=0;   //set time gap in clients in milisecends
const no_of_clients=16000;
var sent=0;
const no_of_message=20;
for (var i = 0; i <no_of_clients; i++){

    setTimeout((i) => {
        const client = new net.Socket();
        client.setEncoding('utf8')
        // client.connect(3000,"192.168.10.153", function () {
            client.connect(serverConfig.PORT,serverConfig.HOST, function () {
                const imei = new RandExp(/^[0-9]{15,15}$/).gen();
                const imei1= new RandExp(/^[0-9]{15,15}$/).gen();
                const imei2= new RandExp(/^[0-9]{15,15}$/).gen();
                const imei3= new RandExp(/^[0-9]{15,15}$/).gen();
				/*var data= { accountId: 'NIPPON',
  firmwareVersion: '2.0',
  packetType: 'HA',
  alertid: '14',
  packetStatus: 'H',
  imei: `${imei}`,
  vehicleRegNo: 'AP09BU9365',
  gpsFix: 1,
  timestamp: 1553411060,
  latitude: 12.933209,
  latitudeDir: 'N',
  longitude: 77.688743,
  longitudeDir: 'E',
  speedOfTheVehicle: 51.8,
  heading: 227.13,
  noOfSatelites: 12,
  altitude: 888,
  pdop: 1.1,
  hdop: 0.6,
  operatorName: 'IDEA',
  ignition: 1,
  mainPowerStatus: 1,
  mainInputVoltage: 15.3,
  internalBatteryVoltage: 0.1,
  emergencyStatus: 0,
  temperAlert: 'C',
  gsmSignalStrength: 3,
  mcc: '404',
  mnc: '44',
  lac: '09D4',
  cellId: '5231',
  nmr1Lac: '58C3',
  nmr1CellId: '09D4',
  nmr1SignalStrength: '28',
  nmr2Lac: '58C2',
  nmr2CellId: '09D4',
  nmr2SignalStrength: '25',
  nmr3Lac: '0000',
  nmr3CellId: '09D4',
  nmr3SignalStrength: '25',
  nmr4Lac: '0000',
  nmr4CellId: 'FFFF',
  nmr4SignalStrength: '24',
  digitalInputStatus: '0000',
  digitalOutputStatus: '00',
  analogInput1: 0,
  frameNumber: 383201,
  Xacc: 0,
  Xpeak: 0,
  Yacc: 0,
  Ypeak: 0,
  analogInput2: 0,
  Zacc: 0,
  Zpeak: 0,
  systemHealth: 1,
  creationTime: 1557827782,
  clientadd: '192.168.10.153',
  clientport: 2246 };*/
               var data=`$,N,NIPPON,5.1,NR,02,H,${imei},AP09BU9365,1,26082019,201232,28.978939,N,079.388633,E,000.0,355.73,13,00202.1,001.3,000.8,IN#CELL,0,1,13.1,00.9,1,C,12,404,54,002C,01EC,FFFF,0000,11,FFFF,0000,08,FFFF,0000,07,FFFF,0000,01,1000,00,00.04,00.04,261615,DC,-0.10,-0.10,0.30,0.30,-0.95,-0.97,* 
               $,GPRS,358943051517893,
               OK 
               !`             
                // var data=`$,N,NIPPON,2.6,NR,02,H,${imei},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*$,N,NIPPON,2.6,NR,02,H,${imei1},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*$,N,NIPPON,2.6,NR,02,H,${imei2},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*$,N,NIPPON,2.6,NR,02,H,${imei3},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*`
                client.write(JSON.stringify(data));
                // client.end();
                sent++;
                // console.log("sent",sent)
        })

        client.on('data', function (data) {

            console.log('server :'.cyan + data);

        })
        client.on('close', function () {
            // console.log('server :' + 'rejected'.bold);
        })
        client.on('error', function (err) {
            console.log('server :'.cyan + "error".red, err);
        })
    }, timegap * i, i);  
}



