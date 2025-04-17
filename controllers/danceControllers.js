
//import required models
const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const db = new courseModel("./databases/courses.db");
const courseBookings = require('../models/courseEnrollmentModel')
const classbookings = require('../models/classBookingsModel')
const classModel = require('../models/classModel')

//render landing page
exports.show_landing_page = function(req, res){
    res.render("landingpage")
}
//register page 
exports.show_register_page = function(req, res) {
    res.render("user/register");
} 
//about page
exports.show_about_page = function(req, res){
    res.render("about", {
        title: 'About Us'
    })
}
//post new user
exports.post_new_user = function(req, res) {
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const user = req.body.email;
    const password = req.body.pass;
    //recieve data passed from the form
    

    if(!user || !password){ // if there is no email or passoword 
        res.send(401, 'no email or no password'); //send 401 error 
        return;
    }
    userModel.lookup(user, function(err, u){
        if(u){
            res.send(401, "user exists: ", user); //if user exists (email) return 401
            return;
        }
        userModel.create(firstname, lastname, user, password) //create user if no error
        console.log("register user", user, "password ", password); 
        res.redirect("/login"); //redirect to login

    });

}

// login functionality 

exports.show_login_page = function(req, res) {
    res.render("user/login");
}; 

//middleware

exports.login = function (req, res, next) {
    next() 
}

//handle 
exports.handle_login = function (req, res){
    req.render("/", {
        user: "user"
    })
}
//handle logout
exports.logout = function(req, res){
    res
        .clearCookie("jwt") //clear cookies
        .status(200)
        .redirect("/")
}

//courses page

exports.show_courses_page = function (req, res) {
    Promise.all([ // array of promises
        db.getAllCourses(),
        db.getCurrentCourses(),
        db.getUpcomingCourses(),
      ]).then(([course, currentcourse, upcomingcourse]) => {
        res.render("guest/course/courses", { // render courses 
          title: "Courses",
          upcomingcourse: upcomingcourse, // add an upcomingcourse object
          currentcourse: currentcourse, // add a current course objects
        });
      });
  };


// functionality for view course when user clicks on view a course in the courses page 

exports.show_view_course = function(req, res){
    console.log("filtering author name", req.params.id);
    let courseid = req.params.id; //get course id from the url param
    db.getCourseById(courseid).then((entries) => { //get coursebyid then send it to entries
        res.render('guest/course/viewcourse', { //render page
            'title': 'View Course',
            'entries' : entries
        });
    }).catch((err)=>{ //error handling
        console.log("error handling course", err)
    });
}

// shows join course page form where the guest makes a form

exports.show_join_course = function(req, res){
    console.log("filtering course id", req.params.id);
    let courseid = req.params.id; //get course id

    db.getCourseById(courseid).then((entries)=>{ //get courese by id
        res.render('guest/course/functionality/joincourse', { //render join course and pass through a course (entries)
            'title': 'Join Course',  
            'entries': entries
        })
    })
}

// functionality for adding registrating a user to a course

exports.post_join_course = function(req, res){
    let courseid = req.params.id // get course id
    if (!req.body.email) { // if req doesnt have an email 
        response.status(400).send("Entries must have a name"); //send 400
        return;
      }
      courseBookings.addUserToCourse(req.body.firstname, req.body.lastname, req.body.email, req.body.mobilenumber, courseid); // make a new course booking
      res.redirect("/courses");
}

