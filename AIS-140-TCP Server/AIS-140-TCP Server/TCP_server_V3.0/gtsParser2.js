//Parser for NipponMSIL NT262_message_format (17-10-2019)

// In production mode
// console.log = function(){};
var winston = require('winston');
const fs = require('fs');
require("colors")
require('moment');
//Updates
const sms_sending = require("./Sending_command/sms_sending");

//const updateres = require('./updatecmd');
const updateres =  require("./Sending_command/update_response_new");

// logger ==>
require('winston-daily-rotate-file');

var winston = require('winston');

winston.loggers.add('errorLogger', {
	transports: [
		// new (winston.transports.Console)(
		//             {
		//                 //level: config.debugLogLevel,
		//                 colorize: true
		//             }),

		//new files will be generated each day, the date patter indicates the frequency of creating a file.
		new winston.transports.DailyRotateFile({
			name: 'error-Parser',
			filename: 'error-parser',
			dirname: './ErrorLog',
			//level: '<level>',
			prepend: true,
			maxSize: '2mb',
			//datePattern: '<pattern>',
			maxFiles: 100
		}
		)
	]
});
var logger = winston.loggers.get('errorLogger');
// logger ==>

const persistance = require('./db');

var res = {};
var res1 = {};
var result = [];
var keys = [];
var lastres = [];
exports.parser = function parser(inputString, clientadd, clientport) {

	res = {};
	// res1={};
	// console.log((new Date()).toLocaleTimeString());
	var msglength = (inputString.toString().match(/,/g) || []).length;
	// console.log(msglength)
	if (inputString.length == 0) {
		console.log("String is null");
	}
	//Finding type of combination of input string
	var rs = inputString.replace(/^\s/, '');
	rs = rs.replace(/\s/g, "#");
	// console.log("->",rs);

	var doller = (rs.match(/\$/g) || []).length;
	// console.log("doller",doller)
	var splitData = [];
	if (doller == 1 && msglength > 18) {
		//NORMAL Message
		// console.log("if")
		splitData = rs.split(",");
		// console.log(splitData)
		parse(splitData);
	}
	else if ((doller == 1 || doller == 8) && (msglength == 3 || msglength == 8 || msglength < 40)) {
		//CMDRES or LOGIN
		// console.log("CMDRES or LOGIN")
		var rs_new = rs;
		var val = rs_new.replace("!#", " ");
		val = val.replace(/#/g, ""); //removing #'s
		var splitd = []
		splitd = val.split(/\s\$/g);
		//Command Response
		if (splitd[0].match("GPRS")) {
			// console.log("GPRS CMD RESPONSE :" + splitd[0]);
			/*--------------------------Updating the response-------------------------------*/
			updateres.emit('update', splitd[0].replace(/"/, ""));
		}
		//Login Message
		// else {
		// 	res = {};
		// 	splitData= splitd[0].split(',');
		// 	console.log("Login message (2):"+splitData);
		// 	parse(splitData);
		// }
	}
	// else if (((doller == 2 && rs.match("GPRS")) || (doller == 9 && rs.match(/\$E!/g))) && (msglength < 67)) {
	else if (((doller == 2 && rs.match("GPRS")) || (doller == 9 && rs.match(/\$E!/g)))) {
		// console.log("Combined Packet")
		var rs_new = rs;
		var val;
		var splitd = [];
		// console.log("rs_new",rs_new)

		// Normal + CMDRES or LOGIN
		if (rs_new.match(/^\$,N,NIPPON/g)) {
			// console.log("normal first+login/cmd".red)
			// console.log('rs_new-->',rs_new);
			val = rs_new.replace(/#+|\\n/g, " ");
			// console.log('val-->',val);
			val = val.replace(/\s+/g, " ");
			// console.log('val-->',val);
			splitd = val.split(/\*/);
			// console.log(splitd);
			//Command Response
			if (splitd[1].match("GPRS")) {
				//  console.log("GPRS CMD RESPONSE :" + splitd[1]);
				// console.log("gprs data");
				/*--------------------------Updating the response-------------------------------*/
				// console.log("calling the update")
				updateres.emit('update', splitd[1].replace(/"/, ""));
			}
			//Login Message
			// else {
			// 	res = {};
			// 	splitData= splitd[1].split(',');
			// 	console.log("Login message(3) :"+splitd[1]);
			// splitData = splitd[0].split(",");
			// parse(splitData);
			// }
			try {
				splitData = splitd[0].split(",");
				parse(splitData);
			}
			catch (er1) {
				//oh well, not much we can do at this point.
				console.error('Error', er1.stack);
			}
		}
		else {
			//CMDRES or LOGIN + Normal
			val = rs_new.replace(/!\\n#/g, " ");
			val = val.replace(/!/g, "! ");
			val = val.replace(/\s+/g, " ");
			splitd = val.split(/\s/g);

			//Command Response
			if (splitd[0].match("GPRS")) {
				let cmdres = splitd[0].replace(/"|\\n|#/g, "")
				// console.log("GPRS CMD RESPONSE :" + cmdres);
				// console.log("gprs data");

				/*--------------------------Updating the response-------------------------------*/
				updateres.emit('update', cmdres);
			}
			//Login Message
			// else {
			// 	res = {};
			// 	splitData= splitd[0].split(',');
			// 	console.log("Login message(3) :"+splitd[0]);
			// 	parse(splitData);
			// }
			try {
				splitData = splitd[1].split(",");
				parse(splitData);
				// console.log("Normal: ",splitData)
			}
			catch (er1) {
				//oh well, not much we can do at this point.
				console.error('Error', er1.stack);

				logger.info(logTime + ">" + inputString + " " + er1 + "\n");
			}
		}
	} else {
		console.log("Merged Message")
		// MERGED message
		res = {};
		splitData = rs.split(',');
		var buffer = '';
		buffer += splitData;
		var boundary = buffer.indexOf("*");
		// console.log("Merged message")

		// split till *
		while (boundary !== -1) {
			var str = buffer.substr(0, boundary);
			buffer = buffer.substr(boundary + 1);
			boundary = buffer.indexOf("*");
			let rs = str.replace(/^\s/, '');
			rs = rs.replace(/\s/g, "#");
			let doller = (rs.match(/\$/g) || []).length;
			// console.log("=>",rs,doller)
			if (doller > 1) {
				//One more round of parser
				parser(str, clientadd, clientport)
			}
			else {
				//Normal message
				// console.log("sent to parser");
				var splitData = [];
				splitData = str.split(",");
				// console.log("merged data",splitData);
				parse(splitData);
			}

		}
	}

	// ACTUAL parsing starts from here
	function parse(splitData) {
		res = {};
		var logTime = ((new Date()).toString()).replace("GMT+0530 (India Standard Time)", "IST");
		if (splitData.length == 9) {
			// Login message decoding
			// console.log("This is Login message")
			/**vehicle reg no */
			res.vehicleRegNo = splitData[1];
			//console.log(vehicleRegNo)

			/**IMEI number */
			splitData[2] = splitData[2].replace('$', '')
			res.imei = splitData[2].substring(0, splitData[2].length);


			/*Firmware index 3 */
			splitData[3] = splitData[3].replace('$', '')
			res.firmwareVersion = (splitData[3]).toFixed(1);

			/*version of frame format protocol index 4 */
			splitData[4] = splitData[4].replace('$', '')
			res.frameFormat = (splitData[4]);

			/*Latitude index 5 */
			splitData[5] = splitData[5].replace('$', '')
			res.latitude = parseFloat(splitData[5]);

			/* Lat Direction index 6 */
			splitData[6] = splitData[6].replace('$', '')
			// res.latitudeDir = splitData[6];


			/*Longitude index 7 */
			splitData[7] = splitData[7].replace('$', '')
			res.longitude = parseFloat(splitData[7]);

			/*Longitude Dir index 8 */
			splitData[8] = splitData[8].replace('$', '')
			splitData[8] = splitData[8].replace('!', '')
			// res.longitudeDir = splitData[8];

			res.creationTime = Math.floor(Date.now() / 1000)
			// console.log("login",res)
		}//<=main if closed
		else {
			//Normal Packet
			res.accountID = splitData[2];
			// res1.accountID=splitData[2];
			//console.log("---------Parsed inputString------------");
			try {
				/* Firmware Version */
				var firmwareVersion = parseFloat(splitData[3]);
				res.firmwareVersion = firmwareVersion.toFixed(1);;

				/**Packet type */
				var packetType = splitData[4].substring(0, splitData[4].length);
				if (packetType === ("TAC")) {
					packetType = "TC";//handlingTAC to TC

				}
				if (packetType === ("DTC")) {
					packetType = "DC";//handlingTAC to TC

				}
				res.packetType = packetType;

				/*alert id */
				res.statusCode = (splitData[5]);
				// res1.statusCode=(splitData[5]);

				var packetStatus = splitData[6].substring(0, splitData[6].length);
				res.packetStatus = packetStatus;
				//console.log("packetStatus :" +res.packetStatus);


				/* IMEI*/
				res.deviceID = splitData[7].substring(0, splitData[7].length);
				// // res1.deviceID=splitData[7].substring(0, splitData[7].length);
				//console.log("imei :" + res.imei);

				/*Vehicle Reg. No*/
				res.vehicleRegNo = splitData[8].substring(0, splitData[8].length);
				//console.log("vehicleRegNo :" + res.vehicleRegNo);


				/* GPS Fix*/
				gpsFix = parseInt(splitData[9]);
				res.gpsFix = isNaN(gpsFix) ? 0 : gpsFix;
				//console.log("gpsFix :" + res.gpsFix);

				/* Date : ddmmyyyy */
				var date = parseInt(splitData[10].substring(4, 8) + splitData[10].substring(2, 4) + splitData[10].substring(0, 2));
				// res.date = date;
				//console.log("date : " +res.date);

				/* Time : hhmmss */
				var time = parseInt(splitData[11]);
				// res.time = time;
				//console.log("time : " +res. time,splitData[11]);

				//timestamp creation
				// console.log(splitData[11])
				if (time == '0' && res.packetStatus == "L") {
					// console.log("Live but time is Zero");
					res.timestamp = Math.floor(Date.now() / 1000);
				}
				else {

					if (date && time) {
						time = splitData[11].toString().padStart(6, '0');
						// console.log("time",time)
						date = date.toString();
						time = [time.slice(0, 2), ':', time.slice(2)].join('');
						time = [time.slice(0, 5), ':', time.slice(5)].join('');
						date = [date.slice(0, 4), '-', date.slice(4)].join('');
						date = [date.slice(0, 7), '-', date.slice(7)].join('');
						var datetime = date + "T" + time;
						var timestamp = Math.round(new Date(datetime) / 1000);
						timestamp = timestamp + 19800;
						//console.log("IST",timestamp)
						if (isNaN(timestamp)) {
							res.timestamp = 0;
						}
						else {
							res.timestamp = timestamp;
						}
					}
					else {
						res.timestamp = 0;
					}


				}
				// res1.timestamp=res.timestamp;


				/* Latitude */
				let latitude = parseFloat(splitData[12]);
				res.latitude = isNaN(latitude) ? 0 : latitude;
				// res1.latitude= parseFloat(splitData[12]);
				//console.log("latitude : " + res.latitude);

				/* Latitude Dir */
				// res.latitudeDir = splitData[13];

				//console.log("latitudeDir : " + res.latitudeDir);


				/* Logitude */
				let longitude = parseFloat(splitData[14]);
				res.longitude = isNaN(longitude) ? 0 : longitude;
				//console.log("logitude : " + res.longitude);

				/* Longitude Dir */
				// res.longitudeDir = splitData[15];
				//console.log("longitudeDir : " + res.longitudeDir);

				/* Speed of Vehicle */
				let speedKPH = parseFloat(splitData[16]);
				res.speedKPH = isNaN(speedKPH) ? 0 : speedKPH;
				//console.log("speedOfTheVehicle : " + res.speedOfTheVehicle);


				/* Heading */
				heading = parseFloat(splitData[17]);
				res.heading = isNaN(heading) ? 0 : heading;
				//console.log("heading : " +res. heading);

				/* No of statllites */
				let noOfSatelites = parseInt(splitData[18]);
				res.noOfSatelites = isNaN(noOfSatelites) ? 0 : noOfSatelites;
				//console.log("noOfSatelites : " +res. noOfSatelites);

				/* Altitude */
				altitude = parseFloat(splitData[19]);
				res.altitude = isNaN(altitude) ? 0 : altitude;
				//console.log("altitude : " +res. altitude);


				/* pdop */
				pdop = parseFloat(splitData[20]);
				res.pdop = isNaN(pdop) ? 0 : pdop;
				//console.log("pdop : " +res. pdop);


				/* hdop */
				hdop = parseFloat(splitData[21]);
				res.hdop = isNaN(hdop) ? 0 : hdop;
				//console.log("hdop : " +res. hdop);


				/* hdop */
				res.operatorName = splitData[22]
				//console.log("operatorName : " +res. operatorName);

				/* Ignition*/
				let ignition = parseInt(splitData[23]);
				res.ignition = isNaN(ignition) ? 0 : ignition;
				//console.log("ignition :" +res. ignition);

				/* Main power status*/
				mainPowerStatus = parseInt(splitData[24])
				res.mainPowerStatus = isNaN(mainPowerStatus) ? 0 : mainPowerStatus;
				//console.log("mainPowerStatus :" +res. mainPowerStatus);

				/*Main Input voltage*/
				res.mainInputVoltage = (splitData[25]);
				//res.mainInputVoltage = parseFloat(splitData[25]);
				//console.log("mainInputVoltage : " +res. mainInputVoltage);


				/* Internal Battery voltage */
				internalBatteryVoltage = parseFloat(splitData[26]);
				res.internalBatteryVoltage = isNaN(internalBatteryVoltage) ? 0 : internalBatteryVoltage;
				//console.log("internalBatteryVoltage : " +res.internalBatteryVoltage);

				/* Emergency status*/
				emergencyStatus = parseInt(splitData[27]);
				res.emergencyStatus = isNaN(emergencyStatus) ? 0 : emergencyStatus
				//console.log("emergencyStatus :" +res. emergencyStatus);

				/* Temper alert */
				res.temperAlert = splitData[28];
				//console.log("temperAlert :" +res. temperAlert);

				/* GSM signal strength*/
				var gsmSignalStrength = parseInt(splitData[29]);
				gsmSignalStrength = isNaN(gsmSignalStrength) ? 0 : gsmSignalStrength;

				if (gsmSignalStrength > 14) {
					gsmSignalStrength = 3;
				}
				else if (gsmSignalStrength > 9) {
					gsmSignalStrength = 2;

				}
				else if (gsmSignalStrength >= 0) {
					gsmSignalStrength = 1;
				}
				else {
					gsmSignalStrength = 0;
				}
				res.gsmSignalStrength = gsmSignalStrength;
				//console.log("gsmSignalStrength :" +res. gsmSignalStrength);

				/* MCC */
				res.mcc = splitData[30];
				//console.log("mcc :" +res. mcc);

				/* MNC */
				res.mnc = splitData[31];
				//console.log("mnc :" +res. mnc);

				/* LAC */
				res.lac = splitData[32];
				//console.log("lac :" +res. lac);

				/* Cell Id */
				res.cellId = splitData[33];
				//console.log("cellId :" +res. cellId);

				/*NMR1 LAC*/
				res.nmr1Lac = splitData[35];
				//console.log("nmr1Lac :" + res.nmr1Lac);


				/*NMR1 Cell Id */
				res.nmr1CellId = splitData[34];
				//console.log("nmr1CellId :" + res.nmr1CellId);

				/*NMR1 Signal strength */
				res.nmr1SignalStrength = splitData[36];
				//console.log("nmr1SignalStrength :" +res. nmr1SignalStrength);

				/*NMR2 LAC*/
				res.nmr2Lac = splitData[38];
				//console.log("nmr2Lac :" +res. nmr2Lac);

				/*NMR2 Cell Id */
				res.nmr2CellId = splitData[37];
				//console.log("nmr2CellId :" +res. nmr2CellId);

				/*NMR2 Signal strength */
				res.nmr2SignalStrength = splitData[39];
				//console.log("nmr2SignalStrength :" +res. nmr2SignalStrength);

				/*NMR3 LAC*/
				res.nmr3Lac = splitData[41];
				//console.log("nmr3Lac :" +res. nmr3Lac);

				/*NMR3 Cell Id */
				res.nmr3CellId = splitData[40];
				//console.log("nmr3CellId :" +res. nmr3CellId);

				/*NMR3 Signal strength */
				res.nmr3SignalStrength = splitData[42];
				//console.log("nmr3SignalStrength :" +res. nmr3SignalStrength);

				/*NMR4 LAC*/
				res.nmr4Lac = splitData[44];
				//console.log("nmr4Lac :" +res. nmr4Lac);

				/*NMR4 Cell Id */
				res.nmr4CellId = splitData[43];
				//console.log("nmr4CellId :" +res. nmr4CellId);

				/*NMR4 Signal strength */
				res.nmr4SignalStrength = splitData[45];
				//console.log("nmr4SignalStrength :" +res. nmr4SignalStrength);

				/*Digital Input Status */
				res.digitalInputStatus = splitData[46];
				//console.log("digitalInputStatus :" +res. digitalInputStatus);

				/*Digital Output Status */
				res.digitalOutputStatus = splitData[47];
				//console.log("digitalOutputStatus :" +res. digitalOutputStatus);

				res.analogIn1 = 0.0;
				res.analogIn2 = 0.0;
				res.frameNumber = 000000;
				res.Xacc = 0.0;
				res.Xpeak = 0.0;
				res.Yacc = 0.0;
				res.Ypeak = 0.0;
				res.Zacc = 0.0;
				res.Zpeak = 0.0;

				if ((firmwareVersion) == 2) {
					/**Frame Number */
					res.frameNumber = (splitData[48]);
					// console.log("Frame Number :" +res.frameNumber);
					/**checksumsplitdata[51] */
					//console.log("version 2");
				}
				else if ((firmwareVersion) >= 2.4) {
					//console.log("version >2.4");

					/* Analog Inputs 1 */
					analogIn1 = parseFloat(splitData[48]);
					res.analogIn1 = isNaN(analogIn1) ? 0.0 : analogIn1;
					// console.log("Analog Input1  :",res.analogIn1);

					/* Analog Inputs2*/
					analogIn2 = parseFloat(splitData[49]);
					res.analogIn2 = isNaN(analogIn2) ? 0 : analogIn2;
					// console.log("res.analogIn2",res.analogIn2);
					// console.log("Analog Input :" +res.analogIn2,splitData[49]);

					/**Frame Number */
					frameNumber = parseInt(splitData[50]);
					res.frameNumber = isNaN(frameNumber) ? 0 : frameNumber;
					//console.log("Frame Number :" +res.frameNumber);

					/**checksumsplitdata[51] */

					/**X-acceleration */
					Xacc = parseFloat(splitData[52]);
					res.Xacc = isNaN(Xacc) ? 0 : Xacc;
					//console.log("X-acceleration :" +res.Xacc);

					/**X-peak */
					Xpeak = parseFloat(splitData[53]);
					res.Xpeak = isNaN(Xpeak) ? 0 : Xpeak;

					//console.log("X-peak:" +res.Xpeak);

					/**Y-acceleration */
					Yacc = parseFloat(splitData[54]);
					res.Yacc = isNaN(Yacc);
					//console.log("Y-acceleration :" +res.Yacc);

					/**Y-peak */

					Ypeak = parseFloat(splitData[55]);
					res.Ypeak = isNaN(Ypeak) ? 0 : Ypeak;
					//console.log("Y-peak:" +res.Ypeak);

					/**Z-acceleration */
					Zacc = parseFloat(splitData[56]);
					res.Zacc = isNaN(Zacc) ? 0 : Zacc;
					//console.log("Z-acceleration :" +res.Zacc);

					/**Z-peak */
					Zpeak = parseFloat(splitData[57]);
					res.Zpeak = isNaN(Zpeak) ? 0 : Zpeak;
					//console.log("Z-peak:" +res.Zpeak);

					var towAlert = 0;
					if ((Math.abs(res.Xpeak) >= 0.15 && Math.abs(res.Ypeak) >= 0.15) && (ignition == 0 && packetStatus == "L")) {
						towAlert = towAlert | 0x02;
					}
					/* tow alert*/
					if ((res.Zacc <= 0.9) && (ignition == 0 && packetStatus == "L" && speedKPH >= 3.6)) {
						towAlert = towAlert | 0x01;
					}
					// if ((packetType === "HA" || packetType === "HB") && ignition == 0) {
					// 	var towAlert = towAlert | 0x01;
					// }
					// else {
					// 	towAlert = towAlert | 0x00;
					// }

					res.towAlert = towAlert;
					//console.log("towAlert :"+res.towAlert);
				}//Other firmware version
				else {
					//console.log("version else");
					if ((packetType === ("HA") || packetType === ("HB")) && ignition == 0) {
						towAlert = towAlert | 0x01;
					}
					else {
						towAlert = towAlert | 0x00;
					}
				}

				/* System Health */
				var systemHealth = 0;
				if (noOfSatelites >= 4) {
					systemHealth = systemHealth | 0x01;
				}
				else {
					systemHealth = systemHealth | 0x00;
				}
				res.systemHealth = systemHealth;
				// console.log("systemHealth :"+res.systemHealth);
			}
			catch (er1) {
				//oh well, not much we can do at this point.
				console.error('Error', er1.stack);
				// fs.appendFile(`exception.txt`, datetime + "(Excp)> " + inputString + "\n" + er1 + "\n",
				// 	function (err) {
				// 		if (err) throw err;
				// 		console.log("Exception in parser".red);
				// 	})

				logger.info(logTime + ">" + inputString + " " + er1 + "\n");
			}
		}//<=main else close

		res.creationTime = Math.floor(Date.now() / 1000)
		//Updates
		try {

			// sms_sending.emit('sms_send',res);

			//-------------------------------------------------------------
			if ((res.packetType == "EA" && res.emergencyStatus == 1 && res.packetStatus == "L") || (res.temperAlert == "O" && res.packetStatus == "L" && res.packetType == "TA") || (res.mainPowerStatus == 0 && res.packetStatus == "L" && res.packetType == "BD") || (res.mainInputVoltage < 11 && res.packetType == "BL" && res.packetStatus == "L")) {
				//console.time("Sms sending");
				sms_sending.emit('sms_send', res);
				//console.timeEnd("Sms sending");
			}
			//-------------------------------------------------------------

			// if (res.packetType == "EA" && res.emergencyStatus == 1 && res.packetStatus == "L") {
			// 	console.time("Sms sending");
			// 	sms_sending.emit('sms_send', res);
			// 	console.timeEnd("Sms sending");
			// }
			// else if (res.temperAlert == "O" && res.packetStatus == "L" && res.packetType == "TA") {
			// 	console.time("Sms sending");
			// 	sms_sending.emit('sms_send', res);
			// 	console.timeEnd("Sms sending");

			// }
			// else if (res.mainPowerStatus == 0 && res.packetStatus == "L" && res.packetType == "BD") {
			// 	console.time("Sms sending");
			// 	sms_sending.emit('sms_send', res);
			// 	console.timeEnd("Sms sending");
			// }
			// else if (res.mainInputVoltage < 11 && res.packetType == "BL" && res.packetStatus == "L") {
			// 	console.time("Sms sending");
			// 	sms_sending.emit('sms_send', res);
			// 	console.timeEnd("Sms sending");

			// }
			// /*else if(towAlert ==1 || towAlert ==3 && packetStatus == "L")
			// {
			//     console.time("Sms sending");
			//     sms_sending.emit('sms_send',res);
			//     console.timeEnd("Sms sending");

			// }
			// else if(towAlert ==2 || towAlert ==3 && packetStatus == "L")
			// {
			//     console.time("Sms sending");
			//     sms_sending.emit('sms_send',res);
			//     console.timeEnd("Sms sending");
			// }*/

		}
		catch (e) {
			console.log(e);
			console.log("error");

			logger.info(logTime + ">" + inputString + " " + e + "\n");
		}


		if (splitData.length > 9) {
			res1.lastValidLatitude = res.latitude,
				res1.lastValidLongitude = res.longitude,
				res1.lastUpdateTime = res.creationTime,
				res1.ipAddressCurrent = clientadd,
				res1.remotePortCurrent = clientport,
				res1.lastValidSpeedKPH = res.speedKPH,
				res1.lastValidHeading = res.heading,
				res1.deviceID = res.deviceID,
				res1.uniqueID = res.deviceID,
				keys = Object.keys(res);
			result.push(res);
			lastres.push(res1);
			// return res;
		}
	}
	// console.log("response",res);
	return res; //Returning result back to server.
}//<=Function closed

setInterval(function () {
	persistance.emit('addRecord', keys, result, lastres);
	// console.log("Data persistance",result)
	result = [];
	lastres = [];
}, 5000)

//Can be used whenever needed.
function PacketType(type) {
	switch (type) {
		case "NR": return "Normal periodic packet";
			break;
		case "HP": return "Health packet"
			break;
		case "TA": return "Tamper alert"
			break;
		case "TAC": return "Tamper Corrected"
			break;
		case "EA": return "Emergency alert"
			break;
		case "IN": return "Ignition On alert"
			break;
		case "IF": return "Ignition OFF alert"
			break;
		case "BR": return "Mains reconnected alert"
			break;
		case "BD": return "Mains disconnected alert"
			break;
		case "BL": return "Low battery alert"
			break;
		case "BH": return "Low battery charged alert"
			break;
		case "CC": return "Configuration over the air alert"
			break;
		case "HA": return "Harsh acceleration alert"
			break;
		case "HB": return "Harsh braking alert"
			break;
		case "RT": return "Harsh/Rash turning alert"
			break;
		case "OS": return "Over Speed Alert"
			break;
		case "DT": return "Device Tampered(sos switch tempered)"
			break;
		case "DTC": return "Device Tampered Corrected(sos switch tempered corrected)"
			break;
		case "ID": return "Ignition ON Idle Time alert"
			break;
		case "GE": return "Geofence Entry alert"
			break;
		case "GX": return "Geofence Exit alert"
			break;
		default: return "Invalid packet type"
			break;
	}

}
function AlertIdType(type) {
	switch (type) {
		case "00": console.log("Health packet over GPRS"); break;
		case "01": console.log("Default Message"); break;
		case "02": console.log("History location Update"); break;
		case "03": console.log("Disconnected from main battery"); break;
		case "04": console.log("Internal battery low"); break;
		case "05": console.log("Internal battery charged again"); break;
		case "06": console.log("Main battery connected back"); break;
		case "07": console.log("Ignition On"); break;
		case "08": console.log("Ignition off"); break;
		case "09": console.log("Gps Box opened"); break;
		case "10": console.log("Emergancy Button pressed"); break;
		case "11": console.log("Emergancy state Removed"); break;
		case "12": console.log("Air parameter Changed"); break;
		case "13": console.log("Harsh Breaking"); break;
		case "14": console.log("Harsh Acceleration"); break;
		case "15": console.log("Harsh turnning"); break;
		case "16": console.log("Device tempered/Corrected"); break;
		case "17": console.log("Overspeed alert"); break;
		case "18": console.log("Ignition On idle time"); break;
		case "19": console.log("Geofence Entry"); break;
		case "20": console.log("Geofence Exit"); break;
		default: console.log("Invalid type Alert type"); break;
	}
}

