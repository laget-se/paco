#!/usr/bin/env node

const configHelpers = require('../../helpers/local-configs');

module.exports = function(yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  yargs
    .option('src', {
      default: pacorcConfig.build.src,
      describe: 'The source path to transpile',
      type: 'string'
    });

  return yargs;
}
