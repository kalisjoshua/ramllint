var raml = require('raml-parser');

raml.loadFile('drapi.raml').then( function(data) {
  console.log(data);
}, function(error) {
  console.log('Error parsing: ' + error);
});