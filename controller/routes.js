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

// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token,'TheSecretIsAStiiift', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'Wrong token'
    });
  }
});

// route to show a random message (GET http://localhost:8080/api/)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

router.put('/passwordRecovery', function(req, res){

     if (req.body.password != user.password) {
     res.status(403).json({
       message: 'Your Password is wrong!'
     });
     return;
   }

   user.password = req.body.newPassword;
   var token = jwt.sign({
     exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiry
     username: user.username
   }, 'TheSecretIsAStiiift');

   var fs = require('fs');

   fs.writeFile('./model/user.json', JSON.stringify(user), 'utf-8', (err) => {
     if (err) {
       res.status(500).json({error: err});
     } else {
       res.status(200).json({
         token: token,
        message: 'Password changed successfully'});
     }
   });
 });



module.exports = router;
