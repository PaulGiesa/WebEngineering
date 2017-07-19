var route = require('../controller/routes.js');
var blog = require('../model/blog.json');
var fs = require('fs');



//[req.params.id] used for index array
exports.get_b = function (req, res){
  res.json(blog[req.params.id]);  //send blog
}

exports.delete_b = function (req, res){
  delete blog[req.params.id];
  fs.writeFile('./model/blog.json', JSON.stringify(blog), 'utf-8', (err) => {
    if (err) {
      res.status(500).json({error: err});
    }
    else{
      res.status(200).send({
            success: true ,
            message: 'Page deleted'
      });
    }
  })
}

exports.edit_b = function (req, res){

}
