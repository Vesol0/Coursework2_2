
const express = require('express'); //setup express
const app = express(); 
require('dotenv').config() // require dotenv
const cookieParser = require('cookie-parser') // setup cookieparser
const bodyParser = require('body-parser'); // body parser
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false})); 

const path = require('path'); //setup path 
const public = path.join(__dirname,'public'); // setup public folder
app.use(express.static(public)); //setup static folder
const mustache = require('mustache-express') // require mustache
app.engine('mustache', mustache()) //setup mustaches
app.set('view engine', 'mustache')

const router = require('./routes/danceRoutes') //setup router
app.use('/', router);  

app.listen(3000, () => {
console.log('Server started on port 3000. Ctrl^c to quit.');
})