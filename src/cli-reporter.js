var colors = require('cli-color');

function reporter(print, level, log) {
  'use strict';

  var firstError = log.read()[0],
      STATUS;

  if (firstError && firstError.name === 'YAMLError') {
    print(colors.redBright('\nInvalid RAML file: parse error.'));
    print(firstError.toString());
  } else if (log.read(level).length === 0) {
    print(colors.green('\nLooking good; no error(s) found.'));
  } else {
    STATUS = {
      'error': colors.redBright,
      'info': colors.cyanBright,
      'warning': colors.magentaBright
    };

    log.read(level)
      .forEach(function entryFormat(entry) {
        var output;

        output = '\n' +
          STATUS[entry.level](entry.level) + ' ' +
          entry.rule + '\n' +
          '  ' + colors.white(entry.message) +
          colors.blackBright(' [' + entry.code + ']') +
          (entry.hint ? colors.cyanBright('\nHINT:\n') + entry.hint : '');

        print(output);
      });
  }
}

module.exports = reporter;
