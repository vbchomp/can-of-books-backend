'use strict';

// dependencies here
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// in order to acces the request request body, use express.json()
app.use(express.json());

const PORT = process.env.PORT || 3001;

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// This is from jsonwebtoken docs 
// https://www.npmjs.com/package/jsonwebtoken
const client = jwksClient({
  // this is from the single page application, advanced settings, endpoint JWKS settings. 
  jwksUri: 'https://dev-xmbqk6d0.us.auth0.com/.well-known/jwks.json'
});

// this comes from this jsonwebtoken docs
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// mongoose / mongo db connection here
const mongoose = require('mongoose');
// connecting to the database
mongoose.connect('mongodb://127.0.0.1:27017/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    seed();
    console.log('Connected to the database');
  })

const BookModel = require('./models/books');


// Seeding the database
async function seed(request, response) {
  let books = await BookModel.find({});
  if (books.length === 0) {
    const bookOne = new BookModel({
      title: "Yoke My Yoga of Self-Acceptance",
      description: "To Yoke mind and body",
      status: "Have not read yet",
      email: "vbchomp@gmail.com",
    });
    const bookTwo = new BookModel({
      title: "Sahara",
      description: "Pitt and Giordino save the world from a chemical waste dump polluting the water supply causing red tide and discover a Civil War ironclad ship in the middle of the desert",
      status: "Good, fast read",
      email: "vbchomp@gmail.com",
    });
    const bookThree = new BookModel({
      title: "Omega Days",
      description: "Within weeks, the world is overrun by the walking dead. Only the quick and the smart, the strong and the determined, will survive—for now",
      status: "BWAINS!!!",
      email: "vbchomp@gmail.com",
    });
    bookOne.save();
    bookTwo.save();
    bookThree.save();
    console.log('I have seeded the DB', "http://localhost:3001/seed");

  }
  console.log('DB already seeded');
}

// test route
app.get('/test', (request, response) => {
  // get the jwt from the headers
  const token = request.headers.authorization.split(' ')[1];
  // console.log()
  // use the jsonwebtoken library to verify that it is a valid jwt
  jwt.verify(token, getKey, {}, function (err, user) {
    if (err) {
      response.status(500).send('Invalid token');
    }
    // prove that everything is working correctly, send the opened jwt back to the front-end
    response.status(200).send(user);
  });
})

// books route
app.get('/books', (request, response) => {
  const token = request.headers.authorization.split(' ')[1];
  console.log('request', request.query.email);
  // console.log('token', token);
  // use the jsonwebtoken library to verify that it is a valid jwt
  let email = request.query.email;
  try {
    jwt.verify(token, getKey, {}, function (err, user) {
      console.log('token', token);
      if (err) {
        response.status(500).send('Invalid token');
      }
      // to prove that everything is working correctly, send the opened jwt back to the front-end
      console.log('email:', email);
      if (email === user.email) {
        // BookModel is the collection created by the schema
        // object of {email} will have value assigned to variable of email is same as {email: email}
        BookModel.find({ email }, (err, books) => {
          if (err) {
            response.status(500).send('Cannot access the database');
          } else {
            response.status(200).send(books);
          }
        });
      } else {
        response.send(' You are not who you say you are!');
      }
    });
  }
  catch (err) {
    response.status(500).send('Server error - fix and come back later!');
  }
})

// seed route
app.get('/seed', seed);

// FIZZO - RYAN said to leave Auth out for now as I am having issues getting new books added with my machine.
// POST new books route
app.post('/books', async (request, response) => {
  // tested that it worked in insomnia
  // response.send('Are we there yet?');
  //using request.body
  // let title = request.body.title;
  // const token = request.headers.authorization.split(' ')[1];
  // console.log('request', request.query.email);
  // or request.body.object uses onject deconstruction
  let { title, description, status, email } = request.body;
  // let bookObjLit = {
  //   title: title,
  //   status: status,
  //   description: description,
  // };
  try {
    // jwt.verify(token, getKey, {}, function (err, user) {
    //   console.log('token', token);
    //   if (err) {
    //     response.status(500).send('Invalid token');
    //   }
    //   console.log('email:', email);
    //   if (email === user.email) {
    // POSTing new book to DB
    let newBook = new BookModel({ title, description, status, email });
    // let bookFour = new BookModel({ title: "Simple Genius", description: "In a world of secrets, human genius is power and sometimes it is simply deadly...", status: "Picked up at ID card office", email: "vbchomp@gmail.com" });

    await newBook.save();
    // bookFour.save();
    // response.send(`${bookObjLit}`);
    // response.send(`${title}, ${description}, ${status}`);
    response.status(200).send(newBook);
  }
  // });
  // }
  catch (err) {
    response.status(500).send('Server error - fix and come back later!');
  }
})

// FIZZO - RYAN said to leave Auth out for now as I am having issues getting books deleted with my machine.
// delete route from code review
// async and await do not work in this delete route. not sure why.
app.delete('/books/:id', async (request, response) => {
  let bookId = request.params.id;
  console.log('request.query:', request.query);
  // user is defined when logged in with auth0
  try {
    // const token = request.headers.authorization.split(' ')[1];
    // console.log()
    // use the jsonwebtoken library to verify that it is a valid jwt
    // jwt.verify(token, getKey, {}, function (err, user) {
    //   if (err) {
    //     response.status(500).send('Invalid token');
    //   } else {
    // prove that everything is working correctly, send the opened jwt back to the front-end
    // let email = request.query.email;
    // console.log('email:', email);
    // if user is authenticated 
    // let requestedBook = BookModel.find({ bookId });
    // if (requestedBook._id === user.email) {
    // delete the book
    // will not work with await here
    await BookModel.findByIdAndDelete(bookId);
    response.send('Deleted that pesky book! You should go add another!');
    // }
    // };
    // });
  }
  catch (err) {
    response.status(500).send('Server error - fix and come back later!');
  }
})

// put request to update a book
app.put('/books/:id', async (request, response) => {
  let bookId = request.params.id;
  console.log('request.body:', request.body);
  // user is defined when logged in with auth0
  try {
    await BookModel.findByIdAndUpdate(bookId, request.body);
    response.send('Updated that book!');
  }
  catch (err) {
    response.status(500).send('Server error - fix and come back later!');
  }
})

// clear route - BE GENTLE
app.get('/clear', clear);

// clearing the database - BE GENTLE
async function clear(request, response) {
  try {
    await BookModel.deleteMany({});
    response.status(200).send('Bombed the database');
  }
  catch (err) {
    response.status(500).send('Error in clearing database');
  }
}

// listening for the port
app.listen(PORT, () => console.log(`listening on ${PORT}`));
