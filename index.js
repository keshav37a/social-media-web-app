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
app.use(session({
    name: 'codeial',
    //TODO- change the secret before deployment in production mode
    secret: 'blahSomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    }
}));

//use app
app.use(passport.initialize());
app.use(passport.session());

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
