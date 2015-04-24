var assert = require('assert'),
    fs = require('fs'),
    ramllint = require('../src/ramllint.js'),

    samples;

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
});

describe('RAML Linter', function () {
  it('should be an function', function () {
    assert.equal('function', typeof ramllint);
  });

  it('should return an error on invalid RAML', function () {
    return ramllint('', function (result) {
      assert.deepEqual([{level: 'error', message: 'Parse error.', resource: 'RAML'}], result);
    });
  });

  it('should log errors for no resources', function () {
    return ramllint(samples.no_resources, function (result) {
      assert.deepEqual([{level: 'info', message: 'No resources defined.', resource: 'root'}], ramllint.log('info'));
    });
  });

  it('should lint a minimal document without errors', function () {
    return ramllint(samples.minimal, function (result) {
      assert.deepEqual([], ramllint.log('error'));
    });
  });
});
