#!/usr/bin/env node

/**
 * paco lint
 */

'use strict';

// Dependencies
const comeondo = require('comeondo');

const npmHelpers = require('../helpers/local-npm');

// Task
module.exports = function(_yargs) {
  // const localConfig = configHelpers.getLocalJSON('.pacorc');

  _yargs.command('lint', 'Runs `npm run lint` if defined', (yargs) => {
    require('./options/tag')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      if (npmHelpers.hasTask('lint')) {
        comeondo.exec(`npm run lint`);
      }
    }
  });
}
