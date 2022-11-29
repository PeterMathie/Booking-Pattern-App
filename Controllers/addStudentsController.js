module.exports = (connDB, io) => {

    let addStudentController = {}

    addStudentController.addStudents = (req, res, next) => {
        var fullUrl =new URL( req.protocol + '://' + req.get('host') + req.originalUrl );
        var searchURL = fullUrl.searchParams;
        
        var idStudent   = searchURL.get("idStudent") == null ? "" : searchURL.get("idStudent");
        var name        = searchURL.get("Name") == null ? "" : searchURL.get("Name");

        var DoB         = searchURL.get("DoB") == null ? "" : searchURL.get("DoB");
        var startDate   = searchURL.get("startDate") == null ? "" : searchURL.get("startDate");

        var rm1End      = searchURL.get("rm1End") == null ? "" : searchURL.get("rm1End");
        var rm2End      = searchURL.get("rm2End") == null ? "" : searchURL.get("rm2End");
        var rm3End      = searchURL.get("rm3End") == null ? "" : searchURL.get("rm3End");

        if(name != null){
            updateStudents(connDB, idStudent, name, DoB, startDate, rm1End, rm2End, rm3End);    
        }
        res.render("add-students")
    }
    return addStudentController;
}

function updateStudents(connDB, idStudent, name, DoB, startDate, rm1End, rm2End, rm3End){
    connDB.query('\
    INSERT INTO\
        Student(Name,DoB,startDate,roomOneEnd,roomTwoEnd,roomThreeEnd) \
        VALUES(?,?,?,?,?,?)',
        [name, DoB, startDate, rm1End , rm2End , rm3End],
    (error, results, fields) => {
        if(error) {
            console.log("error "+ error + "\n")
            }
        else{
            console.log("New student row added!")
        }
    });
}