const Post = require('../models/post');
const Comment = require('../models/comment');

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

module.exports.deletePost = function(req, res){
    console.log('delete post in posts_controller called');
    console.log(req.query);
    let postOwnerId = req.query.postOwner;
    let authUserId = req.user._id;
    let postId = req.query.postId;
    console.log(`postOwnerId = ${postOwnerId}   authUserId = ${authUserId}   postId = ${postId}`);
    if(postOwnerId === authUserId.toString()){
        console.log('authorised to delete');
        Post.findByIdAndDelete(postId, function(err, post){
            if(err){
                console.log(`error in finding post id in db`);
                return;
            }
            if(post){
                let comments = post.comments;
                for(let i of comments){
                    Comment.findByIdAndDelete(i._id, function(err, comment){
                        if(err){
                            console.log(`error in finding comments to delete in db`);
                            return;
                        }
                    })
                }
            }
            return res.redirect('/');
        })
    }
    else{
        console.log('not authorised to delete');
    }
    // return res.redirect('/');
}
