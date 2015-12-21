#!/usr/bin/env node

module.exports = function(yargs) {
  yargs
    .help('h')
    .alias('h', 'help');

  return yargs;
}
