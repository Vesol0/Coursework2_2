const Datastore = require('gray-nedb');
const bcrypt = require('bcrypt');
const e = require('express');
const saltrounds = 10; //set saltrounds
/**
 * This class provides us a way to store users & organisers
 * This application is setup to have "users await recieving organiser role before they can do anything outside a guest."
 */

class UserDAO {
    /**
     * setup db
     * 
     * @param {} db_file_path 
     */
    constructor(db_file_path){
        if(db_file_path){
            this.db = new Datastore({filename: db_file_path, autoload: true});
        }
        else{ 
            this.db = new Datastore(); // in memory
        }
    }

    /**
     * This method creates a user by getting there first and last name, email and password
     * @param {*} first_name 
     * @param {*} last_name 
     * @param {*} email_address 
     * @param {*} password 
     */

    create(first_name, last_name, email_address, password) {
        const that = this;
        
        bcrypt.hash(password, saltrounds).then((hash) =>{  // use bcrypt has function to has the password
            var entry = {firstname : first_name, lastname: last_name, email: email_address, password: hash, organiser: false}; //store the newly hashed password as password
            that.db.insert(entry, function(err){ // insert record
                if(err){
                    console.log("Can't insert user: ", email);
                }
            })
        })
    }
    /**
     * `We can look up a user by providing a user and a callback
     * @param {*} user 
     * @param {*} cb 
     */

    lookup(user, cb) {
        this.db.find({'email':user}, (err, entries)=>{
            if(err) { //check if email exists
                return  cb(null, null);
            }
            else{
                if(entries.length == 0){
                    return cb(null, null);
                }
            }
            return cb(null, entries[0]); //return entries
        })
    }

    /**
     * This methods returns all the users in the db including organiser
     * @returns 
     */
    getAllusers(){
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
     * This method removes any user including orgnaiserss
     * @param {*} userid 
     * @returns 
     */
    removeUser(userid){
        return new Promise((resolve, reject)=>{
            this.db.remove({'_id': userid}, function(err, doc){
                if(err){
                    reject(err);
                    console.log("error")
                }
                else{
                    resolve(doc)
                    console.log("removed", doc)
                }
            })
        })

    }
    /**
     * This method adds an organiser by using the userid, it will replace the user field organiser and set it true
     * @param {*} userid 
     * @returns 
     */

    addOrganiser(userid){
        return new Promise((resolve, reject)=>{
            this.db.update({'_id': userid}, {$set: {organiser: true}}, {}, function(err, doc){
                if(err){
                    console.log("Error setting organiser")
                    reject(err);
                }
                else{
                    console.log("user updated, organiser set to true")
                    resolve(doc)
                }
            })
        })
    }

    
    removeUser2(userid){
        return new Promise((resolve, reject)=>{
            this.db.findOne({_id: userid}, (err, doc)=>{
                if(err){
                    console.log("error finding user", err)
                    return reject(err);
                }
                if(!doc){
                    console.log("User not found")
                    return reject(err)
                }
                if(doc.organiser === true) {
                    console.log("Cannot delete organiser user")
                    return reject(err)
                }

                this.db.remove({_id: userid}, {}, (err, numremoved) =>{
                    if(err){
                        console.log("error removing user:", err)
                        return reject(err)
                    }
                    console.log("User removed", numremoved)
                    resolve(numremoved)
                })
            })
        })
    }
    /**
     * This method will return all the non organisers based on if the organiser is set to false in the dbs
     * @returns 
     */

    getAllNonOrganiserUsers(){
        return new Promise((resolve, reject) =>{
            this.db.find({'organiser': false}, function(err, entries) {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(entries);
              
                    console.log('returns: ', entries);
                }
            })
        })
    }

    /**
     * This method gets all the organisers if the organiser is set to true
     * @returns 
     */
    getAllOrganiserUsers(){
        return new Promise((resolve, reject) =>{
            this.db.find({'organiser': true}, function(err, entries) {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(entries);
              
                    console.log('get all organisers returns: ', entries);
                }
            })
        })
    }
    /**
     * This will check if the a user is an organiser 
     * @param {*} userid 
     * @returns 
     */

    checkIfOrganiser(userid){
        return new Promise((resolve, reject)=>{
            this.db.find({'_id':userid, 'organiser': true}, function(err, success){
                if(err){
                    reject(err)
                    console.log('user is not an organiser')
                }
                else{
                    resolve(success)
                    console.log("user is an organiser")
                }
            })
        })
    }
    /**
     * This method removes an organiser
     * @param {*} userid 
     * @returns 
     */
    removeOrganiser(userid){
        return new Promise((resolve, reject)=>{
            this.db.update({'_id': userid, 'organiser': true},{$set:{
                organiser: false
            }}, {}, function(err, doc){
                if(err){
                    console.log('error removing organiser', err)
                    reject(err)
                }
                else{
                    console.log("removed:", doc)
                    resolve(doc);
                }
            })
        })
    }
}

const dao = new UserDAO("databases/users.db");  //store db
module.exports = dao; //export module
    

