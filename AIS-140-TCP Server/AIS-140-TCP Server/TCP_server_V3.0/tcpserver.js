//Tcp Server with Session creation and client handling
const net = require('net');
// var fs = require('fs')
require('colors');


// logger ==>
require('winston-daily-rotate-file');

var winston = require('winston');

winston.loggers.add('logger', {
    transports: [
// new (winston.transports.Console)(
//             {
//                 //level: config.debugLogLevel,
//                 colorize: true
//             }),

        //new files will be generated each day, the date patter indicates the frequency of creating a file.
        new winston.transports.DailyRotateFile({
               name: 'info-log',
                filename: 'RawData',
                //level: '<level>',
                prepend: true,
				dirname:'./logger',
                maxSize: '2mb',
                //datePattern: '<pattern>',
                maxFiles: 100
            }
        )
    ]
});
// logger <==


var debug=require('debug')('tcpdebug:server');
// var Gateway = require('./gateway')
// var JSONDuplexStream = require('json-duplex-stream');

//Updates
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
const serverConfig = require('./Sending_command/config').SERVER_CONFIG;

//Command fetch and update status.
//var command_data = require("./Sending_command/command_data");
//var update_sts = require("./Sending_command/update_status");

// Updated on 20-11-2019
var command_data = require("./Sending_command/command_data_new");
var update_sts = require("./Sending_command/update_status_new");

const server = net.createServer(onConnect);
const dataParser = require('./gtsParser2');//Parser for the SMART-NT262 message format

// //Mysql database connection pool.
//const mysql=require('mysql');
//const dbConfig = require('./Sending_command/config').DATABASE_CONFIG;
//const con = mysql.createConnection(dbConfig);
//global.con = con;

 var con = require('./database')
 global.con = con;

//For better performace
// var mysql = require('mysql');

// var MysqlPoolBooster = require('mysql-pool-booster');
// mysql = MysqlPoolBooster(mysql);
// const dbConfig = require('./Sending_command/config').DATABASE_CONFIG;
// var con = mysql.createPool(dbConfig);
// global.con = con;



var idletimeout = 20000;  //Should be updated. //Old value 500

const persistance = require('./databaseOpr');


server.listen({port:serverConfig.PORT, host:serverConfig.HOST,exclusive:false}, () => {
    console.log("Server is listening on the PORT :%s and HOST :%s".white.bgCyan, serverConfig.PORT, serverConfig.HOST);
});

