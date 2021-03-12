const ObjectId = require('mongodb').ObjectID;

const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = new ObjectId(id);
    }

    save() {
        const db = getDb();
        return db
            .collection('user')
            .insertOne(this)
            .then(user => {
                console.log('save user successful!', user);
            })
            .catch(err => {
                console.log(err);
            });
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
        let newQuantity = 1;
        const updatedCartItem = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItem[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItem.push({productId: new ObjectId(product._id), quantity: newQuantity});
        }
        const updatedCart = {items: updatedCartItem};
        const db = getDb();
        return db
            .collection('user')
            .updateOne({
                _id: this._id
            }, {
                $set: {
                    cart: updatedCart
                }
            });
    }

    getProductsInCart() {
        const db = getDb();
        const productIds = this.cart.items.map(s => s.productId);
        return db
            .collection('products')
            .find({
                _id: {
                    $in: productIds
                }
            })
            .toArray()
            .then(products => {
                return products.map(product => {
                    // arrow func make this keyword refers to overall class, which function() doesn't
                    return {
                        ...product,
                        quantity: this.cart.items.find(s => s.productId.toString() === product._id.toString()).quantity
                    };
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(cartItem => cartItem.productId.toString() !== productId.toString());
        const db = getDb();
        return db
            .collection('user')
            .updateOne(
                {_id: new ObjectId(this._id)},
                {$set: {cart: {items: updatedCartItems}}}
            );
    }

    addOrder() {
        const db = getDb();
        return this.getProductsInCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name,
                        email: this.email
                    }
                }
                return db
                    .collection('orders')
                    .insertOne(order)
                    .then(result => {
                        console.log(result);
                        return db
                            .collection('user')
                            .updateOne(
                                {_id: new ObjectId(this._id)},
                                {$set: {cart: {items: []}}}
                            );
                    })
            })
            .catch(err => {
                console.log(err);
            });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders')
            .find({'user._id': new ObjectId(this._id)})
            .toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('user')
            .findOne({_id: new ObjectId(userId)})
            .then(user => {
                console.log('retrieved user successful!', user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;
