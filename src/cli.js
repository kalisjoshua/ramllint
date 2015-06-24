#!/usr/bin/env node
'use strict';

var cli = require('commander'),

    Linter = require('./linter.js'),
    project = require('../package.json'),
    reporter = require('./cli-reporter.js'),

    ramllinter = new Linter();

cli
  .option('-r, --raml <file>', 'the RAML file to lint', './api.raml')
  .option('-l, --level <level>', 'logging level: error|warning|info', 'error')
  .usage('[options] <api.raml>')
  .version(project.version)
  .parse(process.argv);

function print(str) {
  console.log(str);
}

ramllinter.lint(cli.args[0] || cli.raml, reporter.bind(null, print, cli.level));
