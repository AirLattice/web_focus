// REQUIRE
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var FileStore = require('session-file-store')(session);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));
app.use(cookieParser('234A!!@2$$21badfgpoi'));
var products = {
  1:{title:'The history of web 1'},
  2:{title:'The next web'}
};
//////////////////////////////////////////////////////////////////////
// ROUTER
app.get('/products', function(req, res){
  var output = '';
  for(var name in products) {
    output += `
      <li>
        <a href="/cart/${name}">${products[name].title}</a>
      </li>`
  }
  res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  res.redirect('/welcome');
});
app.get('/welcome', function(req, res){
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <p>
        <a href='/auth/logout'>Logout</a>
      </p>
      `);
  } else{
    res.send(`
      <h1>Welcome</h1>
      <a href='/auth/login'>Login</a>
    `);
  }
});
app.post('/auth/login', function(req, res){
  var user = {
    username: 'packman',
    password: '111',
    displayName: 'PACKMAN'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if(uname === user.username && pwd === user.password){
    req.session.displayName = user.displayName;
    res.redirect('/welcome');
  } else{
    res.redirect('/auth/login');
  }
});
app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action='/auth/login' method='post'>
    <p>
      <input type='text' name='username' placeholder='username'>
    </p>
    <p>
      <input type='text' name='password' placeholder='password'>
    </p>
    <p>
      <input type='submit'>
    </p>
  `;
  res.send(output);
});
app.get('/cart/:id', function(req, res){
  var id = req.params.id;
  if(req.signedCookies.cart){
    var cart = req.signedCookies.cart;
  } else {
    var cart = {};
  }
  if(!cart[id]){
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id])+1;
  res.cookie('cart', cart, {signed:true});
  res.redirect('/cart');
});
app.get('/cart', function (req, res) {
  var cart = req.signedCookies.cart;
  if(!cart){
    res.send('Empty');
  } else {
    var output = '';
    for(var id in cart){
      output += `
        <li>${products[id].title} (${cart[id]})</li>
      `;
    }
  }
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href='/products'>produts List</a>`);
});
app.get('/count', function(req, res){
  if(req.signedCookies.count){
    var count = parseInt(req.signedCookies.count);
  } else {
    var count = 0;
  }
  count = count+1;
  res.cookie('count', count, {signed:true});
  res.send('count : ' + count);
});

////////////////////////////////////////////////////////////////
// ERROR HANDLER
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, nett) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
////////////////////////////////////////////////////////////////
// WEB SERVER LISTEN
app.listen(3000, function(){
  console.log('Connected 3000 port!!!');
});
