#!/usr/bin/env node

/**
 * paco test
 */

'use strict';

// Dependencies
const paco = require('../api');

const description = `Runs test script form .pacorc or \`npm test\` if defined. If the test config is set to false, nothing will be done.`;

// Task
module.exports = function(_yargs) {
  _yargs.command('test', description, (yargs) => {
    yargs.usage(`Usage: paco test\n\n${description}`);
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      paco.test();
    }
  });
}
