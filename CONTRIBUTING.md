Contributing
=================

Contributions to RAML Linter are welcome and encouraged. Please review the
following guidelines for maintaining project quality, in order to help expedite
the review process.

  1. [Define new feature](#define-feature) in unit tests
  2. [Write code](#write-code) to satisfy all unit tests
  3. [Ensure quality](#ensure-quality):
    + Follow coding style `npm run lint`
    + Maintain code coverage in tests; without unexpected errors `npm run quality`
    + Update documentation, following conventions
  4. Squash commits on branch; One commit per feature is preferred

Being nice to fellow developers is always a good plan.

## Write Code

This project attempts to follow [IdiomaticJS](https://github.com/rwaldron/idiomatic.js/)
(enforced by JSHint and ESLint via `npm run lint`). The goal of IdiomaticJS is,
to paraphrase slightly, to ensure that all code in a project should look like it
was written by a single person following a single set of consistent style rules.

## Write Tests

Unit tests help define how a feature performs. To prevent the introduction
of errors and to provide documentation and demonstration of how new code works,
each change should be accompanied by unit tests. These tests will become part
of the repository and will be run as part of the continuous integration process.
The passing tests will provide assurance to future contributors that changes do
not break expected functionality. New features should be accompanied by as many
new or updated tests as necessary to prove that the change is effective.

All unit tests must pass, and code coverage levels must be maintained.

Keep in mind, changes to the linter may require corresponding changes in the
sample RAML files.

## Write Documentation

Finally, changes should be well commented and documented where necessary.
Contributors and implementors should be able to easily determine what a given
piece of code is doing and why it is essential. Good documentation is not easy
to produce but is invaluable when present.

## Send A Pull Request

In an effort to maintain a clean history, Pull Requests should be as concise as
possible. Commit messages should follow established [commit message guidelines](http://www.tpope.net/node/106),
and should attempt to consolidate complete features into a single commit.

A good pull request should contain each of the following elements:

  1. Code changes - typically located in `src/`
  2. Supporting unit tests - typically located in `test/`
  3. Version bump: major, minor, patch - in `package.json`

Please avoid working directly on `master`. Instead, create a feature branch to
develop your contribution. If it's been a while since you forked, don't forget
to refresh your forked copy:

````
git pull upstream master
````