// module.exports.posts = function(req, res){
//     console.log('postsController.post');
//     res.end('<h1>Posts Controller called</h1>')
// }

//creating posts
module.exports.createPost = function(req, res){
    console.log('create post in post_controller called');
    console.log(req.body);
    console.log(req.cookies);
    return res.redirect('/');
}
