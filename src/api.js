
const Q = require('q');
const comeondo = require('comeondo');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

const bump = require('./helpers/bump');
const configHelpers = require('./helpers/local-configs');
const gitHelpers = require('./helpers/git');
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
 * Init
 */
api.init = function() {
  const deferred = Q.defer();

  const pacorcJson = require('./pacorc-default.js');
  const pacorcContents = JSON.stringify(pacorcJson, null, '  ');

  fs.writeFile(path.join(process.cwd(), '.pacorc'), pacorcContents, { encoding: 'utf8' }, (err) => {
    if (err) {
      exitWithError(err);
    }

    deferred.resolve();
  });

  return deferred.promise;
}

/**
 * Config
 */
api.config = function(options = {}) {
  const { key, value } = options;

  if (key && value) {
    return configHelpers.setConfig(key, value);
  }
  else if (key) {
    const configValue = configHelpers.getConfig(key);
    return JSON.stringify(configValue, null, '  ');
  }
  else {
    const allConfigs = configHelpers.getMergedPacorc();
    return JSON.stringify(allConfigs, null, '  ');
  }
}

/**
 * Lint
 */
api.lint = function() {
  const configs = configHelpers.getMergedPacorc();

  const npmConfig = { traverse: configs.traverse };

  if (configs.lint === false) {
    console.log('lint is explicitly disabled.');
    return Q();
  }

  if (typeof configs.lint === 'string') {
    return comeondo.exec(configs.lint)
      .catch(exitWithError);
  }
  else if (npmHelpers.hasTask('lint', npmConfig)) {
    return npmHelpers.runTask('lint', npmConfig)
      .catch(exitWithError);
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

  const npmConfig = { traverse: configs.traverse };

  if (configs.test === false) {
    console.log('test is explicitly disabled.');
    return Q();
  }

  if (typeof configs.test === 'string') {
    return comeondo.exec(configs.test)
      .catch(exitWithError);
  }
  else if (npmHelpers.hasTask('test', npmConfig)) {
    return npmHelpers.runTask('test', npmConfig)
      .catch(exitWithError);
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
  const configs = configHelpers.getMergedPacorc();

  if (configs.build === false) {
    console.log('build is explicitly disabled.');
    return Q();
  }

  const npmConfig = {
    traverse: configs.traverse
  };

  if (configs.build) {
    const commands = (configs.build || []).map(paths.getInterpolatedPaths);

    return comeondo.run(commands, { cwd: process.env.PACO_PACKAGE_PATH })
      .catch(exitWithError);
  }
  else if (npmHelpers.hasTask('build', npmConfig)) {
    return npmHelpers.runTask('build', npmConfig)
      .catch(exitWithError);
  }
  else {
    return Q();
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

  return gitHelpers.isCleanState().then((isClean) => {
    if (!isClean) {
      console.log(`\n${'Oh nose!'.red.bold}\nYou cannot bump the version number without commiting all changes in this package.\n`);
      process.exit(1);
    }

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
  });
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
