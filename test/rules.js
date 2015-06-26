var assert = require('assert'),

    Rules = require('../src/rules.js'),

    config,
    log = [];

config = new Rules(function (section, rule, context) {
  log.push([section, rule, context]);
});

describe('RAML Linter - Rules', function () {
  it('should be an function', function () {
    assert.equal('function', typeof Rules);
  });

  it('should have an instance', function () {
    assert(config);
    assert.equal('object', typeof config);
  });

  it('should have functions', function () {
    assert.equal('function', typeof config.run);
  });

  it('should provide a list of levels', function () {
    assert.deepEqual(['error', 'warning', 'info'], Rules.getLevels());
  });

  it('should create isolated instances', function () {
    var custom = new Rules(log, {api_version: false}),
        standard = new Rules(log);

    assert.notDeepEqual(custom.rules, standard.rules);
  });
});
