'use strict';

var fs = require('fs'),
    path = require('path'),

    ramllinter = require('./ramllint.js'),

    file,
    filepath;

filepath = path.resolve(process.argv[2]);

file = fs.readFileSync(filepath, 'utf8');

ramllinter(file, function outputFn(results) {
  this.console.log(results); // shutup eslint
});
