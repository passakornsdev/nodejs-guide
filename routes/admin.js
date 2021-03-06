const express = require('express');

const router = express.Router();
const endpoint = '/admin';

router.get('/add-product', (req, res, next) => {
    res.send('<form action="' + endpoint + '/product" method="POST"><input type="text" name="title"><button type="submit">Submit</button></form>');
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports.router = router;
module.exports.endpoint = endpoint;
