var path = require('path');
var fs = require('fs');
var parser = require('raml2obj');
var _ = require('underscore');

function firstMethod(req, res, next) {
  next(asdf)
}

module.exports = function(app){
  app.post('/api/validate', validate);
};

function validate(req, res){
  var raml = req.body.raml;

  parser.load(raml).then(function(data){
    //console.log(data);

    extended_validation(data, res);

    res.send(data);
  }, function(error){
    console.log('Error parsing: ' + error);

    res.send('Error parsing: ' + error);
  });
}

function extended_validation(raml, res){
  typeof raml.baseUri === 'undefined' && res.send('Error parsing: while validating root properties missing "baseUri"');
  typeof raml.version === 'undefined' && res.send('Error parsing: while validating root properties missing "version"');

  typeof raml.resources === 'undefined' && res.send('Error parsing: no resources specified');

  console.log(getAllResources(raml));
}

function getAllResources(raml){
  return _.reduce(raml.resources, function(xs, x){ return getAllResources(x) + x.relativeUri + '\n' + xs; }, '');
}