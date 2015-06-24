'use strict';

var regex = /\s([a-z]+)/i,
    type = Function.prototype.call.bind(Object.prototype.toString);

/**
  * @private
  * @description
  * Unwrap the standard Object.toString() type identifier.
  * @arg {string} str - the string returned from Object.toString().
  * @returns {string} the normalized type name alone.
  */
function strip(str) {

  return str.match(regex)[1].toLowerCase();
}

/**
  * @description
  * Get, or test, the type of an object.
  * @arg {Any} obj - the object to test or get the type of.
  * @arg {string} test - the name of the object type to test against.
  * @returns {(boolean|string)}
  *
  * Return types:
  *
  *   + (boolean) whether or not the object passed in matched the test
  *   + (string) the type of the first argument
  */
function typeOf(obj, test) {
  var result = (obj === global) ? 'global' : strip(type(obj));

  return arguments.length === 1 ? result : result === test;
}

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = typeOf;
}
