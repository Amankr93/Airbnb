exports.error404=(req,res, next)=>{
    res.statusCode=404;
    const user = req.session.user;

    res.render('./store/404',{ user, isLoggedIn:req.session.isLoggedIn})
}