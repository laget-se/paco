#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

/* --------------------------------------------------- *\
   CLI setup
\* --------------------------------------------------- */

var yargs = require('yargs')
  .usage('Usage: paco <command> [options]')
  .help('h')
  .alias('h', 'help')
  .version(function() {
    return require('../package').version;
  })
  .alias('v', 'version');

/* --------------------------------------------------- *\
   Environment setup
\* --------------------------------------------------- */

const configHelpers = require('./helpers/local-configs');
const pathHelpers = require('./helpers/paths');

const rootPacorcPath = pathHelpers.getHighestDirContainingFileNamed('.pacorc', process.cwd());
const nearestPacorcPath = configHelpers.getNearestPacorcPath(process.cwd());
const nearestPackageJsonPath = configHelpers.getNearestPackageJSONPath(process.cwd());

process.env.PACO_ROOT_PATH = rootPacorcPath;
process.env.PACO_PACKAGE_PATH = path.dirname(nearestPackageJsonPath);
process.env.PACO_PACKAGE_JSON_PATH = nearestPackageJsonPath;

/* --------------------------------------------------- *\
   Intro shown on help section
\* --------------------------------------------------- */

if (isHelpCommand) {
  console.log(`
  ${`
      ### ### ### ###
      # # # # #   # #
      ### ### #   # #
      #   # # ### ###
  `.magenta}${`
      - - - - - - - -
  `.white}${`
  Delivering your packages
       to the world.
  `.gray}
 `);
}

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
