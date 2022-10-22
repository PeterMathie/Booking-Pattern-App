var express = require('express');

module.exports = (connDB, io) => {
    let indexController = require('../controllers/indexController.js')(connDB);

    var router = express.Router();

    /* GET home page. */
    router.get('/', (req, res, next) => {
        /* if (req.session) {
            errorsController.index(req, res, next);
        } else {
            indexController.index(req, res, next);
        } */
        indexController.index(req, res, next);
    });

    return router;

}
