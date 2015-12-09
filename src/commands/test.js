#!/usr/bin/env node

/**
 * paco test
 */

'use strict';

// Dependencies
const comeondo = require('comeondo');

const npmHelpers = require('../helpers/local-npm');

// Task
module.exports = function(_yargs) {
  // const localConfig = configHelpers.getLocalJSON('.pacorc');

  _yargs.command('test', 'Runs `npm test` if defined', (yargs) => {
    const argv = yargs
      .help('h')
      .alias('h', 'help')
      .argv;

    if (!argv.help) {
      if (npmHelpers.hasTask('test')) {
        comeondo.exec(`npm test`);
      }
    }
  });
}
