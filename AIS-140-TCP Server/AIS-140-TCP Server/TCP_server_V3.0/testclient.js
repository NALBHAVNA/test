var TestTCP = require('test-tcp');
var assert = require('assert');
var net = require('net');
var RandExp = require('randexp')
var imei = new RandExp(/^[0-9]{15,15}$/).gen();
var data=`$,N,NIPPON,2.6,NR,02,H,${imei},AP09BU9365,1,13032019,141615,28.670875,N,077.226165,E,004.5,212.07,06,00228.6,002.6,001.8,0,0,1,14.4,05.6,0,C,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0000,00,00.45,00.08,153905,B9,0.00,-0.52,0.00,0.01,0.00,0.89,*` 
TestTCP.test_tcp({
    // server: net.createServer(function (socket) {
    //     socket.on('data', function (data) {
    //         socket.write(data);
    //         console.log(data)
    //     });
    // }),
   
    client: function (port, done) {
        var socket = new net.Socket();
        socket.connect(port, function () {
            socket.on('close', done);
            socket.on('data', function (data) {
                assert.equal(data.toString(), data);
                socket.end();
            });
            socket.write(data,'utf8');
        });
    }
});