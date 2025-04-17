/**
 * this class is responsible for classbookings
 */

const Datastore = require('gray-nedb'); // import db
class ClassBooking {
    constructor(db_file_path){ //constructor 
        if(db_file_path){
            this.db = new Datastore({filename: db_file_path, autoload: true}); // we'll save the the db if there is a filepath provided
        }
        else{ 
            this.db = new Datastore(); // in memory
        }
    }

    /**
     * Add booking allows users to add a booking
     * @param {*} classid 
     * @param {*} firstname 
     * @param {*} lastname 
     * @param {*} email 
     * @param {*} phonenumber 
     */
    addBooking(classid, firstname, lastname, email, phonenumber){
        var entry = {classid: classid, firstname: firstname, lastname: lastname, email: email, phonenumber: phonenumber} // create an entry

        this.db.insert(entry, function(err, doc){ // insert entry into db
            if(err){
                console.log("Error inserting: ", firstname, "into ", classid)
            }
            else{
                console.log("Inserted ", firstname, " into ", classid)
            }
        })
    }

    /**
     * This method gets all the bookings based on the class is
     * @param {*} class_id 
     * @returns 
     */

    getAllBookingFromId(class_id){
        return new Promise((resolve, reject)=>{ // new promise
            this.db.find({'classid': class_id}, function(err, entries){ //find records that match class_id
                if(err){
                    reject(err);
                    console.log("Error getting bookings from: ", class_id ) //show error
                }
                else{
                    resolve(entries)
                    console.log(entries)
                }
            })
        })
    }

}

const classBooking = new ClassBooking("databases/classbookings.db");  //create db
module.exports = classBooking //export module