Adding a New Rule
=================

Adding a new rule to the defaults - a new feature - is pretty straight forward.
This tutorial will cover the 'Write code' portion of list under [Contributing](
README.md#contributing) in this repository's root README file. The basics are:

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

Some tests are automated and therefore not very much code will need to be written
in the test files. New edits will probably need to be made to the samle RAML
files to pass or fail depending on the rule being added but most often both.

## Write Code

The place where code will change most often is in `src/linter.js`. This file is
where the AST of the RAML - converted to an object - is traversed, and in some
cases slightly modified, and nodes are passed to the rules instance to be linted.

## Ensure Quality

Being nice to fellow developers is always a good plan.

The first thing to do is to follow the coding conventions - very close to
[IdiomaticJS](https://github.com/rwaldron/idiomatic.js/) - enforced by JSHint and
ESLint via: `npm run lint`. To paraphrase Idiomatic, "all code in a project
should look like it was written by just one person following a single set of
consistent style rules".

The second thing to be sure of is that all code being added is covered in some
way by tests. No code should be untestable; if it is untestable it isn't written
correctly and isn't exposing a proper API.

Lastly, and possibly most important, everything should be well documented so that
anyone picking up the repository can find explanations for what something is and
why it is important to be there. Good documenation is not easy to produce but is
invaluable when present.

## Squashed Commits

In an effort to keep the history as clean as possible, commits in Pull Requests
should be as few as necessary. For the most part only Pull Requests with a single
commit will be merged. In the unlikely case, that there is a reason for multiple
commits on a branch in a Pull Request, the reasons should be obvious yet well
explained.
