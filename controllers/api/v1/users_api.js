const User= require('../../../models/user');
const jwt = require('jsonwebtoken');


module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user||user.password!=req.body.password){
            return res.json(422,{
                message: "Invalid Username or password"
            });
        }

        return res.json(200,{
            message: "sign in successful, here is your JSON token keep it safe",
            data: {
                token: jwt.sign(user.toJSON(),'connectbuddy',{expiresIn: '1000000000000000'})
            }
        })
    }
    catch(err){
        return res.json(500,{
            message : "Internal server error"
        })
    }
}