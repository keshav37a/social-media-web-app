const Likes = require('../models/like');
const Comments = require('../models/comment');
const Posts = require('../models/post');

module.exports.toggleLike = async (req, res)=>{

    try{
        '/likes/toggle/?id=postOrCommentId&type=postOrComment'
        console.log('toggleLike called');
        console.log(req.query);
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
            console.log(likeable);
            likeable.likes.push(newLike);
            likeable.save();
        }

        return res.status(200).json({
            data: deleted,
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