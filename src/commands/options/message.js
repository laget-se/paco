#!/usr/bin/env node

const configHelpers = require('../../helpers/local-configs');

module.exports = function(yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  yargs
    .option('m', {
      alias: 'message',
      default: pacorcConfig.bump.message,
      describe: 'Commit message to use (%s will be replaced with new version)',
      type: 'string'
    });

  return yargs;
}
