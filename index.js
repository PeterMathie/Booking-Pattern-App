// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const mysql = require("mysql")
const http = require('http');

require('dotenv').config();

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8064";

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.set('port', port);


/**
 * Create HTTP server.
 */

var server = http.createServer(app);


/**
 *  Database
 */ 
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
app.use('/teachers', require('./Models/teachers')(connDB));

app.use('/bookingPatterns', require('./Models/bookingPatterns')(connDB));

app.use('/updateStudents', require('./Models/updateStudents')(connDB));
app.use('/addStudents', require('./Models/addStudents')(connDB));

app.use('/updateTeachers', require('./Models/updateTeachers')(connDB));

app.use('/updatePatterns', require('./Models/updatePatterns')(connDB));


/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});






