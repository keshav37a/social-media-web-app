const Post = require('../models/post');
const Comment = require('../models/comment');
var mongoose = require('mongoose');

module.exports.postComment = async function(req, res){
    
    console.log('postComment called');
    let postId = req.query.post;
    let userId = req.query.user;
    let content = req.body.content;
    console.log(`req: post comment: ${postId} userId: ${userId} content: ${content}`);

    let foundPost = await Post.findById(postId);
    //if post is found
    if(foundPost){
        // console.log(`foundPost: ${foundPost}`);

        try {
            let createdComment = await Comment.create({content: content,
                user: userId, 
                post: postId});
            console.log(`createdComment: ${createdComment}`);
            foundPost.comments.push(createdComment);
            await foundPost.save();    

            if(req.xhr){
                console.log('req.xhr: ', req.xhr);
                return res.status(200).json({
                    data:{
                        comment: createdComment,
                        userName: req.user.name
                    },
                    message: 'Post created!!'
                });
            }
    
            req.flash('success', 'Comment added');    
        } 
        catch (err) {
            console.log(`${err}`);
        }
    }
    else{
        req.flash('error', 'Post not found');    
        console.log(`Post not found`);
    }
    return res.redirect('/');
}

module.exports.deleteComment = async function(req, res){
    console.log('deleteComment in comments_controller called');
    console.log(req.query);
    let loggedInUserId = req.user._id;
    let commentId = req.query.cId;
    let postId = req.query.pId;
    let userId = req.query.uId;

    console.log(`commentId: ${commentId} postId ${postId} userId ${userId} loggedInUserId ${loggedInUserId}`);

    if(loggedInUserId.toString() == userId){
        console.log('authorized to delete');

        try {
            let updatedPostPromise = Post.findByIdAndUpdate(postId, {$pull: {comments: commentId}});
            let deletedCommentPromise = Comment.findByIdAndDelete(commentId);
            const updatedPost = await updatedPostPromise;
            const deletedComment = await deletedCommentPromise;
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