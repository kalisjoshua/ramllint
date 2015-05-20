#!/usr/bin/env node
'use strict';

var path = require('path'),

    cli = require('commander'),

    Linter = require('./linter.js'),
    project = require('../package.json'),

    ramllinter = new Linter();

cli
  .option('-l, --level <level>', 'logging level: error|warning|info')
  .usage('[options] <api.raml>')
  .version(project.version)
  .parse(process.argv);

cli.args[0] = path.resolve(cli.args[0] || 'api.raml');

ramllinter.lint(cli.args[0], function outputFn(results) {
  console.log(ramllinter.results(cli.level));
});
