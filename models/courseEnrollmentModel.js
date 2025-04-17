/**
 * This class provides the functionality for users enrolling in courses
 */
const Datastore = require('gray-nedb');
class CourseEnrollment {
    constructor(db_file_path){ 
        if(db_file_path){
            this.db = new Datastore({filename: db_file_path, autoload: true}); //save to location
        }
        else{ 
            this.db = new Datastore(); // in memory
        }
    }

    /**
     * add user to courses
     * @param {*} firstname 
     * @param {*} lastname 
     * @param {*} email 
     * @param {*} telephone 
     * @param {*} course_id 
     */
    addUserToCourse(firstname, lastname, email, telephone, course_id){
        var entry = {firstname : firstname, lastname: lastname, email: email, telephone: telephone, courseid: course_id};
        this.db.insert(entry, function (err, doc) {
            if (err) {
              console.log("Error inserting", firstname, "to course");
            } else {
              console.log("course inserted into the database", doc);
            }
        });
        
    }
}

const courseEnrollment = new CourseEnrollment("databases/coursebookings.db");  //createdb
module.exports = courseEnrollment //export enrollment
    