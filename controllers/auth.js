const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer
    .createTransport(sendGridTransport({
        auth: {
            // from sendgrid
            api_key: 'key'
        }
    }));

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
                    res.redirect('/login');
                    // redirect before send mail cause send mail may take too long
                    // if there are a lot of transaction so leave sending mail at
                    // the bottom of func make app performance better
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject: 'Signup Successful',
                        html: '<h1>You successfully signed up</h1>'
                    })
                })
                .catch(err => {
                    console.log(err);
                })
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

exports.getReset = (req, res, next) => {
    const errorMessages = req.flash('error'); // after retrieve, then flash deletes message immediately
    res.render('auth/reset', {
        path: '/',
        pageTitle: 'Reset Password',
        errorMessage: errorMessages.length > 0 ? errorMessages[0]: null
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user) {
                    req.flash('error', 'no account found');
                    return res.redirect('/reset');
                }
                console.log(token);
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(() => {
                res.redirect('/login');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@node-complete.com',
                    subject: 'Reset Successful',
                    html: '<h1>You requested password reset</h1>' +
                        '<p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</p>'
                })
            })
            .catch(err => {
                console.log(err);
            })
    });
}
