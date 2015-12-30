#!/usr/bin/env node

/**
 * paco release
 */

'use strict';

// Dependencies
const paco = require('../api');

// Task
module.exports = function(_yargs) {
  _yargs.command('release', 'Publishes a new release (lint, test, build, bump, publish, push)', (yargs) => {
    yargs.usage('paco release [version] [options]');

    require('./options/tag')(yargs);
    require('./options/message')(yargs);
    require('./options/commit')(yargs);
    require('./options/git-push')(yargs);
    require('./options/git-push-tags')(yargs);
    require('./options/help')(yargs);

    const argv = yargs.argv;
    argv.version = argv._[1];

    if (!argv.help)
      paco.release(argv);
  });
}
