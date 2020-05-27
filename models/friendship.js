const mongoose = require('mongoose');
const FriendshipSchema = new mongoose.Schema({
    from_user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    to_user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
},{
    timestamps: true
})

const FriendShipModel = mongoose.model('friendship', FriendshipSchema);
module.exports = FriendShipModel;