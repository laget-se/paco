#!/usr/bin/env node

/**
 * paco init
 */

'use strict';

// Dependencies
const fs = require('fs');
const path = require('path');
const jsonpretty = require('json-pretty');
const comeondo = require('comeondo');

// Task
module.exports = function(_yargs) {
  _yargs.command('init', 'Creates a default .pacorc file', (yargs) => {
    require('./options/help')(yargs);

    const argv = yargs.argv;

    if (!argv.help) {
      const pacorcJson = require('../pacorc-default.js');
      const pacorcContents = JSON.stringify(pacorcJson, null, '  ');

      fs.writeFile(path.resolve(process.cwd(), '.pacorc'), pacorcContents, { encoding: 'utf8' }, (err) => {
        if (err) {
          throw err;
        }

        console.log('Created default .pacorc');
      });
    }
  });
}
