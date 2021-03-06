const path = require('path');

const express = require('express');

const router = express.Router();
const endpoint = '/admin';

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports.router = router;
module.exports.endpoint = endpoint;
