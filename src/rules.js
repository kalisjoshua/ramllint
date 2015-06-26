'use strict';

var defaults = require('./defaults.json'),
    typeOf = require('./typeOf.js'),

    LEVELS,
    ruleTypes;

/**
  * @typedef {string} Level
  * @readonly
  * @description
  * A string representing the level of severity for a rule; rules define their
  * level of reporting.
  * @enum {string}
  */
LEVELS = [
  /** a rule that should NOT be violated */
  'error',
  /** a rule that might be a problem */
  'warning',
  /** a rule just for outputting information */
  'info'
];

/**
  * @typedef {object} Rule
  * @description
  * An object defining the default structure of a Rule.
  * @property {string} id - unique identifier name for the rule
  * @property {object} prereq - collection of named prerequisite(s) based on properties
  * @property {string} prop - the name of the property in the AST to validate
  * @property {(array|boolean|string)} test
  *
  * **Possible values are:**
  *
  *   - (array) A list of valid - string - values
  *   - (boolean)
  *     + `false` indicates a skipped test
  *     + `true` validates any value
  *   - (string) A string, that will be passed to RegExp()
  */

/**
  * @typedef {string} Section
  * @description
  * The location within the AST. The possible values are:
  *   + root
  *   + resource
  *   + method
  *   + response
  */

/**
  * @private
  * @description
  * Collection of rule-type functions
  * @arg {mixed} test - rule test configuration
  * @arg {mixed} value - the value from the AST
  * @returns {boolean} whether or not the value satisfiest the test
  */
ruleTypes = {
  'array': function execArray(test, value) {
    function every(expected) {

      return value.indexOf(expected) >= 0;
    }

    return typeOf(value, 'array') ? test.every(every) : test.indexOf(value) >= 0;
  },
  'boolean': function execBoolean(test, value) {

    return !!value;
  },
  'regexp': function execRegExp(test, value) {

    return test.test(value);
  }
};

/**
  * @private
  * @description
  * Merge custom options with defaults; used in Array.map().
  * @arg {Options} options - default override options.
  * @arg {object} rule - instance within defaults.
  * @returns {object} A copy of the default rule customized optionally.
  */
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

/**
  * @private
  * @description
  * Check the type of test and run.
  * @arg {mixed} test - value of the test prop in rules.
  * @arg {mixed} value - value from the AST.
  * @returns {boolean} whether or not the value satisfies the test.
  */
function passes(test, value) {

  return ruleTypes[typeOf(test)](test, value && value.value);
}

/**
  * @constructor
  * @description
  * Create an object holding all rules and provides the capability to run them.
  * against contexts of an AST.
  * @arg {Log} logger - an instance of Log to keep track of entries.
  * @arg {Options} options - external customization of rules.
  */
function Rules(logger, options) {
  this.rules = Object.keys(defaults)
    .reduce(function sections(full, section) {
      full[section] = defaults[section]
        .map(mapRules.bind(null, options));

      return full;
    }, {});

  this.logger = logger;
}

Rules.getLevels = [].slice.bind(LEVELS, 0);

/**
  * @description
  * Instance method to execute rules per section.
  * @arg {Section} section - the name of the section to run rules against.
  * @arg {Context} context - the context to run rules against.
  */
Rules.prototype.run = function runRules(section, context) {
  function eachRule(rule) {
    var isPassing = false,
        prereq,
        temp = passes(rule.test, context[rule.prop]);

    if (rule.prereq) {
      prereq = Object.keys(rule.prereq)
        .some(function prereqReduce(property) {

          return passes(rule.prereq[property], context[property]);
        });

      // the test automatically passes if the prereq is not satisfied
      isPassing = prereq ? temp : true;
    } else {
      isPassing = temp;
    }

    if (!isPassing || rule.test === false) {
      this.logger(section, rule, context);
    }
  }

  this.rules[section]
    .forEach(eachRule.bind(this));
};

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = Rules;
}
