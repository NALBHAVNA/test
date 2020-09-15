
require("colors")
require('moment')
    , mysql = require('mysql');

var request = require('request');
var http = require('http');
http.post = require('http-post');

const EventEmitter = require('events');
class sms_send extends EventEmitter { };
const sms = new sms_send();

sms.on('sms_send', (response) => {

    //console.log('\nokok1');
    //getting current date and time
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var seconds = date.getSeconds();

    var smsdate = year + "-" + month + "-" + day;
    var smstime = hour + ":" + minute + ":" + seconds;

    //console.log('\ntodays date = ' + smsdate );
    //console.log('\ncurrent_time = ' + smstime );
    //console.log('\n');

    var vehicleRegNo;
    var devise_id;
    var packet;
    var alt;
    var sms_time;
    var latitude;
    var longitude;
    var emergencyStatus;
    var packetStatus;
    var temperAlert;
    var mainPowerStatus;
    var mainInputVoltage;
    var towAlert;

    var phone1;
    var phone2;
    var phone3;
    var phone = 0;

    var etime;
    var tatime;
    var bdtime;
    var bltime;
    var twtime;
    var vbtime;

    var phone_no = [];

    devise_id = response.deviceID;
    packet = response.packetType;
    sms_time = response.timestamp;
    vehicle_no = response.vehicleRegNo;
    latitude = response.latitude;
    longitude = response.longitude;

    //Updates
    emergencyStatus = response.emergencyStatus;
    packetStatus = response.packetStatus;
    temperAlert = response.temperAlert;
    mainPowerStatus = response.mainPowerStatus;
    mainInputVoltage = response.mainInputVoltage;
    towAlert = response.towAlert;

    var select_sql = "";
    var update_sql = "";
    var insert_sql = "";
    var alert = "";

    // con.query("Select * from devicelist where deviceID = '"+response.imei+"'",function(err,result){
    //     if(err)
    //     {
    //         console.log(err);
    //     }
    //     else if(result.length>0)
    //     {
    if (packet == "EA" && emergencyStatus == 1 && packetStatus == "L") {

        sendnotification(response, "EA");

        select_sql += "SELECT Sosphoneone,Sosphonetwo,Sosphonethree, emtimestamp FROM devicelist WHERE deviceID = '" + devise_id + "' ";
        update_sql += " UPDATE  devicelist SET  emtimestamp = '" + sms_time + "' WHERE deviceID = ?";
    }
    else if (temperAlert == "O" && packetStatus == "L" && packet == "TA") {
        sendnotification(response, "TA");

        select_sql += "SELECT Sosphoneone,Sosphonetwo,Sosphonethree,tatimestamp  FROM devicelist WHERE deviceID = '" + devise_id + "' ";
        update_sql += " UPDATE  devicelist SET  tatimestamp = '" + sms_time + "' WHERE deviceID = ?"

                alert  += "NIPPON SECURA Device fitted in vehicle , ";
                alert +=""+devise_id+" is Tampered !";

    }
    else if (mainPowerStatus == 0 && packetStatus == "L" && packet == "BD") {
        // sendnotification(response);

        select_sql += "SELECT Sosphoneone,Sosphonetwo,Sosphonethree,bdtimestamp FROM     devicelist WHERE deviceID = '" + devise_id + "' ";
        update_sql += " UPDATE  devicelist SET  bdtimestamp = '" + sms_time + "' WHERE deviceID = ?";

        alert += "Mains disconnected alert, ";
        alert += "" + vehicle_no + " has detected Main Battery Disconnection!";
    }
    else if (mainInputVoltage < 11 && packet == "BL" && packetStatus == "L") {
        // sendnotification(response);

        select_sql += "SELECT Sosphoneone,Sosphonetwo,Sosphonethree,lowbltimestamp  FROM devicelist WHERE deviceID = '" + devise_id + "' ";
        update_sql += " UPDATE  devicelist SET  lowbltimestamp = '" + sms_time + "' WHERE deviceID = ?";

        alert += "Low battery alert, ";
        alert += "" + vehicle_no + " is critically low, Charge immediately!";

    }
    /*else if(towAlert ==1 || towAlert ==3 && packetStatus == "L")
    {
        select_sql+="SELECT Sosphoneone,Sosphonetwo,Sosphonethree,towtimestamp   FROM devicelist WHERE deviceID = '"+devise_id+"' ";
        update_sql += " UPDATE  devicelist SET  towtimestamp  = '" + sms_time + "' WHERE deviceID = ?";
                    
        alert += "NIPPON SECURA Device fitted in vehicle, ";
        alert += ""+vehicle_no+" has detected TOW AWAY !";
                    
    }
    else if(towAlert ==2 || towAlert ==3 && packetStatus == "L")
    {
        select_sql+="SELECT Sosphoneone,Sosphonetwo,Sosphonethree,vibaltimestamp   FROM devicelist WHERE deviceID = '"+devise_id+"' ";
        update_sql += " UPDATE  devicelist SET  vibaltimestamp  = '" + sms_time + "' WHERE deviceID = ?";
                    
        alert += "NIPPON SECURA Device fitted in vehicle, ";
        alert +=""+vehicle_no+" has detected Vibration Alert !";
    }*/

    if (packet == "EA" && emergencyStatus == 1 && packetStatus == "L") {

        con.query(select_sql, function (err, result) {
            var count = 0;
            if (err) {
                console.log(err);
            }
            else if (result.length > 0) {
                //storing the phone no in an array phone_no
                if ((result[0].Sosphoneone) !== null) {
                    phone1 = result[0].Sosphoneone;
                    phone_no.push(phone1);
                    count++;
                }
                if ((result[0].Sosphonetwo) !== null) {
                    phone2 = result[0].Sosphonetwo;
                    phone_no.push(phone2);
                    count++;
                }
                if ((result[0].Sosphonethree) !== null) {
                    phone3 = result[0].Sosphonethree;
                    phone_no.push(phone3);
                    count++;
                }
                //console.log('\nOnly ' + count +  ' phone_no for devise_id = ' +  devise_id );
                /*if(count === 0)
                {
                        console.log('no phone_numbers,no alert');
                }*/
                etime = result[0].emtimestamp;
                console.log('\nsms_time = ' + sms_time);
                console.log('etime = ' + etime);
                console.log(phone_no.length);
                if (phone_no.length > 0) {
                    if ((sms_time - etime >= 120) || (etime == 0)) {
                        var flag = 0;
                        alert += "Panic SOS Button pressed in device, ";
                        alert += "" + devise_id + " on " + smsdate + "  " + smstime + ".";
                        alert += "Location :";

                                var data = "https://maps.mapmyindia.com/@"+latitude+","+longitude;
                                alert += data;
                                //sending alert sms to all phone_numbers of customer
                                //console.log('sending sms to the customer phone no \n');*/
                                for (var i = 0; i < phone_no.length; i++) {
                                    if (phone_no[i] === null) {
                                        continue;
                                    }
                                    http.post("http://api.infobip.com/api/v3/sendsms/plain?user=nippon&password=nippon@123&sender=TELEMA&SMSText= " + alert + " &GSM=91" + phone_no[i], {}, function (res) {
                                        res.setEncoding('utf-8');
                                        res.on('data', function (err, chunk) {
                                        });

                                    });

                                    //console.log('sent alert sms to the customer_phone:'+ i);
                                    if (flag === 0) {
                                        update_smstime(devise_id);
                                        flag = 1;
                                    }
                                    sql = "INSERT INTO `smssending` (`devcieid`,`phonenumber`,`smsdata`,`date`,`time`,`smstype`) VALUES ('" + devise_id + "', '" + phone_no[i] + "', '" + alert + "', '" + smsdate + "','" + smstime + "','" + packet + "')"
                                    con.query(sql, function (err, result) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {

                                            console.log('Inserted the smssending table');
                                        }

                                    });

                                }

                        // });//fetch Address
                    }
                    else {
                        console.log('no alert');
                    }
                }
                else {
                    console.log('no phone_no, no alert');
                }
                //connection.end();
            }
            else {
                console.log("No data available", select_sql);
            }
        });

    }
    if (temperAlert == "O" && packetStatus == "L" && packet == "TA") {
        con.query(select_sql, function (err, result) {
            if (err) {
                throw err;
            }
            else if (result.length > 0) {
                tatime = result[0].tatimestamp;
                phone1 = result[0].Sosphoneone;
                phone2 = result[0].Sosphonetwo;
                phone3 = result[0].Sosphonethree;

                if (phone1 === null && phone2 === null && phone3 === null) {
                    //console.log('no phone_no, no alert');
                    phone = 0;
                    //process.exit(1);
                }
                else if (phone1 !== null) {
                    phone = phone1;
                }
                else if (phone2 !== null) {
                    phone = phone2;
                }
                else {
                    phone = phone3;
                }

                //console.log('sms_time = ' + sms_time);
                //console.log('tatime = ' + tatime);

                //checking the conditions to send sms customer
                if (phone != 0) {
                    //console.log("phone",phone);
                    if ((sms_time - tatime >= 1800) || (tatime == 0)) {
                                        console.log("data")
                                        alert += " on "+smsdate+"  "+smstime+".";
                                        alert += "Location :";

                                                var location = "https://maps.mapmyindia.com/@"+latitude+","+longitude
                                                console.log("location",location);
                                                    //console.log(location);
                                                    alert += location;
                                                    http.post("http://api.infobip.com/api/v3/sendsms/plain?user=nippon&password=nippon@123&sender=TELEMA&SMSText= "+alert+" &GSM=91" + phone, {}, function(res){
                                                        
                                                        res.setEncoding('utf-8');
                                                        
                                                        res.on('data', function(err, chunk) {
                                            
                                                            //if(err) throw err;
                                                            
                                                            //console.log(chunk);
                            
                                                            });
                                                                        
                                                        });
                                                        
                                                        //console.log('sent sms to the customer');
                                                        
                                                        
                                                        update_smstime(devise_id);
                                                        
                                                        //console.log('phone = ' + phone);
                                                        
                                                        insert_sql = "INSERT INTO `smssending` (`devcieid`,`phonenumber`,`smsdata`,`date`,`time`,`smstype`) VALUES ('"+devise_id+"', '"+phone+"', '"+alert+"', '"+smsdate+"','"+smstime+"','"+packet+"')"
                                                        
                                                        insertsms(insert_sql,phone,devise_id,alert);
                                                
                                           
                                    

                    }
                    else {
                        console.log('no alert');
                    }
                }
                else {
                    console.log('no phone_no, no alert');
                }

                //connection.end();
            }
            else {
                console.log("No data available");
            }
        });
    }
    if (mainPowerStatus == 0 && packetStatus == "L" && packet == "BD") {
        con.query(select_sql, function (err, result) {
            if (err) {
                throw err;
            }
            else if (result.length > 0) {
                bdtime = result[0].bdtimestamp;
                phone1 = result[0].Sosphoneone;
                phone2 = result[0].Sosphonetwo;
                phone3 = result[0].Sosphonethree;

                if (phone1 === null && phone2 === null && phone3 === null) {
                    //console.log('no phone_no, no alert');
                    phone = 0;
                    // process.exit(1);
                }
                else if (phone1 !== null) {
                    phone = phone1;
                }
                else if (phone2 !== null) {
                    phone = phone2;
                }
                else {
                    phone = phone3;
                }

                //console.log('sms_time = ' + sms_time);
                //console.log('bdtime = ' + bdtime);

                //checking the conditions to send sms customer
                if (phone != 0) {
                    //console.log("phone",phone);
                    if ((sms_time - bdtime >= 1800) || (bdtime == 0)) {
                        http.post("http://api.infobip.com/api/v3/sendsms/plain?user=nippon&password=nippon@123&sender=TELEMA&SMSText= " + alert + " &GSM=91" + phone, {}, function (res) {

                            res.setEncoding('utf-8');

                            res.on('data', function (err, chunk) {

                                //if(err) throw err;

                                //console.log(chunk);

                            });

                        });

                        //console.log('sent sms to the customer');

                        update_smstime(devise_id);

                        insert_sql = "INSERT INTO `smssending` (`devcieid`,`phonenumber`,`smsdata`,`date`,`time`,`smstype`) VALUES ('" + devise_id + "', '" + phone + "', '" + alert + "', '" + smsdate + "','" + smstime + "','" + packet + "')"

                        insertsms(insert_sql, phone, devise_id, alert);

                    }
                    else {
                        console.log('no alert');
                    }
                }
                else {
                    console.log('no phone_no, no alert');
                }
                //connection.end();
            }
            else {
                console.log("No data available");
            }
        });
    }
    if (mainInputVoltage < 11 && packet == "BL" && packetStatus == "L") {
        con.query(select_sql, function (err, result) {
            if (err) {
                throw err;
            }
            else if (result.length > 0) {
                bltime = result[0].lowbltimestamp;
                phone1 = result[0].Sosphoneone;
                phone2 = result[0].Sosphonetwo;
                phone3 = result[0].Sosphonethree;

                if (phone1 === null && phone2 === null && phone3 === null) {
                    //console.log('no phone_no, no alert');
                    phone = 0;
                    // process.exit(1);
                }
                else if (phone1 !== null) {
                    phone = phone1;
                }
                else if (phone2 !== null) {
                    phone = phone2;
                }
                else {
                    phone = phone3;
                }

                //console.log('sms_time = ' + sms_time);
                //console.log('bltime = ' + bltime);

                //checking the conditions to send sms customer
                if (phone != 0) {
                    //console.log("phone",phone);
                    if ((sms_time - bltime >= 1800) || (bltime == 0)) {
                        http.post("http://api.infobip.com/api/v3/sendsms/plain?user=nippon&password=nippon@123&sender=TELEMA&SMSText= " + alert + " &GSM=91" + phone, {}, function (res) {

                            res.setEncoding('utf-8');

                            res.on('data', function (err, chunk) {

                                //if(err) throw err;

                                //console.log(chunk);

                            });

                        });

                        //console.log('sent sms to the customer');

                        update_smstime(devise_id);

                        insert_sql = "INSERT INTO `smssending` (`devcieid`,`phonenumber`,`smsdata`,`date`,`time`,`smstype`) VALUES ('" + devise_id + "', '" + phone + "', '" + alert + "', '" + smsdate + "','" + smstime + "','" + packet + "')"

                        insertsms(insert_sql, phone1, devise_id, alert);

                    }
                    else {
                        console.log('no alert');
                    }
                }
                else {
                    console.log('no phone_no, no alert');
                }
                //connection.end();
            }
            else {
                console.log("No data available");
            }
        });
    }

    /*if(towAlert ==1 || towAlert ==3 && packetStatus == "L")
    {
                    con.query(select_sql,function(err,result)
                    {
                                    if(err)
                                    {
                                                    throw err;
                                    }
                                    else if(result.length>0)
                                    {
                                    twtime = result[0].towtimestamp;
                                    phone1= result[0].Sosphoneone;
                                    phone2= result[0].Sosphonetwo;
                                    phone3= result[0].Sosphonethree;
                                    
                                     if(phone1 === null && phone2 === null && phone3 === null)
                                    {
                                                    //console.log('no phone_no, no alert');
                                                     phone = 0;
                                                   //process.exit(1);
                                    }
                                    else if(phone1 !== null)
                                    {
                                                    phone = phone1;
                                    }
                                    else if(phone2 !== null)
                                    {
                                                    phone = phone2;
                                    }
                                    else 
                                     {
                                                    phone = phone3;
                                    }
                                    
                                    
                    console.log('sms_time = ' + sms_time);
                    console.log('twtime = ' + twtime);
                    
                    //checking the conditions to send sms customer
                   if(phone != 0)
                    {
                        //console.log("phone",phone);
                                    if( (sms_time -twtime >= 1800) || (twtime == 0))
                                    {
                                                    http.post("http://api.infobip.com/api/v3/sendsms/plain?user=nippon&password=nippon@123&sender=TELEMA&SMSText= "+alert+" &GSM=91" + phone, {}, function(res){
                                                                    
                                                                    res.setEncoding('utf-8');
                                                                    
                                                                    res.on('data', function(err, chunk) {
                                                                    
                                                                                    //if(err) throw err;
                                                                                    
                                                                                    //console.log(chunk);
                                                    
                                                                                    });
                                                                                    
                                                                    });
                                                                    
                                                                    //console.log('sent sms to the customer');
                                                                    
                                                                    
                                                                    update_smstime(devise_id);
                                                                    
                                                                    insert_sql = "INSERT INTO `smssending` (`devcieid`,`phonenumber`,`smsdata`,`date`,`time`,`smstype`) VALUES ('"+devise_id+"', '"+phone+"', '"+alert+"', '"+smsdate+"','"+smstime+"','"+packet+"')"
                                                                    
                                                                    insertsms(insert_sql,phone,devise_id,alert);
                                                    
                                    }
                                    else
                                    {
                                                    console.log('no alert');
                                    }
                    }
                    else
                    {
                                    console.log('no phone_no, no alert');
                    }
                    //connection.end();
                }
                else
                {
                    console.log("No data available");
                }
                    });
    }
                                    
    if(towAlert ==2 || towAlert ==3 && packetStatus == "L")
    {
                    con.query(select_sql,function(err,result)
                    {
                                    if(err)
                                    {
                                                    throw err;
                                    }
                                    else if(result.length>0)
                                    {
                                    vbtime = result[0].vibaltimestamp;
                                    phone1= result[0].Sosphoneone;
                                    phone2= result[0].Sosphonetwo;
                                    phone3= result[0].Sosphonethree;
                                    
                                     if(phone1 === null && phone2 === null && phone3 === null)
                                    {
                                                    //console.log('no phone_no, no alert');
                                                     phone = 0;
                                                     //process.exit(1);
                                    }
                                    else if(phone1 !== null)
                                    {
                                                    phone = phone1;
                                    }
                                    else if(phone2 !== null)
                                    {
                                                    phone = phone2;
                                    }
                                    else 
                                     {
                                                    phone = phone3;
                                    }
                                    // console.log(phone1);
                    
                    console.log('sms_time = ' + sms_time);
                    console.log('vbtime = ' + vbtime);
                                    
                    //checking the conditions to send sms customer
                   if(phone != 0)
                    {
                        //console.log("phone",phone);
                                    if( (sms_time -vbtime >= 1800) || (vbtime == 0))
                                    {
                                                    http.post("http://api.infobip.com/api/v3/sendsms/plain?user=nippon&password=nippon@123&sender=TELEMA&SMSText= "+alert+" &GSM=91" + phone, {}, function(res){
                                                                    
                                                                    res.setEncoding('utf-8');
                                                                    
                                                                    res.on('data', function(err, chunk) {
                                                                    
                                                                                    //if(err) throw err;
                                                                                    
                                                                                    //console.log(chunk);
                                                    
                                                                                    });
                                                                                    
                                                                    });
                                                                    
                                                                    //console.log('sent sms to the customer');
                                                                    
                                                                    
                                                                    update_smstime(devise_id);
                                                                    
                                                                    insert_sql = "INSERT INTO `smssending` (`devcieid`,`phonenumber`,`smsdata`,`date`,`time`,`smstype`) VALUES ('"+devise_id+"', '"+phone+"', '"+alert+"', '"+smsdate+"','"+smstime+"','"+packet+"')"
                                                                    
                                                                    insertsms(insert_sql,phone,devise_id,alert);
                                                                    
                                    }
                                    else
                                    {
                                                    console.log('no alert');
                                    }
                    }
                    else
                    {
                                    console.log('no phone_no, no alert');
                    }
                    //connection.end();
                }
                else
                {
                    console.log("No data available");
                }
                    });
    }*/

    //function to execute insert query           
    var insertsms = function (sqlstring, phone1, id, alert) {

        con.query(sqlstring, [id], function (err, result, fields) {
            if (err) {
                console.log(err)
            }
            //console.log("SMS sending data Inserted");
        })
    };

    //function to execute update query  
    var update_smstime = function (id) {
        con.query(update_sql, [id], function (err, result, fields) {
            if (err) {
                console.log(err)
            }
            //console.log("Timestamp updated");
        })
    };
    //     }
    // });


})

