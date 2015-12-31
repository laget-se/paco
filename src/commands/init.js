#!/usr/bin/env node

/**
 * paco init
 */

'use strict';

// Dependencies
const paco = require('../api');

const description = 'Creates a default .pacorc file';

// Task
module.exports = function(_yargs) {
  _yargs.command('init', description, (yargs) => {
    yargs.usage(`Usage: paco init\n\n${description}`);
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      paco.init().then(() => {
        console.log('Created default .pacorc:\n');
        console.log(paco.config());
      });
    }
  });
}
