module.exports = function(app, session){
  var express = require('express');
  var route = express.Router();
  app.get('/welcome', function(req, res){
    if(req.session.displayName){
      res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
        <a href='/auth/logout'>Logout</a>
      `);
    } else {
      res.send(`
        <h1>You are logout</h1>
      `);
    }
  });
  return route;
};
