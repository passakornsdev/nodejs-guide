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
        if(cartProductIndex >= 0) {
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
