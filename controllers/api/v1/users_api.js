const User = require('../../../models/user');
const jwt = require('jsonwebtoken');


module.exports.createSession = async function (req, res) {
    //Using passport library
    try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: 'Invalid usernam/password'
            })
        }
        else{
            return res.json(200, {
                message: 'Sign in successful. Here is your token. Please keep it safe',
                data: {
                    token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: 10000})
                }
            })
        }

    }
    catch(err){
        console.log(`error: ${err}`);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
    
}