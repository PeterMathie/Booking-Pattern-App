module.exports = (connDB, io) => {

    let bookingPatternsController = {}


    bookingPatternsController.bookingPatterns = (req, res, next) => {
        var fullUrl =new URL( req.protocol + '://' + req.get('host') + req.originalUrl );
        var searchURL = fullUrl.searchParams;
        var toggle = searchURL.get("toggle") == null ? "Student" : searchURL.get("toggle");
        var roomNo = searchURL.get("roomNo") == null ? "1" : searchURL.get("roomNo");
        var date = searchURL.get("date") == null ? new Date().toJSON() : searchURL.get("date");
        console.log(date)
        bookingsArray = []


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
                Name, startDate, roomOneEnd, roomTwoEnd, roomThreeEnd "+ lowerDateCol +", "+ upperDateCol +" \
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
                    console.log(results)
                    res.render("bookingPatterns",{toggle: toggle, roomNo: roomNo, bookingsArray: results} );

                });
    
        }
    

    return bookingPatternsController;
}

