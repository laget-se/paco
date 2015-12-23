
const comeondo = require('comeondo');
const npmHelpers = require('./helpers/local-npm');
const paths = require('./helpers/paths');

/**
 * paco api
 */
const api = {};

/**
 * Build
 */
api.build = function(options = {}) {
  console.log('api.build', options);

  if (npmHelpers.hasTask('build')) {
    comeondo.exec(`npm run build`, {
      cwd: process.env.PACO_PACKAGE_PATH,
    });
  }
  else {
    const src = paths.pathRelativeToRoot(options.src);
    const dest = paths.pathRelativeToRoot(options.dest);

    comeondo.exec(`${options.transpiler} ${src} --out-dir ${dest}`, {
      cwd: process.env.PACO_ROOT_PATH,
    });
  }
}

module.exports = api;
