var assert = require('assert'),
    rule = require('../src/rules/method_desc.js');

describe('Rules - Method Description', function () {
  it('should be an function', function () {
    assert.equal('function', typeof rule);
  });

  it('should provide a level', function () {
    assert(rule.level);
  });

  it('should provide a message', function () {
    assert(rule.message);
  });

  it('should provide a section', function () {
    assert(rule.section);
  });

  it('should return true for a valid context', function () {
    assert.strictEqual(true, rule({description: 'hello'}));
    assert.strictEqual(false, rule({}));
  });
});
