var assert = require('assert'),
    Log = require('../src/log.js'),
    Rules = require('../src/Rules.js'),

    log = new Log(),
    config;

config = new Rules(log);

describe('Rules', function () {
  it('should be an function', function () {
    assert.equal('function', typeof Rules);
  });

  it('should have an instance', function () {
    assert(config);
    assert.equal('object', typeof config);
  });

  it('should have functions', function () {
    assert.equal('function', typeof config.passes);
    assert.equal('function', typeof config.run);
  });

  it('should create isolated instances', function () {
    var custom = new Rules(log, {api_version: false}),
        standard = new Rules(log);

    assert.notDeepEqual(custom.rules, standard.rules);
  });

  [
    [true, 'anything', {test: true}],
    [false, '', {test: true}],

    [true, 'abc', {test: '^[a-z]+$'}],
    [false, 'ABC', {test: '^[a-z]+$'}],

    [true, 'a', {test: ['a', 'b']}],
    [false, '', {test: ['a', 'b']}],

    // literally anything is valid as a value
    [true, 'anything', {test: ''}],
    [true, '', {test: ''}]
  ].forEach(function (mock) {
    var expected = mock[0],
        str,
        test = mock[2].test,
        value = mock[1];

    str = 'should $ \'$\' for test \'$\''
      .replace('$', expected ? 'pass' : 'not pass')
      .replace('$', value)
      .replace('$', test.test);

    it(str, function () {
      assert.equal(expected, config.passes(test, value));
    });
  });
});
