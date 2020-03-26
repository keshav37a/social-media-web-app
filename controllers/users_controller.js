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

    let userName = req.body.name;
    let password = req.body.password;
    console.log(`Entered details in login form: username: ${userName}  password: ${password}`);
    // To check if user is present in the db or not
    User.findOne({email:userName}, function(err, user){
        if(err){
            console.log('Error in finding user by email in db');
            return res.redirect('back');
        }

        //If the user entry is found in the db for that email 
        if(user){
            console.log('User found');
            console.log('user: ', user);
            console.log(typeof(user));
            console.log('userPassword: ', user['password']);

            //If the password is correct then redirect to user profile page
            if(password===user.password){
                console.log('Sign In Successful');
                res.cookie('user_id', user._id);
                console.log('cookies ', req.cookies);
                return res.render('user_profile', {
                    title:'User/Profile', 
                    name: user.name, 
                    email: user.email, 
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                });
            }

            //Handle Incorrect password
            else{
                console.log('Incorrect Password');
                return res.redirect('back');
            }      
        }

        //Handle wrong username / new user trying to login
        else{
            console.log('Username/Email doesnt exist');
            return res.redirect('back');
        }
    })
}
