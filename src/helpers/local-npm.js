#!/usr/bin/env node

const path = require('path');
const uppity = require('uppity');
const comeondo = require('comeondo');
const Q = require('q');

const configHelpers = require('./local-configs');
const npmHelpers = require('./local-npm');
const pathHelpers = require('./paths');

/**
 * Checks if an npm script, optionally searching parent modules.
 */
function hasTask(task, opts = { traverse: true }) {
  const packageJsonPath = opts.traverse
    ? getNearestPackageJsonWithTask(task)
    : process.env.PACO_PACKAGE_JSON_PATH;

  if (packageJsonPath) {
    const packageJson = require(packageJsonPath);
    return !!(packageJson.scripts && packageJson.scripts[task]);
  }
  else {
    return false;
  }
};

/**
 * Runs an npm script, optionally in parent modules with a $PACO_CWD
 * node environment variable.
 */
function runTask(task, opts = { traverse: true }) {
  opts.cwd = opts.cwd || process.cwd();

  const taskPackageJsonPath = opts.traverse
    ? getNearestPackageJsonWithTask(task)
    : process.env.PACO_PACKAGE_JSON_PATH;

  if (taskPackageJsonPath) {
    return comeondo.exec(`npm run ${task}`, {
      cwd: path.dirname(taskPackageJsonPath),
      env: Object.assign({}, process.env, {
        PACO_CWD: opts.cwd,
      }),
    });
  }
  else {
    return Q(null);
  }
}

/**
 * Returns a path to the nearest package.json config containing a
 * npm script with a given name.
 */
function getNearestPackageJsonWithTask(task, opts = {}) {
  const packageJsonPaths = pathHelpers.getTraversedFilesNamed('package.json', {
    stopAt: process.env.PACO_ROOT_PATH,
  });

  for (let filepath of packageJsonPaths) {
    const info = require(filepath);

    if (info.scripts && info.scripts[task]) {
      return filepath;
    }
  }

  return null;
}

module.exports = {
  hasTask,
  runTask,
  getNearestPackageJsonWithTask,
};
