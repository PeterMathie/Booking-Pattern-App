module.exports = (connDB) => {

    let indexController = {}

    indexController.index = (req, res, next) => {
        res.render("index", { title: "Home" });
    }

    return indexController;
}