const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product
        .findAll()
        // we can use cursor, next, eager load
        // .cursor()
        // .next()
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
        .findByPk(prodId)
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
        .findAll()
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
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log(user.cart.items);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                cartItem: user.cart.items
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
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
    Order
        .findAll({'user.userId': req.user})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders
            });
        })
};

exports.postOrder = (req, res, next) => {
    req.user
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
                    email: req.user.email,
                    userId: req.user
                },
                products
            }).save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}
