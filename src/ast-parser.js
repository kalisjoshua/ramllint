'use strict';

var raml = require('raml-parser'),

    // local libraries
    typeOf = require('./typeOf.js'),

    // module variables
    rTag = /\w+$/;

/**
  * @typedef {object} AST
  * @description
  * An element (object) within the raml-parser AST. Typical structure is:
  * @example
  * {
  *   tag: 'tag:yaml.org,2002:(int|map|seq|string)',
  *   value: 'some string value',
  *   start_mark: {
  *     line: 123,
  *     column: 123
  *   }
  * }
  */

/**
  * @description
  * Parse the AST - from raml-parser.composeFile() - to generate an object
  * representation, of the RAML document, retaining location information for
  * reporting purposes.
  * @arg {string} filepath - the path to the RAML file
  * @returns {Promise} - a Promise object, which resolves to: AST or Error
  */
function astParser(filepath) {

  return raml
    .composeFile(filepath)
    .then(parse);
}

/**
  * @private
  * @desciption
  * Reduce the array of objects to a single object with properties having a
  * value and location.
  * @arg {object} acc - the accumulating object for the #reduce()
  * @arg {AST} obj - the element from the AST
  * @returns {object} acc
  */
function gather(acc, obj) {
  var child = parse(obj);

  // add the new property to the eventual final object
  acc[obj[0].value] = child;

  return acc;
}

/**
  * @private
  * @description
  * Based on the object passed in, determines the path to follow.
  * @arg {AST} obj - an element from the AST
  * @returns {object} - the parsed object passed in
  */
function parse(obj) {

  return obj.tag ? recurse(obj) : simple(obj[1]);
}

/**
  * @private
  * @description
  * Conditionally, further process the object based on its type.
  * @arg {AST} obj - an element from the AST
  * @returns {(object|array|string)}
  */
function recurse(obj) {
  switch(obj.tag.match(rTag)[0]) {
    case 'map':

      return obj.value
        .reduce(gather, {});
    case 'seq':

      return obj.value
        .map(parse);
    default:

      return obj.value;
  }
}

/**
  * @private
  * @description
  * Create a simple object to hold the value of a property and the location
  * within the RAML document; line, and column, numbers.
  * @arg {AST} obj - an element from the AST
  * @returns {object}
  */
function simple(obj) {

  return {
      location: {
        begin: {
          column: 1 + obj.start_mark.column,
          line: 1 + obj.start_mark.line
        },
        end: {
          column: 1 + obj.end_mark.column,
          line: 1 + obj.end_mark.line
        }
      },
      value: (/(?:int|str)$/)
        .test(obj.tag) ? obj.value : parse(obj)
    };
}

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = {parse: astParser};
}
