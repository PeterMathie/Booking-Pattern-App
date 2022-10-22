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

/*
  Adds teachers to the database
*/
connectionDB.query(
    'INSERT INTO Teacher(Name, Level) VALUES(?,?)',
    [makeid(5), randomInt(0,5)],
    (error, results, fields) => {
    if (error) {
        throw error;
    }
    console.log("\nNew Teacher row added \n");
});


