const Post = require('../models/post');
const Comment = require('../models/comment');
var mongoose = require('mongoose');

module.exports.postComment = function(req, res){
    
    console.log('postComment called');
    let postId = req.query.post;
    let userId = req.query.user;
    let content = req.body.content;
    console.log(`req.query for post comment: ${postId}`);
    console.log(`req.query for user id: ${userId}`);
    console.log(`req.query for user id: ${content}`);

    Post.findById(postId, function(err, post){
        if(err){
            console.log(`error while looking for post in comments_controller: ${err}`);
            return;
        }
        if(post){
            Comment.create({
                content: content,
                user: userId,
                post: postId
            }, function(err, comment){
                if(err){
                    console.log(`error adding comment to comments table in db in the comments_controller: ${err}`);
                    return;
                }
                else{
                    post.comments.push(comment);
                    post.save();
                    return res.redirect('/');
                }
                
            })
        }
        else{
            return res.redirect('/');
        }

    })

    // Comment.create({
    //     content: req.body.content,
    //     user: userId,
    //     post: postId
    // }, function(err, comment){
    //     if(err){
    //         console.log(`error in inserting comment in db ${err}`);
    //         return;
    //     }
    //     if(comment){
    //         console.log('comment added in comments table in db ');
    //         Post.findByIdAndUpdate(postId, {
    //             $push: {comments: comment._id}
    //         }, function(err, comment_){
    //             if(err){
    //                 console.log(`error in updating/pushing comments in post table ${err}`);
    //                 return;
    //             }
    //             if(comment_){
    //                 console.log('comment pushed in posts table in db');
    //             }
    //         })
    //     }
        
    // })
}