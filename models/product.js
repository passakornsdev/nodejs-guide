const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT INTO products (title, price, image_url, description) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.imageUrl, this.description]);
  }

  static deleteById(id) {

  }

  static fetchAll() {
    return db.execute('SELECT id, title, description, price, image_url as imageUrl FROM products');
  }

  static findById(id) {
    return db.execute('SELECT id, title, description, price, image_url as imageUrl FROM products where id = ?', [id]);
  }
};
