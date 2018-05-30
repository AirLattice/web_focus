// REQUIRE
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var OrientoStore = require('connect-oriento')(session);
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store: new OrientoStore({
    server:'host=45.119.145.162&port=2424&username=root&password=jin85200--&db=focus'
  })
}));
app.use(cookieParser('234A!!@2$$21badfgpoi'));
app.use(passport.initialize());
app.use(passport.session());
//////////////////////////////////////////////////////////////////////
// DATA & USERS
var products = {
  1:{title:'The history of web 1'},
  2:{title:'The next web'}
};
var users = [
  {
    username: 'packman',
    password: 'b+aStUJunI59yeyhQe9CcgSN95d6fzHJRpYfZLEMHfy8MtDk2OZfDcD5GFjxakXSLbynbaOJ34ejMsqmcWz5WZEUlJMvYdZgpndtkIIXkkCScXd18hPBE1a0DN/WuHkSfXhMcX9DskcVq9bBFxLgiKeEe67PuOoTkrxyXE0Uvdo=',
    salt: '3AjJmjU2e161MdpvvsO9YPIOllCr1jS7NTlZ66U4YvXkf8xZZRwXVhAV6YDur4Xlj2522H3MJAtljZHe0MbQcw==',
    displayName: 'PACKMAN'
  }
];
//////////////////////////////////////////////////////////////////////
// ROUTER
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      username:req.body.username,
      password:hash,
      salt:salt,
      displayName:req.body.displayName
    };
    users.push(user);
    req.login(user, function(err){
      req.session.save(function(){
        res.redirect('/welcome');
      });
    });
  });
});
app.get('/auth/register', function(req, res){
  var output = `
  <h1>Register</h1>
  <form action='/auth/register' method='post'>
    <p>
      <input type='text' name='username' placeholder='username'>
    </p>
    <p>
      <input type='password' name='password' placeholder='password'>
    </p>
    <p>
      <input type='text' name='displayName' placeholder='displayName'>
    </p>
    <p>
      <input type='submit'>
    </p>
  </form>
  `;
  res.send(output);
});
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
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  });
});
app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName){
    res.send(`
      <h1>Welcome : ${req.user.displayName}</h1>
      <a href='/auth/logout'>Logout</a>
    `);
  } else{
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href='/auth/login'>Login</a></li>
        <li><a href='/auth/register'>Register</a></li>
      </ul>
    `);
  }
});
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.username == id){
      return done(null, user);
    }
  }
});
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    for(var i=0; i<users.length; i++){
      var user = users[i];
      if(uname === user.username) {
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user);
          } else {
            done(null, false);
          }
        });
      }
    };
    done(null, false);
  }
));
passport.use(new FacebookStrategy({
    clientID: '228612107729627',
    clientSecret: 'b8ba97a8e1c6b5dd1a198903ab004d91',
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  //   User.findOrCreate(..., function(err, user) {
  //     if (err) { return done(err); }
  //     done(null, user);
  //   });
  }
));
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
app.get('/auth/facebook',
  passport.authenticate(
    'facebook'
  )
);
app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login'
    }
  )
);
// app.post('/auth/login', function(req, res){
//   var uname = req.body.username;
//   var pwd = req.body.password;
//   for(var i=0; i<users.length; i++){
//     var user = users[i];
//     if(uname === user.username) {
//       return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
//         if(hash === user.password){
//             req.session.displayName = user.displayName;
//             req.session.save(function(){
//                 res.redirect('/welcome');
//             })
//         } else {
//             res.send(`Who are you <a href="/auth/login">Login</a>`);
//         }
//       });
//     }
//   };
//   res.send(`Who are you <a href="/auth/login">Login</a>`);
// });
app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action='/auth/login' method='post'>
    <p>
      <input type='text' name='username' placeholder='username'>
    </p>
    <p>
      <input type='password' name='password' placeholder='password'>
    </p>
    <p>
      <input type='submit'>
    </p>
  </form>
  <a href='/auth/facebook'>Facebook</a>
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
// app.use((req, res, next) => {
//   const error = new Error('Not found');
//   error.status = 404;
//   next(error);
// });
//
// app.use((error, req, res, nett) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message
//     }
//   });
// });
////////////////////////////////////////////////////////////////
// WEB SERVER LISTEN
app.listen(3000, function(){
  console.log('Connected 3000 port!!!');
});
