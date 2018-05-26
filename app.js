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

// ROUTER Modules








// ROUTER
//////////////////////////////////////////////////////////////////////////////
app.get('/list', function(req, res){
  var sql = 'SELECT FROM list'
  db.query(sql).then(function(list){
    res.render('list', {lists:list});
  });
});
//////////////////////////////////////////////////////////////////////////////
app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  var sql = 'SELECT * FROM users';
  db.query(sql).then(function(results){
    for(var i=0; i<results.length; i++){
      var user = results[i];
      if(uname === user.id && pwd === user.pwd){
        req.session.displayName = user.nick;
        return req.session.save(function(){
          res.redirect('/welcome');
        });
      }
    }
    res.send('<h1>Who are you?</h1><a href="/auth/login">login</a>');
  });
});
app.get('/auth/login', function(req, res){
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <h3>You are loged in, now</h3>
      <a href='/auth/logout'>Logout</a>
      <p>
      <a href='/'>Home</a>
    `);
  } else {
    res.render('login');
  }
});
//////////////////////////////////////////////////////////////////////////////
app.get('/welcome', function(req, res){
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href='/auth/logout'>Logout</a>
      <a href='/'>Home</a>
    `);
  } else {
    res.send(`
      <h1> Welcome </h1>
      <a href='/auth/login'>Login</a>
    `);
  }
});
//////////////////////////////////////////////////////////////////////////////
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  res.redirect('/');
});
//////////////////////////////////////////////////////////////////////////////
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
app.get('/add', function(req, res){
  res.render('add');
});
//////////////////////////////////////////////////////////////////////////////
app.post('/auth/register', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var displayName = req.body.displayName;
  var sql = 'INSERT INTO users (id, pwd, nick) VALUES(:username, :password, :displayName)';
  db.query(sql, {
    params:{
      username:username,
      password:password,
      displayName:displayName
    }
  }).then(function(results){
    req.session.displayName = displayName;
    req.session.save(function(){
      res.redirect('/');
    });
  });
});
app.get('/auth/register', function(req, res){
  res.render('register');
});
//////////////////////////////////////////////////////////////////////////////
app.get('/', function(req, res){
  var sql = 'SELECT FROM list'
  db.query(sql).then(function(list){
    res.render('list', {lists:list});
  });
});


// WEB_LISTEN
app.listen(3000, function(){
  console.log('Connected to 3000 port');
});
