const passport = require('passport');

const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');

passport.use(new LocalStrategy({
    usernameField:'email'
   },
   function(email,password,done){
    User.findOne({email:email},function(err,user){
        if(err){
            console.log("error in finding user-->passport");
            return done(err);
        }
        if(!user||user.password!=password){
            console.log('Invalid Username password');
            return done(null,false)
        }
        return done(null,user);
    });
   }
));

//serialize the user   
passport.serializeUser(function(user,done){
    done(null,user.id);

});

//deserialize the user
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("error in finding user-->passport");
            return done(err);
        }
        return done(null,user);
    });
});

//check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contain current sign in user from the session cookie and we are just sending to the locals for the views
        res.locals.user=req.user;
    }
    next();
}


module.exports=passport;