var imei = "";
var ar = [];
var buff;
var response = {};
function onConnect(socket) {
    socket.setEncoding('utf8');//Socket data to utf8 format
    //Socket event when data is sent from tcp client
    socket.on('data', function (data) {
		//data=JSON.parse(data);
        //persistance.emit('addRecord',data)
        /*if(data.match(/PROXY/g))
        {
            data="";
        }*/
        data=data.replace(/"/g,"");
        let clientport=socket.remotePort;
        let clientadd=socket.remoteAddress;
        // console.log(clientadd+":"+clientport)
        //console.log("--",data,"--")
        var buffer = Buffer.from(data);
        var msglength = (buffer.toString().match(/,/g) || []).length;
        // console.log(msglength);
        // console.log((buffer.toString().indexOf("*")));

        //Check for all combinations else buffer the data till * delimiter
        if (msglength == 50 || msglength == 53 || msglength == 58 || msglength == 61 || msglength == 66 || (msglength == 8 && data.match(/\$E!/g)) || (data.match("GPRS"))) { //(msglength == 3 &&
            //Parse the data
            //console.log("Expected Packet length")
            response = dataParser.parser(buffer.toString(),clientadd,clientport);
            //console.log("After Return in Whole",response.deviceID);


			 if (response != 0) {
				 	socket.imei="";
			        imei="";
				 //Current date and time calculation
			        var date = new Date();
			        var year = date.getFullYear();
			        var month = date.getMonth() + 1;
			        var day = date.getDate();
			        var hour = date.getHours();
			        var minute = date.getMinutes();
			        var seconds = date.getSeconds();
			        var response_date = year + "-" + month + "-" + day;
			        var response_time = hour + ":" + minute + ":" + seconds;

			        var logger = winston.loggers.get('logger');
			        logger.info(response_time+">"+data);
			        // logger.info(data);
			       // Object.defineProperty(exports, "LOG", {value: logger});

			            imei = response.deviceID                //retriving imei number from
			            //console.log("imei",imei)
			            socket.imei = imei;
			            /*----------------Command fetch and update status------------------------*/
			            socket.emergencyStatus = response.emergencyStatus;
			            socket.packetType = response.packetType;


			            if(response.packetType == "EA" && response.emergencyStatus == 1 )
						{
						console.log("packetType "+response.packetType);
			            console.log("emergencyStatus "+response.emergencyStatus);
			            if (socket.imei == imei) {
			                clearSOS=Buffer.from(getBytes("\r\n+ACC CLRSOS\n\r\n"));
			                socket.write(clearSOS);
			                socket.imei="";
			               	imei="";
			            }
			            }else
			            {
			            command_data.command_data(imei, function (err, data) {
			                if (err) {
			                    console.log(err);
			                    socket.imei="";
			                    imei="";
			                }
			                else {
			                    // console.log("calling command data",socket.imei)
			                    if (data == 0) {
									socket.imei="";
			                        imei="";
			                        console.log("No imei present");
			                    }
			                    else if (data == 1) {
									socket.imei="";
			                        imei="";
			                        //console.log("The imei does not have status 1");
			                    }
			                    else {
			                        if (data.cmd != null) {
			                            //console.log("\r\n+ACC "+ data.cmd +"\n\r\n");
			                            org_command = "\r\n+ACC " + data.cmd + "\n\r\n";
			                            if (socket.imei == imei) {
			                                // const bytes=getBytes(org_command)
			                                const buf = Buffer.from(getBytes(org_command));
			                                // console.log(bytes,buf);
			                                if (socket.write(buf)) {
			                                    console.log("calling update sts")
			                                    update_sts.emit('update',socket.imei);
			                                    socket.imei="";
			                                    imei="";
			                                }
			                                else {
			                                    socket.imei="";
			                                    imei="";
			                                    //console.log("Data not sent to the client");
			                                }
			                            }
			                            else {
											socket.imei="";
			                                imei="";
			                                //console.log("client lost");
			                            }
			                        }

			                    }
			                }
			            });
			        }

			            // // console.log(response);

			        }//correct packet
			        else {
						socket.imei="";
			             imei="";
			            console.log("Wrong Packet");
        }

        }
        else if(msglength==0&&data.length==0)
        {
            // console.log("Empty message".blue);
        }
        else {

            if ((buffer.toString().indexOf("*")) > -1) {
                //console.log("complete message formed")
                ar.push(buffer);
                buff = Buffer.concat(ar).toString().replace(/"/g, "");
                // console.log("Complete buffer".blue+buff)
                //calling the parser and storing parse data in response
                response = dataParser.parser(buff,clientadd,clientport)
 				//console.log("After Return in Buffer",response.deviceID);



				 if (response != 0) {
					 	socket.imei="";
				        imei="";
					 //Current date and time calculation
				        var date = new Date();
				        var year = date.getFullYear();
				        var month = date.getMonth() + 1;
				        var day = date.getDate();
				        var hour = date.getHours();
				        var minute = date.getMinutes();
				        var seconds = date.getSeconds();
				        var response_date = year + "-" + month + "-" + day;
				        var response_time = hour + ":" + minute + ":" + seconds;

				        var logger = winston.loggers.get('logger');
				        logger.info(response_time+">"+data);
				        // logger.info(data);
				       // Object.defineProperty(exports, "LOG", {value: logger});

				            imei = response.deviceID                //retriving imei number from
				            //console.log("imei",imei)
				            socket.imei = imei;
				            /*----------------Command fetch and update status------------------------*/
				            socket.emergencyStatus = response.emergencyStatus;
				            socket.packetType = response.packetType;


				            if(response.packetType == "EA" && response.emergencyStatus == 1 )
							{
							console.log("packetType "+response.packetType);
				            console.log("emergencyStatus "+response.emergencyStatus);
				            if (socket.imei == imei) {
				                clearSOS=Buffer.from(getBytes("\r\n+ACC CLRSOS\n\r\n"));
				                socket.write(clearSOS);
				                socket.imei="";
				               	imei="";
				            }
				            }else
				            {
				            command_data.command_data(imei, function (err, data) {
				                if (err) {
				                    console.log(err);
				                    socket.imei="";
				                    imei="";
				                }
				                else {
				                    // console.log("calling command data",socket.imei)
				                    if (data == 0) {
										socket.imei="";
				                        imei="";
				                        console.log("No imei present");
				                    }
				                    else if (data == 1) {
										socket.imei="";
				                        imei="";
				                        //console.log("The imei does not have status 1");
				                    }
				                    else {
				                        if (data.cmd != null) {
				                            //console.log("\r\n+ACC "+ data.cmd +"\n\r\n");
				                            org_command = "\r\n+ACC " + data.cmd + "\n\r\n";
				                            if (socket.imei == imei) {
				                                // const bytes=getBytes(org_command)
				                                const buf = Buffer.from(getBytes(org_command));
				                                // console.log(bytes,buf);
				                                if (socket.write(buf)) {
				                                    console.log("calling update sts")
				                                    update_sts.emit('update',socket.imei);
				                                    socket.imei="";
				                                    imei="";
				                                }
				                                else {
				                                    socket.imei="";
				                                    imei="";
				                                    //console.log("Data not sent to the client");
				                                }
				                            }
				                            else {
												socket.imei="";
				                                imei="";
				                                //console.log("client lost");
				                            }
				                        }

				                    }
				                }
				            });
				        }

				            // // console.log(response);

				        }//correct packet
				        else {
							socket.imei="";
				             imei="";
				            console.log("Wrong Packet");
        }


                buff = "";
                ar = [];
            }
            else {
                //console.log("To buffering(Waiting for complete packet)".red);
                //Buffer data if * is not found
                ar.push(buffer);
            }
        }
		//Wrong Packet
        //server.getConnections(function (error, count) {
            // console.log('Number of concurrent connections to the server : ' + count);
        //});


    })//<=on data

    //Setting idle timeout to every client as 20 sec
    socket.setTimeout(idletimeout);

    //connection close event
    socket.once('close', function () {
        //console.log("Session is cleared for client :",socket.imei)\
        socket.end();
        server.getConnections(function (error, count) {
            // console.log('Number of concurrent connections to the server : ' + count);
        });
    })


    //on Connection Reset or Any errors
    socket.on('error', function (error) {
        if (error == "Error: read ECONNRESET") { /*console.log("client side: connection reset by Ctrl+c (clientid) %j".red, socket.id)*/ }
        else if (error == "Error: write ECONNRESET") { console.log("server side: connection not able to write to client".red) }
        else {
            console.log("some problem in connection :".red + error)
        }
    })

    socket.on('timeout', () => {
        // console.log('socket timeout');
        //Destroy the socket if idle timeout
        socket.end();
    });



    // var s = JSONDuplexStream();
    // var gateway = Gateway();
    // socket.
    //   pipe(s.in).
    //   pipe(gateway).
    //   pipe(s.out).
    //   pipe(socket);


}//<=OnConnection close
process.on('uncaughtException', function (err) {
    console.log('something terrible happened..')
    console.log(err);
    // cluster.fork();
})

//getting bytes for sending command as bytes
var getBytes = function (string) {
    var utf8 = unescape(encodeURIComponent(string));
    var arr = [];
    for (var i = 0; i < utf8.length; i++) {
        arr.push((utf8.charCodeAt(i)));
    }
    // console.log('Array ', arr);
    return arr;
    }
