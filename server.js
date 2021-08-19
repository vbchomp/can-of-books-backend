'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { request } = require('express');

const BookModel = require('./BookModel');

// This is from jsonwebtoken docs 
// https://www.npmjs.com/package/jsonwebtoken
const client = jwksClient({
  // this is from the single page application, advanced settings, endpoint JWKS settings. 
  jwksUri: 'https://dev-xmbqk6d0.us.auth0.com/.well-known/jwks.json'
});

// this is from the class demo
// const bookSchema = new mongoose.Schema({
//   title: {type: String, required: true},
//   description: {type: String, required: true},
//   status: {type: String},
//   email: {type: String},
// })

// const BookModel = mongoose.model('books', bookSchema);

// this comes from this jsonwebtoken docs
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Seeding the database
async function seed(request, response) {
  let books = await BookModel.find({});
  if (books.length === 0) {
    const bookOne = new BookModel({
      title: "Yoke My Yoga of Self-Acceptance",
      description: "To Yoke mind and body",
      status: "Not sure what this is for",
      email: "vbchomp@gmail.com",
    });
    const bookTwo = new BookModel({
      title: "Sahara",
      description: "Pitt and Giordino save the world from a chemical waste dump polluting the water supply causing red tide and discover a Civil War ironclad ship in the middle of the desert",
      status: "Not sure what this is for",
      email: "vbchomp@gmail.com",
    });
    const bookThree = new BookModel({
      title: "Omega Days",
      description: "Within weeks, the world is overrun by the walking dead. Only the quick and the smart, the strong and the determined, will survive—for now",
      status: "Not sure what this is for",
      email: "vbchomp@gmail.com",
    });
    bookOne.save();
    bookTwo.save();
    bookThree.save();
    console.log('I have seeded the DB', "http://localhost:3001/seed");

  }
  console.log('DB already seeded');
}


// Clearing the database
async function clear(request, response) {
  try {
    await BookModel.deleteMany({});
    console.log('Bombed the DBase');
  }
  catch (err) {
    console.log('Error in clearing database');
  }
}


// test route
app.get('/test', (request, response) => {
  // DONE: 
  // STEP 1: get the jwt from the headers
  const token = request.headers.authorization.split(' ')[1];
  console.log()
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  jwt.verify(token, getKey, {}, function (err, user) {
    if (err) {
      response.status(500).send('invalid token');
    }
    // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
    response.status(200).send(user);
  });
})

// books route
app.get('/books', (request, response) => {
  const token = request.headers.authorization.split(' ')[1];
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  try {
    jwt.verify(token, getKey, {}, function (err, user) {
      if (err) {
        response.status(500).send('invalid token');
      }
      // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
      let email = request.query.email;
      BookModel.find({email}, (err, books) => {
        if (err){
          console.log('Error');
        } else {
          response.status(200).send(books);
        }
      });
    });
  }
  catch (err) {
    response.status(500).send('Database error - fix and come back later!');
  }
})

// seed route
app.get('/seed', seed);

// clear route - BE GENTLE
app.get('/clear', clear);


// connecting to the database
mongoose.connect('mongodb://127.0.0.1:27017/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to the database');
  })

// listening for the port
app.listen(PORT, () => console.log(`listening on ${PORT}`));
