const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    User.findById('604bbad1f92bcd2720192577')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    console.log(req.session.user);
    req.session.destroy(() => {
        res.redirect('/');
    });
}