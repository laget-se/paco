#!/usr/bin/env node

const configHelpers = require('../../helpers/local-configs');

module.exports = function(yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  yargs
    .option('c', {
      alias: 'commit',
      default: pacorcConfig.bump.commit,
      describe: 'Runs git commit -am [message] after bumping',
      type: 'boolean'
    })
    .implies('commit', 'message');

  return yargs;
}
