//Parser for NipponMSIL NT262_message_format
require("colors")
require('moment')

const EventEmitter = require('events');
class Persistance extends EventEmitter{};
const persistance = new Persistance();

exports.command_data = (imei,callback) => {
   console.log("calling cmd-data",imei);
    con.query("Select * from command_queue where deviceID = '"+imei+"' order by cmdRecieved_time ASC limit 1",function(err,result){
       //console.log(result);
       if(err)
        {
            console.log(err);
        }
        else if(result.length>0)
        {
            if(result[0].number_of_retries === 0 && result[0].CommandStatusCode === 0){
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

                con.query("Update command_queue set number_of_retries = 1 where deviceID = '"+imei+"' and cmdRecieved_time ='"+result[0].cmdRecieved_time+"'",
                function(err,updateResp){
                    if(err){
                        console.log(err);
                    }
                    else if(updateResp.affectedRows > 0){
                        console.log("No of retires incremented to 1");
                    }
                });
                 callback(null,output);
            }
            else if((result[0].number_of_retries < 3) && (result[0].number_of_retries >=1)){
				console.log("No of retires: ",result[0].number_of_retries,"",(result[0].number_of_retries +1));
                con.query("Update command_queue set number_of_retries = '"+(result[0].number_of_retries +1)+"' where deviceID = '"+imei+"' and cmdRecieved_time ='"+result[0].cmdRecieved_time+"'",
                function(err,updateResp){
                    if(err){
                        console.log(err);
                    }
                    else if(updateResp.affectedRows > 0){
                        console.log("No of retires incremented");
                    }
                    else{
						console.log("cmd Update unsuccessfull");
					}
                });
            }
            else if (result[0].number_of_retries === 3 ){

                con.query("Select Response from  command_queue_log where deviceID = '"+imei+"' and cmdRecieved_time ='"+result[0].cmdRecieved_time+"'",
                function(err,readResp){
                    if(err){
                        console.log(err);
                    }
                    else if(readResp.length > 0){

                        if(readResp[0].Response == "" || readResp[0].Response == null)
                        {
                        con.query("Update command_queue_log set Response = 'Reached maximum number of retries', cmd_response_time = '"+Math.floor(Date.now() / 1000)+"' where deviceID = '"+imei+"' and cmdRecieved_time ='"+result[0].cmdRecieved_time+"'",
                        function(err,updateResp){
                            if(err){
                                console.log(err);
                            }
                            else if(updateResp.affectedRows > 0){
                                console.log("Reached maximum number of retries");
                            }
                             else{
								console.log("cmd Update unsuccessfull");
							}
                        });


                        con.query("Delete from command_queue where deviceID ='"+result[0].deviceID+"' and cmdRecieved_time='"+result[0].cmdRecieved_time+"' and number_of_retries = 3",
						                     function(err,deleterow){
						                         if(err){
						                             console.log(err);
						                         }
						                         else if(deleterow.affectedRows > 0){
						                             console.log("Command Removed in cmd");
						                         }
						                         else{
						                            console.log("Command Removal failed in cmd");
						                         }
                			});


                        }
						else{
							console.log("In else",readResp[0].Response);
						}
                    }
                });




            }


        }
        else
        {
            var output = 0;
            callback(null,output);
        }
    });


}

