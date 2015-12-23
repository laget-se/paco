#!/usr/bin/env node

const comeondo = require('comeondo');

const configHelpers = require('./local-configs');

function bump(options) {
  const versionCmd = {
    cmd: `npm`,
    args: [
      'version',
      options.version,
    ],
  };

  if (!options.tag) {
    versionCmd.args.push('--no-git-tag-version');
  }
  else if (options.message) {
    versionCmd.args.push('-m', options.message);
  }

  return comeondo.exec(versionCmd, { cwd: process.env.PACO_PACKAGE_PATH, })
    .catch(err => process.exit(err ? 1 : 0));
}

function bumpAndCommit(options) {
  const versionCmd = `npm --no-git-tag-version version ${options.version}`;

  return comeondo.exec(versionCmd, { cwd: process.env.PACO_PACKAGE_PATH, })
    .then(() => {
      const newVersion = configHelpers.getNearestPackageJson().version;
      const commitMessage = options.message.replace('%s', newVersion);

      return comeondo.run([
        `git add .`,
        {
          cmd: `git`,
          args: ['commit', '-a', '-m', `${commitMessage}`]
        }
      ], {
        cwd: process.env.PACO_PACKAGE_PATH
      });
    });
}

module.exports = {
  bump,
  bumpAndCommit,
};
