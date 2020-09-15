const EventEmitter = require('events');
class cmdresupdate extends EventEmitter{};
const update = new cmdresupdate();

update.on('update', (data)=>{ 
	var response_data = data.split(",");
	
		con.query("Update command_queue_log set Response = '"+data+"',cmd_response_time = '"+Math.floor(Date.now() / 1000)+"' where deviceID = '"+response_data[2]+"' order by cmdRecieved_time desc limit 1", function (err, res1) {
			
		if (err) {
			console.log("Update devlist: ", err);
		}
		else if (res1.affectedRows > 0) {
            con.query("Delete from command_queue where deviceID ='"+response_data[2]+"' order by cmdRecieved_time ASC limit 1",
            function(err,deleterow){
                if(err){
                    console.log(err);
                }
                else if(deleterow.affectedRows > 0){
                    console.log("Command Removed in resp");
                }
                else{
                console.log("Command Removal failed in resp");
                }
        });
		}
	});//End
	
  
});

module.exports = update;

