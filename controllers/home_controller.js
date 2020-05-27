const Posts = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    console.log('home-controller.home');
    try{
        let posts = await Posts.find({}).sort({createdAt:-1})
                .populate('user')
                .populate({
                    path: 'comments',
                    populate:{
                        path: 'user'
                    }
                });
        //Convert mongoose object to normal object otherwise it wont be editable                
        let users = await User.find({});
        let friendsArr = [];
        if(req.user){
            let loggedInUser = await User.findById(req.user._id).populate({path: 'friendships', populate: 'from_user to_user'});
            let friendshipIdArr = loggedInUser.friendships;
            for(let i=0; i<friendshipIdArr.length; i++){
                let friendshipObject = friendshipIdArr[i];
                let fromUser = friendshipObject.from_user;
                let toUser = friendshipObject.to_user;
                if(fromUser._id.toString()==loggedInUser._id.toString()){
                    friendsArr.push(toUser);
                }
                else{
                    friendsArr.push(fromUser);
                }
            }
        }
        
        return res.render('home', {
            title:'Posts', 
            posts: posts,
            userAll: users,
            friendsArr: friendsArr
        })
    }
    catch(err){
        console.log(`${err}`);
    }
}
