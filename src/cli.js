#!/usr/bin/env node

'use strict';

var path = require('path'),

    Linter = require('./linter.js'),

    ramllinter = new Linter(),

    filepath;

filepath = path.resolve(process.argv[2]);

ramllinter.lint(filepath, function outputFn(results) {
  console.log(results); // shutup eslint
});
