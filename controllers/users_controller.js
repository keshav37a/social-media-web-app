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

// For submission of login form
module.exports.loginForm = function(req, res){
    console.log(req.body);
    return res.render('home', {
        title: 'My Social Media Website'
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
    return res.render('home', {
        title: 'My Social Media Website'
    });
}