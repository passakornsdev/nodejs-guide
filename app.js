const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
// require give a func, the func that require session in arg
const csrf = require('csurf');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);

const sequelize = require('./util/database');
const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

//create express app
const app = express();
const options = {
    host: 'localhost',
    port: 3306,
    user: 'passakorn',
    password: 'nodejs-guide',
    database: 'node_complete'
};
const sessionStore = new MySQLStore(options);
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
    store: sessionStore // tell session to store in mongodb
    // cookie: {
    //     'Max-Age': 3000
    // }
}));

app.use(csrfProtection);

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findByPk(req.session.user.id)
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


sequelize.sync().then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
