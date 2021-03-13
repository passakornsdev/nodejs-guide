// use Cap for class
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        isAuthenticated: req.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.title);
    product.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products]) => {
            res.render('shop', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                isAuthenticated: req.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        })
};
