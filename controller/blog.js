var route = require('../controller/routes.js');
var blog = require('../model/blog.json');

function hidden_no_auth(req, res){
  if(!blog[req.params.id]){       //blog id doesn't exist
    route.not_found(req, res);
    return;
  }

  if(!isAuthenticated && blog[req.params.id].hidden){  //not accessible -> hidden = true
    route.not_authorized_401(req, res);
    return;
  }
}


//[req.params.id] used for index array
exports.get_b = function (req, res){
  hidden_no_auth(req,res);

  res.json(blog[req.params.id]);  //send blog
}

exports.delete_b = function (req, res){
  hidden_no_auth(req, res);
  //TODO
  
}

exports.edit_b = function (req, res){
  hidden_no_auth(req, res);
  //TODO
}
