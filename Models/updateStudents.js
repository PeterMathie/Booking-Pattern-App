const express = require("express");

module.exports = (connDB, io) => {
    let updateStudentController = require("../Controllers/updateStudentController.js")(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get("/", (req, res, next) => {
        updateStudentController.seedStudents(req, res, next);
    });
 
    return router;

}