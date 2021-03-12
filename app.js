const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongoDbUri = require('./mongo-db-connection-uri');
const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const errorController = require('./controllers/error');
// const User = require('./models/user');

//create express app
const app = express();

// set template engine
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
// app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// any file req looks for file in static file path
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User
//         .findById('000000013a5cd00d306a48dd')
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => {
//             console.log(err);
//         })
// });

app.use('/admin', adminRoutes);
app.use(shopRoute);

app.use(errorController.get404);

mongoose.connect(mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
