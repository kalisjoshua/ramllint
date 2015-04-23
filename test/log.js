var assert = require('assert'),
    log = require('../src/log.js');

describe('log', function () {
  it('should be an object', function () {
    assert.equal('object', typeof log);
  });

  it('should expose methods', function () {
    assert.equal('function', typeof log.error);
    assert.equal('function', typeof log.info);
    assert.equal('function', typeof log.log);
    assert.equal('function', typeof log.warning);
  });

  it('should have an empty log to start', function () {
    assert.deepEqual([], log.log());
    assert.deepEqual([], log.log('error'));
    assert.deepEqual([], log.log('info'));
    assert.deepEqual([], log.log('warning'));
  });

  beforeEach(function () {
    log.empty();
  });

  function addEntries(count, level) {
    var result = [];

    while (count--) {
      log[level]('/endpoint', 'has ' + level);
      result.push({
        level: level,
        message: 'has ' + level,
        resource: '/endpoint'
      });
    }

    return result;
  }

  it('should capture errors in the log', function () {
    var actual = addEntries(4, 'error');

    assert.deepEqual(actual, log.log('error'));
    assert.deepEqual(actual, log.error());
    assert.deepEqual(actual, log.log());
  });

  it('should capture info in the log', function () {
    var actual = addEntries(4, 'info');

    assert.deepEqual(actual, log.log('info'));
    assert.deepEqual(actual, log.info());
  });

  it('should capture warnings in the log', function () {
    var actual = addEntries(4, 'warning');

    assert.deepEqual(actual, log.log('warning'));
    assert.deepEqual(actual, log.warning());
  });

  it('should capture all levels of entries', function () {
    var actual;

    actual = []
      .concat(addEntries(4, 'error'))
      .concat(addEntries(4, 'info'))
      .concat(addEntries(4, 'warning'));

    assert.deepEqual(actual, log.log('error info warning'));
    assert.deepEqual(actual, log.log());
  });

  it('should only return desired levels', function () {
    var actual;

    actual = []
      .concat(addEntries(4, 'error'))
      .concat(addEntries(4, 'info'));

    addEntries(4, 'warning');

    assert.deepEqual(actual, log.log('error info'));
  });

  it('should only return desired levels', function () {
    var actual;

    actual = []
      .concat(addEntries(4, 'error'))
      .concat(addEntries(4, 'warning'));

    addEntries(4, 'info');

    assert.deepEqual(actual, log.log('error warning'));
  });

  it('should only return desired levels', function () {
    var actual;

    actual = []
      .concat(addEntries(4, 'info'))
      .concat(addEntries(4, 'warning'));

    addEntries(4, 'error');

    assert.deepEqual(actual, log.log('info warning'));
  });

  it('should provide a list of levels', function () {
    assert.deepEqual(['error', 'warning', 'info'], log.levels());
  });
});
