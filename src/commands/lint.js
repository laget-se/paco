#!/usr/bin/env node

/**
 * paco lint
 */

'use strict';

const paco = require('../api');

// Task
module.exports = function(_yargs) {
  _yargs.command('lint', 'Runs lint script from .pacorc or `npm run lint` if defined', (yargs) => {
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      paco.lint();
    }
  });
}
