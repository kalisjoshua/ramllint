var assert = require('assert'),
    rule = require('../src/rules/api_version.js');

describe('Rules - API Version', function () {
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
    assert(/root|resource|method/i.test(rule.section));
  });

  it('should return true for a valid context', function () {
    assert.strictEqual(true, rule({version: 1}));
    assert.strictEqual(false, rule({}));
  });
});
