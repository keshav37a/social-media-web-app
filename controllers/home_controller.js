module.exports.home = function(req, res){
    // return res.end('<h1>Express is up for coding. Home Controller called</h1>');
    return res.render('home', {
        title: 'My Social Media WebSite'});
}

module.exports.signup = function(req, res){
    return res.render('signup', {
        title: 'My Social Media Website'
    });
}