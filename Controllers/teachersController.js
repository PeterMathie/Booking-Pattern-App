
module.exports = (connDB, io) => {

let teachersController = {}

    teachersController.teachers = (req, res, next) => {
        teachersArray = [];
        connDB.query(
                "SELECT * FROM Teacher",
                (error, results, fields) => {
                    if(error) {
                        console.log("error "+ error + "\n")
                    }
                    teachersArray = results;
                    res.render("teachers",{ teachersArray: teachersArray} );

                });

    }

    return teachersController;
}