var assert = require('assert'),
    strip = require('cli-color/strip'),

    reporter = require('../src/cli-reporter.js');

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

describe('CLI - reporter', function () {
  var type = 'function';

  it('should be an ' + type, function () {
    assert.equal(type, typeof reporter);
  });

  it('should report all is well', function () {
    var output = [];

    reporter(output.push.bind(output), 'error', reader([]));

    assert.equal('\nLooking good; no error(s) found.', strip(output[0]));
  });

  it('should report YAMLError', function () {
    var output = [];

    function YAMLError() {
      this.name = 'YAMLError';
    }

    reporter(output.push.bind(output), 'error', reader([new YAMLError()]));

    assert.equal('\nInvalid RAML file: parse error.', strip(output[0]));
    assert.equal('YAMLError', output[1]);
    assert.equal('\nRAML Lint, finished.', strip(output[2]));
    assert.equal(3, output.length);
  });

  it('should report an error', function () {
    var output = [];

    reporter(function (entry) {
      output.push(entry);
    }, 'error', reader([entry()]));

    assert.equal('\nerror locale\n  message [fake_id]', strip(output[0]));
    assert.equal(2, output.length);
  });

  it('should report a hint', function () {
    var input = entry(),
        output = [];

    input.hint = 'Let me tell ya something.';
    reporter(function (entry) {
      output.push(entry);
    }, 'error', reader([input]));

    assert(output[0].indexOf('HINT') >= 0);
    assert.equal(2, output.length);
  });
});
