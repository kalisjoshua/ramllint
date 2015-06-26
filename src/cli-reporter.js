'use strict';

var colors = require('cli-color'),

    // local libraries
    typeOf = require('./typeOf.js'),

    TEMPLATES;

TEMPLATES = {
  ENTRY : ('\n' +
    colors.red('{level}') + ' {scope} ' + colors.blackBright('{location}\n') +
    colors.white('{message}') + colors.blackBright(' {rule}') + '{hint}'),
  LOCATION: 'line: {line}, column: {column}',
  MESSAGE: 'RAML section ({section}) must include: {property}.'
};

/**
  * @description
  * Formats and colorizes the log entries for easy reading.
  */
function entry(section, rule, context) {
  var location,
      result,
      skipped;

  if (arguments.length === 3) {
    skipped = rule && rule.test === false;

    if (!skipped) {
      /*jshint validthis:true*/
      this.errors++;
    }

    if (context[rule.prop] && context[rule.prop].location) {
      location = TEMPLATES.LOCATION
        .replace('{column}', context[rule.prop].location.begin.column)
        .replace('{line}', context[rule.prop].location.begin.line);
    } else {
      // FIXME: this could be better; it just can't be fixed here. The fix should
      // be in the linter, where the "scope" property is set.
      location = 'no location';
    }

    result = TEMPLATES.ENTRY
      .replace('{rule}', rule.id)
      .replace('{hint}', rule.hint ? '\nHINT:\n' + rule.hint : '')
      .replace('{level}', skipped ? 'info' : 'error')
      .replace('{location}', location)
      .replace('{scope}', context.scope)
      .replace('{message}', (rule.text || TEMPLATES.MESSAGE)
        .replace('{property}', rule.prop)
        .replace('{section}', section));

    console.log(result);
  } else {
    // FIXME:  missing implementation
    console.log(arguments[0]);
  }
}

function factory() {

  return new Reporter();
}

function Reporter() {
  this.entry = entry.bind(this);

  this.errors = 0;

  this.start = function start() {
    this.errors = 0;
  };

  this.stats = function stats() {

    return this.errors;
  };
}

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = factory;
}
