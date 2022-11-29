module.exports = (connDB, io) => {

    let updatePatternsController = {}


    updatePatternsController.seedStudentPatterns = (req, res, next) => {
        connDB.query(
            "SELECT idStudent FROM Student",
            (error, results, fields) => {
                if(error) {
                    console.log("error 1 "+ error + "\n")
                }
                else if (!results.length) {                                                   
                    console.log("error 2 "+ error + "\n");
                } 
                for(i in results){
                    idStudent = results[i].idStudent

                    connDB.query(
                        //Ingore means no exsisting students in the BookingPatterns table will be reentered
                        //Ignore prevent duplicate entries
                        "INSERT IGNORE INTO BookingPattern_Students             \
                        (idStudent, Mm, Ma, Tm, Ta, Wm, Wa, Thm, Tha, Fm, Fa)   \
                        VALUES(?,?,?,?,?,?,?,?,?,?,?)",
                        [idStudent, Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random())],
                        (error, results, fields) => {
                            if(error) {
                                console.log("error "+ error + "\n")
                            }
                            else if (!results.length) {                                                   
                                console.log('Error2');
                            }
                        }
                    )
                }
                console.log("Booking patterns randomised!")
            }
        )    
        res.render("index" );
    }

    updatePatternsController.seedTeacherPatterns = (req, res, next) => {
        connDB.query(
            "SELECT idTeacher FROM Teacher",
            (error, results, fields) => {
                if(error) {
                    console.log("error 1 "+ error + "\n")
                }
                else if (!results.length) {                                                   
                    console.log("error 2 "+ error + "\n");
                } 
                for(i in results){
                    date = new Date()
                    idTeacher = results[i].idTeacher
                    randDate = randomDate(new Date(), new Date( date.setDate(date.getDate() + 365) ), )
                    connDB.query(
                        "INSERT IGNORE INTO BookingPattern_Teachers             \
                        (idTeacher,endDate, Mm, Ma, Tm, Ta, Wm, Wa, Thm, Tha, Fm, Fa)   \
                        VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
                        [idTeacher,randDate, Math.ceil(Math.random()*3),Math.ceil(Math.random()*3),Math.ceil(Math.random()*3),Math.ceil(Math.random()*3),Math.ceil(Math.random()*3),Math.ceil(Math.random()*3),Math.ceil(Math.random()*3),Math.ceil(Math.random()*3),Math.ceil(Math.random()*3),Math.ceil(Math.random()*3)],
                        (error, results, fields) => {
                            if(error) {
                                console.log("error "+ error + "\n")
                            }
                            else if (!results.length) {                                                   
                                console.log('Error2');
                            }
                        }
                    )
                }
                console.log("Booking patterns randomised.")

            }
        )    
        res.render("index");

    }
    return updatePatternsController;
}

function getAgeMonths(startDate, endDate) {
    var ageMonths = endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());   
    return ageMonths;
}
function getRoom(DoB, roomStart){

    var ageMonths = getAgeMonths(DoB, roomStart);
    
    if(ageMonths < 24){return 1;}
    if(ageMonths < 36){return 2;}
    if(ageMonths < 60){return 3;}

    console.log("TOO OLD");
}

function randomDate(start, end) {
    var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return new Date(year, month, day);
}