//Parser for NipponMSIL NT262_message_format
require("colors")
require('moment')

const EventEmitter = require('events');
class update extends EventEmitter{};
const update_sts= new update();

update_sts.on('update', (imei)=>{ 
    
        con.query("Select * from command_queue where deviceID = '"+imei+"' order by cmdRecieved_time ASC limit 1",function(err,res1){
        if(err)
        {
            console.log(err);
        }
        else if(res1.length>0)
        {
            con.query("Update command_queue set CommandStatusCode =2 where deviceID ='"+res1[0].deviceID+"' and cmdRecieved_time ='"+res1[0].cmdRecieved_time+"'",
                     function(err,updaterow){
                         if(err){
                             console.log(err);
                         }
                         else if(updaterow.affectedRows > 0){
                             console.log("CommandStatusCode Updated");
                         }
                         else{
                            console.log("CommandStatusCode Update failed");
                         }
            });

            con.query("Insert into command_queue_log(`accountID`,`deviceID`,`command`,`cmdRecieved_time`,`cmdSent_time`) values "+
            " ('"+res1[0].accountID+"','"+res1[0].deviceID+"','"+res1[0].command+"','"+res1[0].cmdRecieved_time+"','"+Math.floor(Date.now() / 1000)+"')",function(err,result){
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
