const express = require('express');
const port = 8000;
const app = express();

//use express router
app.use('/', require('./routes/index'));

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