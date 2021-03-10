const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoute = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

//create express app
const app = express();

// set template engine
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
// app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
// any file req looks for file in static file path
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoute);

app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product); // optional, to make it's clear
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {
    through: CartItem // through tell the connection should be store, eg. cartId, productId
});
Product.belongsToMany(Cart, {
    through: CartItem
});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
    through: OrderItem
})

sequelize
    // .sync({force: true}) // not for prod
    .sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if(!user) {
            return User.create({name: 'Admin', email: 'admin@mail.com'})
        }
        // return Promise.resolve(user);
        return user; // if return object in then block, value is converted to promise, just make sure value are equal
    })
    .then(user => {
        return user.createCart();
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
    console.log(err);
});
