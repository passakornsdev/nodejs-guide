const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product
        .findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: 'Product Detail',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getIndex = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(err => {
        console.log(err);
    });
    // ([1,2,3]) -> ([rows]) -> rows = [1] = pull out first element in array as variable
};

exports.getCart = (req, res, next) => {
    req.user
        .getProductsInCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
           return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .deleteItemFromCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({
            // in app.js, order BelongToMany Product, but sequelize pluralize product, then it's products
            // include = eager loading
            include: ['products']
        })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders
            });
        })
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}
