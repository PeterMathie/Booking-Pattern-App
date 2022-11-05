
module.exports = (connDB, io) => {

let studentController = {}

    studentController.students = (req, res, next) => {

        connDB.query(
                "SELECT * FROM Student",
                (error, results, fields) => {
                    if(error) {
                        console.log("error "+ error + "\n")
                        //throw error;
                    }
                    for(i in results){
                        results[i].DoB = results[i].DoB.toLocaleDateString('en-GB')
                        results[i].RoomStart = results[i].RoomStart.toLocaleDateString('en-GB')
                        results[i].RoomEnd = results[i].RoomEnd.toLocaleDateString('en-GB')
                        results[i].End = results[i].End.toLocaleDateString('en-GB')
                    }
                    
                    res.render("students",{ studentsArray: results} );

                });

    }

    return studentController;
}