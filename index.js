// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const mysql = require("mysql")

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
var connectionDB = mysql.createConnection({
  host: "nurserydb.chdlpe2a2izs.eu-west-2.rds.amazonaws.com",
  user: "nurseryAdmin",
  password: "meatismurder",
  port: "3306",
  database: "mydb"
});


connectionDB.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
  
});


/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});







