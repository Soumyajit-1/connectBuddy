const Post=require('../models/post');
const Comment =require('../models/comment');
const User=require('../models/user');
module.exports.home = async function(req,res){
    try{
        let posts= await Post.find({})
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });

        let users= await User.find({});

        return res.render('home',{
            title:"ConnectBuddy",
            posts: posts,
            all_user:users
        });
    }catch(err){
        console.log('error',err);
        return;
    }
}