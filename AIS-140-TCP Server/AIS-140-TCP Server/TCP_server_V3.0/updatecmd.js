const EventEmitter = require('events');
class cmdresupdate extends EventEmitter{};
const update = new cmdresupdate();
update.on('update', (data)=>{ 
	var response_data = data.split(",");
	
	// console.log("Update function");
	
		con.query("Update devicelist set Response = '" + data + "',CommandStatusCode = 3 where deviceID = '" + response_data[2] + "' and CommandStatusCode = 2", function (err, res1) {
			
		if (err) {
			console.log("Update devlist: ", err);
		}
		else if (res1.affectedRows > 0) {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var seconds = date.getSeconds();


			var response_date = year + "-" + month + "-" + day;
			var response_time = hour + ":" + minute + ":" + seconds;
			//console.log(response_data[2]);
			con.query("INSERT INTO `response_received` (`deviceid`,`response`,`response_date`,`response_time`) VALUES ('" + response_data[2] + "', '" + data + "', '" + response_date + "', '" + response_time + "')", function (err, res2) {
				if (err) {
					console.log("Insert Res:", err);
				}
				else if (res2.affectedRows > 0) {
					console.log("Inserted successfully");
				}
			});
		}
	});//End
	
  
});

module.exports = update;