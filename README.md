RAML Linter
===========

RAML does not enforce any rules on how to document an API but many larger
organizations, or companies, would benefit from being able to enforce some
consistent standards across many APIs. This linter will allow configuration
through an "opt-in" strategy of validation rules.

## Getting Started (install)

```
npm install
```

## Running

An example run is setup in the npm scripts.

```
npm run example
```

## Using the Linter

```
var ramllint = require('ramllint'),
    ramlsrc = require('./project_name/api.raml');

ramllint(ramlsrc, function (results) {
  // do something with results
});
```

## Unit Testing

Making use of [mocha](http://mochajs.org/) for unit testing: `npm test` or
`mocha -w` to start watching for changes while developing to re-run tests.

### Code Coverage

Making use of [Istanbul](https://github.com/gotwarlost/istanbul) for coverage
reporting: `npm run coverage` to generate reports in `/coverage`.
