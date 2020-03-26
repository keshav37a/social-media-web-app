const db = require('../config/mongoose');
//import our model class for db operations
const User = require('../models/user');

// For rendering User Profile
module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'UserName Profile'
    });
}

// For rendering User Settings
module.exports.settings = function(req, res){
    return res.render('user_settings', {
        title: 'UserName Settings'
    });
}

//For rendering login page
module.exports.login = function(req, res){
    return res.render('login', {
        title: 'Login Page'
    });
}

// For rendering signup page
module.exports.signup = function(req, res){
    return res.render('signup', {
        title: 'My Social Media Website'
    });
}

// For submission of signup form
module.exports.signupForm = function(req, res){
    console.log(req.body);

    //If password and confirm password fields dont match then return
    if(req.body.password != req.body.confirmPassword){
        console.log("Passwords do not match");
        return res.redirect('back');
    }

    //If they do match then check if the user is already registered or not
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding user');
            return;
        }

    //If user entry is not found on the db by email then add the user in the db
        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user');
                    return;
                }
                else{
                    console.log('New User created');
                    return res.redirect('/users/login');
                }
            })
        }
        else{
            console.log('User already exists');
            return res.redirect('back');
        }
    })
}

// For submission of login form
module.exports.loginForm = function(req, res){
    console.log(req.body);
    return res.render('home', {
        title: 'My Social Media Website'
    });
}
