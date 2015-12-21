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
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      if (npmHelpers.hasTask('test')) {
        comeondo.exec(`npm test`);
      }
    }
  });
}
