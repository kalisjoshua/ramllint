'use strict';

var typeOf = require('../typeOf.js');

function rule(obj){

  return (/^\/([a-z]+(_[a-z]+)*|{[a-z]+(_[a-z]+)*})$/.test(obj.relativeUri));
}

rule.level = 'error';

rule.message = 'Each uri resource must be lower case.';

rule.section = 'resource';

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = rule;
}
