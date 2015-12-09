#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const deepExtend = require('deep-extend');

const getLocalJSON = function(filename) {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filename)));
  }
  catch (ex) {
    return {};
  }
};

const getPackageJson = function() {
  return getLocalJSON('package.json');
};

const getPacorc = function() {
  return getLocalJSON('.pacorc');
};

const getMergedPacorc = function() {
  const defaultPacorc = require('../pacorc-default.js');
  const localPacorc = getPacorc();

  return deepExtend({}, defaultPacorc, localPacorc);
}

module.exports = {
  getLocalJSON,
  getPackageJson,
  getPacorc,
  getMergedPacorc
};
