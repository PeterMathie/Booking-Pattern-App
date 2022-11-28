module.exports = (connDB, io) => {

    let updateStudentController = {}

    updateStudentController.updateStudents = (req, res, next) => {
        var fullUrl =new URL( req.protocol + '://' + req.get('host') + req.originalUrl );
        var searchURL = fullUrl.searchParams;
        
        var idStudent   = searchURL.get("idStudent") == null ? "" : searchURL.get("idStudent");
        var name        = searchURL.get("Name") == null ? "" : searchURL.get("Name");

        var DoB         = searchURL.get("DoB") == null ? "" : searchURL.get("DoB");
        var startDate   = searchURL.get("startDate") == null ? "" : searchURL.get("startDate");

        var rm1End      = searchURL.get("rm1End") == null ? "" : searchURL.get("rm1End");
        var rm2End      = searchURL.get("rm2End") == null ? "" : searchURL.get("rm2End");
        var rm3End      = searchURL.get("rm3End") == null ? "" : searchURL.get("rm3End");

        updateStudents(connDB, idStudent, name, DoB, startDate, rm1End, rm2End, rm3End);    
            
        connDB.query(
            'SELECT * FROM Student',
            (error, results, fields) => {
                if(error) {
                    console.log("error "+ error + "\n")
                    }
                else if (!results.length) {                                                   
                    console.log('Error2');
                }
                else if (!results[0].something) {
                    console.log('Error3');
                } 
                res.render("update-students", {studentArray: results});
            });
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
                if(error) {
                    console.log("error "+ error + "\n")
                    }
                else if (!results.length) {                                                   
                    console.log('Error2');
                }
                else if (!results[0].something) {
                    console.log('Error3');
                }
                console.log("\nNew Student row added\n");
        });

        connDB.query(
            'SELECT * FROM Student',
            (error, results, fields) => {
                if(error) {
                    console.log("error "+ error + "\n")
                    }
                else if (!results.length) {                                                   
                    console.log('Error2');
                }
                else if (!results[0].something) {
                    console.log('Error3');
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
    
    var yyyy = DoB.getFullYear()+2 ;
    var mm = DoB.getMonth()<10 ? "0"+(DoB.getMonth()+1) : (DoB.getMonth()+1)
    var dd = DoB.getDate()<10 ? "0"+DoB.getDate(): DoB.getDate()
    endDate = yyyy + "-" + mm + "-" + dd

    return endDate;
}
function getTwoEnd(DoB){
    var endDate = new Date(DoB);

    var yyyy = DoB.getFullYear()+3 ;
    var mm = DoB.getMonth()<10 ? "0"+(DoB.getMonth()+1) : (DoB.getMonth()+1)
    var dd = DoB.getDate()<10 ? "0"+DoB.getDate(): DoB.getDate()
    endDate = yyyy + "-" + mm + "-" + dd

    return endDate;
}
function getThreeEnd(DoB){
    var endDate = new Date(DoB);

    var yyyy = DoB.getFullYear()+5 ;
    var mm = DoB.getMonth()<10 ? "0"+(DoB.getMonth()+1) : (DoB.getMonth()+1)
    var dd = DoB.getDate()<10 ? "0"+DoB.getDate(): DoB.getDate()
    endDate = yyyy + "-" + mm + "-" + dd

    return endDate;
}


function updateStudents(connDB, idStudent, name, DoB, startDate, rm1End, rm2End, rm3End){
    connDB.query('\
    UPDATE\
        Student\
    SET\
        Name         = "'+name     +'",\
        DoB          = "'+DoB      +'",\
        startDate    = "'+startDate+'",\
        roomOneEnd   = "'+rm1End   +'",\
        roomTwoEnd   = "'+rm2End   +'",\
        roomThreeEnd = "'+rm3End   +'" \
    WHERE \
        idStudent    = "'+idStudent+'";\
    ',
    (error, results, fields) => {
        if(error) {
            console.log("error "+ error + "\n")
            }
    });
    
}
