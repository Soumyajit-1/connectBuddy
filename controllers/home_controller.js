module.exports.home =function(req,res){
    console.log(req.cookies);
    res.cookie('ssp',78);
    return res.render('home',{
        title: "Home"
    });
}