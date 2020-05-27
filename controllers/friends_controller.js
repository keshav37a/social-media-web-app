'/friends/toggle?from=<%=locals.user._id%>&to=<%=currUser._id%>&toggle=0"'

module.exports.toggleFriend = (req, res)=>{
    console.log(req.query);
    return res.status(200).json({
        message: 'togglefriend called in friends_controller'
    });
}