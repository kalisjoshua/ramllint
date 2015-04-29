'use strict';

var parser = require('raml2obj'),

    log = require('./log.js'),
    rules = require('./defaults.json'),
    typeOf = require('./typeOf.js');

function errorMessage(section, rule) {
  var result;

  result = '[$] RAML section ($) must include: $.'
    .replace('$', rule.id)
    .replace('$', section)
    .replace('$', rule.prop);

  return result;
}

function lint(raml, cb) {
  log.start();

  function resolve() {
    cb(log('error'));
  }

  return parser
    .parse(raml)
    .then(lintRoot, parseError)
    .finally(resolve);
}

function lintMethod(method) {
  runRules('method', method, method.resource);

  Object.keys(method.responses)
    .forEach(function eachMethod(code) {
      lintResponse(code, method.responses[code]);
    });
}

function lintResource(resource) {
  runRules('resource', resource, resource.resource);

  (resource.methods || [])
    .forEach(lintMethod);

  (resource.resources || [])
    .forEach(lintResource);
}

function lintResponse(code, response) {
  response.code = code;
  runRules('response', response, response.resource);
}

function lintRoot(root) {
  runRules('root', root, 'root');

  if (root.resources) {
    root.resources
      .forEach(lintResource);
  } else {
    log.info('root', 'No resources defined.');
  }
}

function parseError() {
  log.error('RAML', 'Parse error.');
}

function runRules(section, context, ref) {
  function eachRule(rule) {
    var value = context[rule.prop];

    if (rule.test) {
      if (!value || !(new RegExp(rule.regex)).test(value)) {
        log.error(ref, errorMessage(ref, rule));
      }
    } else {
      log.info(ref, 'skipped ' + errorMessage(ref, rule));
    }
  }

  rules[section]
    .forEach(eachRule);
}

lint.log = log;

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = lint;
}
