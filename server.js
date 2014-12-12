var path = require('path');
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
module.exports = app;

function main(){
  var http = require('http');

  var server = http.createServer(app);

  app.use( bodyParser.json() ); // to support JSON-encoded bodies
  app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies
  app.use(express.static(path.join(__dirname, 'public')));

  require('./routes')(app);
  server.listen(process.env.PORT);
  console.log('Express server listening on port ' + process.env.PORT);
}

main();