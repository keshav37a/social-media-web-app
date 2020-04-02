const Posts = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    console.log('home-controller.home');
    // return res.end('<h1>Express is up for coding. Home Controller called</h1>');
    // console.log('req-cookies:', req.cookies);
    // res.cookie('name', 'hehehe');
    // console.log('res-cookies:', res.cookies);

    try{
        let posts = await Posts.find({}).sort({createdAt:-1})
                .populate('user')
                .populate({
                    path: 'comments',
                    populate:{
                        path: 'user'
                    }
                });

        let users = await User.find({});

        return res.render('home', {
            title:'Posts', 
            posts: posts,
            userAll: users
        })
    }
    catch{
        console.log(`${err}`);
    }
}
