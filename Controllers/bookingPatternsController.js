module.exports = (connDB, io) => {

    let bookingPatternsController = {}


    bookingPatternsController.bookingPatterns = (req, res, next) => {
        var roomNo = 3

        var fullUrl =new URL( req.protocol + '://' + req.get('host') + req.originalUrl );
        var searchURL = fullUrl.searchParams;
        var toggle = searchURL.get("toggle") == null ? "Student" : searchURL.get("toggle");
        var roomNo = searchURL.get("roomNo") == null ? "1" : searchURL.get("roomNo");
        connDB.query(
                "SELECT \
                id"+ toggle +", Mm, Ma, Tm, Ta, Wm, Wa, Thm, Tha, Fm, Fa \
                FROM BookingPattern_"+ toggle +"s_"+ roomNo +"\
                ORDER BY id"+ toggle,
                (error, results, fields) => {
                    if(error) {
                        console.log("error "+ error + "\n")
                        //throw error;
                    }
                   
                    res.render("bookingPatterns",{toggle: toggle, roomNo: roomNo, bookingsArray: results} );

                });
    
        }
    
        return bookingPatternsController;
    }