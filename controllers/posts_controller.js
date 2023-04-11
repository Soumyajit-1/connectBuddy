const Post=require('../models/post');
const Comment= require('../models/comment');
const Like = require('../models/like');


module.exports.create =function(req,res){
    Post.create({
        content:req.body.content,
        user: req.user._id
    },function(err,post){
        if(err){console.log('error in creating a post');return ;}
        return res.redirect('back');
    });
}

module.exports.destroy= function(req,res){
    Post.findById(req.params.id,function(err,post){
        //.id means converting the object id into string
        if(post.user==req.user.id){
            Like.deleteMany({likeable: post, onModel: 'Post'});
            Like.deleteMany({_id: {$in: post.comments}});
            post.remove();
            Comment.deleteMany({post:req.params.id},function(err){
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    })
}