module.exports = function(app, db){
  var express = require('express');
  var route = express.Router();
  route.get('/', function(req, res){
    var sql = 'SELECT FROM list'
    db.query(sql).then(function(list){
      res.render('list', {lists:list});
    });
  });
  return route;
};
