
module.exports = (connDB, io) => {

let studentController = {}

    studentController.students = (req, res, next) => {
        studentsArray = [];
        connDB.query(
                "SELECT * FROM Student",
                (error, results, fields) => {
                    if(error) {
                        console.log("error "+ error + "\n")
                        //throw error;
                    }
                    for(i in results){
                        results[i].DoB          = results[i].DoB.toLocaleDateString('en-GB')
                        results[i].startDate    = results[i].startDate.toLocaleDateString('en-GB')
                        results[i].roomOneEnd   = results[i].roomOneEnd.toLocaleDateString('en-GB')
                        results[i].roomTwoEnd   = results[i].roomTwoEnd.toLocaleDateString('en-GB')
                        results[i].roomThreeEnd = results[i].roomThreeEnd.toLocaleDateString('en-GB')

                    }
                    studentsArray = results;
                    res.render("students",{ studentsArray: studentsArray} );

                });

    }

    return studentController;
}