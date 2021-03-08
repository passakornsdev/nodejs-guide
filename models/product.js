const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, data) => { // use arrow function to reference to class
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(data));
        }
    });
};

module.exports = class product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {

            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    // call func via class not instantiate object
    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
}
