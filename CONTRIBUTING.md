Contributing
=================

Adding a new rule to the defaults - a new feature - is pretty straightforward.
The basics are:

  1. [Define new feature](#define-feature) in unit tests
  2. [Write code](#write-code) to satisfy all unit tests
  3. [Ensure quality](#ensure-quality):
    + Follow coding style `npm run lint`
    + Fully covered, in tests; without unexpected errors `npm run quality`
    + Documented thoroughly, following conventions
  4. Squash commits on branch; a Pull Request should have only one commit

## Define Feature

When adding a new rule, the definition of how it should perform needs to be
documented and one of the best ways of doing that is a test. This test will
become a part of the repository and will be run any time the code changes. The
test passing will provide assurance to any future editors that any changes do
not break expected functionality.

Some tests are automated and therefore not very much code will need to be
written in the test files. New edits will probably need to be made to the sample
RAML files to pass or fail depending on the rule being added but most often
both.

## Write Code

Without a doubt, `src/linter.js` will change more than any other file. It is in
that file where the AST of the RAML - converted to an object - is traversed, and
in some cases slightly modified, and where nodes are passed to the rules
instance to be linted.

## Ensure Quality

Being nice to fellow developers is always a good plan.

RAML Lint attempts to follow [IdiomaticJS](https://github.com/rwaldron/idiomatic.js/)
- enforced by JSHint and ESLint via: `npm run lint`. To paraphrase Idiomatic,
"all code in a project should look like it was written by just one person
following a single set of consistent style rules".

The second thing to be sure of is that all code being added is covered in some
way by tests. No code should be untestable; if it is untestable it isn't written
correctly and isn't exposing a proper API.

Lastly, and possibly most important, everything should be well documented so
that anyone reading the code should be able to easily determine what a given
piece of code is doing and why it is essential. Good documenation is not easy to
produce but is invaluable when present.

## Squashed Commits

In an effort to keep the history clean, Pull Requests should be as concise as
possible. For the most part only Pull Requests with a single commit will be
merged. If there is a reason for multiple commits in a Pull Request, the reasons
should be well explained.
