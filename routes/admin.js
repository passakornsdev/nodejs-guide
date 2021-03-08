const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();
const endpoint = '/admin';
const product = [];

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/product', (req, res, next) => {
    product.push({title: req.body.title});
    res.redirect('/');
});

module.exports.router = router;
module.exports.endpoint = endpoint;
module.exports.product = product;
