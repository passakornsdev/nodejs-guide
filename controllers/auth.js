const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    const errorMessages = req.flash('error'); // after retrieve, then flash deletes message immediately
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errorMessages.length > 0 ? errorMessages[0]: null
    });
};

exports.getSignup = (req, res, next) => {
    const errorMessages = req.flash('error'); // after retrieve, then flash deletes message immediately
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errorMessages.length > 0 ? errorMessages[0]: null
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {
            if (!user) {
                req.flash('error', 'invalid email or password.');
                return res.redirect('/login');
            }
            return bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            // no need to return in callback
                            // with return req.session.save, callback is all code that exec
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'invalid password or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Duplicated email, Please try another email!');
                return res.redirect('/signup');
            }
            // return hash fn. improve performance
            return bcrypt
                .hash(password, 12)
                .then(hashPassword => {
                    new User({
                        email,
                        password: hashPassword,
                        cart: {items: []}
                    })
                        .save()
                })
                .then(() => {
                    res.redirect('/login')
                });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
