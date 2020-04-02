const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.createPost = async function(req, res){
    console.log('create post in post_controller called');
    console.log(req.body);
    console.log(req.cookies);

    try {
        await Post.create({content: req.body.content,
                            user: req.user._id});
    } 
    catch (error) {
        console.log(`${error}`);
    }
    
    return res.redirect('/');
}

module.exports.deletePost = async function(req, res){
    console.log('delete post in posts_controller called');
    console.log(req.query);
    let postOwnerId = req.query.postOwner;
    let authUserId = req.user._id;
    let postId = req.query.postId;
    console.log(`postOwnerId = ${postOwnerId}   authUserId = ${authUserId}   postId = ${postId}`);
    if(postOwnerId === authUserId.toString()){
        console.log('authorised to delete');
        try {
            let foundPost = await Post.findById(postId);
            console.log(`foundPost: ${foundPost}`);
        // let deletedPost = await Post.findByIdAndDelete(postId);
           if(foundPost){
                let comments = foundPost.comments;
                for(let i of comments){
                    let deletedComment = await Comment.findByIdAndDelete(i._id);
                    console.log(`deletedComment: ${deletedComment}`);
                }
            }
            foundPost.remove();
        }
        catch (error) {
            console.log(`${error}`);
        }   
    } 
    else
    {
        console.log('not authorised to delete');
    }    

    return res.redirect('/');
}
