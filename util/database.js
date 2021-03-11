let _username, _password, _cluster;

const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = callback => {
    const uri = "mongodb+srv://" +
        _username +
        ":" +
        _password +
        "@" +
        _cluster +
        "/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client
        .connect()
        .then(client => {
            console.log('connected');
            // overwrite db name
            _db = client.db('shop');
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
}

// mongodb will provide sufficient connection for multiple simultaneously operations
const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No Database found!';
}

exports.mongoConenct = mongoConnect;
exports.getDb = getDb;
