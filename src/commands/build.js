#!/usr/bin/env node

/**
 * paco build
 */

'use strict';

// Dependencies
const paco = require('../api');

const description = 'Runs all scripts provided in the build config in .pacorc, or `npm run build` if defined';

// Task
module.exports = function(_yargs) {
  _yargs.command('build', description, (yargs) => {
    yargs.usage(`Usage: paco build\n\n${description}`);
    require('./options/help.js')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      paco.build(argv);
    }
  });
}
