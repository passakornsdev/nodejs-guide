const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl);
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getEditProduct = (req, res, next) => {
    const editedMode = req.query.edit;
    const productId = req.params.productId;
    if (!editedMode) {
        res.redirect('/');
    } else {
        Product
            .findById(productId)
            .then(product => {
                if (!product) {
                    res.redirect('/');
                } else {
                    res.render('admin/edit-product', {
                        pageTitle: 'Add Product',
                        path: '/admin/edit-product',
                        editing: true,
                        product: product
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, prodId);
    product
        .save()
        .then(() => {
            console.log('UPDATED Product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            // destroy = delete
            return product.destroy(); // avoid nested chaining, simply returns promise
        })
        .then(() => {
            console.log('Destroyed product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        })
};

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        })
};
