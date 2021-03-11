const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = new mongodb.ObjectID(id);
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products')
                .updateOne({
                    _id: this._id // filter update doc
                }, {
                    // $set: {title: this.title,...}
                    $set: this // $set tell mongodb what field to update
                });
        } else {
            dbOp = db.collection('products')
                .insertOne(this);
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        return getDb()
            .collection('products')
            .find() // find return cursor
            .toArray() // retrieve all data, should not use for tremendous doc
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static findById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            .find({_id: new mongodb.ObjectID(prodId)}) // mongodb generate id with ObjectId type
            .next() // get next item
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = Product;
