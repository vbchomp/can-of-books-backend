'use strict';



// const token = request.headers.authorization.split(' ')[1];
  // // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jwt.verify(token, getKey, {}, function(err, user) {
  //   if (err){
  //     response.status(500).send('invalid token');
  //   }
  //   // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
  //   response.status(200).send(user);
  // });

  try {
    let booksDB = BookModel.find({});
    response.status(200).send(booksDB);
  }
  catch (err) {
    response.status(500).send('Database error - fix and come back later!');
  }

  module.exports = { };
