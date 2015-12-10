#!/usr/bin/env node

const configHelpers = require('../../helpers/local-configs');

module.exports = function(yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  yargs
    .option('git-push-tags', {
      default: pacorcConfig.release.pushTags,
      describe: 'Whether to run git push --tags',
      type: 'boolean'
    });

  return yargs;
}
