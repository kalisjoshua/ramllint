var fs = require('fs'),
    parser = require('raml2obj'),

    log = require('./log.js'),
    typeOf = require('./typeOf.js'),

    regex = /\.js$/i,
    rules = {};

// read in all rules
fs.readdirSync(__dirname + '/rules')
  .forEach(function (file) {
    var rule;

    /* istanbul ignore else */
    if (regex.test(file)) {
      rule = require(__dirname + '/rules/' + file, 'utf8');

      rule.id = file.replace(regex, '');

      rule.message = '[$] $'
        .replace('$', rule.id)
        .replace('$', rule.message);

      if(/root|method|resource/i.test(rule.section)) {
        if (!rules[rule.section]) {
          rules[rule.section] = [rule];
        } else {
          rules[rule.section].push(rule);
        }
      } else {
        throw new Error('Invalid rule section "$".'.replace('$', rule.section));
      }
    }
  });

(function () {
  "use strict";

  function helper_run_rules(section, context) {
    var location;

    if (section === 'root') {
      location = section;
    } else {
      location = context.resource;
    }

    rules[section]
      .forEach(function (rule) {
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
      .then(lint_root, parse_error)
      .finally(resolve);
  }

  function lint_method(method) {
    helper_run_rules('method', method);
  }

  function lint_resource(resource) {
    helper_run_rules('resource', resource);

    (resource.methods || [])
      .forEach(lint_method);

    (resource.resources || [])
      .forEach(lint_resource);
  }

  function lint_root(root) {
    helper_run_rules('root', root);

    if (root.resources) {
      root.resources
        .forEach(lint_resource);
    } else {
      log.info('root', 'No resources defined.');
    }
  }

  function parse_error(error) {
    log.error('RAML', 'Parse error.');
  }

  lint.log = log;

  /* istanbul ignore else */
  if (typeOf(exports, 'object')) {
    module.exports = lint;
  }
}());
