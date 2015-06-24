'use strict';

var Log = require('./log.js'),
    parser = require('./ast-parser.js'),
    Rules = require('./rules.js'),
    typeOf = require('./typeOf.js'),
    valueOf = require('./ast-valueOf.js');

/**
  * @typedef {object} Context
  * @description
  * An object generated object, transformed from {@link AST}, representing a
  * location within the RAML document.
  * @prop {Any} value - the representation of the value from the document.
  * @prop {string} location - the line number and column location.
  */

/**
  * @typedef {object} Options
  * @description
  * An object containing key/value pairs to configure the rules for the linter.
  * Three available value types are accepted:
  *   - (string) - a regular expression to test against
  *   - (boolean)
  *     + true - evaluates that the value is provided (any value)
  *     + false - skips the rule validation; an 'info' entry will be logged
  *   - (array) - a list of stings to check the value against; any match passes
  * @example
  * {
  *   "api_version": true,
  *   "base_uri": "^[a-z]+[_a-z]{3}$",
  *   "code_desc": false,
  *   "request_schema": [
  *     "application/json"
  *   ]
  * }
  */

/**
  * @private
  * @description
  * Flatten the context to reduce needless recursion overhead.
  * @arg {Context} context - the context to extract the examples and schemas out of.
  */
function flattenExamplesAndSchemas(context) {
  context.examples = {value: []};
  context.schemas = {value: []};

  function flattener(mediatype) {
    var example = valueOf(context, 'body', mediatype, 'example', false),
        schema = valueOf(context, 'body', mediatype, 'schema', false);

    /* istanbul ignore else */
    if (example) {
      context.examples.value.push(mediatype);
    }

    /* istanbul ignore else */
    if (schema) {
      context.schemas.value.push(mediatype);
    }
  }

  Object.keys(valueOf(context, 'body', {}))
    .forEach(flattener);
}

/**
  * @private
  * @description
  * Handle configuration and rule execution for the method section.
  * @arg {Rule} rules - instance of Rules containing default and custom rules.
  * @arg {Context} parent - the parent context object.
  * @arg {Context} context - current (method) object location within AST.
  */
function lintMethod(rules, parent, context) {
  var method = valueOf(context, 'method', '').toUpperCase(),
      space = new Array(8 - method.length).join(' ');

  context.scope = method + space + parent.scope;

  flattenExamplesAndSchemas(context);

  // evaluate all rules for this level of the AST
  rules.run('method', context);

  // attempt to recurse into the AST
  Object.keys(valueOf(context, 'responses', {}))
    .forEach(function eachMethod(code) {
      lintResponse(rules, code, context, valueOf(context, 'responses', code, {}));
    });
}

/**
  * @private
  * @description
  * Handle configuration and rule execution for the resource section.
  * @arg {Rule} rules - instance of Rules containing default and custom rules.
  * @arg {Context} parent - the parent context object.
  * @arg {Context} context - current (resource) object location within AST.
  */
function lintResource(rules, parent, context) {
  context.scope = parent.scope + valueOf(context, 'relativeUri', '');

  // evaluate all rules for this level of the AST
  rules.run('resource', context);

  // attempt to recurse into the AST
  valueOf(context, 'methods', [])
    .forEach(lintMethod.bind(null, rules, context));

  // attempt to recurse into the AST
  valueOf(context, 'resources', [])
    .forEach(lintResource.bind(null, rules, context));
}

/**
  * @private
  * @description
  * Handle configuration and rule execution for the response section.
  * @arg {Rule} rules - instance of Rules containing default and custom rules.
  * @arg {string} code - the response code of the current context.
  * @arg {Context} parent - the parent context object.
  * @arg {Context} context - current (response) object location within AST.
  */
function lintResponse(rules, code, parent, context) {
  context.scope = parent.scope + ' ' + valueOf(context, 'code', '');

  flattenExamplesAndSchemas(context);

  // evaluate all rules for this level of the AST
  rules.run('response', context);
}

/**
  * @private
  * @description
  * Handle configuration and rule execution for the root section.
  * @arg {Rule} rules - instance of Rules containing default and custom rules.
  * @arg {Context} context - current (root) object location within AST.
  */
function lintRoot(rules, context) {
  context.scope = valueOf(context, 'baseUri', '');

  rules.run('root', context);

  valueOf(context, 'resources', [])
    .forEach(lintResource.bind(null, rules, context));
}

/**
  * @constructor
  * @description
  * Creates a new instance with the given options; passed in options are merged
  * with defaults.
  * @arg {Options} options - configuration options from project based prefs file.
  * @example
  * // using only default rule definitions
  * var basicLinter = new Linter();
  * @example
  * // passing in customizations
  * var myLinter = new Linter({api_version: false});
  */
function Linter(options) {
  var log = new Log(),
      rules = new Rules(log, options);

  /**
    * @callback LinterCB
    * @description
    * The function to handle the results of linting the RAML document.
    * @arg {Log} log
    */

  /**
    * @description
    * Run all rules on the provided RAML document.
    * @arg {string} raml - the RAML document as a string or filepath.
    * @arg {LinterCB} callback - the callback to receive the linting results.
    * @example
    * basicLinter.lint(myRAML, function (log) {
    *   // check log for errors
    *   if (log.read('error')) {
    *     // report errors
    *   }
    * });
    */
  this.lint = function lint(raml, callback) {
    log.empty();

    return parser
      .parse(raml)
      .then(this.errorWrap.bind(this, rules), log.raw)
      .finally(callback.bind(this, log));
  };
}

/**
  * @description
  * Catch developer/development error(s). Errors that fail silently are
  * extremely frustrating and counter-productive.
  * @arg {Rule} rules - instance of Rules containing default and custom rules.
  * @arg {Context} context - current (method) object location within AST.
  */
Linter.prototype.errorWrap = function errorWrap(rules, root) {
  // catch errors within the async flow
  try {
    lintRoot(rules, root);
  } catch (e) {
    // output the error to make it visible while developing
    console.log(e);
    throw e;
  }
};

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = Linter;
}
