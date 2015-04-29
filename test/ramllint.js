var assert = require('assert'),
    fs = require('fs'),
    ramllint = require('../src/ramllint.js'),

    nothing_log,
    nothing_raml_evolution,
    samples;

nothing_log = [
  {
    'level': 'error',
    'message': '[api_version] RAML section (root) must include: version.',
    'resource': 'root'
  },
  {
    'level': 'error',
    'message': '[base_uri] RAML section (root) must include: baseUri.',
    'resource': 'root'
  }
];

fs.readdir(__dirname + '/samples', function (error, list) {
  var regex = /\.raml$/i;

  if (error) {
    throw error;
  }

  samples = list
    .reduce(function (acc, file) {
      if (regex.test(file)) {
        acc[file.replace(regex, '')] = fs.readFileSync(__dirname + '/samples/' + file, 'utf8');
      }

      return acc;
    }, {});

  nothing_raml_evolution = samples.nothing;
});

function appendToRAML(prop, value) {
  nothing_log = nothing_log.slice(1);

  nothing_raml_evolution += '\n' + prop + ': ' + value;
}

describe('RAML Linter', function () {
  it('should be an function', function () {
    assert.equal('function', typeof ramllint);
  });

  it('should return an error on invalid RAML', function () {
    // async
    return ramllint('', function (result) {
      assert.deepEqual([{level: 'error', message: 'Parse error.', resource: 'RAML'}], result);
    });
  });

  it('should log errors for empty RAML root', function () {
    // async
    return ramllint(samples.nothing, function (result) {
      assert.deepEqual(nothing_log, result);
    });
  });

  it('should not list missing version entry in log for nothing.raml', function () {
    appendToRAML('version', '1');

    // async
    return ramllint(nothing_raml_evolution, function (result) {
      assert.deepEqual(nothing_log, result);
    });
  });

  it('should not list missing baseUri entry in log for nothing.raml', function () {
    appendToRAML('baseUri', 'http://example.com');

    // async
    return ramllint(nothing_raml_evolution, function (result) {
      assert.deepEqual(nothing_log, result);
    });
  });

  it('should lint a minimal document without errors', function () {
    // async
    return ramllint(samples.minimal, function (result) {
      assert.deepEqual([], result);
    });
  });
});
