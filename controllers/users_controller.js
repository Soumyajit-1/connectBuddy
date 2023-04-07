const User= require('../models/user');
const path = require('path');
const fs = require('fs');


module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:res.locals.user.name+"'s profile",
            this_user: user
        })
    })
}


//render the sign in and sign up page  
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title: "ConnectBuddy|Sign Up"
    })
}

module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "ConnectBuddy|Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    // check if password and confirm password is same 
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('error in finding user in signing up');return}
        if(user){
            return res.end('<h1>Already Exist!!</h1>');
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){console.log('error in creating user');return}
                return res.redirect('/users/sign-in');
            })
        }else res.redirect('back');
    })


}

module.exports.update = async function(req,res){

    if(req.user.id==req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('multer err',err)};
                
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        try{
                            fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                        }catch(err){
                            console.log('error in finding file path to delete',err);
                        }
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');

            });
        }
        catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error','Unauthprized');
        return res.status(401).send('Unauthorized');
    }

}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    // TODO later
    req.flash('success','logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession=function(req,res,next){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','logged out successfully');
        return res.redirect('/');
    });
}