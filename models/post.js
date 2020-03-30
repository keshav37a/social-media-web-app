const mongoose = require('mongoose');

// var schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
    content:{
        type: String,
        required
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},{
    timestamps: true
})

const Post = mongoose.model('post', postSchema);

module.exports = Post;