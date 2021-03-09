const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(data);
            }
            const existingProductIndex = cart.products.findIndex(s => s.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = {...existingProduct, qty: existingProduct.qty + 1};
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(productId, productPrice) {
        fs.readFile(p, (err, data) => {
           if(err) {
               return;
           }
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(data);
            }
            const updatedCart = {...cart};
            const product = updatedCart.products.find(s => s.id === productId);
            if(!product) {
                return;
            }
            const qty = product.qty;
            updatedCart.products = updatedCart.products.filter(s => s.id !== productId);
            updatedCart.totalPrice -= qty * productPrice;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    static getProducts(cb) {
        fs.readFile(p, (err, data) => {
           const cart = JSON.parse(data);
           if(err) {
               cb(null);
           } else {
               cb(cart);
           }
        });
    }
}
