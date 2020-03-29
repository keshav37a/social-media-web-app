module.exports.home = function(req, res){
    console.log('home-controller.home');
    // return res.end('<h1>Express is up for coding. Home Controller called</h1>');
    // console.log('req-cookies:', req.cookies);
    // res.cookie('name', 'hehehe');
    // console.log('res-cookies:', res.cookies);
    return res.render('home', {
        title: 'My Social Media WebSite'});
}

