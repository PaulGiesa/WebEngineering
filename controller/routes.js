var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var app= express();

var blog = require('../model/blog.json');
var user = require('../model/user.json');
var controllerUser = require('../controller/user'); // functions of user
var controllerBlog = require('../controller/blog'); // functions of blog
// Wurzelroute in Server.js definiert --> /api/V1

var isAuthenticated = false;

//Error-Messages
//TODO wenn hidden == true - beide
function forbidden_token(req, res){
  res.status(403).send({
          success: false,
          message: 'Wrong token'
      });
}
function not_authorized_401(req, res){
  res.status(401).send({
        success: false,
        message: 'No valid authentification'
  });
}
function not_found(req, res){
  res.status(404).send({
        success: false,
        message: 'Page not found'
  });
}

/*
function hidden_no_auth(req, res){
  if(!blog[req.params.id]){       //blog id doesn't exist
    not_found(req, res);
    return;
  }

  if(!isAuthenticated && blog[req.params.id].hidden){  //not accessible -> hidden = true
    not_authorized_401(req,res);
    return;
  }
}
*/

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
// through the following function, every route beneath this function
// has a verified token (or not) --> isAuthenticated
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token,'TheSecretIsAStiiift', function(err, decoded) {
      if (err) {
        isAuthenticated = false;
        next();

      } else {
        // if everything is good, save to request for use in other routes
        isAuthenticated = true;
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    isAuthenticated = false;
    next();
  }
});

router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

router.put('/passwordRecovery', function(req, res){
  if(isAuthenticated){
     if (req.body.password != user.password) {
     res.status(403).json({
       message: 'Your Password is wrong!'
     });
     return;
   }

   user.password = req.body.newPassword;
   var token = jwt.sign({
     expiresInMinutes: 60*24, // 24h
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
 }
 else{
   forbidden_token(req, res);
 }
});

//need key "x-access-token" in header with jwt key as value
//all routes for /blog
router.route('/blog')

  .get(function(req, res){
    if(isAuthenticated){
      res.json(blog);
    }
    else{
      res.json(blog.filter((blogs) => {
        return !blogs.hidden;
      }));
    }
  })

  .post(function(req, res){
    if(!isAuthenticated){  //not accessible -> hidden = true
      not_authorized_401(req,res);
      return;
    }
    else{
      controllerBlog.create_b(req, res)
    };
  });

//all routes for /blog/[number]
router.route('/blog/:id(\\d+)') // \\d+ == digit (regex, at least one)
                                //:id => stores the digit in req.params.id
  .get(function(req, res){
    if(!blog[req.params.id]){       //blog id doesn't exist
      not_found(req, res);
      return;
    }

    if(!isAuthenticated && blog[req.params.id].hidden){  //not accessible -> hidden = true
      not_authorized_401(req,res);
      return;
    }
    controllerBlog.get_b(req, res);
    })
  .delete(function(req, res){
    if(!blog[req.params.id]){       //blog id doesn't exist
      not_found(req, res);
      return;
    }

    if(!isAuthenticated && blog[req.params.id].hidden){  //not accessible -> hidden = true
      not_authorized_401(req,res);
      return;
    }
    controllerBlog.delete_b(req,res);
  })
  .put(function(req, res){
    if(!blog[req.params.id]){       //blog id doesn't exist
      not_found(req, res);
      return;
    }

    if(!isAuthenticated && blog[req.params.id].hidden){  //not accessible -> hidden = true
      not_authorized_401(req,res);
      return;
    }
    controllerBlog.edit_b(req, res);
  });

module.exports = router;
