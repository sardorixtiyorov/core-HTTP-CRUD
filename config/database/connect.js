const mysql = require("mysql");

const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "trade_inventory_system",
});
module.exports = pool;
