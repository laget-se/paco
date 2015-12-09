#!/usr/bin/env node
'use strict';

/* --------------------------------------------------- *\
   CLI setup
\* --------------------------------------------------- */

var yargs = require('yargs')
  .usage('Usage: paco <command> [options]')
  .help('h')
  .alias('h', 'help')

  .version(function() {
    return require('../package').version;
  });

// Test
require('./commands/test')(yargs);

const argv = yargs.argv;
