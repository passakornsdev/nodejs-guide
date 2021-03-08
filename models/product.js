const products = [];

module.exports = class product {
    constructor(title) {
        this.title = title;
    }

    save() {
        products.push(this);
    }

    // call func via class not instantiate object
    static fetchAll() {
        return products;
    }
}
