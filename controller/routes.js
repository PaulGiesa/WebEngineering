var express = require('express');
var router = express.Router();


var user = require('../model/user')
var controllerUser = require('../controller/user'); // functions of user
var controllerBlog = require('../controller/blog'); // functions of blog
// Wurzelroute in Server.js definiert --> /api/V1

// basic route
router.get('/', function(req, res) {
    res.send('Welcome to Stiiift-Site!');
});

// API ROUTES -------------------

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.put('/login', function(req, res) {
  // find the user
  user.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});


module.exports = router;
