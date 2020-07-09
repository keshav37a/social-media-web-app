const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),     //extract token from header
    secretOrKey: env.jwt_secret   //Encryption/Decryption string
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done){
    User.findById(jwtPayload._id, function(err, user){
        if(err){console.log(`Error in finding user: during passport-jwt-auth: ${err}`)}

        if(user){
            console.log(`User authorised: during passport-jwt-auth: ${err}`)
            return done(null, user);
        }
        else{
            console.log(`User not found: during passport-jwt-auth`);
            return done(null, false);
        }

    });
}))


module.exports = passport;