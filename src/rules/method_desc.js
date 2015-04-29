'use strict';

var typeOf = require('../typeOf.js');

// obj will be the context that is needed for validation
function rule(obj) {

  return !!obj.description;
}

// log level
rule.level = 'error';

// message for log
rule.message = 'Methods need to provide a description.';

//section of document to check
rule.section = 'method';

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = rule;
}
