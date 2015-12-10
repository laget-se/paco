#!/usr/bin/env node

const configHelpers = require('../../helpers/local-configs');

module.exports = function(yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  yargs
    .option('git-push', {
      default: pacorcConfig.release.push,
      describe: 'Whether to run git push',
      type: 'boolean'
    });

  return yargs;
}
