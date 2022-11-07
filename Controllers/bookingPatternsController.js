module.exports = (connDB, io) => {

    let bookingPatternsController = {}


    bookingPatternsController.bookingPatterns = (req, res, next) => {
        var fullUrl =new URL( req.protocol + '://' + req.get('host') + req.originalUrl );
        var searchURL = fullUrl.searchParams;

        var toggle = searchURL.get("toggle") == null ? "Student" : searchURL.get("toggle");
        var roomNo = searchURL.get("roomNo") == null ? "1" : searchURL.get("roomNo");
        var date = searchURL.get("date") == null ? new Date().toJSON().toString().slice(0, 10) : searchURL.get("date");
        
        
        var roomSize;
        getRoomSize(connDB, roomNo, function(result){
            roomSize = result;
        });
        var roomRatios;
        var bookingPatterns;
        getBookingPattern(connDB, toggle, roomNo, date, function(result){
            bookingPatterns = result
            roomRatio = getRoomRatio(bookingPatterns, roomSize, date)
            res.render("bookingPatterns",{toggle: toggle, roomNo: roomNo, bookingsArray: bookingPatterns, roomRatios: roomRatios} );

        });


    }
    return bookingPatternsController;

}

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

        return roomRatios.map(x => x.toPrecision(4));

    }



    function getTeachRatio(results, countTeach, date){
        var defaultValue = {sumTeachers:0, weightedSumStudents:0};
        var teachRatios = [];
        for(i in 10){
            teachRatios.push(defaultValues)
        }
        
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
    
            return roomRatios.map(x => x.toPrecision(4));
    
        }


function getBookingPattern(connDB, toggle, roomNo, date, callback){
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
        res.render("bookingPatterns",{toggle: toggle, roomNo: roomNo, bookingsArray: bookingsArray} );
    }

    connDB.query(
        "SELECT Mm, Ma, Tm, Ta, Wm, Wa, Thm, Tha, Fm, Fa, \
        Name, DoB, startDate, roomOneEnd, roomTwoEnd, roomThreeEnd "+ lowerDateCol +", "+ upperDateCol +" \
        FROM BookingPattern_"+ toggle +"s, Student \
        WHERE BookingPattern_"+ toggle +"s.idStudent = Student.idStudent \
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