// Application Require & Other
var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(session({
  secret: '123455kasldfk324lk23l4k@#$2#4',
  resave: false,
  saveUninitialized: true,
}));
var request = require('request');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
app.get('/', function(req, res){
  res.status(400).send('Sorry');
});

app.post('/auth/login',
  passport.authenticate(
      'local',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false
    }
  )
);


app.listen(3000, function(){
  console.log('Connected to 3000 port');
});
