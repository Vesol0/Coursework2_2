const bcrypt = require('bcrypt');
const userModel = require('../models/userModel'); 

const jwt = require('jsonwebtoken')

exports.login = function(req, res, next){
    let email = req.body.email;
    let password = req.body.password

    userModel.lookup(email, function(err, user){
        if(err){
            console.log("error looking up user", err);
            return res.status(401).send()
        }

        if(!user){
            console.log("user ", email, " not found")
            return res.status(401).send();
        }
        if(user.organiser === false){
            console.log("user", user, " does not have the organiser access")
            return res.status(401).send();
        }
        bcrypt.compare(password, user.password, function(err, result){
            if(result){
                let payload = { email: user.email };
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
                res.cookie("jwt", accessToken)
                next()
            }
            else{
                return res.status(403).send();
            }
            
        })
    })
}
//verify token
exports.verify = function(req, res, next){
    let accessToken = req.cookies.jwt; //access token is equal to cookies.jwt
    if(!accessToken){
        return res.status(403).send(); //if there is no access token send 403

    }
    let payload; 
    try{
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); //set payload 
        next();
    }
    catch(e){
        res.status(401).send();
    }
}