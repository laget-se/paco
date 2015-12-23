
const comeondo = require('comeondo');
const jsonpretty = require('json-pretty');

const configHelpers = require('./helpers/local-configs');
const npmHelpers = require('./helpers/local-npm');
const paths = require('./helpers/paths');

/**
 * paco api
 */
const api = {};

/**
 * Config
 */
api.config = function(options) {
  const { key, value } = options;

  if (key && value) {
    return configHelpers.setConfig(key, value);
  }
  else if (key) {
    const configValue = configHelpers.getConfig(key);
    return configValue;
  }
  else {
    const allConfigs = configHelpers.getMergedPacorc();
    return jsonpretty(allConfigs);
  }
}

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
 * Test
 */
api.test = function() {
  if (npmHelpers.hasTask('test')) {
    comeondo.exec(`npm run test`)
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