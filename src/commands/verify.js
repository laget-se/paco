#!/usr/bin/env node

/**
 * paco verify
 */

'use strict';

// Dependencies
const comeondo = require('comeondo');

// Task
module.exports = function(_yargs) {
  _yargs.command('verify', 'Runs `paco lint` and `paco test`', (yargs) => {
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      console.log('paco verify');

      comeondo.run([
        `paco lint`,
        `paco test`,
      ]);
    }
  });
}
