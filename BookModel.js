'use strict';

const mongoose = require('mongoose');

// this is from the class demo
const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  status: {type: String},
  email: {type: String, required: true},
})

const BookModel = mongoose.model('books', bookSchema);

module.exports = BookModel;
