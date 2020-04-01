const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');


//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//For local db storage of session cookie so that sign in persists after restarting server
const MongoStore = require('connect-mongo')(session);

//sass middleware for scss
const sassMiddleware = require('node-sass-middleware');
//need to use sassMiddleware before the server starts

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