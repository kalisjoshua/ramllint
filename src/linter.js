'use strict';

var parser = require('raml2obj'),

    Log = require('./log.js'),
    Rules = require('./rules.js'),
    typeOf = require('./typeOf.js');

function Linter(options) {
  var log = new Log(),
      rules = new Rules(log, options);

  this.lint = function lint(raml, cb) {
    log.empty();

    function resolve() {
      cb(log.read('error'));
    }

    return parser
      .parse(raml)
      .then(lintRoot.bind(this, rules), parseError)
      .finally(resolve);
  };

  function parseError() {
    log.error('RAML', 'parse_error', '[parse_error] Parse error.', 'root');
  }
}

function lintMethod(rules, lintContext, method) {
  method.lintContext = method.method.toUpperCase() + ' ' + lintContext;

  rules.run('method', method);

  Object.keys(method.responses || {})
    .forEach(function eachMethod(code) {
      lintResponse(rules, method.lintContext, code, method.responses[code] || {});
    });
}

function lintResource(rules, lintContext, resource) {
  resource.lintContext = lintContext + resource.relativeUri;

  rules.run('resource', resource);

  (resource.methods || [])
    .forEach(lintMethod.bind(this, rules, resource.lintContext));

  (resource.resources || [])
    .forEach(lintResource.bind(this, rules, resource.lintContext));
}

function lintResponse(rules, lintContext, code, response) {
  response.code = code;
  response.lintContext = lintContext + ' ' + code;
  rules.run('response', response);
}

function lintRoot(rules, root) {
  root.lintContext = root.baseUri || 'no baseUri';
  root.resource = 'root';
  rules.run('root', root);

  (root.resources || [])
    .forEach(lintResource.bind(this, rules, root.lintContext));
}

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = Linter;
}
