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

function getRoomEnd(DoB,ageMonths){
    var endDate = new Date(DoB);
    console.log(endDate)
    if     (ageMonths < 24){endDate.setDate(endDate.getDate() + 365*2);}
    else if(ageMonths < 36){endDate.setDate(endDate.getDate() + 365*3);}
    else if(ageMonths < 60){endDate.setDate(endDate.getDate() + 365*5);}

    return endDate;
}

function getEndDate(DoB){
    var end = new Date(DoB);

    end.setDate(end.getDate() + 365*5);
    return end;
}





/*
  Adds students to the database
*/

var date = new Date()
var DoB = randomDate(new Date(date.setFullYear(date.getFullYear()-5)), new Date());
var ageMonths = getAgeMonths(DoB, new Date());
var roomStart = randomDate(new Date() ,new Date(2023, 5, 1));
var roomEnd = getRoomEnd(DoB, ageMonths);
var end = getEndDate(DoB);
var room = getRoom(DoB, roomStart);

/*console.log("Age:      "+ageMonths+"\
        \nDoB:      "+ DoB +"\
        \nRoom:     "+ room +"\
        \nRoom Str: "+ roomStart +"\
        \nRoom End: "+ roomEnd +"\
        \nEnd:      "+ end);
*/
if(room==undefined){
    throw {error : "Child too old."}; 
}
connectionDB.query(
    'INSERT INTO Student(Name, DoB, ageMonths, idRoom, RoomStart, RoomEnd, End) VALUES(?,?,?,?,?,?,?)',
    [makeid(5), DoB, ageMonths, room, roomStart, roomEnd, end],
    (error, results, fields) => {
    if (error) {
        throw error;
    }
    console.log("\nNew Student row added\n");
});
