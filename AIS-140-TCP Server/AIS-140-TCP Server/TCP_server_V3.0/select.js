const mysql=require('mysql');
const dbConfig = require('./Sending_command/config').DATABASE_CONFIG;
const con = mysql.createPool(dbConfig);
var ar=[];
const nomsg=16000;

var interval=setInterval(() => {
    con.query("Select count (*) as row from `eventdata`",function(err,rows){
        var count=rows[0].row;
        if(count!=0&&count!=nomsg){ar.push(count)}
        // console.log("select  per 1/2 sec",count);

        if(count==nomsg)
        {            
            ar.push(nomsg);
            console.log(ar[0],"length",ar.length)
            var sum=ar[0];
            for(let i=0;i<ar.length-1;i++)
            {
            sum+=ar[i+1]-ar[i];
            console.log(ar[i+1]-ar[i])
            }
            const inserts=Math.round(sum/(ar.length));
            const time=(nomsg/inserts)*1000;
            const oneins=time/nomsg;
            console.log(inserts,"insertions per sec");
            console.log(time,`ms for ${nomsg} insertions`);
            console.log(oneins,"ms for 1 insertion");
            clearInterval(interval);
            process.exit(0)
        }
    })
}, 1000);
