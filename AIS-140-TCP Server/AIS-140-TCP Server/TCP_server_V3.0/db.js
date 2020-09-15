require("colors");
const fs=require('fs');
var winston = require('winston');
const EventEmitter = require('events');
class Persistance extends EventEmitter{};
const persistance = new Persistance();
var row=0


// logger ==>
require('winston-daily-rotate-file');

var winston = require('winston');

winston.loggers.add('errorLoggerdb', {
    transports: [
// new (winston.transports.Console)(
//             {
//                 //level: config.debugLogLevel,
//                 colorize: true
//             }),

        //new files will be generated each day, the date patter indicates the frequency of creating a file.
        new winston.transports.DailyRotateFile({
                name: 'error-db',
                filename: 'error-database',
				dirname:'./ErrorLog',
                //level: '<level>',
                prepend: true,
                maxSize: '2mb',
                //datePattern: '<pattern>',
                maxFiles: 100
            }
        )
    ]
});
var logger = winston.loggers.get('errorLoggerdb');
// logger ==>

    persistance.on('addRecord', (keys,response,lastres)=>{
        inputString = '';
        if(response.length <= 0 || lastres<=0){
            return false;
        }
        var row=0
        // console.log(response);
        var sql = 'INSERT INTO eventdata (' + keys.join(',') + ') VALUES ?'
        //'INSERT INTO msileventdata SET ?'
        let values = response.map( obj => keys.map( key => obj[key]));
        // console.log(values);
        con.query(sql ,[values],
        function (err, results) {
             if (err != null && err.code == "ER_DUP_ENTRY") {
                 // console.log("duplicate".red);
                 //console.log("dup insertion",err);
                 var datetime = ((new Date()).toString()).replace("GMT+0530 (India Standard Time)", "IST");
                //logger.info(datetime+" > "+ "(duplicate) > " +inputString+" Error > "+err+" "+err.sql+"\n");
                //  fs.appendFile(`exception.txt`, datetime + "(duplicate)> " + inputString + "\n",
                //      function (err) {
                //          if (err) throw err;
                //          console.log("Duplicate Insertion".red);
                //      });
             }
             else if (err) {
                 var datetime = ((new Date()).toString()).replace("GMT+0530 (India Standard Time)", "IST");
                //  fs.appendFile(`exception.txt`, datetime + " (database)> " + inputString + "\n"+err+"\n",
                //      function (err) {
                //          if (err)
                //          //throw err;
                //          console.log("eventdata DB Err".red);

                //      });

                logger.info(datetime+" > "+ "(database) > " +inputString+" Error > "+err+" "+err.sql+"\n");
                console.log("ds",err)
             }
             else {
               row += 1;
              console.log(row +" row affected");

            //   var names = [];
            //   for(keys in lastres[0]){
            //   names.push(keys);
            //   // That would give you name, email, id
            //   }

            //   var values = [];
            //   for(var i = 0; i < lastres.length; i++){
            //       values.push(Object.values(lastres[i]));
            //   }

            //   console.log(values);
            //   // names.join(',')
            //    con.query('INSERT INTO `eventdata` (' + names.join(',') + ') VALUES ?' ,[values],
            // `INSERT into `device` (' + names.join(',') + ')
            // VALUES ?
            // ON DUPLICATE KEY UPDATE fruit = VALUES(fruit)`;

            for (i in lastres)
            {
                con.query("Update device set lastValidLatitude = '"+lastres[i].lastValidLatitude+"',lastValidLongitude = '"+lastres[i].lastValidLongitude+"',lastUpdateTime = '"+lastres[i].lastUpdateTime+"',ipAddressCurrent='"+lastres[i].ipAddressCurrent+"',remotePortCurrent='"+lastres[i].remotePortCurrent+"',lastValidSpeedKPH='"+lastres[i].lastValidSpeedKPH+"',lastValidHeading='"+lastres[i].lastValidHeading+"' where deviceID = '"+lastres[i].deviceID+"' and uniqueID = '"+lastres[i].uniqueID+"'",function (err, rows) {
                    if (err)
                     {
                         //console.log(err);
                         var datetime = ((new Date()).toString()).replace("GMT+0530 (India Standard Time)", "IST");
                        //  fs.appendFile(`exception.txt`, datetime + " (device database)> " + inputString + "\n"+err+"\n",
                        //      function (err) {
                        //          if (err) throw err;
                        //          console.log("device DB Err".red);
                        //      });


                        logger.info(datetime+" > "+ "(Device) > " +inputString+" Error > "+err+" "+err.sql+"\n");
                        console.log("ds",err)

                     }
                     else
                     {
                         if(rows.affectedRows==0)
                         {
                             console.log("Not in device table".red)
                         }
                         else{
                         console.log(rows.affectedRows + " row Updated", row)
                         }
                     }
                 })
            }


             }
         })


     });

module.exports = persistance;