var path = require('path');
var fs = require('fs');
var parser = require('raml-parser');

function firstMethod(req, res, next) {
  next(asdf)
}

module.exports = function(app){
  app.post('/api/validate', validate);
};

function validate(req, res){
  var raml = req.body.raml;

  parser.load(raml).then(function(data){
    console.log(data);

    res.send(data);
  }, function(error){
    console.log('Error parsing: ' + error);

    res.send('Error parsing: ' + error);
  });
}
