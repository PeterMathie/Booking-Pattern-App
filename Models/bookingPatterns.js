const express = require("express");

module.exports = (connDB, io) => {
    let bookingPatternsController = require("../Controllers/bookingPatternsController.js")(connDB);
    let indexController = require('../Controllers/indexController.js')(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get("/", (req, res, next) => {
        bookingPatternsController.bookingPatterns(req, res, next);
    });
    router.get("/home", (req, res, next) => {
        indexController.index(req, res, next);
    });
    return router;

}