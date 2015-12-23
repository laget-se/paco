#!/usr/bin/env node

/**
 * paco release
 */

'use strict';

// Dependencies
const comeondo = require('comeondo');

// Helpers
const configHelpers = require('../helpers/local-configs');
const npmHelpers = require('../helpers/local-npm');

// Task
module.exports = function(_yargs) {
  const pacorcConfig = configHelpers.getMergedPacorc();

  _yargs.command('release', 'Publishes a new release (lint, test, build, bump, publish, push)', (yargs) => {
    yargs.usage('paco release [version] [options]');

    require('./options/tag')(yargs);
    require('./options/message')(yargs);
    require('./options/commit')(yargs);
    require('./options/git-push')(yargs);
    require('./options/git-push-tags')(yargs);
    require('./options/help')(yargs);

    const argv = yargs.argv;

    const bumpArg = argv._[1] || 'patch';

    const commands = [
      `paco lint`,
      `paco test`,
      `paco build`,
      `paco bump`,
      `npm publish`,
    ];

    if (argv.gitPush)
      commands.push(`git push`);
    if (argv.gitPushTags)
      commands.push(`git push --tags`);

    comeondo.run(commands);
  });
}
