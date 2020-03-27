const db = require('../config/mongoose');
//import our model class for db operations
const User = require('../models/user');



// For rendering User Profile
module.exports.profile = function(req, res){
    // delete req.cookies['user_id'];
    let userId = req.cookies['user_id'];
    console.log('req profile cookie:', userId);
    if(userId){
        let userInfo = {};
        User.findById(userId, function(err, user){
            if(err){
                console.log('Error ocuured while looking for id in users_controller>profile');
                console.log('log line 16');
                return;
            }
            if(user){
                userInfo['name'] = user.name;
                userInfo['email'] = user.email;
                userInfo['CreatedAt'] = user.createdAt;
                userInfo['UpdatedAt'] = user.updatedAt;
                console.log('log line 25');
                return res.render('user_profile', {
                    title:'User Profile', 
                    userInfo: userInfo
                });
            }
            else{
                console.log('log line 32');
                return res.redirect('/users/login');
            }
        })
        // console.log('UNDEFINED: Redirecting to login page');
        // return res.redirect('/users/login');
    }
    else{
        console.log('log line 40');
        return res.redirect('/users/login');
    }
    
}

// For rendering User Settings
module.exports.settings = function(req, res){
    return res.render('user_settings', {
        title: 'UserName Settings'
    });
}

//For rendering login page
module.exports.login = function(req, res){
    let userId = req.cookies.user_id;
    if(userId){
        User.findById(userId, function(err, user){
            if(err){
                console.log('Error finding user in db');
                return;
            }
            if(user){
                let userInfo = {};
                userInfo['name'] = user.name;
                userInfo['email'] = user.email;
                userInfo['CreatedAt'] = user.createdAt;
                userInfo['UpdatedAt'] = user.updatedAt;
                console.log('log line 72');
                return res.render('user_profile', {
                    title:'User Profile', 
                    userInfo: userInfo
                });
            }
        })
    }
    else{
        console.log('log line 80');
        res.render('login', {title: 'Login Page'});
    }
    
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
                let userInfo = {};
                userInfo['name'] = user.name;
                userInfo['email'] = user.email;
                userInfo['createdAt'] = user.createdAt;
                userInfo['updatedAt'] = user.updatedAt;

                return res.render('user_profile', {
                    title:'User/Profile', 
                    userInfo: userInfo
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

//For logout
module.exports.logout = function(req, res){
    console.log('in logout: ', req.cookies);
    delete req.cookies['user_id'];
    console.log('after delete: ', req.cookies);;
    return res.redirect('/users/login');
    
}


//silly mistake - used ',' instead of ':' for key value pairs in res.render

//error:Cannot set headers after they are sent to the client - use proper if else otherwise both times render/redirect would be called and you would get the error. async could also be used to counter the problem
