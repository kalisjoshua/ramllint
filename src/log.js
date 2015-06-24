'use strict';

var Rules = require('./rules.js'),
    typeOf = require('./typeOf.js');

// filter based on level
function filterEntries(level, entry) {

  return level.indexOf(entry.level) !== -1;
}

// bind level methods for instances
function instanceLevelMethods(addEntry, name) {
  /* jshint validthis:true */
  this[name] = addEntry.bind(null, name);
}

/**
  * @private
  * @description
  * Check for argument definition.
  * @arg {Any} arg - any argument value.
  * @returns {boolean} whether the argument was defined as anything.
  */
function isDef(arg) {

  return arg !== null && arg !== undefined;
}

/**
  * @constructor
  * @description
  * Creates a new instance for logging linting problems.
  * @example
  * var logger = new Log();
  * logger.error('root', 'api_version', 'RAML document must provide api_version', 'RAML');
  * logger.read(); // returns an array of all logged entries
  */
function Log() {
  var stack;

  /**
    * @typedef {object} LogEntry
    * @prop {string} code - the unique identifier for the rule.
    * @prop {Level} level - the level of error: `error`, `warning`, or `info`.
    * @prop {string} message - the "helpful" message to indicate the problem.
    * @prop {string} locale - the resource location within the RAML document.
    * @prop {string} section - the section "type" within the AST.
    */

  /**
    * @protected
    * @description
    * Primary method for logging, made available as instance methods named for
    * the levels of logging available; those methods have the first argument
    * provided automatically.
    * @arg {Level} level - automatically provided, will never be passed by user
    * @arg {string} section - the section within the document entry originated
    * @arg {string} code - uniquge identifier of the rule for the entry
    * @arg {string} message - the (possibly) helpful message to the user
    * @arg {string} locale - the helper string to identify where in the RAML doc
    * @throws {MissingArgumentException} If any argument is not provided
    * @example
    * myLogger.error('resource', 'resource_desc', 'need a description', 'GET http://example.com/resource');
    * @example
    * myLogger.warning('resource', 'resource_desc', 'need a description', 'GET http://example.com/resource');
    * @example
    * myLogger.info('resource', 'resource_desc', 'need a description', 'GET http://example.com/resource');
    */
  function addEntry(level, section, rule, message, locale) {
    if ([section, rule, message, locale].every(isDef)) {
      stack
        .push({
          code: rule.id,
          hint: rule.hint,
          level: level,
          message: message,
          rule: locale,
          section: section
        });
    } else {
      //console.error(arguments);
      throw new Error('Missing arguments calling log.$().'.replace('$', level));
    }
  }

  /**
    * @function error
    * @memberOf Log
    * @instance
    * @description
    * Instance method for logging `error` level entries; calls {@link Log~addEntry}
    * with first argument satisfied, and passing along addition arguments.
    * @see {@link Log~addEntry}
    */

  /**
    * @function warning
    * @memberOf Log
    * @instance
    * @description
    * Instance method for logging `warning` level entries; calls {@link Log~addEntry}
    * with first argument satisfied, and passing along addition arguments.
    * @see {@link Log~addEntry}
    */

  /**
    * @function info
    * @memberOf Log
    * @instance
    * @description
    * Instance method for logging `info` level entries; calls {@link Log~addEntry}
    * with first argument satisfied, and passing along addition arguments.
    * @see {@link Log~addEntry}
    */
  // add methods to public-facing api for each of these
  Rules.getLevels()
    .forEach(instanceLevelMethods.bind(this, addEntry));

  /**
    * @description
    * For use when logging information that will be helpful in debugging but will
    * not necessarily be able to give additional information that the normal log
    * methods require.
    * @arg {any} obj - any object to put into the log
    */
  this.raw = function logRaw(obj) {
    stack.push(obj);
  };

  /**
    * @description
    * Reset the list, of entries, to an empty array.
    */
  this.empty = function emptyStack() {
    stack = [];
  };

  /**
    * @description
    * Retrieve the entries; for the level indicated, or all of them.
    * @arg {Level} [level] - if provided, only include entries that match
    * @returns {LogEntry[]} An array of {@link LogEntry}
    */
  this.read = function readLog(level) {

    return !level ? stack : (stack
      .filter(filterEntries.bind(null, level)));
  };

  this.empty();
}

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = Log;
}
