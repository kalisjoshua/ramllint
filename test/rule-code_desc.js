var assert = require('assert'),
    rule = require('../src/rules/code_desc.js');

describe('Rules - Response Code Description', function () {
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

  [
    // GOOD
    [{code:'200', description:'good'}, true],
    
    // BAD
    [{code:'200'}, false]
  ].forEach(function(x){
    it('should return ' + x[1] + ' for response object ' + x[0], function () {
      assert.strictEqual(x[1], rule(x[0]));
    });
  });
});
