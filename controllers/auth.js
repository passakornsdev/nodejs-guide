const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('604bbad1f92bcd2720192577')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email})
      .then(userDoc => {
        if(userDoc) {
          // TO DO ADD ERROR MSG
          return res.redirect('/signup');
        }
        // return hash fn. improve performance
        return bcrypt
            .hash(password, 12)
            .then(hashPassword => {
                new User({
                    email,
                    password: hashPassword,
                    cart: {items: []}})
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
