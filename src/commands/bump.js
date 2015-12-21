#!/usr/bin/env node

/**
 * paco bump
 *
 * TODO: Make more transparent to npm version
 */

'use strict';

// Dependencies
const comeondo = require('comeondo');

const configHelpers = require('../helpers/local-configs');
const npmHelpers = require('../helpers/local-npm');

// Task
module.exports = function(_yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  _yargs.command('bump', 'Bumps the package.json version, optionally creating a git tag', (yargs) => {
    require('./options/tag')(yargs);
    require('./options/message')(yargs);
    require('./options/commit')(yargs);
    require('./options/help')(yargs);

    const argv = yargs.argv;

    const bumpArg = argv._[1] || 'patch';

    const tagArg = argv.tag ? '' : '--no-git-tag-version';
    const messageArg = argv.message ? `-m "${argv.message}"` : '';

    // Version command
    const versionCmd = {
      cmd: `npm`,
      args: [tagArg, 'version', bumpArg].filter(arg => arg.trim() !== '')
    };

    if (argv.message)
      versionCmd.args.push('-m', argv.message);

    if (!argv.help) {
      comeondo.exec(versionCmd).then(() => {
        const newVersion = configHelpers.getPackageJSON().version;

        // Commit command
        if (argv.commit && argv.message) {
          const commitMessage = argv.message.replace('%s', newVersion);
          const commitCmd = {
            cmd: `git`,
            args: ['commit', '-a', '-m', `${commitMessage}`]
          };

          comeondo.exec(commitCmd);
        }
      })
      .catch(err => console.error(err));
    }
  });
}
