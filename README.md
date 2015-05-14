[RAML](http://raml.org) does not enforce any style rules on how to consistently
document an API; and that is good because not all projects will need the same
rule enforcement. However, all APIs defined within a group of related APIs - such
as many from a single entity or organization - should be consistent across each. 
APIs developed and documented by one team should be consistent with those by
another team.

RAML Linter is a static analysis, [linter-like](http://en.wikipedia.org/wiki/Lint_%28software%29),
utility that will enforce rules (optionally) on the RAML created such that
consistency can be more easily maintained.

## Contributing

  1. Fork this repository
  2. `git clone`
  3. `npm install`
  4. `npm run coverage` (optional)
  5. Create a working branch
  6. Write code
  7. Submit Pull Request

### Contributions

This project is trying to keep a high level of code coverage for unit tests. Contributtions
are required to have unit tests provided to explain what is being added as well as
prove compliance with use case.

The basis for rules is stored in `src/defaults.json` and is the location to [add new
rules](NEWRULES.md) as defaults. Projects using the linter to maintain
consistency will be able to provide a customization file which will override the
values in the defauls file.

## (`npm`) Scripts

A number of helpful commands have been created in the npm scripts (`package.json`).

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

There are two ways to use the RAML Linter, as a: library, and as a command line
utility. How you intend to use RAML Lint will dictate which way you use.

### Library

Using the library in code will provide the most flexibility; full access to how
to handle errors as well as reading the full list of results for: 'error',
'warning', and 'info' log entries. 

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

  1. [Code Documentation](http://git/pages/Galileo/ramllint/)
  2. [Code Coverage Report](http://git/pages/Galileo/ramllint/coverage/lcov-report/)
  3. [Static Code Analysis](http://git/pages/Galileo/ramllint/stats/)

## License

[MIT](LICENSE.md)
