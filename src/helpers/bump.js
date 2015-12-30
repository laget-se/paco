#!/usr/bin/env node

const comeondo = require('comeondo');

const configHelpers = require('./local-configs');

function getInterpolatedCommitMessage(message) {
  const packageJson = require(process.env.PACO_PACKAGE_JSON_PATH);
  const [scope, name] = packageJson.name.split('/');

  return message
    .replace('%scope%', scope)
    .replace('%name%', name);
}

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
    const message = getInterpolatedCommitMessage(options.message);
    versionCmd.args.push('-m', message);
  }

  return comeondo.exec(versionCmd, { cwd: process.env.PACO_PACKAGE_PATH, })
    .catch(err => process.exit(err ? 1 : 0));
}

function bumpAndCommit(options) {
  const versionCmd = `npm --no-git-tag-version version ${options.version}`;

  return comeondo.exec(versionCmd, { cwd: process.env.PACO_PACKAGE_PATH, })
    .then(() => {
      const newVersion = configHelpers.getNearestPackageJson().version;
      let commitMessage = getInterpolatedCommitMessage(options.message);
      commitMessage = commitMessage.replace('%s', newVersion);

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
