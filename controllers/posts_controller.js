module.exports.posts = function(req, res){
    res.end('<h1>Posts Controller called</h1>')
}

module.exports.likedPosts = function(req, res){
    res.end('<h1>Liked Posts called inside posts controller</h1>');
}