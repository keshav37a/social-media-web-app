const Likes = require('../models/like');
const Comments = require('../models/comment');
const Posts = require('../models/post');

module.exports.toggleLike = async (req, res)=>{

    try{
        let likeable;
        let deleted = false;

        if(req.query.type=='post'){
            likeable = await Posts.findById(req.query.id).populate('likes');
        }
        else{
            likeable = await Comments.findById(req.query.id).populate('likes');
        }

        //check if a like already exists
        let existingLike = await Likes.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type
        });

        if(existingLike){
            likeable.likes.pull(existingLike);
            likeable.save();
            existingLike.remove();

            deleted = true;
        }
        else{
            let newLike = await Likes.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike);
            likeable.save();
        }
        return res.status(200).json({
            data: {
                isLiked: !deleted,
                likeable: likeable,
                type: req.query.type
            },
            message: 'Like Toggled'
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports.getAllLikeablesLikedByUser = async (req, res)=>{
    try{
        let userId = req.params.id;
        let likesByUser = await Likes.find({user: userId});
        return res.status(200).json({
            data: likesByUser,
            message: 'Successful'
        });
    }
    catch(err){
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
    
    
}
