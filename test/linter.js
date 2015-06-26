var assert = require('assert'),
    fs = require('fs'),

    defaults = require('../src/defaults.json'),
    Linter = require('../src/linter.js'),

    failing,
    passing,
    rules;

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
  var ramllint;

  it('should be an (constructor) function', function () {
    assert.equal('function', typeof Linter);
    assert.equal('object', typeof new Linter());
  });

  it('should fail with parse_error', function () {
    ramllint = new Linter(function (error) {
      assert.equal('YAMLError', error.name);
    });

    // async
    return ramllint.lint('', function noop() {});
  });

  it('should pass on valid RAML', function () {
    var counter = 0;

    ramllint = new Linter(function () {
      counter++;
    });

    // async
    return ramllint.lint(passing, function () {
      assert.equal(0, counter);
    });
  });

  it('should provide hints', function () {
    var counter = 0;

    ramllint = new Linter(function (section, rule, context) {
      if (!counter && rule.hint) {
        counter++;
      }
    });

    // async
    return ramllint.lint(passing, function () {
      assert.equal(0, counter);
    });
  });

  it('should allow overriding of defaults', function () {
    ramllint = new Linter(function (section, rule, context) {
      if (rule.id === 'api_version') {
        assert.equal(false, rule.test);
      }
    }, {api_version: false});

    ramllint.lint(passing, function noop() {});
  });

  it('should throw errors for Linter async workflow errors', function () {
    assert.throws(function () {
      console.log('Ignore this error; intentionally thrown for testing.');
      ramllint.errorWrap(null, null, function () {});
    });
    console.log('Stop ignoring.');
  });

  // 1. (positive) check that all defined rules for section are not passing
  // 2. (negative) check that no other errors are reported for section
  // 3. (negative) check that errors for previous sections are not reported
  Object.keys(failing)
    .forEach(function (sect) {
      it('should fail in ' + sect, function () {
        var counter = 0,
            expected = rules[sect].length;

        ramllint = new Linter(function (section, rule, context) {
          counter++;

          // #1 - part one
          (function (indx) {
            rules[sect] = rules[sect]
              .slice(0, indx)
              .concat(rules[sect].slice(indx + 1));
          }(rules[sect].indexOf(rule.id)));

          // #3
          assert.equal(sect, section);
        });

        return ramllint.lint(failing[sect].doc, function () {
          // #1 - part two
          assert.deepEqual([], rules[sect]);
          assert.deepEqual(0, rules[sect].length);

          // #2
          assert.equal(expected, counter);
        });
      });
    });
});
