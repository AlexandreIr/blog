function adminAuth(req, res, next){
    if(req.session.user!=null){
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = adminAuth;