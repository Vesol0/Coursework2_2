const nedb = require('gray-nedb');

/**
 * This class provides us a way to store course related data
 */
class Course{
    /**
     * Set up database
     * @param {*} db_filepath 
     */
    constructor(db_filepath){
        if(db_filepath) {
            this.db = new nedb({ filename: db_filepath, autoload: true}); 
            console.log('DB connected to ' + db_filepath); 
        }
        else{
            this.db = new nedb();
        }
    }

    init(){
        this.db.remove({},{multi: true}, function(err, docsRem) {
            if(err){
                console.log(err)
            }
            else{
               
                console.log(docsRem)
            }
        });
        
        this.db.insert({
            name: 'Dance',
            duration: '24',
            current: true,
            upcoming: false, 
        });
            //for later debugging
            console.log('db entry inserted');

            this.db.insert({
                name: 'Dance 2 ',
                duration: '23',
                current: true,
                upcoming: false,
            });

            this.db.insert({
                name: 'Upcoming Dance event ',
                duration: '23',
                current: false,
                upcoming: true,
            });
                //for later debugging
                console.log('db entry inserted');
    }

    /**
     * Provides use a way to get all the courses in the db.
     * @returns 
     */
    getAllCourses(){
        return new Promise((resolve, reject) =>{
            this.db.find({}, function(err, entries) {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(entries);
              
                    console.log('function all() returns: ', entries);
                }
            })
        })
    }

    /**
     * If we only want current courses we can do that by specifying to find where current is set to true
     * @returns 
     */

    getCurrentCourses(){
        return new Promise((resolve, reject) =>{
            this.db.find({'current': 'true'}, function(err, entries){
                if(err){
                    reject(err);
                    console.log("No current courses avaliable")

                }
                else{
                    resolve(entries)
                    console.log("current courses: ", entries);
                }
            })
        })
    }

    /**
     * Allows us to get upcoming courses where current is equal to false
     * @returns 
     */
    getUpcomingCourses(){
        return new Promise((resolve, reject) =>{
            this.db.find({'current': 'false'}, function(err, entries){
                if(err){
                    reject(err)
                    console.log("No upcoming courses")
                }
                else{
                    resolve(entries)
                    console.log("Upcoming Courses: ", entries)
                }

            })
        })
    }
    /**
     * This method allows us to get a course using the id this will only return one entity as ids are unique
     * @param {*} id 
     * @returns 
     */

    getCourseById(id){
        return new Promise((resolve, reject) =>{
            this.db.findOne({'_id': id}, function(err, course){
                if(err){
                    reject(err)
                    console.log("Couldn't find course")
                }
                else{
                    resolve(course)
                    console.log("course: ", course)
                }
            })
        })

    }


    getAllClassesByCourseid(courseId){
        return new Promise((resolve, reject) =>{
            this.db.findOne({_id: courseId}, (err, course)=>{
                if(err){
                    console.log('error finding course')
                    reject(err)
                }
                else if (!course){
                    console.log("no course found with id: ", courseId)
                    resolve([])
                }
                else{
                    console.log("classes for course", course, ":", course.classes)
                    resolve(course.classes || [])
                }
            })
        })
    }

    /**
     * We can add a course by calling this method which takes the name, duration, current
     * @param {*} name 
     * @param {*} duration 
     * @param {*} current 
     */
    addCourse(name, duration, current) {
        var entry = {
          name: name,
          duration: duration,
          classes: [],
          current: current
        };
        console.log("entry created", entry);
        this.db.insert(entry, function (err, doc) {
          if (err) {
            console.log("Error inserting course", name);
          } else {
            console.log("course inserted into the database", doc);
          }
        });
    }
/**
 * We can remove a course by passing through the course we want to remove (courseid)
 * @param {*} course_id 
 * @returns 
 */
    removeCourse(course_id) {
        return new Promise((resolve, reject )=>{
            this.db.remove({_id: course_id}, function(err, course){
                if(err){
                    reject(err)
                    console.log("Couldn't find course")
                }
                else{
                    resolve(course)
                    console.log("deleted course: ", course)
                }
            })
        })
    }


/**
 * This method provides us a way to edit a courses
 * @param {*} name 
 * @param {*} duration 
 * @param {*} current 
 * @param {*} courseid 
 */
    editCourse(name, duration, current, courseid ){
        this.db.update({_id: courseid},{$set:{
            name: name,
            duration: duration,
            current: current

        }}, {}, function(err, numReplaced){
            if(err){
                console.log("update error", err)
            }
        })
    }

    
}

module.exports = Course; //export course

