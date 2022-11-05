const express = require("express");

module.exports = (connDB, io) => {
    let updateStudentController = require("../Controllers/updateStudentController.js")(connDB);
    let indexController = require('../Controllers/indexController.js')(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get("/", (req, res, next) => {
        updateStudentController.studentNames(req, res, next);
    });
    router.get("/home", (req, res, next) => {
        indexController.index(req, res, next);
    });
    return router;

}