'use strict';

var fs = require('fs'),
    path = require('path'),

    Linter = require('./linter.js'),

    ramllinter = new Linter(),

    file,
    filepath;

filepath = path.resolve(process.argv[2]);

file = fs.readFileSync(filepath, 'utf8');

ramllinter.lint(file, function outputFn(results) {
  this.console.log(results); // shutup eslint
});
