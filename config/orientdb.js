module.exports = function(app){
  var OrientDB = require('orientjs');
  var server = OrientDB({
  host: '10.10.10.3',
  port: 2424,
  username: 'root',
  password: 'jin85200--'
  });
  var db = server.use('focus');
  return db;
};
