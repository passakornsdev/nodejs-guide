const ObjectId = require('mongodb').ObjectID;

const getDb = require('../util/database').getDb;

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this._id = new ObjectId(1)
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
