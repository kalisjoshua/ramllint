'use strict';

var colors = require('cli-color'),

    // local libraries
    typeOf = require('./typeOf.js'),

    STATUS,
    TEMPLATE;

STATUS = {
  'error': colors.redBright,
  'info': colors.cyanBright,
  'warning': colors.magentaBright
};

TEMPLATE = '\n{status} {rule}\n  {message} {code}{hint}';

/**
  * @private
  * @description
  * Format log entries.
  * @arg {LogEntry} entry
  * @returns {string}
  */
function entryFormat(entry) {

  return TEMPLATE
    .replace('{status}', STATUS[entry.level](entry.level))
    .replace('{rule}', entry.rule)
    .replace('{message}', colors.white(entry.message))
    .replace('{code}', colors.blackBright('[' + entry.code + ']'))
    .replace('{hint}', (entry.hint ? colors.cyanBright('\nHINT:\n') + entry.hint : ''));
}

/**
  * @description
  * CLI Reporter; formats and colorizes the log entries for easy reading, passing
  * the resulting string(s) to the print function (passed in).
  * @arg {function} print - the function to receive the final output string
  * @arg {Level} level - the level of entry to include
  * @arg {Log} log - the log of results
  * @arg {Any} complete - a value provided to indicate the end of reporting
  */
function cliReporter(print, level, log, complete) {
  var finalColor = 'bgGreen',
      firstError = log.read()[0];

  if (firstError && firstError.name === 'YAMLError') {
    print(colors.redBright('\nInvalid RAML file: parse error.'));
    print(firstError.name);

    finalColor = 'bgRed';
  } else if (log.read(level).length === 0) {
    print(colors.green('\nLooking good; no error(s) found.'));
  } else {
    log.read(level)
      .map(entryFormat)
      .forEach(print);

    finalColor = 'bgRed';
  }

  print(colors.white[finalColor](complete || '\nRAML Lint, finished.'));
}

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = cliReporter;
}
