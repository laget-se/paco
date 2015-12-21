#!/usr/bin/env node

/**
 * paco verify
 */

'use strict';

// Dependencies
const comeondo = require('comeondo');

// Task
module.exports = function(_yargs) {
  _yargs.command('prepare', 'Runs `paco verify` and `paco build`', (yargs) => {
    require('./options/build-transpiler.js')(yargs);
    require('./options/build-src.js')(yargs);
    require('./options/build-dest.js')(yargs);
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      comeondo.run([
        `paco verify`,
        `paco build --transpiler=${argv.transpiler} ${argv.src} --dest=${argv.dest}`,
      ]).catch(err => process.exit(err ? 1 : 0));
    }
  });
}
