'use strict';

var typeOf = require('./typeOf.js'),

    levels,
    results = [];

levels = [
  'error',
  'warning',
  'info'
];

/** Add a log entry to the 'results' collection in a consistent way.
  TODO: add more description and follow documentation format
  */
function add(level, resource, message) {
  if (resource && message) {
    results
      .push({
        level: level,
        message: message,
        resource: resource
      });
  } else {

    return results
      .filter(function filterResults(entry) {

        return entry.level === level;
      });
  }
}

function log(level) {

  return !level ? results : (results
    .filter(function filterLog(entry) {

      return level.indexOf(entry.level) !== -1;
    }));
}

// add methods to public-facing api for each of these
levels
  .forEach(function eachLevel(name) {
    log[name] = add.bind(null, name);
  });

log.empty = log.start = function resetLog() {
  results = [];
};

log.levels = function getLevels() {

  return levels.slice(0);
};

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = log;
}
