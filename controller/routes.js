var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var app= express();

var user = require('../model/user.json')
var controllerUser = require('../controller/user'); // functions of user
var controllerBlog = require('../controller/blog'); // functions of blog
// Wurzelroute in Server.js definiert --> /api/V1

// basic route
router.get('/', function(req, res) {
    res.send('Welcome to Stiiift-Site!');
});

// API ROUTES -------------------

// route to authenticate a user /api/V1/login
// to test with Postman: Put ...
//    Body:x-www-forum-urlencoded
//    username    xx
//    password    xx
router.put('/login', function(req, res) {
  // username correct?
  if (req.body.username != user.username) {
    res.json({ success: false, message: 'Authentication failed. User not found.' + user.username + " res " + req.body.username});
    return;
  } else{

    // password correct?
    if (req.body.password != user.password) {
      res.json({ success: false, message: 'Authentication failed. Wrong password.' });
    } else {

      var token = jwt.sign({
        expiresInMinutes: 60*24, // 24h
        username: user.username
      }, 'TheSecretIsAStiiift');
      // return the information including token as JSON
      res.json({
        success: true,
        message: 'So 1 awesome token created' + ' - Hallo I bims 1 Token, lol',
        token: token
      });
    }
  }
});

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});


module.exports = router;
