var assert = require('assert'),

    reporterFactory = require('../src/cli-reporter.js');

function entry(level, section, rule, message, locale) {
  rule = rule || ({
    //hint: 'testing', // intentionally removed
    id: 'fake_id'
  });

  return {
      code: rule.id,
      hint: rule.hint,
      level: level || 'error',
      message: message || 'message',
      rule: locale || 'locale',
      section: section || 'section'
    };
}

function reader(mock) {

  return {
      read: function read() {

        return mock;
      }
    };
}

describe('Reporter', function () {
  var reporter = reporterFactory();

  beforeEach(function () {
    reporter.start();
  });

  describe('module', function () {
    var type = 'function';

    it('should be an ' + type, function () {
      assert.equal(type, typeof reporterFactory);
    });

    it('should create a Reporter object', function () {
      assert.equal('object', typeof reporter);
      assert.equal('function', typeof reporter.entry);
      assert.equal('function', typeof reporter.start);
      assert.equal('function', typeof reporter.stats);
    });
  });

  it('should start with no errors', function () {
    assert.equal(0, reporter.stats());
  });

  it('should report error(s)', function () {
    reporter.entry({a: null}, {prop: 'a', test: true}, {});
    assert.equal(1, reporter.stats());
    reporter.entry({a: null}, {prop: 'a', test: true}, {});
    assert.equal(2, reporter.stats());
  });

  it('should enable reset', function () {
    // errors from previous tests are cleared by beforeEach (above)
    assert.equal(0, reporter.stats());
  });
});
