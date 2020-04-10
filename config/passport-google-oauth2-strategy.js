const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

console.log('google-oauth2-strategy loaded');


//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: '198457081810-vts6146cjldkc9u95d5qu4c8j2e4tfds.apps.googleusercontent.com',
    clientSecret: 'cz18Hs3dNe15YJygZlWkAuo0',
    callbackURL: 'http://localhost:8000/users/auth/google/callback',
    },

    function(accessToken, refreshToken, profile, done){

        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log(`error in google-oauth2-strategy: ${err}`);  return; }

            console.log(`profile in googleoauth-`);
            console.log(profile);
            console.log('refreshtoken');
            console.log(refreshToken);
            console.log('accessToken');
            console.log(accessToken);

            if(user){ 
                //If found set this user as req.user
                return done(null, user); 
            }
            else{  
                //If not found then create this user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex') 
                }, function(err, user){
                    if(err) {console.log(`error in creating new user in google-oauth2-strategy: ${err}`);  return;}

                    else return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;