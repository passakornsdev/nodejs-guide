const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({title, price, description, imageUrl,
        userId: req.user // just pass user object, with ref:, mongoose will look to _id automatically
    });
    product
        .save()
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
                        product: product,
                        isAuthenticated: req.isLoggedIn
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
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    Product
        .findById(prodId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save();
        })
        .then(() => {
            console.log('UPDATED Product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        })
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product
        .findByIdAndRemove(prodId)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        })
};

exports.getProducts = (req, res, next) => {
    Product
        .find()
        // .select('title price -_id') //select title price,-_id = exclude id
        // .populate('userId') // get doc that ref to field
        // .populate('userId', 'name') // select name
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        })
};