// new course page for admin
  exports.show_new_course_entry = function (req, res) {
    res.render("admin/newcourse", {
      title: "Add new Course", //render page
    });
  };



 // orgnaiser functionality for posting a new course
  exports.post_new_course = function (req, res) {
    console.log("processing post-new_coursecontroller");
    if (!req.body.name) { //if req doesn't have a name send 400 status
      response.status(400).send("Entries must have a name");
      return;
    }
    db.addCourse(req.body.name, req.body.duration, req.body.current); // add course to course database
    res.redirect("/dashboard"); //redirect to dashboard
  };


  // show dashboard with list of courses

  exports.show_dashboard = function(req, res){
    db.getAllCourses().then((list) =>{
        res.render("admin/dashboard", {
            title: "Guest book",
            course: list, // populate courses with get all courses method
        });
        console.log("promise resolved") 
    }).catch((err)=>{
        console.log("promised rejected", err)
    })
  }
 
  // page for viewing details about the class
  exports.show_view_class_details = function (req, res){
    let courseid = req.params.id
    Promise.all([classModel.getClassesByCourseId(courseid), db.getCourseById(courseid)]).then(([list, course])=>{ // resolve an array of promises
        res.render("admin/manageclasses/classdetails",{
            title: 'Manage Classes',
            class: list, //populate classes with the result from getclassesbycourseid
            course: course //populate course with the result from get course by id 
        })
    })

}
    // shows the form for adding a new class
    exports.show_add_new_class = function(req, res){
        let courseid = req.params.id // get course id
        db.getCourseById(courseid).then((list)=>{ // get course by ids
            res.render("admin/manageclasses/newclass",{
                title: 'Add Class',
                course: list // send course to template
            })
        })
            
    }
    //post method for adding a new class
    exports.post_add_new_class = function(req, res){
        let course_id = req.params.id // course id 
        console.log("processing post_add_new_class controller");
        if (!req.body.name) { // check if there is no name
            response.status(400).send("Entries must have a name"); // send error
        return;
        }
        classModel.addClass(req.body.name, req.body.price, req.body.description, req.body.location, req.body.datetime, course_id); //add class
        res.redirect("/dashboard") //return to dashboard
    }

    //remove a class from a courses

    exports.remove_class_from_course = function(req,res){
        const course_id = req.params.courseid //get courseid
        const class_id = req.params.classid //get class id 
        classModel.removeClass(class_id, course_id).then(success =>{ // execute removeclass if success then
            if(success){
                console.log("class removed:",)
                res.redirect("/dashboard")
            }
            else{
                console.log("no class removed")
            }
        }).catch(err =>{
            console.log("error: ", err)
        })
    }

    // guest show classes 

    exports.guest_show_classes = function(req, res){
        let courseid = req.params.id
        classModel.getClassesByCourseId(courseid).then((list)=>{ // get classes by course id
            res.render('guest/course/classes/viewclasses', {
                title: 'Classes',
                class: list //send class list to template
            })
        })
    }

    exports.show_join_class = function(req, res){
        let classid = req.params.classid // class id
        let courseid = req.params.courseid // course id
 
        console.log(classid, " ", courseid)

        classModel.getClass(classid, courseid).then(foundClass =>{ //get class 
            res.render('guest/course/classes/functionality/bookclass',{
                title: 'Join Course',
                class: foundClass //send class to template
            })
        })

    }

    // removes a course
    exports.show_remove_course = function(req, res){
        let course_id  = req.params.id  // set courseid
        
        db.removeCourse(course_id) // run removecourse methods
        .then(() => {
            console.log("Course removed:", course_id);  
            res.redirect("/dashboard"); //redirect on completion 
        })
        .catch(err => {
            console.error("Error removing course:", err);
            res.status(500).send("Error removing course"); //show error if found
        });
    }

    // functionality for booking a class

    exports.post_book_class = function(req, res){
    let classid = req.params.classid // class id variable
        if (!req.body.email) { //check if the form had an emal
        response.status(400).send("Entries must have a email"); // display error if not.
        return;
      }
      classbookings.addBooking(classid, req.body.firstname, req.body.lastname, req.body.email, req.body.mobilenumber); //add booking
      res.redirect("/courses"); //redirect to home
    }
    // fucnctionality for getting the participants of a class only for the organisers s
    exports.show_class_particpants = function(req, res){
        classbookings.getAllBookingFromId(req.params.classid).then((participants)=>{ //get all the participants from the class id then
            res.render('admin/manageclasses/viewallparticipants', {
                title: 'Class Participants', //render and populate template with participants
                participant: participants
            })
        })
    }

    //shows update class details
    exports.show_update_class_details = function(req, res){
        classModel.getClass(req.params.classid, req.params.courseid).then((foundClass)=>{  // get class by class_id and courseid 
            res.render('admin/manageclasses/updatedetails', { //render page 
                title: 'Update Class Details',
                class : foundClass
            })
        })
    }
    
    // post method functionality for updating class details
    exports.post_update_class_details = function(req, res){
        let course_id = req.params.courseid // get ids
        let class_id = req.params.classid 
        console.log("processing post_add_new_class controller");
        if (!req.body.name) { //check if request has a names
            response.status(400).send("Entries must have a name");
        return;
        }

        classModel.updateClass(req.body.name, req.body.description, req.body.price, req.body.location, req.body.datetime, course_id, class_id) // update class based on the request
        
        res.redirect("/dashboard")

        
    }

    //show organisers details 
    exports.show_organisers_details = function(req, res){
        userModel.getAllOrganiserUsers().then((organiser)=>{ // get any user with organiser set to true
            res.render('admin/manageorganisers/vieworganisers', {
                title: 'Manage Organisers',
                organiser: organiser, //populate template
            })
        })
    }

    //functionality for removing an organiser
    exports.remove_orgnaiser = function(req, res){
        organiserid = req.params.id; //get id
        userModel.removeOrganiser(organiserid).then(success =>{ // remove, if success 
            if(success){
                console.log("orgnaiser removed:")
                res.redirect("/dashboard/manageorganiser")
               
            }
            else{
                console.log("no organiser removed") // log error
            }
        }).catch(err =>{
            console.log("error: ", err) 
        })
    }

    
    // renders a page of users

    exports.organisers_show_users = function(req, res){
        userid = req.params.id //get user id
        userModel.getAllNonOrganiserUsers().then((user)=>{ // anyone that is not an organiser (organiser: false)
            res.render('admin/manageusers/viewusers', {
                title: 'All Users',
                users: user
            })
        })

    }

       //functionality for giving users adminstritive rights 

       // this method will update the user data and change organiser to true
    exports.addOrganiserAccess = function(req, res){
        userid = req.params.id // get user id 

        userModel.addOrganiser(userid).then((success)=>{
            if(success){
                console.log("organiser added")
                res.redirect('/dashboard/manageusers');
            }
            else{
                console.log("No organiser added")
            }
        })
    }

    // delete normal user (non organiser)

    exports.deleteNormalUser = function(req, res){
        userid = req.params.id //get user id

        userModel.removeUser2(userid).then((success)=>{ // execute delete method
            if(success){
                console.log("removed regular user: ")
                res.redirect("/dashboard/manageusers")
            }
            else{
                console.log("didn't removed")
            }
        })
    }

