
const comeondo = require('comeondo');
const npmHelpers = require('./helpers/local-npm');
const paths = require('./helpers/paths');

/**
 * paco api
 */
const api = {};

/**
 * Lint
 */
api.lint = function() {
  if (npmHelpers.hasTask('lint')) {
    comeondo.exec(`npm run lint`)
      .catch(err => process.exit(err ? 1 : 0));
  }
}

/**
 * Build
 */
api.build = function(options = {}) {
  console.log('api.build', options);

  if (npmHelpers.hasTask('build')) {
    comeondo.exec(`npm run build`)
      .catch(err => process.exit(err ? 1 : 0));
  }
  else {
    const src = paths.pathRelativeToRoot(options.src);
    const dest = paths.pathRelativeToRoot(options.dest);

    comeondo.exec(`${options.transpiler} ${src} --out-dir ${dest}`, {
        cwd: process.env.PACO_ROOT_PATH,
      })
      .catch(err => process.exit(err ? 1 : 0));
  }
}

module.exports = api;
