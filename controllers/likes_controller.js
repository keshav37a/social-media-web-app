module.exports.likePost = function(req, res){
    req.flash('success', 'Like this Post +1');
    return res.redirect('back');
}

module.exports.likeComment = (req, res)=>{
    req.flash('success', 'Like this Comment +1');
    return res.redirect('back');
}

module.exports.unlikePost = (req, res)=>{
    req.flash('success', 'unLike this Post -1');
    return res.redirect('back');
}

module.exports.unlikeComment = (req, res)=>{
    req.flash('success', 'unLike this Comment -1');
    return res.redirect('back');
}