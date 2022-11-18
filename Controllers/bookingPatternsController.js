const { render } = require("pug");

module.exports = (connDB, io) => {

    let bookingPatternsController = {}


    bookingPatternsController.bookingPatterns = (req, res, next) => {
        var fullUrl =new URL( req.protocol + '://' + req.get('host') + req.originalUrl );
        var searchURL = fullUrl.searchParams;

        var toggle = searchURL.get("toggle") == null ? "Student" : searchURL.get("toggle");
        var roomNo = searchURL.get("roomNo") == null ? "1" : searchURL.get("roomNo");
        var date = searchURL.get("date") == null ? new Date().toJSON().toString().slice(0, 10) : searchURL.get("date");
        
        var bookingPatternsStudents;
        var bookingPatternsTeachers;
        var bookingPatterns;

        var weightedSumStudents;
        var roomRatios;
        var sumTeachers;
        var teachRatios; 

        var roomSize;
        getRoomSize(connDB, roomNo, function(result){
            roomSize = result;
        });
        
        // get the booking pattern for the students for that week and room
        getBookingPatternStudent(connDB, roomNo, date, function(result){
            bookingPatternsStudents = result;

            getBookingPatternTeacher(connDB, roomNo, date, function(result){
                bookingPatternsTeachers = result;
                
                sumTeachers         = getTeachSum(bookingPatternsTeachers, roomSize, date);
                weightedSumStudents = getWeightedSum(bookingPatternsStudents, roomSize, date);
            
                roomRatios          = getRoomRatio(bookingPatternsStudents, roomSize, date);
                teachRatios         = getTeachRatios(sumTeachers, weightedSumStudents) 
                
                /*
                console.log("bp TEACHERS: ",bookingPatternsTeachers)

                console.log("SUM TEACHER: "+sumTeachers)
                console.log("SUM STUDENT: "+weightedSumStudents)
                
                console.log("ROOM RATIOS: "+roomRatios)
                console.log("TEACH RATIO: "+teachRatios)
                */

                switch(toggle){
                    case "Teacher":
                        bookingPatterns = bookingPatternsTeachers;
                        break;
                    case "Student":
                        bookingPatterns = bookingPatternsStudents;
                        break;
                }
                renderBookingPatterns(res, date, toggle, roomNo, bookingPatterns, roomRatios , teachRatios)
                 
            })
        });
       

    }
    bookingPatternsController.futureBookingPatterns = (req, res, next) => {
        for(i = 0; i < 52; i++){

            bookingPatterns()
        }
    }

    return bookingPatternsController;

}

/** ---------- Helper Functions ---------- */

function renderBookingPatterns(res, date, toggle, roomNo, bookingPatterns, roomRatios, teachRatios){

    res.render("bookingPatterns",{toggle: toggle, date: date, roomNo: roomNo, bookingPatterns: bookingPatterns, roomRatios: roomRatios, teachRatios: teachRatios} );
}


// Maps ages to the space required
function getRule(ageMonths){
    if(0 <= ageMonths && ageMonths < 24){
        return 3.5;
    }
    if(24 <= ageMonths && ageMonths < 36){
        return 2.5;
    }
    if(36 <= ageMonths && ageMonths < 60){
        return 2.3;
    }
}

// Maps ages to the number of teacher required for that age
function getWeight(ageMonths){
    if(0 <= ageMonths && ageMonths < 24){
        return (1/3);
    }
    if(24 <= ageMonths && ageMonths < 36){
        return (1/4);
    }
    if(36 <= ageMonths && ageMonths < 60){
        return (1/8);
    }
}


/*  
    
    Gets the remaining space for the room on that date
    Data is returned as a array size 10, 
    where 0 maps to addtional space for Mm (Monday Morning)
    and   9 maps to addtional space for Fa (Friday Afternoon)

    every increment of 1 maps to the next timeslot

    Negative values represent too many children for that sized room in that timeslot

*/ 

