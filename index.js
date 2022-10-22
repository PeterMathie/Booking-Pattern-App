// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const mysql = require("mysql")
require('dotenv').config();

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// db
var connDB = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: "mydb"
});


connDB.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
  
});


/**
 * Routes Definitions
 */

app.use('/', require('./Models/index')(connDB));
app.use('/home', require('./Models/index')(connDB));

app.use('/students', require('./Models/students')(connDB));



/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});







