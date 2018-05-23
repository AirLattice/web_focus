// Application Require & Other
var express = require('express');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '123455kasldfk324lk23l4k@#$2#4',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'pug');
app.set('views', './views');
app.locals.pretty = true;

// OrientDB
var db = require('./config/orientdb')(app);

///////////////////////////////////////////////////

var list = require('./routes/list')(app, db);
app.use('/list', list);

var login = require('./routes/login')(app);
app.use('/login', login);

var add = require('./routes/add')(app, db);
app.use('/add', add);

///////////////////////////////////////////////////


app.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});

app.get('/auth/logout', function(req, res){
  delete req.session.dispalyName;
  res.redirect('/welcome');
});
app.get('/welcome', function(req, res){
  if(req.session.dispalyName){
    res.send(`
      <h1>Hello, ${req.session.dispalyName}</h1>
      <a href='/auth/logout'>Logout</a>
    `);
  } else {
    res.send(`
      <h1> Welcome </h1>
      <a href='/auth/login'>Login</a>
    `);
  }
});
// AUTH/LOGIN
app.post('/auth/login', function(req, res){
  var user = {
    username:'packman',
    password:'111',
    dispalyName:'PACKMAN'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if(uname === user.username && pwd === user.password){
    req.session.dispalyName = user.dispalyName;
    res.redirect('/welcome');
  } else {
    res.send('<h1>Who are you?</h1><a href="/auth/login">login</a>');
  }
})
app.get('/auth/login', function(req, res){ 
  res.render('authlogin');
});
app.get('/', function(req, res){
  res.render('login');
});

// WEB_LISTEN
app.listen(3000, function(){
  console.log('Connected to 3000 port');
});