function getRoomRatio(results, roomSize, date){

    roomRatios = [roomSize, roomSize, roomSize, roomSize, roomSize, roomSize, roomSize, roomSize, roomSize, roomSize]
    

    date = new Date(date)
        for( i in results){
            var ageMonths = date.getMonth() - results[i].DoB.getMonth() + 12 * (date.getFullYear() - results[i].DoB.getFullYear());   
            if(results[i].Mm){ 
                roomRatios[0]-=getRule(ageMonths);
            }
            if(results[i].Ma){ 
                roomRatios[1]-=getRule(ageMonths);
            }
            if(results[i].Tm){ 
                roomRatios[2]-=getRule(ageMonths);
            }
            if(results[i].Ta){ 
                roomRatios[3]-=getRule(ageMonths);
            }
            if(results[i].Wm){ 
                roomRatios[4]-=getRule(ageMonths);
            }
            if(results[i].Wa){ 
                roomRatios[5]-=getRule(ageMonths);
            }
            if(results[i].Thm){
                roomRatios[6]-=getRule(ageMonths);
            }
            if(results[i].Tha){ 
                roomRatios[7]-=getRule(ageMonths);
            }
            if(results[i].Fm){ 
                roomRatios[8]-=getRule(ageMonths);
            }
            if(results[i].Fa){ 
                roomRatios[9]-=getRule(ageMonths);
            }
        }
        return roomRatios.map(x => x.toPrecision(3));

    }


/*

    The function returns a sum of the children in a room for a given timeslot
    Children are weighted such that weigh as much as one teacher can legally look after

    The algorithm for checking validity of 1 time slot: {
    
    Sum of teachers = T
    Sum students    = S

    for each child aged 0-2 -> S+=1/3
    for each child aged 2-3 -> S+=1/4
    for each child aged 3-5 -> S+=1/8

    if (T/S < 1) -> INVALID STATE
    if (T/S >=1) -> VALID STATE

    }

*/
function getWeightedSum(results, roomSize, date){
    weightedSum = [0,0,0,0,0,0,0,0,0,0]

    date = new Date(date)
    for( i in results){
        var ageMonths = date.getMonth() - results[i].DoB.getMonth() + 12 * (date.getFullYear() - results[i].DoB.getFullYear());   
        if(results[i].Mm){ 
            weightedSum[0] += getWeight(ageMonths)
        }
        if(results[i].Ma){ 
            weightedSum[1] += getWeight(ageMonths)
        }
        if(results[i].Tm){ 
            weightedSum[2] += getWeight(ageMonths)
        }
        if(results[i].Ta){ 
            weightedSum[3] += getWeight(ageMonths)
        }
        if(results[i].Wm){ 
            weightedSum[4] += getWeight(ageMonths)
        }
        if(results[i].Wa){ 
            weightedSum[5] += getWeight(ageMonths)
        }
        if(results[i].Thm){
            weightedSum[6] += getWeight(ageMonths)
        }
        if(results[i].Tha){ 
            weightedSum[7] += getWeight(ageMonths)
        }
        if(results[i].Fm){ 
            weightedSum[8] += getWeight(ageMonths)
        }
        if(results[i].Fa){ 
            weightedSum[9] += getWeight(ageMonths)
        }
    }

    return weightedSum.map(x => x.toPrecision(2));

}

/*

    Returns the number of teachers on that room for a given timeslot
    
    The results have already been filtered for date and room

*/

function getTeachSum(results){
    teachSum = [0,0,0,0,0,0,0,0,0,0]

    for( i in results){
        if(results[i].Mm){ 
            teachSum[0] += 1;
        }
        if(results[i].Ma){  
            teachSum[1] += 1;
        }
        if(results[i].Tm){  
            teachSum[2] += 1;
        }
        if(results[i].Ta){  
            teachSum[3] += 1;
        }
        if(results[i].Wm){  
            teachSum[4] += 1;
        }
        if(results[i].Wa){  
            teachSum[5] += 1;
        }
        if(results[i].Thm){ 
            teachSum[6] += 1;
        }
        if(results[i].Tha){  
            teachSum[7] += 1;
        }
        if(results[i].Fm){  
            teachSum[8] += 1;
        }
        if(results[i].Fa){  
            teachSum[9] += 1;
        }
    }

    return teachSum;
}
    

function getTeachRatios(sumTeachers, weightedSumStudents) {
    teachRatios = sumTeachers.map(function(n, i) { 
            ratio = n/weightedSumStudents[i];
            if(isNaN(ratio)){
                ratio = 0;
            }
        return ratio.toPrecision(2);
    });
    return teachRatios;

}

/** ---------- QUERIES ---------- */


