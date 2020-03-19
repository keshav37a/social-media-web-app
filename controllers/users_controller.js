module.exports.profile = function(req, res){
    return res.end('<h1>User Profile</h1>');
}

module.exports.settings = function(req, res){
    return res.end('<h1>User Settings</h1>');
}