const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const moment = require('moment');
// console.log('index>moment: ', moment('2020-04-01 11:46:38.339Z').format('DD MMMM YYYY, hh:mm a'));

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//For local db storage of session cookie so that sign in persists after restarting server
const MongoStore = require('connect-mongo')(session);

//sass middleware for scss
const sassMiddleware = require('node-sass-middleware');
//need to use sassMiddleware before the server starts

//connect-flash for flash messages after signup/signin etc
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))

app.use(express.urlencoded());

//To parse key value pairs in cookies
app.use(cookieParser());

// To use static files in our app
app.use(express.static('./assets'));

//To use common layouts
app.use(expressLayouts);

//extract styles and scripts from sub pages and use it on the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set ejs in view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//use session
//use mongo store (connect-mongo library) to store our session cookie in our db using our mongodb database to store it so that session persists even after the server restarts 
app.use(session({
    name: 'codeial',
    //TODO- change the secret before deployment in production mode
    secret: 'blahSomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection:db,
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb session cookie db storage successfully setup');
    })
}));

//use app
app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticatedUser);

//Use connect-flash after session 
app.use(flash());
app.use(customMiddleware.setFlash);

//use express router
app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if(err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`The server is up and running on port: ${port}`);
})


//errors encountered
//If no file found error then check current directory or check require modules

//Passport requires callback method - callback method should be outside the brackets '{}' as another arguement of the constructor

//Passport.use was not getting called. It was because I had given wrong name="" in input tag of email in the signin.ejs view. So it was not getting the value for the missing variable so it ws not calling the method. Fuck my life. I spent a whole day looking for the problem :(

//To compare two object ids with same reference in ejs first convert them to string using toString()

//Convert objectId taken from locals.user to string before comparing

//Getting error i not defined in case of partials. Use  <%- include("_post", {i:i}) %> for passing context to the partial

//syntaxerror missing catch or finally after try while compiling ejs - error in opening or closing bracket in if() in ejs file

//Get moment.js functionality by either copying the script.min.js and pasting it in assets as a separate file and importing it in home.ejs or using npm to install and use require to get its functionality and use it on bckend to format the date and send it to the front end. The second way is better

//Instead of using forms all the time use href and a tags for operations like delete

//Keep using hard refresh because your old code is cached and new changes arent reflected even in case of npm start

//When I create ajax for new post and add its html to the page via ajax I need to add its delete link to the other function which gives it the ajax calling on click by calling the deleteLink on the new post to allow the delete to listen to the newly added html

//So partial logging was being done. The functions that were called the logs in some of those were not being displayed. The problem was that somehow in the filter option post was written so only those logs were being displayed which had post in them. Spent 1 day scratching my head. Fuck my life

//multiple comments being added when a single submit was done. I had called allPostsToAjax function to add delete comment link into ajax. That way multiple listeners were allocated to a single submit button and hence multiple submissions and deletions were done because multiple times ajax was being called. Reverted to an older branch to figure out what was the issue. Lots of time and effort wasted.