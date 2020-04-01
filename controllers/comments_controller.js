const Post = require('../models/post');
const Comment = require('../models/comment');
var mongoose = require('mongoose');

module.exports.postComment = function(req, res){
    
    console.log('postComment called');
    let postId = req.query.post;
    let userId = req.query.user;
    let content = req.body.content;
    // console.log(`req.query for post comment: ${postId}`);
    // console.log(`req.query for user id: ${userId}`);
    // console.log(`req.query for user id: ${content}`);

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
}

module.exports.deleteComment = function(req, res){
    console.log('deleteComment in comments_controller called');
    console.log(req.query);
    let loggedInUserId = req.user._id;
    let commentId = req.query.cId;
    let postId = req.query.pId;
    let userId = req.query.uId;

    console.log(`commentId: ${commentId} postId ${postId} userId ${userId} loggedInUserId ${loggedInUserId}`);

    if(loggedInUserId.toString() == userId){
        console.log('authorized to delete');
        
        Post.findByIdAndUpdate(postId, {$pull: {comments: commentId}}, function(err, post){
            if(err){
                console.log(`${err}`);
            }
        })

        Comment.findByIdAndDelete(commentId, function(err, comment){
            if(err){
                console.log(`${err}`);
                return;
            }
        })    
        return res.redirect('/');
        // Post.findById(postId, function(err, post){
        //     if(err){
        //         console.log(`${err}`);
        //         return;
        //     }
        //     if(post){
        //         for(let i of post.comments._id){
                    
        //         }
        //     }
        // })
    }
    else{
        console.log('not authorized to delete');
        return res.redirect('/');
    }
}