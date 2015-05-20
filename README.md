[![Build Status](https://travis-ci.org/QuickenLoans/ramllint.svg)](https://travis-ci.org/QuickenLoans/ramllint)
[![GitHub version](https://badge.fury.io/gh/QuickenLoans%2Framllint.svg)](http://badge.fury.io/gh/QuickenLoans%2Framllint)
[![Coverage Status](https://coveralls.io/repos/QuickenLoans/ramllint/badge.svg?branch=master)](https://coveralls.io/r/QuickenLoans/ramllint?branch=master)
[![Dependency Status](https://img.shields.io/david/QuickenLoans/ramllint.svg?style=flat-rounded)](https://david-dm.org/QuickenLoans/ramllint)


[RAML](http://raml.org) is a language for modeling RESTful APIs. By design,
it does not enforce any style rules on how to consistently document APIs,
because not all projects will require the same level of rule enforcement.
However, it can often be useful to enforce uniform rules and standards across a
group of related APIs to ensure consistency and uniformity across multiple teams
or business units.

RAML Linter is a static analysis, [linter-like](http://en.wikipedia.org/wiki/Lint_%28software%29),
utility that will enforce rules (optionally) on a given RAML document, ensuring
consistency and quality.

## Contributing

  1. Fork this repository
  2. `git clone`
  3. `npm install`
  4. `npm run coverage` (optional)
  5. Create a working branch
  6. Write code
  7. Submit Pull Request

### Contributions

This project aims to maintain a high level of unit test code coverage. All pull
requests must be accompanied by appropriate test cases, and all tests must pass
in order to be considered for merge.

For detailed rules on contributions, please refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## (`npm`) Scripts

Below is a list of commands available via npm (`package.json`).

  + `npm run coverage` - runs all unit tests (Mocha) with code coverage (Istanbul)
  + `npm run doc` - generate documentation pages (JSDoc)
  + `npm run example` - runs a single example RAML document through the linter
  + `npm run hint` - static code analysis (JSHint)
  + `npm run lint` - static code analysis and code style linting (ESLint)
  + `npm run quality` - runs lint and coverage
  + `npm test` - runs unit tests (Mocha)
  + `npm run test-w` - runs tests with additional flags, including --watch

## Running

@TODO: example using the CLI

## Using the Linter

There are two ways to use the RAML Linter. either as a library, or as a command
line utility.

### Library

Using the library in code provides the most flexibility, including error
handling and the ability to parse the full results for: `error`, `warning`, and
`info` log entries.

```
var ramllint = require('ramllint'),
    ramlDocument = require('./path/to/api.raml');

ramllint(ramlDocument, function (results) {
  // NOTE: results will only contain 'error' and will exclude 'warning' and 'info'
  // to get an array of all log entries use: `ramllint.results()`

  if (!results.length) {
    // no errors, all rules are satisfied
  } else {
    // errors
  }
});
```

### Command Line

This is a work in progress.

```
ramllint src/api.raml
```

## GH-Pages

Some information about the code is hosted on the gh-pages branch and served:

  1. [Code Documentation](http://QuickenLoans.github.io/ramllint/)
  2. [Code Coverage Report](http://QuickenLoans.github.io/ramllint/coverage/lcov-report/)
  3. [Static Code Analysis](http://QuickenLoans.github.io/ramllint/stats/)

## License

[MIT](LICENSE.md)