function sendnotification(response, type) {

    con.query("select * from gts.fms_group as gr where group_manager_pcontact=(SELECT Sosphonetwo FROM gts.devicelist as dl where dl.DeviceID=?);", [response.deviceID], function (err, resGrp) {
        if (err) {
            console.log(err)
        }
        else if (resGrp.length == 0) {
            con.query("SELECT fa.admin_id FROM gts.fms_devices as fd,gts.fms_admin as fa where fd.DeviceID=? and fd.admin_id=fa.admin_id;", [response.deviceID], function (err, resAdmin) {
                if (err) {
                    console.log(err)
                }
                else if (resAdmin.length > 0) {
                    if (type == "EA") {
                        message = "<h4>Emergency Alert!!</h4><p>Emergency alert (SOS) from " + response.vehicleRegNo + " IMEI: " + response.deviceID + ".</p><hr/>";
                    }
                    else if (type == "TA") {
                        message = "<h4>Emergency Alert!!</h4><p>Emergency alert (Tampered) from " + response.vehicleRegNo + " IMEI: " + response.deviceID + ".</p><hr/>";
                    }
                    con.query("Insert into gts.alert_information (`sender`,`receiver`,`message`,`read_status`,`timestamp`,`alert_status`,`alert_type`) values ('robo','" + resAdmin[0].admin_id + "','" + message + "',0,'" + response.timestamp + "',1,'risk');",
                        function (err, res3) {
                            if (err) {
                                console.log(err);
                                res.send({ "status": 0, "data": "Server Error" });

                            }
                            else if (res3.affectedRows > 0) {
                                console.log("Start trip alert inserted successfully");
                            }

                        });

                }
            });
        }
        else if (resGrp.length > 0) {

            if (type == "EA") {
                message = "<h4>Emergency Alert!!</h4><p>Emergency alert (SOS) from " + response.vehicleRegNo + " IMEI: " + response.deviceID + ".</p><hr/>";
            }
            else if (type == "TA") {
                message = "<h4>Emergency Alert!!</h4><p>Emergency alert (Tampered) from " + response.vehicleRegNo + " IMEI: " + response.deviceID + ".</p><hr/>";
            }
            con.query("Insert into gts.alert_information (`sender`,`receiver`,`message`,`read_status`,`timestamp`,`alert_status`,`alert_type`) values ('robo','" + resGrp[0].admin_id + "','" + message + "',0,'" + response.timestamp + "',1,'risk');",
                function (err, res3) {
                    if (err) {
                        console.log(err);
                        res.send({ "status": 0, "data": "Server Error" });

                    }
                    else if (res3.affectedRows > 0) {
                        console.log("Start trip alert inserted successfully");
                    }

                });

                con.query("Insert into gts.alert_information (`sender`,`receiver`,`message`,`read_status`,`timestamp`,`alert_status`,`alert_type`) values ('robo','" + resGrp[0].groupID + "','" + message + "',0,'" + response.timestamp + "',1,'risk');",
                function (err, res3) {
                    if (err) {
                        console.log(err);
                        res.send({ "status": 0, "data": "Server Error" });

                    }
                    else if (res3.affectedRows > 0) {
                        console.log("Start trip alert inserted successfully");
                    }

                });
        }
    });
}

module.exports = sms;


