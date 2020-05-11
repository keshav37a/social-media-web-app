const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    //This defines the objectId of the liked object
    likeable:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },

    //This field is used to define the type of the liked object since this is a dynamic reference
    onModel:{
        type: String,
        required: true,
        enum:['Post', 'Comment']
    }
},{
    timestamps: true
});

const Like = mongoose.model('like', likeSchema);
module.exports = Like;