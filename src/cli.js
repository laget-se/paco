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

// Init
require('./commands/init')(yargs);

// Config
require('./commands/config')(yargs);

// Lint
require('./commands/lint')(yargs);

// Test
require('./commands/test')(yargs);

// Verify
require('./commands/verify')(yargs);

// Build
require('./commands/build')(yargs);

// Prepare
require('./commands/prepare')(yargs);

// Bump
require('./commands/bump')(yargs);

// Release
require('./commands/release')(yargs);

const argv = yargs.argv;
