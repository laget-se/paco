#!/usr/bin/env node

/**
 * paco build
 *
 * ...
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
  const localConfig = configHelpers.getLocalJSON('.pacorc');

  let binPath = localConfig.build.transpiler;
  if (binPath === 'babel')
    binPath = `./node_modules/.bin/babel`;

  const srcDir = localConfig.build.src || 'src';
  const destDir = localConfig.build.dest || 'dist';

  _yargs.command('build', 'Build ES5 compatible files into your distribution directory', (yargs) => {
    const argv = yargs.option('transpiler', {
        default: binPath || './node_modules/.bin/babel',
        describe: 'The path to the babel executable',
        type: 'string'
      })
      .option('src', {
        default: srcDir,
        describe: 'The source path to transpile',
        type: 'string'
      })
      .option('dest', {
        default: destDir,
        describe: 'The transpilation destination directory',
        type: 'string'
      })
      .help('h')
      .alias('h', 'help')
      .argv;

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
