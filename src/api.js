
const Q = require('q');
const comeondo = require('comeondo');
const jsonpretty = require('json-pretty');

const bump = require('./helpers/bump');
const configHelpers = require('./helpers/local-configs');
const npmHelpers = require('./helpers/local-npm');
const paths = require('./helpers/paths');

function exitWithError(err) {
  console.log('exiting due to error:');
  console.log(err);
  console.log(err.stack);
  process.exit(err ? 1 : 0);
}

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
  const configs = configHelpers.getMergedPacorc();

  if (typeof configs.test === 'string') {
    return comeondo.exec(configs.test)
      .catch(err => process.exit(err ? 1 : 0));
  }
  else if (npmHelpers.hasTask('test')) {
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
  if (npmHelpers.hasTask('build')) {
    return comeondo.exec(`npm run build`)
      .catch(err => process.exit(err ? 1 : 0));
  }
  else {
    const src = paths.pathRelativeToPackage(options.src);
    const dest = paths.pathRelativeToPackage(options.dest);

    return comeondo.exec(`${options.transpiler} ${src} --out-dir ${dest}`, {
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

/**
 * Bump
 */
api.bump = function(options) {
  const pacorc = configHelpers.getMergedPacorc();

  const mergedOptions = {
    version: options.version || 'patch',
    tag: options.tag || pacorc.bump.tag,
    commit: options.commit || pacorc.bump.commit,
    message: options.message || pacorc.bump.message,
  };

  if (!mergedOptions.tag && mergedOptions.commit && mergedOptions.message) {
    return bump.bumpAndCommit(mergedOptions);
  }
  else {
    return bump.bump(mergedOptions);
  }
}

/**
 * Release
 */
api.release = function(options) {
  return api.prepare(options)
    .then(() => api.bump(options))
    .then(() => {
      return comeondo.exec('npm publish', { cwd: process.env.PACO_PACKAGE_PATH })
        .catch(exitWithError);
    })
    .then(() => {
      if (options.gitPush && (options.commit || options.tag))
        return comeondo.exec('git push').catch(exitWithError);
      else
        return Q();
    })
    .then(() => {
      if (options.gitPushTags && options.tag)
        return comeondo.exec('git push --tags').catch(exitWithError);
      else
        return Q();
    })
    .catch(exitWithError);
}

module.exports = api;
