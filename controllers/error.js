exports.error404=(req,res, next)=>{
    res.statusCode=404;
    const user = req.session.user;

    res.render('store/404',{ user,pageTitle:"404", currentPage:"404", isLoggedIn:req.session.isLoggedIn })
}