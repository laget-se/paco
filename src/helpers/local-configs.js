#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const deepExtend = require('deep-extend');
const jsonpretty = require('json-pretty');
const objectify = require('node-objectify');
const fileExists = require('file-exists');

const pathHelpers = require('./paths');

// Default config
const defaultPacorc = require('../pacorc-default.js');

function getFileAsJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  }
  catch (ex) {
    return {};
  }
}

function getLocalJSON(filename) {
  return getFileAsJson(path.resolve(process.cwd(), filename));
};

function getPackageJSON() {
  return getLocalJSON('package.json');
}

function getNearestPackageJson() {
  return getFileAsJson(getNearestPackageJSONPath(process.cwd()));
}

function getPacorc() {
  return getLocalJSON('.pacorc');
}

function getNearestPacorc() {
  return getFileAsJson(getNearestPacorcPath(process.cwd()));
}

function getMergedPacorc() {
  let currentConfigDir = pathHelpers.getNearestDirContainingFileNamed('.pacorc', process.cwd());
  const configPaths = [];
  let mergedConfigs = require('../pacorc-default');

  while (path.isAbsolute(currentConfigDir)) {
    configPaths.push(path.resolve(currentConfigDir, '.pacorc'));
    currentConfigDir = path.resolve(currentConfigDir, '..');
    currentConfigDir = pathHelpers.getNearestDirContainingFileNamed('.pacorc', currentConfigDir);
  }

  configPaths.reverse();

  for (let configPath of configPaths) {
    const config = getFileAsJson(configPath);
    mergedConfigs = deepExtend({}, mergedConfigs, config);
  }

  return mergedConfigs;
}

function getNearestPacorcPath(startPath) {
  return pathHelpers.getNearestPathToFileWithName('.pacorc', startPath || process.cwd());
}

function getNearestPackageJSONPath(startPath) {
  return pathHelpers.getNearestPathToFileWithName('package.json', startPath || process.cwd());
}

function getRootPacorcPath(startPath) {
  return pathHelpers.getHighestPathToFileNamed('.pacorc', startPath || process.cwd());
}

/**
 * Returns a (derived) local paco config value
 * @param  {String} key A config key
 * @return {any}        A config value or an error
 */
function getConfig(key) {
  const allConfigs = getMergedPacorc();
  const allConfigsMap = objectify(allConfigs);

  if (allConfigsMap.isSet(key)) {
    return allConfigsMap.get(key);
  }
  else {
    return new Error(`There isn't a config named: ${key}`);
  }
}

/**
 * Saves a config to .pacorc
 * @param {String} key   A config key
 * @param {any}    value A config value
 */
function setConfig(key, value) {
  const configs = getNearestPacorc();
  const defaultPacorcMap = objectify(defaultPacorc);

  if (defaultPacorcMap.isSet(key)) {
    const configsMap = objectify(configs);
    configsMap.set(key, value);
    savePacorc(configs);
    return value;
  }
  else {
    return new Error(`There isn't a config named: ${key}`);
  }
}

function savePacorc(configs) {
  const configsContents = JSON.stringify(configs, null, '  ');
  const pacorcPath = getNearestPacorcPath();

  fs.writeFile(pacorcPath, configsContents, { encoding: 'utf8' }, (err) => {
    if (err) {
      throw err;
    }
  });
}

module.exports = {
  getFileAsJson,
  getLocalJSON,
  getPackageJSON,
  getNearestPackageJson,
  getPacorc,
  getNearestPacorc,
  getMergedPacorc,
  getNearestPacorcPath,
  getNearestPackageJSONPath,
  getRootPacorcPath,
  getConfig,
  setConfig,
};
