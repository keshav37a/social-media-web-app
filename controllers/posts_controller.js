const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.createPost = async function(req, res){
    console.log('create post in post_controller called');
    console.log(req.body);
    console.log(req.cookies);

    try {
        let post = await Post.create({content: req.body.content,
                            user: req.user._id});
        
        if(post)
            req.flash('success', 'Post published');    
        else
            req.flash('error', 'Failed to publish post');    

        //checking if it has an ajax request or not
        let postObj = post.toObject();
        // console.log('req.user:', req.user);
        // console.log('typeof post: ', typeof(postObj));
        // console.log('typeof req.user: ', typeof(req.user));
        postObj['loggedInUser'] = req.user;
        console.log('post', postObj);
        if(req.xhr){
            console.log('req.xhr: ', req.xhr);
            return res.status(200).json({
                data:{
                    post: postObj
                },
                message: 'Post created!!'
            })
        }

        
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
            req.flash('success', 'Post and associated comments removed');
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: postId
                    },
                    message: 'Post deleted successfully'
                });
            }    
        }
        catch (error) {
            console.log(`${error}`);
        }   
    } 
    else
    {
        req.flash('error', 'Unauthorized');    
        console.log('not authorised to delete');
    }    

    return res.redirect('/');
}
