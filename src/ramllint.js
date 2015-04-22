var log = require('./log.js'),
    parser = require('raml2obj');

(function () {
  "use strict";

  function _Linter(raml, cb) {
    parser
      .parse(raml)
      .then(root_validation, parse_error)
      .then(function () {
        cb(log.log(true));
      });
  }

  function helper_resource_title(resource) {
    var len = resource.resources ? resource.resources.length : 0;

    return resource.parentUrl + resource.relativeUri + ' (#)'.replace('#', len);
  }

  function method_validation(method) {
    log.info(method.method, 'info');
  }

  function parse_error(error) {
    log.error('root', 'Error parsing: ' + error);
  }

  function resource_validation(resource) {
    log.info(helper_resource_title(resource), 'info');

    (resource.methods || [])
      .forEach(method_validation);

    (resource.resources || [])
      .forEach(resource_validation);
  }

  function root_validation(root) {
    root.resources
      .forEach(resource_validation);
  }

  if (typeof exports === 'object' && exports) {
    module.exports = _Linter;
  }
}());
