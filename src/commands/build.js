#!/usr/bin/env node

/**
 * paco build
 */

'use strict';

// Dependencies
const paco = require('../api');

// Task
module.exports = function(_yargs) {
  _yargs.command('build', 'Build ES5 compatible files into your distribution directory', (yargs) => {
    require('./options/build-transpiler.js')(yargs);
    require('./options/build-src.js')(yargs);
    require('./options/build-dest.js')(yargs);
    require('./options/help.js')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      paco.build(argv);
    }
  });
}
