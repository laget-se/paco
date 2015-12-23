
const Q = require('q');
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
    return comeondo.exec(`npm run lint`)
      .catch(err => process.exit(err ? 1 : 0));
  }
  else {
    return Q();
  }
}

/**
 * Test
 */
api.test = function() {
  if (npmHelpers.hasTask('test')) {
    return comeondo.exec(`npm run test`)
      .catch(err => process.exit(err ? 1 : 0));
  }
  else {
    return Q();
  }
}

/**
 * Verify
 */
api.verify = function() {
  return Q()
    .then(() => api.lint())
    .then(() => api.test());
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
    const src = paths.pathRelativeToPackage(options.src);
    const dest = paths.pathRelativeToPackage(options.dest);

    comeondo.exec(`${options.transpiler} ${src} --out-dir ${dest}`, {
        cwd: process.env.PACO_ROOT_PATH,
      })
      .catch(err => process.exit(err ? 1 : 0));
  }
}

/**
 * Prepare
 */
api.prepare = function(options) {
  return Q()
    .then(() => api.verify())
    .then(() => api.build(options));
}

module.exports = api;
