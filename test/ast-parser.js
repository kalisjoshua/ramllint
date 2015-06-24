var assert = require('assert'),
    fs = require('fs'),

    parser = require('../src/ast-parser.js');

describe('AST Parser', function () {
  var type = 'object';

  it('should be an ' + type, function () {
    assert.equal(type, typeof parser);
  });

  it('should parse a simple RAML document', function (done) {
    var name = './test/samples/simple',
        expected = JSON.parse(fs.readFileSync(name + '.json', 'utf8'));

    parser.parse(name + '.raml')
      .then(function (ast) {
        try {
          assert.deepEqual(expected, ast);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('should throw errors', function (done) {
    parser.parse('')
      .then(null, function (data) {
        assert.equal('YAMLError', data.name);
        done();
      });
  });
});
