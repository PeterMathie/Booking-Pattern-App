const express = require("express");

module.exports = (connDB, io) => {
    let addStudentsController = require("../Controllers/addStudentsController.js")(connDB);

    var router = express.Router();

    /* add student to DB. */
    router.get("/", (req, res, next) => {
        addStudentsController.addStudents(req, res, next);
    });

    return router;

}