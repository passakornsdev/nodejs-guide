const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');

//create express app
const app = express();

// set template engine
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
// app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// any file req looks for file in static file path
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoute);

app.use((req, res, next) => {
    res
        .status(404)
        .render('404', {pageTitle: 'Page Not Found', path: ''});
});

app.listen(3000);
