const Posts = require('../models/post');
const User = require('../models/user');
const moment = require('moment');

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

        //Convert mongoose object to normal object otherwise it wont be editable                
        // let postObjArr = [];
        // for(let i of posts){
        //     let postObj = i.toObject();
        //     let formattedDate = moment(postObj.createdAt).format('hh:mm A, DD MMMM');
        //     postObj.createdAt = formattedDate;
        //     let commentObjArr = [];
        //     for(let j of postObj.comments){
        //         console.log(j);
        //         formattedDate = moment(j.createdAt).format('hh:mm A, DD MMMM');
        //         j.createdAt = formattedDate;
        //     }
        //     postObjArr.comments = commentObjArr;
        //     postObjArr.push(postObj);
        // }

        let users = await User.find({});

        return res.render('home', {
            title:'Posts', 
            posts: posts,
            userAll: users
        })
    }
    catch(err){
        console.log(`${err}`);
    }
}
