// Application Require & Other
var express = require('express');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var app = express();


// SESSION CONFIG
app.use(session({
  secret: '123455kasldfk324lk23l4k@#$2#4',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));
var request = require('request');

// Middle
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());


// PASSPORT
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.set('view engine', 'pug');
app.set('views', './views');
app.locals.pretty = true;


// OrientDB
var db = require('./config/orientdb')(app);









// WEB_LISTEN
app.listen(3000, function(){
  console.log('Connected to 3000 port');
});
