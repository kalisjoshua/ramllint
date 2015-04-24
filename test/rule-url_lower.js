var assert = require('assert'),
    rule = require('../src/rules/url_lower.js');

describe('Rules - URL Lower', function () {
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

  [
    // GOOD
    ['/example', true],
    ['/{example}', true],
    ['/{example_example}', true],
    ['/long_example', true],
    ['/really_long_example', true],
    
    // BAD
    ['example', false],
    ['ex ample', false],
    ['/ex ample', false],
    ['_example', false],
    ['/_example', false],
    ['/example_', false],    
    ['/{example', false],
    ['/example}', false],
    ['/{example}example', false],
    ['/{example}_example', false],
    ['/{example}_{example}', false],
    ['/Example', false],
    ['/EXAMPLE', false],
    ['/examPle', false] 
  ].forEach(function(x){
    it('should return ' + x[1] + ' for url ' + x[0], function () {
      assert.strictEqual(x[1], rule({relativeUri: x[0]}));
    });
  });
});
