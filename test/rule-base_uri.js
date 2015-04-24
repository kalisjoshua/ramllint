var assert = require('assert'),
    rule = require('../src/rules/base_uri.js');

describe('Rules - Base URI', function () {
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
    assert(/root|resource|method|response/i.test(rule.section));
  });

  it('should return true for a valid context', function () {
    assert.strictEqual(true, rule({baseUri: 'http://example.com'}));
    assert.strictEqual(false, rule({}));
  });
});
