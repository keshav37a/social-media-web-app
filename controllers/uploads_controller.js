const multer = require('multer');
var upload = multer({ dest: 'uploads/' })

module.exports.avatar_upload = function(req, res){
    upload.single('avatar');
    console.log(req);
}

