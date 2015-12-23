#!/usr/bin/env node

/**
 * paco config
 */

'use strict';

// Dependencies
const comeondo = require('comeondo');
const jsonpretty = require('json-pretty');

const configHelpers = require('../helpers/local-configs');

// Task
module.exports = function(_yargs) {
  _yargs.command('config', 'Gets and sets local paco configs', (yargs) => {
    yargs.usage('paco config [key] [value]');
    require('./options/help')(yargs);

    const argv = yargs.argv;

    const key = argv._[1];
    const value = argv._[2];

    if (!argv.help) {
      if (key && value) {
        const results = configHelpers.setConfig(key, value);
        console.log(results);
      }
      else if (key) {
        const configValue = configHelpers.getConfig(key);
        console.log(configValue);
      }
      else {
        const allConfigs = configHelpers.getMergedPacorc();
        console.log(jsonpretty(allConfigs));
      }
    }
  });
}
