
module.exports = (connDB, io) => {

let studentController = {}

    studentController.students = (req, res, next) => {
        res.render("students", { title: "Profile", userProfile: { nickname: "Auth0" } });
    }

    return studentController;
}