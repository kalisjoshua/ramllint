'use strict';

var typeOf = require('./typeOf.js'),

    errorMessage,
    levels;

errorMessage = 'Missing argument(s) calling log.$(); $ args passed, 3 needed.';

levels = [
  'error',
  'warning',
  'info'
];

function Log() {
  var stack;

  function addEntry(level, resource, message, rule) {
    var missingArgs = !resource || !message || !rule,
        notEnoughArgs = arguments.length < addEntry.length;

    if (missingArgs || notEnoughArgs) {
      throw new Error(errorMessage
        .replace('$', level)
        .replace('$', arguments.length - 1));
    } else {
      stack
        .push({
          level: level,
          message: message,
          resource: resource,
          rule: rule.id
        });
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
