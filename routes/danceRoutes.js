const express = require("express");
const router = express.Router();
const controller = require("../controllers/danceControllers.js");
const {login} = require('../auth/auth');
const {verify} = require('../auth/auth');


//landing page

router.get("/", controller.show_landing_page);

//register routes
router.get("/register", controller.show_register_page); 
router.post("/register", controller.post_new_user); 

//login routes 

router.get("/login", controller.show_login_page); 
router.post("/login", login , controller.handle_login)

//logout

router.get("/logout", verify, controller.logout)

//show about page
router.get("/about", controller.show_about_page)

//organizers add course
router.get("/dashboard/course/addcourse", verify, controller.show_new_course_entry);
// post route for add a courses
router.post("/dashboard/course/addcourse", verify,  controller.post_new_course);


// courses page 

router.get("/courses", controller.show_courses_page)

// view course specificially 

router.get("/viewcourse/:id", controller.show_view_course);

// show join course page form

router.get("/joincourse/:id", controller.show_join_course)
router.post("/joincourse/:id", controller.post_join_course);

// dashboard for logged in uses (organisers)

router.get("/dashboard", verify, controller.show_dashboard)


// manage classes for courses based on id 

router.get("/dashboard/course/:id/manageclass",verify,  controller.show_view_class_details)

// show the page for organizers to add classes for courses 

router.get("/dashboard/course/:id/manageclass/addclass", verify,  controller.show_add_new_class)
router.post("/dashboard/course/:id/manageclass/addclass", verify, controller.post_add_new_class)

//remove class 

router.get("/dashboard/course/:courseid/manageclass/:classid/removeclass/",verify, controller.remove_class_from_course)

//remove course 

router.get("/dashboard/course/:id/remove", verify, controller.show_remove_course)


// for guests show the classes once they clicked on view classes for a course

router.get("/viewclasses/:id", controller.guest_show_classes)

// join class

router.get("/course/:courseid/bookclass/:classid", controller.show_join_class)
router.post("/course/:courseid/bookclass/:classid", controller.post_book_class)

// show the page for organizers

router.get("/dashboard/course/:courseid/manageclass/:classid/showparticipants",verify, controller.show_class_particpants)

// update class details for organisers

router.get("/dashboard/course/:courseid/manageclass/:classid/updateclass",verify, controller.show_update_class_details)
router.post("/dashboard/course/:courseid/manageclass/:classid/updateclass",verify, controller.post_update_class_details)


// show manage organiser page 

router.get('/dashboard/manageorganiser/', verify, controller.show_organisers_details)
router.get('/dashboard/manageorganiser/remove/:id', verify, controller.remove_orgnaiser)

// route for adding organiseraccess to users

router.get('/dashboard/manageuser/:id/add', verify, controller.addOrganiserAccess)

//route delete  normal users without organiser priv

router.get('/dashboard/manageuser/:id/remove', verify, controller.deleteNormalUser )

// route for showing organiers managing regular users 

router.get('/dashboard/manageusers', verify, controller.organisers_show_users)





router.use(function (req, res) {
    res.status(404);
    res.type("text/plain");
    res.send("404 Not found.");
  });
router.use(function (err, req, res, next) {
  res.status(500);
  res.type("text/plain");
  res.send("Internal Server Error.");
});
module.exports = router;
