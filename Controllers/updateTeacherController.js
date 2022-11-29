module.exports = (connDB, io) => {

    let updateTeacherController = {}
    updateTeacherController.updateTeacher = (req, res, next) => {

    }

    updateTeacherController.seedTeachers = (req, res, next) => {
        /*
        Adds teachers to the database
        */
        connDB.query(
            'INSERT INTO Teacher(Name, Level) VALUES(?,?)',
            [makeid(5), randomInt(0,5)],
            (error, results, fields) => {
                if(error) {
                    console.log("error "+ error + "\n")
                    }
                else if (!results.length) {                                                   
                    console.log('Error2');
                }
                console.log("\nNew Teacher row added \n");
        });


        res.render("index", { title: "Home" });

    }
    return updateTeacherController
}


function randomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


