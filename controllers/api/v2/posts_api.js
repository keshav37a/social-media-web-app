module.exports.index = function(req, res){
    return res.status(200).json({
        data:{
            posts: []
        },
        message:'Posts retrieved successfully'
    })
}