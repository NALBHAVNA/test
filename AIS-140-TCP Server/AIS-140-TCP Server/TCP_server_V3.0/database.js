// var mysql = require('mysql')
// const dbConfig = require('./Sending_command/config').DATABASE_CONFIG;
// var con = mysql.createPool(dbConfig);
//// console.log("In database")
// con.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection was closed.')
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has too many connections.')
//         }
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection was refused.')
//         }
//     }
//     if (connection) connection.release()
//     return
// })
// module.exports = con




var mysql = require('mysql')
const dbConfig = require('./Sending_command/config').DATABASE_CONFIG;
var con;

function handleDb() {
    con = mysql.createPool(dbConfig)
    con.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
                setTimeout(handleDb(), 1000);
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.')
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.')
            }
        }
        if (connection) connection.release()
        return
    })
}

handleDb();

module.exports = con