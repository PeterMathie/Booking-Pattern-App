module.exports = (connDB, io) => {

    let updateStudentController = {}
    updateStudentController.updateStudents = (req, res, next) => {
        
    
    
    }


    
    updateStudentController.seedStudents = (req, res, next) => {

        var name = makeid(5);
        var date = new Date()
        var DoB = randomDate(new Date(date.setFullYear(date.getFullYear()-5)), new Date());
        var roomOneEnd = getOneEnd(DoB);
        var roomTwoEnd = getTwoEnd(DoB);
        var roomThreeEnd = getThreeEnd(DoB);
        var startDate = randomDate(DoB ,roomThreeEnd);

        connDB.query(
            'INSERT INTO Student(Name, DoB, startDate, roomOneEnd, roomTwoEnd, roomThreeEnd)\
            VALUES(?,?,?,?,?,?)',
            [name, DoB, startDate, roomOneEnd, roomTwoEnd, roomThreeEnd],
            (error, results, fields) => {
            if (error) {
                throw error;
            }
            console.log("\nNew Student row added\n");
        });

        connDB.query(
            'SELECT * FROM Student',
            (error, results, fields) => {
            if (error) {
                throw error;
            }
            res.render("index", { title: "Home" });
        });



    }
    return updateStudentController;
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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

function getOneEnd(DoB){
    var endDate = new Date(DoB);
    endDate.setDate(endDate.getDate() + 365*2);

    return endDate;
}
function getTwoEnd(DoB){
    var endDate = new Date(DoB);
    endDate.setDate(endDate.getDate() + 365*3);

    return endDate;
}
function getThreeEnd(DoB){
    var endDate = new Date(DoB);
    endDate.setDate(endDate.getDate() + 365*5);

    return endDate;
}



