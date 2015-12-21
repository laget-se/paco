#!/usr/bin/env node

/**
 * paco build
 */

'use strict';

// Dependencies
const path = require('path');
const fs = require('fs');
const comeondo = require('comeondo');

const configHelpers = require('../helpers/local-configs');
const npmHelpers = require('../helpers/local-npm');

// Task
module.exports = function(_yargs) {
  _yargs.command('build', 'Build ES5 compatible files into your distribution directory', (yargs) => {
    require('./options/build-transpiler.js')(yargs);
    require('./options/build-src.js')(yargs);
    require('./options/build-dest.js')(yargs);
    require('./options/help.js')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      if (npmHelpers.hasTask('build')) {
        comeondo.exec(`npm run build`);
      }
      else {
        comeondo.exec(`${argv.transpiler} ${argv.src} --out-dir ${argv.dest}`);
      }
    }
  });
}
