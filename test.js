var request = require("request");

var options = { method: 'GET',
  url: 'http://restapi.fs.ncloud.com/focusfs/text.txt',
  qs:
   { oauth_consumer_key: 'CZ9VHQDDUjWBPvLvFWIx',
     oauth_signature_method: 'HMAC-SHA1',
     oauth_timestamp: '1527354125',
     oauth_nonce: 'y65vDT3WuV7',
     oauth_version: '1.0',
     oauth_signature: 'vJwV5SbZoqpg3dZc2ecpUU2zKsc=' },
  headers:
   { 'Postman-Token': '24eaf176-eb6d-48f3-bee0-d413d580cdc3',
     'Cache-Control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
