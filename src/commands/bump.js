#!/usr/bin/env node

/**
 * paco bump
 *
 * TODO: Make more transparent to npm version
 */

'use strict';

// Dependencies
const paco = require('../api');

// Task
module.exports = function(_yargs) {
  _yargs.command('bump', 'Bumps the package.json version, optionally creating a git tag', (yargs) => {
    yargs.usage('paco bump [version] [options]');
    require('./options/tag')(yargs);
    require('./options/message')(yargs);
    require('./options/commit')(yargs);
    require('./options/help')(yargs);

    const argv = yargs.argv;

    argv.version = argv._[1];

    if (!argv.help) {
      paco.bump(argv);
    }
  });
}
