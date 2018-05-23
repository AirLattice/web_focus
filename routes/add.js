module.exports = function(app, db){
  var express = require('express');
  var route = express.Router();
  app.get('/add', function(req, res){
    res.render('add');
  });
  app.post('/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO list (title, description, author) VALUES(:title, :desc, :author)';
    db.query(sql, {
      params:{
        title:title,
        desc:description,
        author:author
      }
    }).then(function(results){
        res.redirect('/list');
    });
  });
  return route;
};
