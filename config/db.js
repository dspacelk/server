const mysql = require("mysql");
const local = true;


const db = mysql.createConnection({
    host: local ? "localhost" : "s83.gocheapweb.com",
    user: local ? "root" : "dspacelk_ofc_user",
    password: local ? "" : "dspace@darkleo",
    database: local ? "ds" : "dspacelk_ofc_database",
})

module.exports = db;