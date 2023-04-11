const Comment=require('../models/comment');
const Post=require('../models/post');
const commentMailer = require('../mailer/comments_mailer');
const queue = require('../config/kue');
const commentsEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');


module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            },function(err,comment){
                if(comment){
                    post.comments.push(comment);
                    //we need to save , it indicates the db that it is the final version so lock it
                    //so every update we need to do this

                    post.save();
                    comment.populate('user',function(err,comment){
                        if(err){console.log('error in populating user in comment',err)}
                        // commentMailer.newComment(comment);
                        let job = queue.create('emails',comment).save(function(err){
                            if(err){
                                console.log('err in crating queue',err);
                                return;
                            }
                            console.log('job enqueued', job.id);
                        });

                    });
                    res.redirect('/');
                }
            })
        }
    })
}

module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment.user==req.user.id){
            var postId=comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
                return res.redirect('back');
            })
            Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
        }else{
            return res.redirect('back');
        }
    })
}