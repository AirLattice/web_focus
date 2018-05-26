module.exports = function(app, session, bodyparser){
  var express = require('express');
  var route = express.Router();
  app.post('/auth/register', function(req, res){
    var user = {
      username: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName
    };
    users.push(user);
    res.send(users);
  });
  app.get('/auth/register', function(req, res){
    res.render('register');
  });
  return route;
};
