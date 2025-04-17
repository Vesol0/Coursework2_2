const nedb = require('gray-nedb');
/**
 * This class provides us the ability to store class related data
 */
class ClassModel{
    constructor(db_filepath){ //constructor
        if(db_filepath) {
            this.db = new nedb({ filename: db_filepath, autoload: true}); //save db to locations
            console.log('DB connected to ' + db_filepath);
        }
        else{
            this.db = new nedb(); // memory db
        }
    }
    /**
     * Add class allows us to add a class 
     * @param {*} name 
     * @param {*} description 
     * @param {*} price 
     * @param {*} location 
     * @param {*} datetime 
     * @param {*} courseid 
     */
    addClass(name, description, price, location, datetime, courseid){
        var entry = {name: name, description: description, price: price, location: location, date: datetime.split("T")[0], time: datetime.split("T")[1], courseid} // split the time and date so we can store them as seperate fields

        this.db.insert(entry, function(err, doc){ //insert into db
            if(err){
                console.log("Error inserting", name, "to class")
            }
            else{
                console.log("class inserted into the database", doc)
            }
        })

    }
    /**
     * This function will return all the classes by courseid
     * @param {*} courseid 
     * @returns 
     */
    getClassesByCourseId(courseid){
        return new Promise((resolve, reject) =>{
            this.db.find({'courseid': courseid}, function(err, entries){ // search for records that match courseids
                if(err){
                    reject(err);
                    console.log("No classes avaliable")

                }
                else{
                    resolve(entries)
                    console.log("class: ", entries);
                }
            })
        })
    }
/**
 * Get class method will allow us to retrieve a class based on two params (classid and courseid)
 * @param {*} classid 
 * @param {*} courseid 
 * @returns 
 */
    getClass(classid, courseid){
        return new Promise((resolve, reject)=>{ 
            this.db.find({courseid: courseid, _id: classid}, function(err, doc){ // find class that match both courseid and classid
                if(err){
                    reject(err);
                    console.log("can't find class", err)
                }
                else{
                    resolve(doc);
                    console.log("Class", doc)
                }
            })
        })
    }

    /**
     * This function allows us to remove a class using classid and courseid
     * @param {*} classid 
     * @param {*} courseid 
     * @returns 
     */
    removeClass(classid, courseid){
        return new Promise((resolve, reject)=>{
            this.db.remove({courseid: courseid, _id: classid}, function(err, doc){ //remove record courseid and class id matches
                if(err){
                    reject(err)
                    console.log("couldn't delete class")
                }
                else{
                    resolve(doc)
                    console.log("Class deleted: ", doc)  
                }
            })
        })
    }
    /**
     * This allows us to update a class
     * @param {*} name 
     * @param {*} description 
     * @param {*} price 
     * @param {*} location 
     * @param {*} datetime 
     * @param {*} courseid 
     * @param {*} class_id 
     */
    updateClass(name, description, price, location, datetime, courseid, class_id){
        var entry = {name: name, description: description, price: price, location: location, date: datetime.split("T")[0], time: datetime.split("T")[1], courseid}
        this.db.update({_id: class_id}, {$set: entry}, {}, function(err, numReplaced){ //update where class id matches class id, replace with entry
            if(err){
                console.log("error updating classes", err)
            }
            else{
                console.log("Updated class")
            }
        })

    }

    
}

const classModel = new ClassModel("databases/class.db");  // create dbs
module.exports = classModel //export module