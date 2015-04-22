"use strict";

var fs = require('fs'),
    path = require('path'),
    ramllinter = require('./ramllint.js');

var file,
    filepath;

filepath = path.resolve(process.argv[2]);

file = fs.readFileSync(filepath, 'utf8');

ramllinter(file);
