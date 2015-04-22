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

  api.log = function (all) {

    return results
      .filter(function (entry) {

        return all || entry.level !== 'info';
      });
  };

  if (typeof exports === 'object' && exports) {
    module.exports = api;
  }
}());
