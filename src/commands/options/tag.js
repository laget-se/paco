#!/usr/bin/env node

const configHelpers = require('../../helpers/local-configs');

module.exports = function(yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  yargs
    .option('t', {
      alias: 'tag',
      default: pacorcConfig.bump.tag,
      describe: 'Creates a corresponding git tag',
      type: 'boolean'
    });

  return yargs;
}
