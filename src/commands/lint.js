#!/usr/bin/env node

/**
 * paco lint
 */

'use strict';

const paco = require('../api');

const description = `Runs lint script from .pacorc or \`npm run lint\` if defined. If the lint config is set to false, nothing will be done.`;

// Task
module.exports = function(_yargs) {
  _yargs.command('lint', description, (yargs) => {
    yargs.usage(`Usage: paco lint\n\n${description}`);
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      paco.lint();
    }
  });
}
