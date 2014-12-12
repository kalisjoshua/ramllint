var fs = require('fs');
var path = require('path');

module.exports = function(app){
  fs.readdirSync('./routes/api').forEach(function (file){
    console.log('loading apis');
    if(file === path.basename(__filename)) { return; }

    require('./api/' + file)(app);

  });

  fs.readdirSync('./routes/site').forEach(function(file){
    if(file === path.basename(__filename)) { return; }
    require('./site/' + file)(app)
  });
}