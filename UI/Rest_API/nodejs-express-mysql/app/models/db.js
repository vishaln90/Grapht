const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
var connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin@123",
  database: 'graph_schema'
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;