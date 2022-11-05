const express = require("express");

module.exports = (connDB, io) => {
    let teachersController = require("../Controllers/teachersController.js")(connDB);
    let indexController = require('../Controllers/indexController.js')(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get("/", (req, res, next) => {
        teachersController.teachers(req, res, next);
    });
    router.get("/home", (req, res, next) => {
        indexController.index(req, res, next);
    });
    return router;

}
