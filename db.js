const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Qwerty@12345",
  database: "jersey_store"
});

db.connect();
module.exports = db;
