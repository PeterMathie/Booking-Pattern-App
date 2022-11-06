const express = require("express");

module.exports = (connDB, io) => {
    let studentController = require("../Controllers/studentsController.js")(connDB);
    let indexController = require('../Controllers/indexController.js')(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get("/", (req, res, next) => {
        console.log(req)

        studentController.students(req, res, next);
    });

    return router;

}
