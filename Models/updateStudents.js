const express = require("express");

module.exports = (connDB, io) => {
    let updateStudentController = require("../Controllers/updateStudentController.js")(connDB);

    var router = express.Router();

    /* add student to DB. */
    router.get("/", (req, res, next) => {
        updateStudentController.updateStudents(req, res, next);
    });

  
 
    return router;

}