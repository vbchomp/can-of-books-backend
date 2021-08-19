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

// THIS DOES NOT WORK!! HOW DO I GET MY TOKEN TO COME WITHOUT THAT SPLIT ERROR? See lines 16-18
// TypeError: Cannot read property 'split' of undefined
//     at /Users/heatherbisgaard/CodeFellows/301/can-of-books-backend/server.js:78:47
//     at Layer.handle [as handle_request] (/Users/heatherbisgaard/CodeFellows/301/can-of-books-backend/node_modules/express/lib/router/layer.js:95:5)

// const token = request.headers.authorization.split(' ')[1];
//   // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
//   jwt.verify(token, getKey, {}, function(err, user) {
//     if (err){
//       response.status(500).send('invalid token');
//     }
//     // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
//     response.status(200).send(user);
//   });

  // try {
  //   let booksDB = BookModel.find({});
  //   response.status(200).send(booksDB);
  // }
  // catch (err) {
  //   response.status(500).send('Database error - fix and come back later!');
  // }

// Not sure what to do with this since the split on line 41 keeps breaking code when it is on server.js. Watching code review, Ryan has it here on books.js, so I copied it above and will leave my whole piece that I copied the route for /books below. I refactored the route on server.js to just be the try/catch. 
//   // books route
// app.get('/books', (request, response) => {
//   const token = request.headers.authorization.split(' ')[1];
//   // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
//   try {
//     jwt.verify(token, getKey, {}, function (err, user) {
//       if (err) {
//         response.status(500).send('invalid token');
//       }
//       // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
//       let email = request.query.email;
//       BookModel.find({email}, (err, books) => {
//         if (err){
//           console.log('Error');
//         } else {
//           response.status(200).send(books);
//         }
//       });
//     });
//   }
//   catch (err) {
//     response.status(500).send('Database error - fix and come back later!');
//   }
// })

  module.exports = BookModel;
