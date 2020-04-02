const db = require('../config/mongoose');
//import our model class for db operations
const User = require('../models/user');

// console.log('users_controller');

// For rendering User Profile
module.exports.profile = function(req, res){
    let userId = req.query.uId;
    User.findById(userId, function(err, user){
        if(err){
            console.log(`${err}`);
            return;
        }
        console.log('usersController.profile');
        return res.render('user_profile', {
            title: 'UserName Profile',
            currUser: user
        });
    })
}

// For rendering User Settings
module.exports.settings = function(req, res){
    console.log('usersController.settings');
    return res.render('user_settings', {
        title: 'UserName Settings'
    });
}

//For rendering signin page
module.exports.signin = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    console.log('usersController.signin');
    return res.render('signin', {
        title: 'Sign In Page'
    });
}

// For rendering signup page
module.exports.signup = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    console.log('usersController.signup');
    return res.render('signup', {
        title: 'My Social Media Website'
    });
}

// For submission of signup form
module.exports.createUser = function(req, res){
    console.log('usersController.createUser');
    console.log(req.body);
    //If password and confirm password fields dont match then return
    if(req.body.password != req.body.confirmPassword){
        console.log("Passwords do not match");
        return res.redirect('back');
    }

    //If they do match then check if the user is already registered or not
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding user in sign up');
            return;
        }

    //If user entry is not found on the db by email then add the user in the db
        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user in signup');

                    return;
                }
                else{
                    console.log('New User created');
                    return res.redirect('/users/signin');
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
module.exports.createSession = function(req, res){
    // console.log(req.body);

    // return res.render('home', {
    //     title: 'My Social Media Website'
    // });
    console.log('usersController.createSession');
    console.log('create session controller called');
    return res.redirect('/');
}

//for signing out and destroying session
module.exports.destroySession = function(req, res){
    req.logout();
    console.log('usersController.destroySession');
    return res.redirect('/');
}



