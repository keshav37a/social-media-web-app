const Post = require('../models/post');

module.exports.createPost = function(req, res){
    console.log('create post in post_controller called');
    console.log(req.body);
    console.log(req.cookies);

    Post.create({
        content: req.body.content, 
        user: req.user._id
    }, function(err, post){
        if(err){
            console.log('error in creating a post');
            return ;
        }
        return res.redirect('/');
    })
}
