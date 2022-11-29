const express = require("express");

module.exports = (connDB, io) => {
    let updatePatternsController = require("../Controllers/updatePatternsController.js")(connDB);
    
    var router = express.Router();
    // Seeds the Student Booking Patterns with random values
    
    // Seeds the Teacher Booking Patterns with random values
    router.get("/", (req, res, next) => {
        updatePatternsController.seedStudentPatterns(req, res, next);
    });
    return router;

}