'use strict';

var defaults = require('./defaults.json'),
    typeOf = require('./typeOf.js'),

    testExec;

testExec = {
  'array': function execArray(a, v) {

    return a.indexOf(v) >= 0;
  },
  'boolean': function execBoolean(t, v) {

    return !!v;
  },
  'regexp': function execRegExp(r, v) {

    return r.test(v);
  },
  'string': function execString(s, v) {

    return (new RegExp(s)).test(v);
  }
};

function format(section, rule) {
  var result;

  result = '[$] RAML section ($) must include: $.'
    .replace('$', rule.id)
    .replace('$', section)
    .replace('$', rule.prop);

  return result;
}

function mapRules(options, rule) {
  var custom;

  if (options && rule.id in options) {
    custom = JSON.parse(JSON.stringify(rule));
    custom.test = options[rule.id];
  } else {
    custom = rule;
  }

  if (typeOf(custom.test, 'string')) {
    custom.test = new RegExp(custom.test);
  }

  return custom;
}

function passes(rule, value) {
  var type = typeOf(rule.test);

  return type in testExec && testExec[type](rule.test, value);
}

function Rules(logger, options) {
  this.rules = Object.keys(defaults)
    .reduce(function sections(full, section) {
      full[section] = defaults[section]
        .map(mapRules.bind(null, options));

      return full;
    }, {});

  this.logger = logger;
}

Rules.prototype.passes = passes;

Rules.prototype.run = function runRules(section, context) {
  this.rules[section]
    .forEach(function eachRule(rule) {
      if (rule.test === false) {
        this.logger.info(section, 'skipped ' + format(context.resource, rule), rule);
      } else {
        if (!passes(rule, context[rule.prop])) {
          this.logger.error(section, format(section, rule), rule);
        }
      }
    }.bind(this));
};

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = Rules;
}
