//Parser for NipponMSIL NT262_message_format
require("colors")
require('moment')

exports.update_response = (imei,response,callback) => {
    con.getConnection(function(err, conn) {
        if(err)
        {
            console.log(err);
            return;
        }
        conn.query("Update devicelist set Response = '"+response+"',CommandStatusCode = 3 where deviceID = '"+imei+"' and CommandStatusCode = 2 ",function(err,result){
       if(err)
        {
           // console.log(err);
        }
        else if(result.affectedRows>0)
        {
            var output = 1
            callback(null,output);
        }
        else
        {
            var output = 0;
            callback(null,output);
        }
    });
    if(conn)
        conn.release();
    
}); 
    
}

