const mongoose = require('mongoose');
const env = require('../config/environment');

mongoose.connect(`mongodb://localhost/${env.db_name}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

db.once('open', function(){
    console.log('successfully connected to database :: MongoDB');
})

module.exports = db;