/**
 * 
 * @param {*} connDB connection to the Database
 * @param {*} roomNo The room being queried from the databse, derives the student's individual start and end date
 * @param {*} date The date being checked
 * @param {*} callback callback function to be called after the asyn function .query() has returned a result
 
    Retunrs the booking patterns of the students for filling into the 

 */
async function getBookingPatternStudent(connDB, roomNo, date, callback){

    var upperDateCol;
    var lowerDateCol;

    if(roomNo == 3){
        upperDateCol = "roomThreeEnd"
        lowerDateCol = "roomTwoEnd"
        //roomThreeEnd > date > roomTwoEnd 
    }
    if(roomNo == 2){
        upperDateCol = "roomTwoEnd"
        lowerDateCol = "roomOneEnd"
        //roomTwoEnd > date > roomOneEnd
    }
    if(roomNo == 1){
        upperDateCol = "roomOneEnd"
        lowerDateCol = "startDate"
        //roomOneEnd > date > startDate
    }
    if(roomNo != 1 && roomNo != 2 && roomNo != 3){
        console.log("Invalid room!")
    }

    connDB.query(
        "SELECT Mm, Ma, Tm, Ta, Wm, Wa, Thm, Tha, Fm, Fa, \
        Name, DoB, startDate, roomOneEnd, roomTwoEnd, roomThreeEnd "+ lowerDateCol +", "+ upperDateCol +" \
        FROM BookingPattern_Students, Student \
        WHERE BookingPattern_Students.idStudent = Student.idStudent \
        AND Student.startDate < '"+ date +"'\
        AND Student."+upperDateCol+" >  '"+ date +"'\
        AND Student."+lowerDateCol+" <  '"+ date +"'\
        GROUP BY Student.idStudent",
        (error, results, fields) => {
            if(error) {
                console.log("error "+ error + "\n")
                //throw error;
            }
            
            callback(results)
        }
    );

    }


async function getBookingPatternTeacher(connDB, roomNo, date, callback){
    connDB.query("\
        SELECT *\
        FROM (\
            SELECT idTeacher, \
            MIN(endDate) AS 'endDate' \
            FROM BookingPattern_Teachers\
            WHERE DATE(endDate) > '"+date+"'\
            GROUP BY idTeacher\
            )tmp \
        JOIN BookingPattern_Teachers \
        ON BookingPattern_Teachers.idTeacher = tmp.idTeacher\
        JOIN Teacher \
        ON tmp.idTeacher = Teacher.idTeacher\
        WHERE tmp.endDate = BookingPattern_Teachers.endDate\
        ORDER BY Name ASC\
        ",
        (error, results, fields) => {
            if(error) {
                console.log("error "+ error + "\n")
                //throw error;
            }
            console.log(date)

            console.log(results)
            callback(results)
        }
    );

}



function getRoomSize(connDB, roomNo, callback){
    connDB.query("SELECT Size FROM Room WHERE idRoom = "+roomNo,
        (error, results, fields) => {
            if(error) {
                console.log("error "+ error + "\n")
                //throw error;
            }
            return callback(results[0].Size)
        }
    )   
}

function getRatiosPeriod(connDB, roomNo, roomSize, period){
    ratios = new Array(period)

    var dateJS = new Date()

    for(i=0; i<period; i++){
    
        dateJS.setDate(dateJS.getDate() + 365)
        var date = dateJS.toJSON().toString().slice(0, 10);
        console.log("BEFORE "+date)

        // get the booking pattern for the students for that week and room
        getBookingPatternStudent(connDB,i, roomNo, date, function(result){
            console.log("AFTER "+i)

            bookingPatternsStudents = result;

            getBookingPatternTeacher(connDB, roomNo, date, function(result){
                bookingPatternsTeachers = result;
                /*
                sumTeachers         = getTeachSum(bookingPatternsTeachers, roomSize, date);
                weightedSumStudents = getWeightedSum(bookingPatternsStudents, roomSize, date);
            
                roomRatios          = getRoomRatio(bookingPatternsStudents, roomSize, date);
                teachRatios         = getTeachRatios(sumTeachers, weightedSumStudents) 

                datum = {date: date, roomRatios: roomRatios , teachRatios: teachRatios}
                ratios[i] = datum;*/
            })
        });

    }
    console.log(ratios)

}
