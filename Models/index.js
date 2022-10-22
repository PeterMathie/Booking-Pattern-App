var express = require('express');

module.exports = (connDB, io) => {
    let indexController = require('../Controllers/indexController.js')(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get('/', (req, res, next) => {
        indexController.index(req, res, next);
    });

    return router;

}
