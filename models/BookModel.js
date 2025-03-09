const mongoose = require('mongoose');

let BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number
});

let BookModel = mongoose.model('books', BookSchema);

module.exports = BookModel;