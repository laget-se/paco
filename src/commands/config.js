#!/usr/bin/env node

/**
 * paco config
 */

'use strict';

// Dependencies
const paco = require('../api');

// Task
module.exports = function(_yargs) {
  _yargs.command('config', 'Gets and sets local paco configs', (yargs) => {
    yargs.usage('paco config [key [value]]');
    require('./options/help')(yargs);

    const argv = yargs.argv;

    const [, key, value] = argv._;
    const options = { key, value };

    if (!argv.help) {
      const results = paco.config(options);
      console.log(results);
    }
  });
}
