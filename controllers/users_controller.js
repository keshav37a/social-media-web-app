module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'UserName Profile'
    });
}

module.exports.settings = function(req, res){
    return res.render('user_settings', {
        title: 'UserName Settings'
    });
}