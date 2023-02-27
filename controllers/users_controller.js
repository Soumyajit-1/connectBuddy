const User= require('../models/user');


module.exports.profile=function(req,res){
    res.end('<h1>Profile loadded</h1>');
}


//render the sign in and sign up page  
module.exports.signUp=function(req,res){
    return res.render('user_sign_up',{
        title: "CodeBuddy|Sign Up"
    })
}

module.exports.signIn=function(req,res){
    return res.render('user_sign_in',{
        title: "CodeBuddy|Sign In"
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


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    // TODO later
}