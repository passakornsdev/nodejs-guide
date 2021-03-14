const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// require give a func, the func that require session in arg
const MongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = require('./mongo-db-connection-uri');
const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

//create express app
const app = express();
const store = new MongodbStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    // expires: true // optional
});
const csrfProtection = csrf({});

// set template engine
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
// app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// any file req looks for file in static file path
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret', // use to hash session id
    resave: false, // resave when session is change
    saveUninitialized: false,
    store: store // tell session to store in mongodb
    // cookie: {
    //     'Max-Age': 3000
    // }
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    // add var to views
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoute);
app.use(authRoute);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
