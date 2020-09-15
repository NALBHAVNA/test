require("colors");
const fs=require('fs');
const EventEmitter = require('events');
class Persistance extends EventEmitter{};
const persistance = new Persistance();

    persistance.on('addRecord', (response,inputString)=>{ 
        var row=0
        con.query("INSERT INTO `eventdata` (`accountID`, `deviceID`, `timestamp`, `statusCode`, `latitude`, `longitude`, `gpsAge`, `speedKPH`, `heading`, `altitude`, `transportID`, `inputMask`, `outputMask`, `seatbeltMask`, `address`, `dataSource`, `rawData`, `distanceKM`, `odometerKM`, `odometerOffsetKM`, `geozoneIndex`, `geozoneID`, `firmwareVersion`, `packetType`, `packetStatus`, `vehicleRegNo`, `gpsFix`, `noOfSatelites`, `pdop`, `hdop`, `operatorName`, `ignition`, `mainPowerStatus`, `mainInputVoltage`, `internalBatteryVoltage`, `emergencyStatus`, `temperAlert`, `gsmSignalStrength`, `mcc`, `mnc`, `lac`, `cellId`, `nmr1CellId`, `nmr1Lac`, `nmr1SignalStrength`, `nmr2CellId`, `nmr2Lac`, `nmr2SignalStrength`, `nmr3CellId`, `nmr3Lac`, `nmr3SignalStrength`, `nmr4CellId`, `nmr4Lac`, `nmr4SignalStrength`, `digitalInputStatus`, `digitalOutputStatus`, `frameNumber`, `towAlert`, `systemHealth`, `analogIn1`, `analogIn2`, `Xacc`, `Xpeak`, `Yacc`, `Ypeak`, `zacc`, `zpeak`,`creationTime`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [response.accountID, response.deviceID, response.timestamp, response.statusCode, response.latitude, response.longitude, , response.speedKPH, response.heading, response.altitude, , , , , , , , , , , , , response.firmwareVersion, response.packetType, response.packetStatus, response.vehicleRegNo, response.gpsFix, response.noOfSatelites, response.pdop, response.hdop, response.operatorName, response.ignition, response.mainPowerStatus, response.mainInputVoltage, response.internalBatteryVoltage, response.emergencyStatus, response.temperAlert, response.gsmSignalStrength, response.mcc, response.mnc, response.lac, response.cellId, response.nmr1CellId, response.nmr1Lac, response.nmr1SignalStrength, response.nmr2CellId, response.nmr2Lac, response.nmr2SignalStrength, response.nmr3CellId, response.nmr3Lac, response.nmr3SignalStrength, response.nmr4CellId, response.nmr4Lac, response.nmr4SignalStrength, response.digitalInputStatus, response.digitalOutputStatus, response.frameNumber, response.towAlert, response.systemHealth, response.analogIn1, response.analogIn2, response.Xacc, response.Xpeak, response.Yacc, response.Ypeak, response.Zacc, response.Zpeak, response.creationTime], 
        function (err, rows) {
             if (err != null && err.code == "ER_DUP_ENTRY") {
                 // console.log("duplicate".red);
                 //console.log("dup insertion",err);
                 var datetime = ((new Date()).toString()).replace("GMT+0530 (India Standard Time)", "IST");
                 fs.appendFile(`exception.txt`, datetime + "(duplicate)> " + inputString + "\n",
                     function (err) {
                         if (err) throw err;
                         console.log("Duplicate Insertion".red);
                     });
             }
             else if (err) {
                 var datetime = ((new Date()).toString()).replace("GMT+0530 (India Standard Time)", "IST");
                 fs.appendFile(`exception.txt`, datetime + " (database)> " + inputString + "\n"+err+"\n",
                     function (err) {
                         if (err) 
                         //throw err;
                         console.log("eventdata DB Err".red);
                         
                     });
                 console.log(err)
             }
             else {
                 row += 1;
                 //console.log(row +" row affected");
                 con.query("Update device set lastValidLatitude = '"+response.latitude+"',lastValidLongitude = '"+response.longitude+"',lastUpdateTime = '"+response.creationTime+"',ipAddressCurrent='"+response.clientadd+"',remotePortCurrent='"+response.clientport+"',lastValidSpeedKPH='"+response.speedOfTheVehicle+"',lastValidHeading='"+response.heading+"' where deviceID = '"+response.imei+"' and uniqueID = '"+response.imei+"'",function (err, rows) {
                    if (err) 
                     {
                         console.log(err);
                         var datetime = ((new Date()).toString()).replace("GMT+0530 (India Standard Time)", "IST");
                         fs.appendFile(`exception.txt`, datetime + " (device database)> " + inputString + "\n"+err+"\n",
                             function (err) {
                                 if (err) throw err;
                                 console.log("device DB Err".red);
                             });
                         
                     }
                     else 
                     {
                         if(rows.affectedRows==0)
                         {
                            //  console.log("Not in device table".red)
                         }
                         else{
                        console.log(rows.affectedRows + " row Updated", row)
                         }
                     }
                 })
                 
             }
         })
         
        
     });
     
module.exports = persistance;