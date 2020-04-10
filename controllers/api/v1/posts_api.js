const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

//Api for get posts
module.exports.index = async function(req, res){
    try{
        console.log('index called in api v1');
        let posts = await Post.find({}).sort({createdAt:-1})
            .populate('user')
            .populate({
                path: 'comments',
                populate:{
                    path: 'user'
                }
        });

        return res.status(200).json({
            data:{
                posts: posts
            },
            message:'Posts retrieved successfully'
        })
    }
    catch(err){
        console.log(`error: ${err}`);
        return res.status(500).json({
            message: 'Internal Server error'
        });    
    }
    
}



////Api for delete posts
module.exports.deletePost = async function(req, res){
    console.log('delete post in api v1 called');
    console.log(req.query);
    // let postOwnerId = req.query.postOwner;
    // let authUserId = req.user._id;
    // let postId = req.query.postId;
    let postId = req.params.id;
    try {
        let foundPost = await Post.findById(postId);
        console.log(`foundPost: ${foundPost}`);
        if(foundPost){
            if(foundPost.user == req.user.id){
                let comments = foundPost.comments;
                for(let i of comments){
                    await Comment.findByIdAndDelete(i._id);
                }
                foundPost.remove();
                return res.status(200).json({
                    message: 'Post and associated comments deleted successfully'
                });
            }
            else{
                return res.status(401).json({
                    message:'You cannot delete this post'
                })
            }
            
        }
        else{
            return res.status(404).json({
                message: 'Post not found'
            });
        }
    }
    catch (error) {
        console.log(`${error}`);
        return res.status(500).json({
            message: 'Internal Server error'
        });
    }   
}


