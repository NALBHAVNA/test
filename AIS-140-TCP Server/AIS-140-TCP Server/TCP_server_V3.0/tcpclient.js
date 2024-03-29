const net = require('net');
const colors = require('colors')
var RandExp = require('randexp')
const serverConfig = require('./Sending_command/config').SERVER_CONFIG
var sent=0;
const client = new net.Socket();
client.setEncoding('utf8')
client.connect(serverConfig.PORT,serverConfig.HOST, function () {
    var imei = new RandExp(/^[0-9]{15,15}$/).gen();
    var imei1 =358943051399870 //new RandExp(/^[0-9]{15,15}$/).gen();
    var imei2 = new RandExp(/^[0-9]{15,15}$/).gen();
    var imei3 = new RandExp(/^[0-9]{15,15}$/).gen();
    
        let data=`$,N,NIPPON,2.6,TA,01,L,123450000000023,KA67676,1,0000000,000000,12.955477,N,077.637245,E,000.0,000.00,11,00907.0,001.8,000.8,AIRTEL,0,0,00.0,05.2,1,O,23,404,45,61F1,03A4,61F1,D373,23,61F1,03A5,21,61F1,D374,15,FFFF,0000,15,0000,00,00.39,00.08,003757,BF,0.31,0.31,0.00,0.01,0.95,0.98,*`;
        // let data=`$,AP09BU9365,$358943051628518,$2.6,$1.0,$28.670875,$N,$077.226165,$E! $,N,NIPPON,2.4,NR,02,L,${imei},AP09BU9365,1,05042019,161227,12.955459,N,077.637306,E,012.5,308.83,12,00233.6,001.2,000.7,IDEA-H,1,1,15.4,05.4,0,C,25,404,04,0145,070B,0145,070B,23,00E1,CE87,21,00E1,0174,21,00E1,0175,20,0000,00,00.40,00.08,100147,E7,0.70,0.76,0.21,0.23,-0.71,-0.82,* $,GPRS,358943051517893, OK ! $,N,NIPPON,2.4,NR,02,L,${imei1},AP09BU9365,1,05042019,161227,12.955459,N,077.637306,E,012.5,308.83,12,00233.6,001.2,000.7,IDEA-H,1,1,15.4,05.4,0,C,25,404,04,0145,070B,0145,070B,23,00E1,CE87,21,00E1,0174,21,00E1,0175,20,0000,00,00.40,00.08,100147,E7,0.70,0.76,0.21,0.23,-0.71,-0.82,*$,N,NIPPON,2.4,NR,02,L,${imei2},AP09BU9365,1,05042019,161227,12.955459,N,077.637306,E,012.5,308.83,12,00233.6,001.2,000.7,IDEA-H,1,1,15.4,05.4,0,C,25,404,04,0145,070B,0145,070B,23,00E1,CE87,21,00E1,0174,21,00E1,0175,20,0000,00,00.40,00.08,100147,E7,0.70,0.76,0.21,0.23,-0.71,-0.82,*$,N,NIPPON,2.4,NR,02,L,${imei3},AP09BU9365,1,05042019,161227,12.955459,N,077.637306,E,012.5,308.83,12,00233.6,001.2,000.7,IDEA-H,1,1,15.4,05.4,0,C,25,404,04,0145,070B,0145,070B,23,00E1,CE87,21,00E1,0174,21,00E1,0175,20,0000,00,00.40,00.08,100147,E7,0.70,0.76,0.21,0.23,-0.71,-0.82,*`;
        client.write(JSON.stringify(data));
        // console.log(data,"Sent")
        // client.end();
})
    // for(var i=0;i<1;i++){
    // var imei_1 = new RandExp(/^[0-9]{15,15}$/).gen();
    // var imei_2 = new RandExp(/^[0-9]{15,15}$/).gen();
    // var imei_3 = new RandExp(/^[0-9]{15,15}$/).gen();
    // var data_0=`$,N,NIPPON,2.6,NR,01,L,358943051524779,KA67676,1,15032019,122512,12.955477,N,077.637245,E,000.0,000.00,11,00907.0,001.8,000.8,AIRTEL,0,0,00.0,05.2,0,O,23,404,45,61F1,03A4,61F1,D373,23,61F1,03A5,21,61F1,D374,15,FFFF,0000,15,0000,00,00.39,00.08,003757,BF,0.31,0.31,0.00,0.01,0.95,0.98,*`

    
    // var data_1= `$,AP09BU9365,$${imei_2},$2.6,$1.0,$28.670875,$N,$077.226165,$E! $,N,NIPPON,2.0,TAC,05,L,${imei_2},AP09BU9365,1,14022019,114540,-12.955117,N,-077.637016,E,000.0,216.14,12,00900.7,001.7,000.9,AIRTEL,0,0,00.0,05.1,0,O,21,404,45,61,*`
    // var data_2=`F1,03A5,FFFF,0000,19,FFFF,0000,18,FFFF,0000,01,FFFF,0000,01,1000,00,00.41,00.14,007150,8D,-0.01,-0.02,0.21,0.23,0.97,1.00,@MSIL,050341057900000000,00,0B03410B1F00000000,0C04410C0B04000000,0D03410D0000000000,0F03410F5500000000,00,00,00,00,010641010007600000,210441210000000000,00,00,00,00,00,00,00,00*`
    // var data_3= `$,N,NIPPON,2.0,TAC,05,L,${imei_3},AP09BU9365,1,14022019,114540,-12.955117,N,-077.637016,E,000.0,216.14,12,00900.7,001.7,000.9,AIRTEL,0,0,00.0,05.1,0,O,21,404,45,61`
    // var data_4=`F1,03A5,FFFF,0000,19,FFFF,0000,18,FFFF,0000,01,FFFF,0000,01,1000,00,00.41,00.14,007150,8D,-0.01,-0.02,0.21,0.23,0.97,1.00,@MSIL,050341057900000000,00,0B03410B1F00000000,0C04410C0B04000000,0D03410D0000000000,0F03410F5500000000,00,00,00,00,010641010007600000,210441210000000000,00,00,00,00,00,00,00,00*`
    // var data = [data_0, data_1, data_2, data_3, data_4];
   
    // client.write(data_1,'utf8')
    // client.write(data_2,'utf8')
    // client.write(data_3,'utf8')
    // client.write(data_4,'utf8')
    // setInterval(function(){
        
    // },19000)
// }

client.on('data', function (data) {

    console.log('server :'.cyan + data);

})
client.on('close', function () {
    console.log('server :' + 'rejected'.bold);
    process.exit(0);
})
client.on('error', function (err) {
    console.log('server :'.cyan + "error".red, err);
})

 