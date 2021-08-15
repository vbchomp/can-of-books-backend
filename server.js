'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// This is from jsonwebtoken dock 
// https://www.npmjs.com/package/jsonwebtoken
const client = jwksClient({
  // this url comes from your app on the auth0 dashboard 
  jwksUri: 'https://dev-4rwdhvtd.us.auth0.com/.well-known/jwks.json'
});


app.use(cors());

const PORT = process.env.PORT || 3001;

// this comes from this jsonwebtoken docs
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

app.get('/test', (request, response) => {
  // TODO: 
  // STEP 1: get the jwt from the headers
  const token = request.headers.authorization.split(' ')[1];
  
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  jwt.verify(token, getKey, {}, function(err, user) {
    if (err){
      response.send('invalid token');
    }
    // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end
    response.send(user);
  });
})
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken

app.listen(PORT, () => console.log(`listening on ${PORT}`));
