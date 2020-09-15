//Parser for NipponMSIL NT262_message_format
require("colors")
require('moment')

const EventEmitter = require('events');
class Persistance extends EventEmitter{};
const persistance = new Persistance();

exports.command_data = (imei,callback) => {
//    console.log("imei",imei);
    con.query("Select * from devicelist where deviceID = '"+imei+"'",function(err,result){
       //console.log(result);
       if(err)
        {
            console.log(err);
        }
        else if(result.length>0)
        {
            if(result[0].CommandStatusCode == 1)
            {
                if((result[0].command == "")||(result[0].command==null))
                {
                    var output = {
                        "imei":result[0].deviceID,
                        "cmd":null
                    }
                }
                else
                {
                var output = {
                        "imei":result[0].deviceID,
                        "cmd":result[0].command
                    }
                }
                
                //console.log(output);
                callback(null,output);
            }
            else
            {
                var output = 1;
                callback(null,output);
            }
            
        }
        else
        {
            var output = 0;
            callback(null,output);
        }
    });
   
   
}

