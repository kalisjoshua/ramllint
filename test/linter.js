var assert = require('assert'),
    fs = require('fs'),

    defaults = require('../src/defaults.json'),
    Linter = require('../src/linter.js'),

    failing,
    passing,
    rules,

    ramllint = new Linter();

/* NOTE: these are in priority order of nesting within a RAML document */
failing = [
  'root',
  'resource',
  'method',
  'response'
].reduce(function (acc, sect) {
  acc[sect] = {
    doc: './test/samples/failing-$.raml'.replace('$', sect),
    name: sect
  };

  return acc;
}, {});

// this document will evolve as new rules are added but will always be valid.
passing = './test/samples/passing.raml';

// make an object the is helpful in automated testing; below.
rules = Object.keys(defaults)
  .reduce(function (acc, sect) {
    acc[sect] = defaults[sect]
      .map(function (opt) {

        return opt.id;
      });

    return acc;
  }, {});

function hasError(haystack, needle) {
  var result;

  result = haystack
    .some(function (entry) {

      return entry.code === needle;
    });

  return result;
}

describe('RAML Linter - linter', function () {
  it('should be an object', function () {
    assert.equal('object', typeof ramllint);
  });

  it('should fail with parse_error', function () {
    // async
    return ramllint.lint('', function (log) {
      var result = log.read();

      assert.equal(result.length, 1);
      assert.equal(result[0].name, 'YAMLError');
    });
  });

  it('should pass on valid RAML', function (done) {
    // async
    ramllint.lint(passing, function (log) {
      try {
        assert.equal(log.read().length, 0);
        done();
      } catch (e) {
        //console.log(passing);
        done(e);
      }
    });
  });

  it('should provide hints', function (done) {
    try {
      // async
      ramllint.lint(failing['root'].doc, function (results) {
        var hints;

        hints = results.read()
          .some(function (entry) {

            return entry.hint;
          });

        assert(hints, 'Some log entries should include hints.');
        done();
      });
    } catch (e) {
      done(e);
    }
  });

  it('should skip rules', function (done) {
    var myLinter = new Linter({api_version: false});

    myLinter.lint(passing, function (log) {
      try {
        assert.equal(log.read('error').length, 0);
        assert(hasError(log.read(), 'api_version'));
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should throw errors for Linter async workflow errors', function () {
    assert.throws(function () {
      console.log('Ignore this error; intentionally thrown for testing.');
      ramllint.errorWrap(null, null, function () {});
    });
    console.log('Stop ignoring.');
  });

  Object.keys(failing)
    .forEach(function (section) {
      it('should fail in ' + section, function (done) {
        ramllint.lint(failing[section].doc, function (log) {
          var results;

          try {
            results = log.read();

            // 1. (positive) check that all defined rules for section are not passing
            rules[section]
              .forEach(function (rule) {
                assert(hasError(results, rule), 'The error log should include an error for: ' + rule);
              });

            // 2. (negative) check that no other errors are reported for section
            assert.equal(results.length, rules[section].length, 'Length of error report does not match expected length.');

            // 3. (negative) check that errors for previous sections are not reported

            done(); // async
          } catch (e) {
            //console.log(results);
            done(e); // this is stupid (node)assert/mochajs
          }
        });
      });
    });
});
