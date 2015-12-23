#!/usr/bin/env node

/**
 * paco test
 */

'use strict';

// Dependencies
const paco = require('../api');

// Task
module.exports = function(_yargs) {
  _yargs.command('test', 'Runs `npm test` if defined', (yargs) => {
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      paco.test();
    }
  });
}
