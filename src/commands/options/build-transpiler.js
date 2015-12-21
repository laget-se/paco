#!/usr/bin/env node

const configHelpers = require('../../helpers/local-configs');

module.exports = function(yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  let binPath = pacorcConfig.build.transpiler;
  if (binPath === 'babel')
    binPath = `./node_modules/.bin/babel`;

  yargs
    .option('transpiler', {
      default: binPath,
      describe: 'The path to the babel executable',
      type: 'string'
    });

  return yargs;
}
