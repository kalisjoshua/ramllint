'use strict';

var typeOf = require('../typeOf.js');

// obj will be the context that is needed for validation
function rule(obj) {

  return !!obj.version;
}

// log level
rule.level = 'error';

// message for log
rule.message = 'RAML file must include a version number.';

//section of document to check
rule.section = 'root';

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = rule;
}
