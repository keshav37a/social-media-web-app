const Post = require('../models/post');
const Comment = require('../models/comment');
const Likes = require('../models/like');
var mongoose = require('mongoose');
const commentMailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.postComment = async function(req, res){
    
    console.log('postComment called');
    let postId = req.query.post;
    let userId = req.query.user;
    let content = req.body.content;
    console.log(`req: post comment: ${postId} userId: ${userId} content: ${content}`);

    try{
        let foundPost = await Post.findById(postId);
        //if post is found
        if(foundPost){
            // console.log(`foundPost: ${foundPost}`);
            let createdComment = await Comment.create({
                content: content,
                user: userId, 
                post: postId});

            console.log(`createdComment: ${createdComment}`);
            foundPost.comments.push(createdComment);
            await foundPost.save(); 
            
            createdComment = await createdComment.populate('user', 'name email').execPopulate();

            //Sending the new comment to the mailer
            let job = queue.create('emails', createdComment).save(function(err){
                if(err){
                    console.log(`error in creating a queue ${err}`); 
                    return;
                }
                console.log('job enqued', job.id);
            })
            
            if(req.xhr){                
                return res.status(200).json({
                    data:{
                        comment: createdComment,
                        userName: req.user.name
                    },
                    message: 'Comment created!!'
                });
            }

            req.flash('success', 'Comment added');    
        }
        else{
            req.flash('error', 'Post not found');    
            console.log(`Post not found`);
        } 
    }
    catch (err) {
        console.log(`${err}`);
    }
    return res.redirect('/');
}

module.exports.deleteComment = async function(req, res){
    console.log('deleteComment in comments_controller called');
    let loggedInUserId = req.user._id;
    let commentId = req.query.cId;
    let postId = req.query.pId;
    let userId = req.query.uId;

    console.log(`commentId: ${commentId} postId ${postId} userId ${userId.toString()} loggedInUserId ${loggedInUserId}`);
    if(loggedInUserId.toString() == userId.toString()){
        console.log('authorized to delete');

        try {
            let updatedPostPromise = Post.findByIdAndUpdate(postId, {$pull: {comments: commentId}});

            let deletedCommentPromise = Comment.findByIdAndDelete(commentId);

            const updatedPost = await updatedPostPromise;
            const deletedComment = await deletedCommentPromise;
            await Likes.deleteMany({_id: {$in: deletedComment.likes}});

            console.log(`req.xhr: ${req.xhr}`);
            if(req.xhr){
                console.log('req.xhr in delete comment: ', req.xhr);
                return res.status(200).json({
                    data:{
                        commentId: commentId,
                        postId: postId
                    },
                    message: ' Comment Deleted!!'
                })
            }
            req.flash('success', 'Comment removed');    
        } 
        catch (error) {
            console.log(`${error}`);
        }
    }
    else{
        req.flash('error', 'Unauthorized');    
        console.log('not authorized to delete');
    }
    return res.redirect('/');
}