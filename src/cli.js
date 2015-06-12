#!/usr/bin/env node

var path = require('path'),

    cli = require('commander'),
    colors = require('cli-color'),

    Linter = require('./linter.js'),
    project = require('../package.json'),

    ramllinter = new Linter();

cli
  .option('-l, --level <level>', 'logging level: error|warning|info')
  .usage('[options] <api.raml>')
  .version(project.version)
  .parse(process.argv);

cli.args[0] = path.resolve(cli.args[0] || 'api.raml');

ramllinter.lint(cli.args[0], function outputFn() {
  'use strict';

  var STATUS;

  if (ramllinter.results(cli.level).length === 0) {
    console.log(colors.green('\nLooking good; no error(s) found.'));
  } else {
    STATUS = {
      'error': colors.redBright,
      'info': colors.cyanBright,
      'warning': colors.magentaBright
    };

    ramllinter.results(cli.level)
      .forEach(function entryFormat(entry) {
        var output;

        output = '\n' +
          STATUS[entry.level](entry.level) + ' ' +
          entry.rule + '\n' +
          '  ' + colors.white(entry.message) +
          colors.blackBright(' [' + entry.code + ']') +
          (entry.hint ? colors.cyanBright('\nHINT:\n') + entry.hint : '');

        console.log(output);
      });
  }
});
