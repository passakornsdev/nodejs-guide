const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

//create express app
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
// any file req looks for file in static file path
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoute.endpoint, adminRoute.router);
app.use(shopRoute);

app.use((req, res, next) => {
    res
        .status(404)
        .sendFile(path.join(__dirname, 'views', 'not-found.html'));
});

app.listen(3000);
