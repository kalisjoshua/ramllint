'use strict';

var typeOf = require('./typeOf.js'),

    levels;

levels = [
  'error',
  'warning',
  'info'
];

function isDef(arg) {

  return arg != null;
}

function Log() {
  var stack;

  function addEntry(level, section, code, message, locale) {
    if ([section, code, message, locale].every(isDef)) {
      stack
        .push({
          code: code,
          level: level,
          message: message,
          rule: locale,
          section: section
        });
    } else {
      throw new Error('Missing arguments calling log.$().'.replace('$', level));
    }
  }

  // add methods to public-facing api for each of these
  levels
    .forEach(function eachLevel(name) {
      this[name] = addEntry.bind(null, name);
    }.bind(this));

  this.empty = function emptyStack() {
    stack = [];
  };

  this.read = function readLog(level) {

    return !level ? stack : (stack
      .filter(function filterLog(entry) {

        return level.indexOf(entry.level) !== -1;
      }));
  };

  this.empty();
}

Log.levels =
Log.prototype.levels = function getLevels() {

  return levels.slice(0);
};

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = Log;
}
