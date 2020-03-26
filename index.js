const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');

//To parse key value pairs in cookies
app.use(cookieParser());

// To use static files in our app
app.use(express.static('./assets'));

//To use common layouts
app.use(expressLayouts);

//use express router
app.use('/', require('./routes/index'));

//extract styles and scripts from sub pages and use it on the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set ejs in view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`The server is up and running on port: ${port}`);
})

//If no file found error then check current directory or check require modules