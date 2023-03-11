const Post=require('../models/post');
const Comment =require('../models/comment');
const User=require('../models/user');
module.exports.home =function(req,res){
    // Post.find({},function(err,posts){
    //     if(err){console.log('error in finding post')}
    //     return res.render('home',{
    //         title:"ConnectBuddy",
    //         posts: posts
    //     });
    // });
    Post.find({}).populate('user').populate({path: 'comments',populate:{path:'user'}}).exec(function(err,posts){
        if(err){console.log('error finding posts')}
        User.find({},function(err,users){
            return res.render('home',{
                title:"ConnectBuddy",
                posts: posts,
                all_user:users
           });
        })
    });
}