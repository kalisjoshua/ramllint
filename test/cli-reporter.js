var assert = require('assert'),

    reporter = require('../src/cli-reporter.js');

function entry(level, section, rule, message, locale) {
  rule = rule || ({
    hint: 'testing',
    id: 'fake_id'
  });

  return {
      code: rule.id,
      //hint: rule.hint,
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

    assert.equal('\u001b[32m\nLooking good; no error(s) found.\u001b[39m', output[0]);
  });

  it('should report YAMLError', function () {
    var output = [];

    function YAMLError() {
      this.name = 'YAMLError';
    }

    reporter(output.push.bind(output), 'error', reader([new YAMLError()]));

    assert.equal('\u001b[91m\nInvalid RAML file: parse error.\u001b[39m', output[0]);
    assert.equal(2, output.length);
  });

  it('should report an error', function () {
    var output = [];

    reporter(output.push.bind(output), 'error', reader([entry()]));

    assert.equal('\n\u001b[91merror\u001b[39m locale\n  \u001b[37mmessage\u001b[39m\u001b[90m [fake_id]\u001b[39m', output[0]);
    assert.equal(1, output.length);
  });
});
