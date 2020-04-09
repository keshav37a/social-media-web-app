const db = require('../config/mongoose');
//import our model class for db operations
const User = require('../models/user');

const fs = require('fs');
const path = require('path');

// console.log('users_controller');

// For rendering User Profile
module.exports.profile = async function (req, res) {
    let userId = req.query.uId;
    console.log(req.query);
    console.log(`userId:  ${userId}`);
    try {
        var user = await User.findById(userId);
        console.log(`user-profile-opened: ${user}`);
    }
    catch (err) {
        console.log(`${err}`);
    }
    return res.render('user_profile', {
        title: 'User Profile',
        currUser: user
    });
}

// For rendering User Settings
module.exports.settings = function (req, res) {
    console.log('usersController.settings');
    return res.render('user_settings', {
        title: 'UserName Settings'
    });
}

//For rendering signin page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    console.log('usersController.signin');
    return res.render('signin', {
        title: 'Sign In Page'
    });
}

// For rendering signup page
module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    console.log('usersController.signup');
    return res.render('signup', {
        title: 'My Social Media Website'
    });
}

// For submission of signup form
module.exports.createUser = async function (req, res) {
    console.log('usersController.createUser');
    console.log(req.body);
    //If password and confirm password fields dont match then return
    if (req.body.password != req.body.confirmPassword) {
        console.log("Passwords do not match");
        return res.redirect('back');
    }
    try {
        //If they do match then check if the user is already registered or not
        let user = await User.findOne({ email: req.body.email });

        //If user entry is not found on the db by email then add the user in the db
        if (!user) {
            let createdUser = await User.create(req.body);
            if (createdUser) {
                req.flash('success', 'User created');
                return res.redirect('/users/signin');
            }
        }
        else {
            console.log('User already exists');
            req.flash('error', 'User already exists');
            return res.redirect('back');
        }
    }
    catch (err) {
        req.flash('error', err);
        console.log(`${err}`);
        return res.redirect('back');
    }
}

// For submission of login form
module.exports.createSession = function (req, res) {
    //Using passport library
    console.log('usersController.createSession');
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/');
}

//for signing out and destroying session
module.exports.destroySession = function (req, res) {
    console.log('usersController.destroySession');
    req.logout();
    req.flash('success', 'Logged Out Successfully');
    return res.redirect('/');
}

//for updating fields in profile form
module.exports.updateProfile = async function (req, res) {
    console.log('userController.updateProfile called');
    let userId = req.query.uId;
    let newName = req.body.name;
    let newEmail = req.body.email;
    console.log(`${req.query}    ${userId} `);
    console.log(req.body);
    console.log(req.name);
    // console.log(req);
    try {
        if (req.user._id.toString() == userId) {
            let updatedUser = await User.findById(userId);

            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('*****Multer error: ', err);
                }
                console.log(req.file);
                updatedUser.name = newName;
                updatedUser.email = newEmail;
                if(req.file){
                    if(updatedUser.avatar){
                        console.log(path.join(__dirname, '..', updatedUser.avatar));
                        fs.unlinkSync(path.join(__dirname, '..', updatedUser.avatar));
                    }
                    //this is saving the path of the uploaded file into the avatar field in the user
                    updatedUser.avatar = User.avatarPath + '/' + req.file.filename;
                    console.log(updatedUser.avatar);
                }
                //for saving userinfo in db
                updatedUser.save();
                console.log(updatedUser);
            })

            req.flash('success', 'Profile Updated Successfully');
            return res.redirect('back');
        }
        else {
            req.flash('error', 'Unauthorized');
            return res.status(401).send('Unauthorized');
        }
    }
    catch (error) {
        req.flash('error', 'Error in updating profile. Please try again later');
        console.log(`${error}`);
        return res.redirect('back');
    }
}
