const Posts = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){
    console.log('home-controller.home');
    // return res.end('<h1>Express is up for coding. Home Controller called</h1>');
    // console.log('req-cookies:', req.cookies);
    // res.cookie('name', 'hehehe');
    // console.log('res-cookies:', res.cookies);
    let userAll = [];
    

    Posts.find({}).sort({createdAt:-1})
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        })
        .exec(function(err, posts){
            if(err){
                console.log('Error in showing posts');
                return;
            }
            console.log(posts);
            User.find({}, function(err, users){
                if(err){
                    console.log(`${err}`);
                    return;
                }
                return res.render('home', {
                    title:'Posts', 
                    posts: posts,
                    userAll: users
                })
            })
        });
    

}
