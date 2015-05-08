'use strict';

var defaults = require('./defaults.json'),
    typeOf = require('./typeOf.js'),

    testExec;

testExec = {
  'array': function execArray(a, v) {
    function every(expected) {

      return v.indexOf(expected) >= 0;
    }

    return typeOf(v, 'array') ? a.every(every) : a.indexOf(v) >= 0;
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

function passes(test, value) {
  var type = typeOf(test);

  return type in testExec && testExec[type](test, value);
}

function passing(rule, context) {
  var result;

  if (rule.prereq) {
    result = Object.keys(rule.prereq || {})
      .reduce(function prereqReduce(acc, key) {
        if (acc && passes(rule.prereq[key], context[key])) {
          acc = passes(rule.test, context[rule.prop]);
        }

        return acc;
      }, true);
  } else {
    result = passes(rule.test, context[rule.prop]);
  }

  return result;
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
  var logger = this.logger;

  this.rules[section]
    .forEach(function eachRule(rule) {
      if (rule.test === false) {
        logger.info(section, rule.id, 'skipped ' + format(context.resource, rule), context.lintContext);
      } else {
        if (!passing(rule, context)) {
          logger.error(section, rule.id, format(section, rule), context.lintContext);
        }
      }
    });
};

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = Rules;
}
