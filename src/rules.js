'use strict';

var fs = require('fs'),

    typeOf = require('./typeOf.js'),

    DIR_OF_RULES = __dirname + '/rules/',

    rFileTypes = /\.js$/i,
    rRuleTypes = /root|method|resource|response/i,
    rules = {};

function loadRule(file) {
  var rule = require(DIR_OF_RULES + file, 'utf8');

  rule.id = file.replace(rFileTypes, '');

  rule.message = '[$] $'
    .replace('$', rule.id)
    .replace('$', rule.message);

  if(rRuleTypes.test(rule.section)) {
    if (!rules[rule.section]) {
      rules[rule.section] = [rule];
    } else {
      rules[rule.section].push(rule);
    }
  } else {
    throw new Error('Invalid rule section "$".'.replace('$', rule.section));
  }
}

// iterate over files in rules/
fs.readdirSync(DIR_OF_RULES)
  .forEach(function iterate(file) {
    /* istanbul ignore else */
    if (rFileTypes.test(file)) {
      loadRule(file);
    }
  });

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = rules;
}
