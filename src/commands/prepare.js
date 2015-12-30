#!/usr/bin/env node

/**
 * paco verify
 */

'use strict';

// Dependencies
const paco = require('../api');

// Task
module.exports = function(_yargs) {
  _yargs.command('prepare', 'Runs `paco verify` and `paco build`', (yargs) => {
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      paco.prepare(argv);
    }
  });
}
