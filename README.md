# Markoa App

Based on [babel-library-boilerplate](https://github.com/babel/babel-library-boilerplate)

"A boilerplate to author libraries in ES2015 for Node and the browser"

## Usage

Add as npm dependency:

`npm install markoa-server --save`

In your code:

`import Server from 'marko-server';`

### Features

- Author in ES2015 (even the unit tests)
- Export as ES5 & UMD
- Mocha-Chai-Sinon testing stack
- Unit tests that work in Node and in the browser

### Getting Started

Run `gulp build` to compile the source into a distributable format.

Put your unit tests in `test/unit`. The `gulp` command runs the tests.

### Gulp tasks

- `gulp` - Lint the library and tests, then run the unit tests
- `gulp build` - Lint then build the library
- `gulp watch` - Continuously run the unit tests as you make changes to the source
   and test files themselves
- `gulp test-browser` - Build the library for use with the browser spec runner.
  Changes to the source will cause the runner to automatically refresh.

### Browser Tests

The [browser spec runner](https://github.com/babel/babel-library-boilerplate/blob/master/test/runner.html)
can be opened in a browser to run your tests. For it to work, you must first run `gulp test-browser`. This
will set up a watch task that will automatically refresh the tests when your scripts, or the tests, change.

### Code Climate

This library is set up to integrate with Code Climate. If you've never used Code Climate, then you might be wondering
why it's useful. There are two reasons:

1. It consumes code coverage reports, and provides a coverage badge for the README
2. It provides interesting stats on your library, if you're into that kinda thing

Either of these items on the list can simply be ignored if you're uninterested in them. Or you can pull Code Climate
out entirely from the boilerplate and not worry about it. To do that, update the relevant Gulp tasks and the Travis
build.

If you'd like to set up Code Climate for your project, follow [the steps here](https://github.com/babel/babel-library-boilerplate/wiki/Code-Climate).

### Linting

This boilerplate uses [ESLint](http://eslint.org/)
and [JSCS](http://jscs.info/rules.html) to lint your source. To change the rules,
edit the `.eslintrc` and `.jscsrc` files in the root directory, respectively.

Given that your unit tests aren't your library code, it makes sense to
lint them against a separate ESLint configuration. For this reason, a
separate, unit-test specific `.eslintrc` can be found in the `test`
directory. Unlike ESLint, the same JSCS rules are applied to both your code
and your tests.

### FAQ

#### What's the browser compatibility?

As a rule of thumb, this transpiler works best in IE9+. You can support IE8 by limiting yourself
to a subset of ES2015 features. The [Babel caveats page](http://babeljs.io/docs/usage/caveats/) does an
excellent job at explaining the nitty gritty details of supporting legacy browsers.

#### Is there a Yeoman generator?

[There sure is.](https://github.com/thejameskyle/generator-es6-library-boilerplate)

#### Is there a version for Node-only projects?

Yup. It has fewer pieces on account of no longer running the tests in the browser.
[Check it out over here](https://github.com/jmeas/es6-node-boilerplate).

### Customizing

This boilerplate is, to a certain extent, easily customizable. To make changes,
find what you're looking to do below and follow the instructions.

#### I want to change the exported file name

1. Update `main` in `package.json`

#### I want to change the destination directory

1. Update `main` in `package.json`

#### I want to change what variable my module exports

`MyLibrary` is the name of the variable exported from this boilerplate. You can change this by following
these steps:

1. Ensure that the variable you're exporting exists in your scripts
2. Update the value of `exportVarName` in `package.json` under `babelBoilerplateOptions`
3. Check that the unit tests have been updated to reference the new value

#### I don't want to export a variable

1. Ensure that your entry file does not export anything
2. Set the property of `exportVarName` in `package.json` to be `"null"`

#### My library depends on an external module

In the simplest case, you just need to install the module and use it in your scripts.

If you want to access the module itself in your unit test files, you will need to set up the
test environment to support the module. To do this:

1. Load the module in the [test setup file](https://github.com/babel/babel-library-boilerplate/blob/master/test/setup/setup.js).
  Attach any exported variables to global object if you'll be using them in your tests.
2. Add those same global variables to the `mochaGlobals` array in `package.json` under
  `babelBoilerplateOptions`
