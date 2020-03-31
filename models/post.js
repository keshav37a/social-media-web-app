const mongoose = require('mongoose');

// var schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    //includes the array of ids of all comments in this post itself
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]
},{
    timestamps: true
})

const Post = mongoose.model('post', postSchema);

module.exports = Post;