const mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    like : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'like'
    }]
}, {
    timestamps : true
})

const Comment = mongoose.model('comment', CommentSchema);
module.exports = Comment;