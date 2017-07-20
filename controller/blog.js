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
            message: 'Blog successfully deleted'
      });
    }
  })
}

exports.edit_b = function (req, res){

  if (req.body.title!=null) {
    blog[req.params.id].title = req.body.title;
  }
  if (req.body.picture!=null) {
    blog[req.params.id].picture = req.body.picture;
  }
  if (req.body.author!=null) {
    blog[req.params.id].author = req.body.author;
  }
  if (req.body.about!=null) {
    blog[req.params.id].about = req.body.about;
  }
  if (req.body.hidden!=null) {
    blog[req.params.id].hidden = req.body.hidden;
  }
  if (req.body.tags!=null) {
      blog[req.params.id].tags = req.body.tags;
  }

  fs.writeFile('./model/blog.json', JSON.stringify(blog), 'utf-8', (err) => {
    if (err) {
      res.status(500).json({error: err});
    }
    else{
      res.statusMessage = 'Blog successfully updated';
      res.status(200).json(blog[req.params.id]);
    }
  })
}

exports.create_b = function(req, res){
  if(req.body.title == null || req.body.picture == null || req.body.author == null
      || req.body.about == null || req.body.hidden == null || req.body.tags == null){
    res.status(400).send({
          message: 'Some values are missing'
    });
    return;
  }

  //get next free index
  var index = 0,
  while(blog[index] != undefined || blog[index] != null)
  {
    index=index+1;
  }

  var blogpost =
  {
    _id : Math.random().toString(36).substr(2, 16);
    index : index
    title : req.body.title,
    picture : req.body.picture,
    author : req.body.author,
    about : req.body.about,
    released : new Date(),
    //TODO find a way to display date in the format of other blogs

    hidden : req.body.hidden,
    tags : req.body.tags
  };

  blog.push(blogpost);

  fs.writeFile('./model/blog.json', JSON.stringify(blog), 'utf-8', (err) => {
    if (err) {
      res.status(500).json({error: err});
    }
    else{
      res.status(201).send({
            success: true ,
            message: 'Blog successfully created'
      });
    }
  })
}
