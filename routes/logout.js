module.exports = function(app, session){
  var express = require('express');
  var route = express.Router();
  app.get('/auth/logout', function(req, res){
    delete req.session.displayName;
    res.redirect('/');
  });
  return route;
};
