const path = require('path');

const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    const product = adminData.product;
    res.render('shop', {prods: product, docTitle: 'Shop'});
});

module.exports = router;
