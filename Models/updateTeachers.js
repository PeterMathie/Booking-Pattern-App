const express = require("express");

module.exports = (connDB, io) => {
    let updateTeacherController = require("../Controllers/updateTeacherController.js")(connDB);
    let indexController = require('../Controllers/indexController.js')(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get("/", (req, res, next) => {
        updateTeacherController.seedTeachers(req, res, next);
    });

    return router;

}