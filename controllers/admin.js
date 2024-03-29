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
    const product = new Product({title, price, description, imageUrl,
        userId: req.user // just pass user object, with ref:, mongoose will look to id automatically
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
            .findByPk(productId)
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
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    Product
        .findByPk(prodId)
        .then(product => {
            if(product.userId.toString() !== req.user.id.toString()) {
                return res.redirect('/');
            }
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save()
                .then(() => {
                    console.log('UPDATED Product!');
                    res.redirect('/admin/products');
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        })
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product
        .deleteOne({id: prodId, userId: req.user})
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
        .findAll(
            {userId: req.user}
            )
        // .select('title price -id') //select title price,-id = exclude id
        // .populate('userId') // get doc that ref to field
        // .populate('userId', 'name') // select name
        .then(products => {
            console.log(products);
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
