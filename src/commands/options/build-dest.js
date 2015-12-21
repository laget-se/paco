#!/usr/bin/env node

const configHelpers = require('../../helpers/local-configs');

module.exports = function(yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  yargs
    .option('dest', {
      default: pacorcConfig.build.dest,
      describe: 'The transpilation destination directory',
      type: 'string'
    });

  return yargs;
}
