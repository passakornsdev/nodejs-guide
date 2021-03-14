const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product
        .find()
        // we can use cursor, next, eager load
        // .cursor()
        // .next()
        .then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            isAuthenticated: req.isLoggedIn
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
                path: '/products',
                isAuthenticated: req.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getIndex = (req, res, next) => {
    Product
        .find()
        .then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            isAuthenticated: req.isLoggedIn
        });
    }).catch(err => {
        console.log(err);
    });
    // ([1,2,3]) -> ([rows]) -> rows = [1] = pull out first element in array as variable
};

exports.getCart = (req, res, next) => {
    req.session.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log(user.cart.items);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                cartItem: user.cart.items,
                isAuthenticated: req.isLoggedIn
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
           return req.session.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.session.user
        .deleteItemFromCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getOrders = (req, res, next) => {
    Order
        .find({'user.userId': req.session.user})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders,
                isAuthenticated: req.isLoggedIn
            });
        })
};

exports.postOrder = (req, res, next) => {
    req.session.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(s => {
               return {quantity: s.quantity, product: {
                   ...s.productId._doc // ._doc = special field in mongoose
               }}
            });
            return new Order({
                user: {
                    name: req.session.user.name,
                    userId: req.session.user
                },
                products
            }).save();
        })
        .then(() => {
            return req.session.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}
