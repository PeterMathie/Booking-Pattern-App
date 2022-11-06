const express = require("express");

module.exports = (connDB, io) => {
    let teachersController = require("../Controllers/teachersController.js")(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get("/", (req, res, next) => {
        teachersController.teachers(req, res, next);
    });
    
    return router;

}
