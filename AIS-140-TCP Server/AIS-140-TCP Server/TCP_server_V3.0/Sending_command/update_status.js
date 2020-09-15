//Parser for NipponMSIL NT262_message_format
require("colors")
require('moment')

const EventEmitter = require('events');
class update extends EventEmitter{};
const update_sts= new update();

update_sts.on('update', (imei)=>{ 
   
        con.query("Select * from devicelist where deviceID = '"+imei+"'",function(err,res1){
        if(err)
        {
            console.log(err);
        }
        else if(res1.length>0)
        {
            con.query("Update devicelist set CommandStatusCode = 2 where deviceID = '"+imei+"'",function(err,result){
                if(err)
                 {
                     console.log(err);
                 }
                 else if(result.affectedRows>0)
                 {
                     var output = 1
                    
                 }
                 else
                 {
                     var output = 0;
                     
                 }
             });
        }
        
    });
   
    
})

module.exports = update_sts;
