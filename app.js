const express = require('express');
const bodyParser = require('body-parser');

//create express app
const app = express();

app.use(bodyParser.urlencoded());

app.get('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Submit</button></form>');
});

app.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

app.use((req, res, next) => {
    res.send('<h1>hello from express! </h1>');
});

app.listen(3000);
