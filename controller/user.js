var user = require('../model/user.json');
var jwt = require('jsonwebtoken');
var routes = require('../controller/routes.js')

exports.login = function(req, res){
  // username correct?
  if (req.body.username != user.username) {
    res.json({ success: false, message: 'Authentication failed. User not found.'});
    return;
  }
  // password correct?
  if (req.body.password != user.password) {
    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
    return;
  }
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
};

exports.passwordRecovery = function (req,res){
  if(res.locals.isAuthenticated){
    // password correct?
    if (req.body.password != user.password) {
      res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      return;
    }
    if (req.body.newPassword == '' || req.body.newPassword == undefined){
      res.json({ success: false, message: 'Please enter a valid password as new password.' });
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
   routes.forbidden_token(req, res);
 }
};
