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

/* --------------------------------------------------- *\
   Commands
\* --------------------------------------------------- */

// Lint
require('./commands/lint')(yargs);

// Test
require('./commands/test')(yargs);

// Build
require('./commands/build')(yargs);

const argv = yargs.argv;
