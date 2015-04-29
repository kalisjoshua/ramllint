'use strict';

var parser = require('raml2obj'),

    log = require('./log.js'),

    rules = require('./rules.js'),
    typeOf = require('./typeOf.js');

function helperRunRules(section, context) {
  var location;

  if (section === 'root') {
    location = section;
  } else {
    location = context.resource;
  }

  rules[section]
    .forEach(function eachRule(rule) {
      if (!rule(context)) {
        log[rule.level](location, rule.message);
      }
    });
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
  helperRunRules('method', method);

  Object.keys(method.responses)
    .forEach(function eachMethod(x) {
      lintResponse(x, method.responses[x]);
    });
}

function lintResource(resource) {
  helperRunRules('resource', resource);

  (resource.methods || [])
    .forEach(lintMethod);

  (resource.resources || [])
    .forEach(lintResource);
}

function lintResponse(code, response) {
  response.code = code;
  helperRunRules('response', response);
}

function lintRoot(root) {
  helperRunRules('root', root);

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

lint.log = log;

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = lint;
}
