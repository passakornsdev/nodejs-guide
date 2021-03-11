let _username, _password, _cluster;

const MongoClient = require('mongodb').MongoClient;

const mongoConnect = (callback) => {
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
            callback(client);
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = mongoConnect;
