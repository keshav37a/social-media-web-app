const Friendship = require('../models/friendship');
const User = require('../models/user');

module.exports.toggleFriend = async (req, res)=>{
    try{
        let fromUserId = req.query.from;
        let toUserId = req.query.to;
        let toggle = req.query.toggle;

        let isFriendship = false;
        let friendshipStatus = null;

        let fromUser = await User.findById(fromUserId);
        let toUser = await User.findById(toUserId);

        if(toggle==1){
            //add friendship
            console.log("add friendship condition");
            friendshipStatus = await Friendship.create({from_user: fromUserId, to_user: toUserId});

            fromUser.friendships.push(friendshipStatus);
            toUser.friendships.push(friendshipStatus);

            isFriendship = true;
        }
        else{
            console.log("remove friendship condition");
            let friendship1 = await Friendship.findOne({from_user: fromUserId, to_user: toUserId});
            let friendship2 = await Friendship.findOne({from_user: toUserId, to_user: fromUserId});

            if(friendship1){
                fromUser.friendships.remove(friendship1);
                toUser.friendships.remove(friendship1);
                friendship1.remove();
            }
            else if(friendship2){
                fromUser.friendships.remove(friendship2);
                toUser.friendships.remove(friendship2);
                friendship2.remove();
            }
            else{
                console.log('friendship not found');
            }
            isFriendship = false;
        }

        await fromUser.save();
        await toUser.save();

        return res.status(200).json({
            data: {
                from: fromUserId,
                to: toUserId,
                isFriendship: isFriendship
            },
            message: 'togglefriend called in friends_controller'
        });
    }
    catch(err){
        console.log(`error in friends controller: ${err}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }   
}