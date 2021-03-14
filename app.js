const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const mongoDbUri = require('./mongo-db-connection-uri');
const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

//create express app
const app = express();

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
    // cookie: {
    //     'Max-Age': 3000
    // }
}));

app.use((req, res, next) => {
    User
        .findById('604bbad1f92bcd2720192577')
        .then(user => {
            // user is mongoose model, so we can call req.user.save,find
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

app.use('/admin', adminRoutes);
app.use(shopRoute);
app.use(authRoute);

app.use(errorController.get404);

mongoose.connect(mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
