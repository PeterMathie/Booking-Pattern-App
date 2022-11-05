
module.exports = (connDB, io) => {

let teachersController = {}

    teachersController.teachers = (req, res, next) => {

        connDB.query(
                "SELECT * FROM Teacher",
                (error, results, fields) => {
                    if(error) {
                        console.log("error "+ error + "\n")
                        //throw error;
                    }

                    res.render("teachers",{ teachersArray: results} );

                });

    }

    return teachersController;
}