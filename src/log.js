(function () {
  "use strict";

  var api = {},
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
        .filter(function (entry) {

          return entry.level === level;
        });
    }
  }

  // add methods to public-facing api for each of these
  levels
    .forEach(function (name) {
      api[name] = add.bind(null, name);
    });

  api.empty = api.start = function () {
    results = [];
  };

  api.levels = function () {
    return levels.slice(0);
  };

  api.log = function (level) {

    return !level ? results : (results
      .filter(function (entry) {

        return level.indexOf(entry.level) !== -1;
      }));
  };

  if (typeof exports === 'object' && exports) {
    module.exports = api;
  }
}());
